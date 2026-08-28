import { handleAdminRequest } from './admin.js';

const encoder = new TextEncoder();

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...headers
    }
  });
}

function getAllowedOrigin(request, env) {
  const origin = request.headers.get('Origin');
  if (!origin) return null;
  const allowed = String(env.ALLOWED_ORIGINS || '').split(',').map(value => value.trim()).filter(Boolean);
  return allowed.includes(origin) ? origin : false;
}

function corsHeaders(origin) {
  if (!origin) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type, Range',
    'Access-Control-Expose-Headers': 'Content-Disposition, Content-Length, Content-Range, ETag',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

function toBase64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}

async function hmac(value, secret) {
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value)));
}

async function passwordDigest(password, pepper) {
  return toBase64Url(await hmac(password, pepper));
}

function constantTimeEqual(left, right) {
  const a = encoder.encode(String(left || ''));
  const b = encoder.encode(String(right || ''));
  let mismatch = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let index = 0; index < length; index++) {
    mismatch |= (a[index % Math.max(a.length, 1)] || 0) ^ (b[index % Math.max(b.length, 1)] || 0);
  }
  return mismatch === 0;
}

async function issueToken(albumId, env) {
  const ttl = Math.min(Math.max(Number(env.TOKEN_TTL_SECONDS) || 900, 60), 3600);
  const payload = toBase64Url(encoder.encode(JSON.stringify({
    albumId,
    exp: Math.floor(Date.now() / 1000) + ttl
  })));
  const signature = toBase64Url(await hmac(payload, env.TOKEN_SECRET));
  return `${payload}.${signature}`;
}

async function verifyToken(token, expectedAlbumId, env) {
  if (!token || !env.TOKEN_SECRET) return false;
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return false;
  const expected = toBase64Url(await hmac(payload, env.TOKEN_SECRET));
  if (!constantTimeEqual(signature, expected)) return false;
  try {
    const data = JSON.parse(new TextDecoder().decode(fromBase64Url(payload)));
    return data.albumId === expectedAlbumId && Number(data.exp) > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

function isExpired(config) {
  if (config.isDeleted === true || config.isExpired === true) return true;
  if (!config.deliveryDate) return false;
  const parts = String(config.deliveryDate).split(/[.\/-]/).map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return false;
  const deliveredAt = Date.UTC(parts[0], parts[1] - 1, parts[2]);
  const expiryDays = config.expiryDays ?? 14;
  return Date.now() > deliveredAt + Number(expiryDays) * 86400000;
}

function safeObjectKey(config, photo) {
  const prefix = String(config.prefix || '').replace(/^\/+/, '');
  const filename = typeof photo === 'string' ? photo : String(photo?.filename || '');
  const key = `${prefix}${prefix && !prefix.endsWith('/') ? '/' : ''}${filename}`;
  if (!key || key.includes('..') || key.startsWith('/')) return null;
  return key;
}

async function storageIsAvailable(config, env) {
  const photos = Array.isArray(config.photos) ? config.photos : [];
  if (!photos.length) return false;
  const indexes = [...new Set([0, Math.floor(photos.length / 2), photos.length - 1])];
  const results = await Promise.all(indexes.map(index => {
    const key = safeObjectKey(config, photos[index]);
    return key ? env.GALLERY_BUCKET.head(key) : null;
  }));
  return results.some(Boolean);
}

function publicGallery(config, request, token) {
  const workerOrigin = new URL(request.url).origin;
  const photos = (config.photos || []).map((photo, index) => {
    const filename = typeof photo === 'string' ? photo : String(photo?.filename || '');
    const accessUrl = `${workerOrigin}/api/gallery/${encodeURIComponent(config.id)}/photo/${index}?token=${encodeURIComponent(token)}`;
    return {
      filename,
      originalUrl: accessUrl,
      displayUrl: `${accessUrl}&variant=grid`,
      lightboxUrl: `${accessUrl}&variant=lightbox`
    };
  });
  return {
    id: config.id,
    clientName: config.clientName || '',
    albumTitle: config.albumTitle || '',
    pageTitle: config.pageTitle || '',
    deliveryDate: config.deliveryDate || '',
    expiryDays: config.expiryDays ?? 14,
    zipFilename: config.zipFilename || config.albumTitle || 'Album_Photos',
    zipUrl: 'auto',
    photos,
    photosList: photos
  };
}

async function handleAuth(request, env, origin) {
  if (!env.PASSWORD_PEPPER || !env.TOKEN_SECRET) {
    return json({ success: false, message: '服務尚未完成安全設定' }, 503, corsHeaders(origin));
  }
  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > 4096) return json({ success: false, message: '無效的請求' }, 413, corsHeaders(origin));

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, message: '無效的請求' }, 400, corsHeaders(origin));
  }
  let albumId = String(body?.albumId || '').trim();
  const password = String(body?.password || '').trim();
  if (albumId.length > 100 || !password) {
    return json({ success: false, message: '密碼錯誤或存取失效' }, 401, corsHeaders(origin));
  }

  const actor = request.headers.get('CF-Connecting-IP') || 'unknown';
  const rateResult = await env.AUTH_RATE_LIMITER.limit({
    key: `${actor}:${albumId.toLowerCase() || 'password-only'}`
  });
  if (!rateResult.success) {
    return json({ success: false, message: '嘗試次數過多，請稍後再試' }, 429, {
      ...corsHeaders(origin), 'Retry-After': '60'
    });
  }

  const digest = await passwordDigest(password, env.PASSWORD_PEPPER);
  if (!albumId) albumId = await env.GALLERY_CONFIG.get(`password-index:${digest}`) || '';
  const config = albumId ? await env.GALLERY_CONFIG.get(`gallery:${albumId.toLowerCase()}`, 'json') : null;
  if (!config || !constantTimeEqual(config.passwordDigest, digest)) {
    return json({ success: false, message: '密碼錯誤或存取失效' }, 401, corsHeaders(origin));
  }

  if (isExpired(config) || !(await storageIsAvailable(config, env))) {
    return json({
      success: true,
      gallery: {
        id: config.id,
        albumTitle: config.albumTitle || '',
        isExpired: true,
        isDeleted: true,
        photos: [],
        photosList: []
      }
    }, 200, corsHeaders(origin));
  }

  const token = await issueToken(config.id, env);
  return json({ success: true, gallery: publicGallery(config, request, token) }, 200, corsHeaders(origin));
}

function responseWithRequestHeaders(response, origin, cacheControl = 'private, no-store') {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(corsHeaders(origin))) headers.set(name, value);
  headers.set('Cache-Control', cacheControl);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'no-referrer');
  return new Response(response.body, { status: response.status, headers });
}

async function transformPreview(object, variant, env) {
  const settings = variant === 'lightbox'
    ? { width: 1600, quality: 82 }
    : { width: 800, quality: 76 };
  return (
    await env.IMAGES.input(object.body)
      .transform({ width: settings.width, fit: 'scale-down' })
      .output({ format: 'image/webp', quality: settings.quality, anim: false })
  ).response();
}

async function handlePreview(request, env, origin, config, key, variant, index, ctx) {
  const metadata = await env.GALLERY_BUCKET.head(key);
  if (!metadata) return json({ success: false, message: '檔案不存在' }, 404, corsHeaders(origin));

  const cacheAvailable = typeof caches !== 'undefined' && caches.default;
  const cacheUrl = new URL(request.url);
  cacheUrl.pathname = `/__gallery-preview-cache/${encodeURIComponent(config.id)}/${index}/${variant}/${encodeURIComponent(metadata.etag || metadata.httpEtag || 'v1')}`;
  cacheUrl.search = '';
  const cacheKey = new Request(cacheUrl.toString(), { method: 'GET' });
  if (cacheAvailable) {
    const cached = await caches.default.match(cacheKey);
    if (cached) return responseWithRequestHeaders(cached, origin, 'private, max-age=3600');
  }

  const object = await env.GALLERY_BUCKET.get(key);
  if (!object) return json({ success: false, message: '檔案不存在' }, 404, corsHeaders(origin));

  try {
    const transformed = await transformPreview(object, variant, env);
    if (!transformed.ok) throw new Error(`Images binding returned ${transformed.status}`);
    const cacheHeaders = new Headers(transformed.headers);
    cacheHeaders.set('Content-Type', 'image/webp');
    cacheHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
    cacheHeaders.set('X-Content-Type-Options', 'nosniff');
    const cacheResponse = new Response(transformed.body, { status: 200, headers: cacheHeaders });
    if (cacheAvailable) {
      const cacheWrite = caches.default.put(cacheKey, cacheResponse.clone());
      if (ctx?.waitUntil) ctx.waitUntil(cacheWrite);
      else await cacheWrite;
    }
    return responseWithRequestHeaders(cacheResponse, origin, 'private, max-age=3600');
  } catch (error) {
    console.error('Image preview transformation failed:', error);
    // Images binding accepts inputs up to 20 MB. If transformation is not
    // available or the source is larger, keep the gallery usable by falling
    // back to the original private R2 object.
    const fallback = await env.GALLERY_BUCKET.get(key);
    if (!fallback) return json({ success: false, message: '檔案不存在' }, 404, corsHeaders(origin));
    const headers = new Headers();
    fallback.writeHttpMetadata(headers);
    headers.set('ETag', fallback.httpEtag);
    return responseWithRequestHeaders(new Response(fallback.body, { status: 200, headers }), origin);
  }
}

async function handlePhoto(request, env, origin, match, ctx) {
  const albumId = decodeURIComponent(match[1]);
  const index = Number(match[2]);
  const url = new URL(request.url);
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : url.searchParams.get('token');
  if (!(await verifyToken(token, albumId, env))) {
    return json({ success: false, message: '存取權限已失效' }, 401, corsHeaders(origin));
  }

  const config = await env.GALLERY_CONFIG.get(`gallery:${albumId.toLowerCase()}`, 'json');
  if (!config || isExpired(config) || !Number.isInteger(index) || index < 0 || index >= (config.photos || []).length) {
    return json({ success: false, message: '相簿已失效或檔案不存在' }, 404, corsHeaders(origin));
  }
  const photo = config.photos[index];
  const key = safeObjectKey(config, photo);
  if (!key) return json({ success: false, message: '檔案不存在' }, 404, corsHeaders(origin));

  const variant = url.searchParams.get('variant');
  if (request.method === 'GET' && (variant === 'grid' || variant === 'lightbox')) {
    return handlePreview(request, env, origin, config, key, variant, index, ctx);
  }

  const object = request.method === 'HEAD'
    ? await env.GALLERY_BUCKET.head(key)
    : await env.GALLERY_BUCKET.get(key, { onlyIf: request.headers, range: request.headers });
  if (!object) return json({ success: false, message: '檔案不存在' }, 404, corsHeaders(origin));

  const headers = new Headers(corsHeaders(origin));
  object.writeHttpMetadata(headers);
  headers.set('ETag', object.httpEtag);
  headers.set('Cache-Control', 'private, no-store');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'no-referrer');
  const filename = typeof photo === 'string' ? photo : String(photo?.filename || 'photo');
  if (url.searchParams.has('dl') || url.searchParams.has('download')) {
    headers.set('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);
  }
  if (request.method === 'HEAD') return new Response(null, { status: 200, headers });
  const hasBody = 'body' in object;
  return new Response(hasBody ? object.body : null, { status: hasBody ? 200 : 412, headers });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/admin' || url.pathname.startsWith('/admin/')) {
      return handleAdminRequest(request, env);
    }
    const origin = getAllowedOrigin(request, env);
    if (origin === false) return json({ success: false, message: '不允許的來源' }, 403);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(origin) });
    if (request.method === 'POST' && (url.pathname === '/' || url.pathname === '/api/gallery/auth')) {
      return handleAuth(request, env, origin);
    }
    const photoMatch = url.pathname.match(/^\/api\/gallery\/([^/]+)\/photo\/(\d+)$/);
    if (photoMatch && (request.method === 'GET' || request.method === 'HEAD')) {
      return handlePhoto(request, env, origin, photoMatch, ctx);
    }
    if (request.method === 'GET' && url.pathname === '/health') {
      return json({ ok: true, service: 'weipic-private-gallery' }, 200, corsHeaders(origin));
    }
    return json({ success: false, message: '找不到資源' }, 404, corsHeaders(origin));
  }
};
