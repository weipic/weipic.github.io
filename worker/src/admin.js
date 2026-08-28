import { ADMIN_APP_JS, ADMIN_HTML, ADMIN_STYLES } from './admin-ui.js';

const encoder = new TextEncoder();
const ADMIN_COOKIE = '__Host-weipic_admin';
const ADMIN_SESSION_SECONDS = 8 * 60 * 60;
const MAX_BODY_BYTES = 256 * 1024;
const ADMIN_PASSWORD_KEY = 'admin:password-digest';
const R2_METRICS_CACHE_KEY = 'admin:r2-metrics-cache';
const ANALYTICS_TOKEN_KEY = 'admin:analytics-token-encrypted';
const R2_METRICS_CACHE_SECONDS = 300;
const MAX_SINGLE_UPLOAD_BYTES = 50 * 1024 * 1024;
const MAX_R2_OBJECT_BYTES = 5 * 1024 ** 4;
const CLASS_A_ACTIONS = new Set([
  'ListBuckets', 'PutBucket', 'ListObjects', 'PutObject', 'CopyObject',
  'CompleteMultipartUpload', 'CreateMultipartUpload', 'LifecycleStorageTierTransition',
  'ListMultipartUploads', 'UploadPart', 'UploadPartCopy', 'ListParts',
  'PutBucketEncryption', 'PutBucketCors', 'PutBucketLifecycleConfiguration'
]);
const CLASS_B_ACTIONS = new Set([
  'HeadBucket', 'HeadObject', 'GetObject', 'UsageSummary', 'GetBucketEncryption',
  'GetBucketLocation', 'GetBucketCors', 'GetBucketLifecycleConfiguration'
]);

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      ...headers
    }
  });
}

function adminAsset(body, contentType) {
  return new Response(body, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'no-store',
      'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer'
    }
  });
}

function adminPage() {
  return new Response(ADMIN_HTML, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      'X-Frame-Options': 'DENY'
    }
  });
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

async function digestPassword(password, pepper) {
  return toBase64Url(await hmac(password, pepper));
}

async function analyticsEncryptionKey(secret) {
  const bytes = await crypto.subtle.digest('SHA-256', encoder.encode(`weipic-analytics:${secret}`));
  return crypto.subtle.importKey('raw', bytes, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

async function encryptAnalyticsToken(token, env) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await analyticsEncryptionKey(env.TOKEN_SECRET);
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(token));
  return JSON.stringify({ iv: toBase64Url(iv), data: toBase64Url(new Uint8Array(encrypted)) });
}

async function decryptAnalyticsToken(value, env) {
  const record = JSON.parse(value);
  const key = await analyticsEncryptionKey(env.TOKEN_SECRET);
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromBase64Url(record.iv) }, key, fromBase64Url(record.data)
  );
  return new TextDecoder().decode(decrypted);
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

function randomPassword() {
  const bytes = new Uint8Array(18);
  crypto.getRandomValues(bytes);
  return toBase64Url(bytes);
}

async function issueAdminSession(env) {
  const payload = toBase64Url(encoder.encode(JSON.stringify({
    role: 'gallery-admin',
    nonce: toBase64Url(crypto.getRandomValues(new Uint8Array(12))),
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS
  })));
  const signature = toBase64Url(await hmac(`admin.${payload}`, env.TOKEN_SECRET));
  return `${payload}.${signature}`;
}

function cookieValue(request, name) {
  const cookies = String(request.headers.get('Cookie') || '').split(';');
  for (const cookie of cookies) {
    const index = cookie.indexOf('=');
    if (index > 0 && cookie.slice(0, index).trim() === name) return cookie.slice(index + 1).trim();
  }
  return '';
}

async function hasAdminSession(request, env) {
  if (!env.TOKEN_SECRET) return false;
  const token = cookieValue(request, ADMIN_COOKIE);
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return false;
  const expected = toBase64Url(await hmac(`admin.${payload}`, env.TOKEN_SECRET));
  if (!constantTimeEqual(signature, expected)) return false;
  try {
    const data = JSON.parse(new TextDecoder().decode(fromBase64Url(payload)));
    return data.role === 'gallery-admin' && Number(data.exp) > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

function sessionCookie(token) {
  return `${ADMIN_COOKIE}=${token}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=${ADMIN_SESSION_SECONDS}`;
}

function clearSessionCookie() {
  return `${ADMIN_COOKIE}=; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=0`;
}

function sameOrigin(request) {
  const origin = request.headers.get('Origin');
  if (!origin) return false;
  return origin === new URL(request.url).origin;
}

async function readJson(request) {
  const length = Number(request.headers.get('Content-Length') || 0);
  if (length > MAX_BODY_BYTES) throw new Error('資料量過大');
  try {
    return await request.json();
  } catch {
    throw new Error('JSON 格式不正確');
  }
}

function cleanText(value, label, maximum, required = false) {
  const text = String(value || '').trim();
  if (required && !text) throw new Error(`${label}不可空白`);
  if (text.length > maximum) throw new Error(`${label}過長`);
  return text;
}

function normalizeGallery(input) {
  const id = cleanText(input.id, '相簿 ID', 100, true);
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(id)) {
    throw new Error('相簿 ID 只能使用英文字母、數字、連字號與底線');
  }
  const prefix = cleanText(input.prefix, 'R2 資料夾', 500).replace(/^\/+/, '');
  if (!prefix || prefix.includes('..')) throw new Error('R2 資料夾不可空白或包含 ..');
  const photos = Array.isArray(input.photos)
    ? input.photos.map(item => cleanText(typeof item === 'string' ? item : item?.filename, '照片檔名', 1000)).filter(Boolean)
    : [];
  if (photos.some(filename => filename.includes('..') || filename.startsWith('/'))) {
    throw new Error('照片檔名不可包含 .. 或以 / 開頭');
  }
  if (new Set(photos).size !== photos.length) throw new Error('照片清單包含重複檔名');
  const isDeleted = input.isDeleted === true;
  if (!isDeleted && photos.length === 0) throw new Error('上架中的相簿至少需要一張照片');
  const expiryDays = Number(input.expiryDays ?? 14);
  if (!Number.isInteger(expiryDays) || expiryDays < 0 || expiryDays > 3650) {
    throw new Error('有效天數必須是 0 到 3650 的整數');
  }
  const deliveryDate = cleanText(input.deliveryDate, '交件日期', 10);
  if (deliveryDate && !/^\d{4}[.\/-]\d{2}[.\/-]\d{2}$/.test(deliveryDate)) {
    throw new Error('交件日期格式必須為 YYYY.MM.DD');
  }
  return {
    id,
    clientName: cleanText(input.clientName, '客戶名稱', 200),
    albumTitle: cleanText(input.albumTitle, '相簿名稱', 300, true),
    pageTitle: cleanText(input.pageTitle, '頁面標題', 300),
    zipFilename: cleanText(input.zipFilename, 'ZIP 檔名', 200),
    deliveryDate: deliveryDate.replace(/[\/-]/g, '.'),
    expiryDays,
    isDeleted,
    prefix: prefix.endsWith('/') ? prefix : `${prefix}/`,
    photos
  };
}

function publicAdminGallery(config) {
  const { passwordDigest: _, ...gallery } = config;
  return { ...gallery, hasPassword: Boolean(config.passwordDigest) };
}

async function listAllKeys(namespace, prefix) {
  const keys = [];
  let cursor;
  do {
    const page = await namespace.list({ prefix, cursor });
    keys.push(...page.keys);
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  return keys;
}

async function listGalleries(env) {
  const keys = await listAllKeys(env.GALLERY_CONFIG, 'gallery:');
  const configs = await Promise.all(keys.map(key => env.GALLERY_CONFIG.get(key.name, 'json')));
  return configs.filter(Boolean).map(publicAdminGallery).sort((a, b) => a.id.localeCompare(b.id));
}

async function backupGallery(env, action, config) {
  if (!config) return;
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const nonce = toBase64Url(crypto.getRandomValues(new Uint8Array(6)));
  const key = `gallery-backup:${config.id.toLowerCase()}:${stamp}:${nonce}`;
  await env.GALLERY_CONFIG.put(key, JSON.stringify({ action, savedAt: new Date().toISOString(), gallery: config }));
}

async function saveGallery(request, env) {
  const body = await readJson(request);
  const gallery = normalizeGallery(body.gallery || {});
  const originalId = cleanText(body.originalId || gallery.id, '原相簿 ID', 100).toLowerCase();
  const oldConfig = await env.GALLERY_CONFIG.get(`gallery:${originalId}`, 'json');
  const newId = gallery.id.toLowerCase();
  const collision = newId !== originalId
    ? await env.GALLERY_CONFIG.get(`gallery:${newId}`, 'json')
    : null;
  if (collision) return json({ success: false, message: '新的相簿 ID 已存在' }, 409);

  let password = String(body.password || '').trim();
  if (body.generatePassword === true) password = randomPassword();
  let digest = oldConfig?.passwordDigest || '';
  if (password) digest = await digestPassword(password, env.PASSWORD_PEPPER);
  if (!digest) return json({ success: false, message: '新增相簿必須輸入密碼或自動產生密碼' }, 400);

  const indexedId = await env.GALLERY_CONFIG.get(`password-index:${digest}`);
  if (indexedId && indexedId.toLowerCase() !== originalId) {
    return json({ success: false, message: '這組密碼已被其他相簿使用，請換一組密碼' }, 409);
  }

  const config = { ...gallery, passwordDigest: digest, updatedAt: new Date().toISOString() };
  await backupGallery(env, oldConfig ? 'update' : 'create', oldConfig);
  await env.GALLERY_CONFIG.put(`gallery:${newId}`, JSON.stringify(config));
  await env.GALLERY_CONFIG.put(`password-index:${digest}`, gallery.id);

  if (oldConfig && oldConfig.passwordDigest !== digest) {
    await env.GALLERY_CONFIG.delete(`password-index:${oldConfig.passwordDigest}`);
  }
  if (oldConfig && originalId !== newId) {
    await env.GALLERY_CONFIG.delete(`gallery:${originalId}`);
  }

  return json({
    success: true,
    gallery: publicAdminGallery(config),
    generatedPassword: body.generatePassword === true ? password : undefined,
    message: oldConfig ? '相簿已更新' : '相簿已建立'
  });
}

async function deleteGallery(id, env) {
  const normalizedId = cleanText(id, '相簿 ID', 100, true).toLowerCase();
  const config = await env.GALLERY_CONFIG.get(`gallery:${normalizedId}`, 'json');
  if (!config) return json({ success: false, message: '找不到相簿' }, 404);
  await backupGallery(env, 'delete', config);
  if (config.passwordDigest) await env.GALLERY_CONFIG.delete(`password-index:${config.passwordDigest}`);
  await env.GALLERY_CONFIG.delete(`gallery:${normalizedId}`);
  return json({ success: true, message: '相簿下載資訊已刪除，R2 原始照片仍保留' });
}

async function listR2(prefix, env) {
  const normalized = cleanText(prefix, 'R2 資料夾', 500, true).replace(/^\/+/, '');
  if (normalized.includes('..')) return json({ success: false, message: 'R2 資料夾不可包含 ..' }, 400);
  const folder = normalized.endsWith('/') ? normalized : `${normalized}/`;
  const filenames = [];
  let cursor;
  do {
    const page = await env.GALLERY_BUCKET.list({ prefix: folder, cursor, limit: 1000 });
    for (const object of page.objects) {
      const relative = object.key.slice(folder.length);
      if (relative && !relative.endsWith('/')) filenames.push(relative);
      if (filenames.length >= 5000) break;
    }
    cursor = page.truncated && filenames.length < 5000 ? page.cursor : undefined;
  } while (cursor);
  filenames.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  return json({ success: true, prefix: folder, filenames, limited: filenames.length >= 5000 });
}

function normalizeR2Prefix(value, required = true) {
  const normalized = cleanText(value, 'R2 資料夾', 500, required).replace(/^\/+/, '');
  if ((required && !normalized) || normalized.includes('..') || normalized.includes('\\')) {
    throw new Error('R2 資料夾不可空白或包含 ..、反斜線');
  }
  return normalized && !normalized.endsWith('/') ? `${normalized}/` : normalized;
}

function normalizeUpload(input) {
  const prefix = normalizeR2Prefix(input.prefix);
  const filename = cleanText(input.filename, '檔名', 1000, true);
  if (filename.includes('/') || filename.includes('\\') || filename.includes('..')) {
    throw new Error('檔名不可包含路徑符號或 ..');
  }
  const size = Number(input.size);
  if (!Number.isFinite(size) || size <= 0 || size > MAX_R2_OBJECT_BYTES) {
    throw new Error('檔案大小無效或超過 R2 單一物件上限');
  }
  const contentType = cleanText(input.contentType || 'application/octet-stream', '檔案類型', 200);
  return { key: `${prefix}${filename}`, prefix, filename, size, contentType };
}

async function ensureUploadTarget(upload, overwrite, env) {
  if (!overwrite && await env.GALLERY_BUCKET.head(upload.key)) {
    throw new Error(`R2 已存在同名檔案：${upload.filename}`);
  }
}

async function uploadR2Object(request, env, url) {
  if (!request.body) return json({ success: false, message: '缺少檔案內容' }, 400);
  const upload = normalizeUpload({
    prefix: url.searchParams.get('prefix'),
    filename: url.searchParams.get('filename'),
    size: url.searchParams.get('size'),
    contentType: request.headers.get('Content-Type')
  });
  if (upload.size > MAX_SINGLE_UPLOAD_BYTES) {
    return json({ success: false, message: '大型檔案請使用多段上傳' }, 413);
  }
  await ensureUploadTarget(upload, url.searchParams.get('overwrite') === 'true', env);
  const object = await env.GALLERY_BUCKET.put(upload.key, request.body, {
    httpMetadata: { contentType: upload.contentType },
    customMetadata: { uploadedVia: 'weipic-admin' }
  });
  await env.GALLERY_CONFIG.delete(R2_METRICS_CACHE_KEY);
  return json({ success: true, key: object?.key || upload.key, size: upload.size });
}

async function createR2Multipart(request, env) {
  const body = await readJson(request);
  const upload = normalizeUpload(body);
  await ensureUploadTarget(upload, body.overwrite === true, env);
  const multipart = await env.GALLERY_BUCKET.createMultipartUpload(upload.key, {
    httpMetadata: { contentType: upload.contentType },
    customMetadata: { uploadedVia: 'weipic-admin' }
  });
  return json({ success: true, key: multipart.key, uploadId: multipart.uploadId });
}

function multipartFromUrl(url, env) {
  const key = cleanText(url.searchParams.get('key'), 'R2 物件 key', 1500, true);
  const uploadId = cleanText(url.searchParams.get('uploadId'), 'uploadId', 1000, true);
  if (key.startsWith('/') || key.includes('..') || key.includes('\\')) throw new Error('R2 物件 key 不安全');
  return env.GALLERY_BUCKET.resumeMultipartUpload(key, uploadId);
}

async function uploadR2Part(request, env, url) {
  if (!request.body) return json({ success: false, message: '缺少分段內容' }, 400);
  const partNumber = Number(url.searchParams.get('partNumber'));
  if (!Number.isInteger(partNumber) || partNumber < 1 || partNumber > 10000) {
    return json({ success: false, message: '分段編號無效' }, 400);
  }
  const part = await multipartFromUrl(url, env).uploadPart(partNumber, request.body);
  return json({ success: true, partNumber: part.partNumber, etag: part.etag });
}

async function completeR2Multipart(request, env, url) {
  const body = await readJson(request);
  if (!Array.isArray(body.parts) || !body.parts.length || body.parts.length > 10000) {
    return json({ success: false, message: '多段上傳資料不完整' }, 400);
  }
  const parts = body.parts.map(part => ({
    partNumber: Number(part.partNumber),
    etag: cleanText(part.etag, 'ETag', 500, true)
  }));
  if (parts.some(part => !Number.isInteger(part.partNumber) || part.partNumber < 1)) {
    return json({ success: false, message: '多段上傳編號無效' }, 400);
  }
  const object = await multipartFromUrl(url, env).complete(parts);
  await env.GALLERY_CONFIG.delete(R2_METRICS_CACHE_KEY);
  return json({ success: true, key: object.key, etag: object.httpEtag || object.etag || '' });
}

async function abortR2Multipart(env, url) {
  await multipartFromUrl(url, env).abort();
  return json({ success: true });
}

async function scanR2Storage(env) {
  let cursor;
  let objectCount = 0;
  let payloadSize = 0;
  do {
    const page = await env.GALLERY_BUCKET.list({ cursor, limit: 1000 });
    for (const object of page.objects) {
      objectCount += 1;
      payloadSize += Number(object.size || 0);
    }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
  return { objectCount, payloadSize };
}

async function getAnalyticsToken(env) {
  if (env.CLOUDFLARE_ANALYTICS_TOKEN) return env.CLOUDFLARE_ANALYTICS_TOKEN;
  const encrypted = await env.GALLERY_CONFIG.get(ANALYTICS_TOKEN_KEY);
  if (!encrypted) return '';
  try {
    return await decryptAnalyticsToken(encrypted, env);
  } catch (error) {
    console.error('Unable to decrypt analytics token:', error);
    return '';
  }
}

async function queryR2Operations(env, tokenOverride = '') {
  const token = tokenOverride || await getAnalyticsToken(env);
  if (!token || !env.CLOUDFLARE_ACCOUNT_ID || !env.R2_BUCKET_NAME) {
    return { available: false, classA: null, classB: null, message: '尚未連接 Cloudflare Analytics 唯讀權限' };
  }
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const query = `query R2Operations($accountTag: string!, $startDate: Time!, $endDate: Time!, $bucketName: string!) {
    viewer { accounts(filter: { accountTag: $accountTag }) {
      r2OperationsAdaptiveGroups(limit: 10000, filter: { datetime_geq: $startDate, datetime_leq: $endDate, bucketName: $bucketName }) {
        sum { requests } dimensions { actionType }
      }
    } }
  }`;
  const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: {
      accountTag: env.CLOUDFLARE_ACCOUNT_ID,
      bucketName: env.R2_BUCKET_NAME,
      startDate: start.toISOString(),
      endDate: now.toISOString()
    } })
  });
  const data = await response.json();
  const groups = data?.data?.viewer?.accounts?.[0]?.r2OperationsAdaptiveGroups;
  if (!response.ok || !Array.isArray(groups) || data.errors?.length) {
    console.error('R2 analytics query failed:', data.errors || response.status);
    return { available: false, classA: null, classB: null, message: 'Cloudflare Analytics 暫時無法讀取' };
  }
  let classA = 0;
  let classB = 0;
  for (const group of groups) {
    const requests = Number(group?.sum?.requests || 0);
    const action = group?.dimensions?.actionType;
    if (CLASS_A_ACTIONS.has(action)) classA += requests;
    if (CLASS_B_ACTIONS.has(action)) classB += requests;
  }
  return { available: true, classA, classB, message: '本月累計作業' };
}

async function connectAnalytics(request, env) {
  const body = await readJson(request);
  const token = cleanText(body.token, 'Analytics token', 1000, true);
  if (token.length < 20) return json({ success: false, message: 'Analytics token 格式不正確' }, 400);
  const test = await queryR2Operations(env, token);
  if (!test.available) return json({ success: false, message: 'Token 無法讀取 R2 Analytics，請確認具備 Account Analytics Read 權限' }, 400);
  await env.GALLERY_CONFIG.put(ANALYTICS_TOKEN_KEY, await encryptAnalyticsToken(token, env));
  await env.GALLERY_CONFIG.delete(R2_METRICS_CACHE_KEY);
  return json({ success: true, message: 'A／B 類作業統計已安全連接' });
}

async function r2Metrics(env, force = false) {
  if (!force) {
    const cached = await env.GALLERY_CONFIG.get(R2_METRICS_CACHE_KEY, 'json');
    if (cached) return json({ success: true, ...cached, cached: true });
  }
  const [storage, operations] = await Promise.all([scanR2Storage(env), queryR2Operations(env)]);
  const metrics = { ...storage, ...operations, updatedAt: new Date().toISOString() };
  await env.GALLERY_CONFIG.put(R2_METRICS_CACHE_KEY, JSON.stringify(metrics), { expirationTtl: R2_METRICS_CACHE_SECONDS });
  return json({ success: true, ...metrics, cached: false });
}

async function listBackups(id, env) {
  const normalizedId = cleanText(id, '相簿 ID', 100, true).toLowerCase();
  const keys = await listAllKeys(env.GALLERY_CONFIG, `gallery-backup:${normalizedId}:`);
  const records = await Promise.all(keys.slice(-30).reverse().map(async key => ({
    key: key.name,
    ...(await env.GALLERY_CONFIG.get(key.name, 'json'))
  })));
  return json({ success: true, backups: records.filter(Boolean).map(record => ({
    key: record.key,
    action: record.action,
    savedAt: record.savedAt,
    gallery: record.gallery ? publicAdminGallery(record.gallery) : null
  })) });
}

async function adminPasswordMatches(password, env) {
  const storedDigest = await env.GALLERY_CONFIG.get(ADMIN_PASSWORD_KEY);
  if (storedDigest) {
    const candidate = await digestPassword(String(password || ''), env.PASSWORD_PEPPER);
    return constantTimeEqual(candidate, storedDigest);
  }
  return Boolean(env.ADMIN_PASSWORD) && constantTimeEqual(String(password || ''), env.ADMIN_PASSWORD);
}

async function changeAdminPassword(request, env) {
  const body = await readJson(request);
  const currentPassword = String(body.currentPassword || '');
  const newPassword = String(body.newPassword || '').trim();
  const confirmation = String(body.confirmPassword || '').trim();
  if (!(await adminPasswordMatches(currentPassword, env))) {
    return json({ success: false, message: '目前管理密碼錯誤' }, 401);
  }
  if (newPassword.length < 8 || newPassword.length > 128) {
    return json({ success: false, message: '新管理密碼必須為 8 到 128 個字元' }, 400);
  }
  if (newPassword !== confirmation) {
    return json({ success: false, message: '兩次輸入的新密碼不一致' }, 400);
  }
  if (constantTimeEqual(currentPassword, newPassword)) {
    return json({ success: false, message: '新密碼不可與目前密碼相同' }, 400);
  }

  const digest = await digestPassword(newPassword, env.PASSWORD_PEPPER);
  await env.GALLERY_CONFIG.put(ADMIN_PASSWORD_KEY, digest);
  const token = await issueAdminSession(env);
  return json({ success: true, message: '管理密碼已更新，請保存到密碼管理器' }, 200, {
    'Set-Cookie': sessionCookie(token)
  });
}

async function login(request, env) {
  if (!sameOrigin(request)) return json({ success: false, message: '不允許的請求來源' }, 403);
  if (!env.TOKEN_SECRET || !env.PASSWORD_PEPPER) {
    return json({ success: false, message: '管理後台尚未完成安全設定' }, 503);
  }
  const actor = request.headers.get('CF-Connecting-IP') || 'unknown';
  const rate = await env.AUTH_RATE_LIMITER.limit({ key: `gallery-admin:${actor}` });
  if (!rate.success) return json({ success: false, message: '嘗試次數過多，請稍後再試' }, 429);
  const body = await readJson(request);
  if (!(await adminPasswordMatches(body.password, env))) {
    return json({ success: false, message: '管理密碼錯誤' }, 401);
  }
  const token = await issueAdminSession(env);
  return json({ success: true }, 200, { 'Set-Cookie': sessionCookie(token) });
}

async function routeAdminRequest(request, env) {
  const url = new URL(request.url);
  if (request.method === 'GET' && (url.pathname === '/admin' || url.pathname === '/admin/')) return adminPage();
  if (request.method === 'GET' && url.pathname === '/admin/style.css') return adminAsset(ADMIN_STYLES, 'text/css; charset=utf-8');
  if (request.method === 'GET' && url.pathname === '/admin/app.js') return adminAsset(ADMIN_APP_JS, 'text/javascript; charset=utf-8');
  if (request.method === 'POST' && url.pathname === '/admin/api/login') return login(request, env);

  const authenticated = await hasAdminSession(request, env);
  if (request.method === 'GET' && url.pathname === '/admin/api/session') return json({ authenticated });
  if (!authenticated) return json({ success: false, message: '管理登入已失效' }, 401);
  if (!['GET', 'HEAD'].includes(request.method) && !sameOrigin(request)) {
    return json({ success: false, message: '不允許的請求來源' }, 403);
  }

  if (request.method === 'POST' && url.pathname === '/admin/api/logout') {
    return json({ success: true }, 200, { 'Set-Cookie': clearSessionCookie() });
  }
  if (request.method === 'POST' && url.pathname === '/admin/api/password') {
    return changeAdminPassword(request, env);
  }
  if (request.method === 'GET' && url.pathname === '/admin/api/galleries') {
    return json({ success: true, galleries: await listGalleries(env) });
  }
  if (request.method === 'POST' && url.pathname === '/admin/api/galleries') return saveGallery(request, env);
  const galleryMatch = url.pathname.match(/^\/admin\/api\/galleries\/([^/]+)$/);
  if (request.method === 'DELETE' && galleryMatch) return deleteGallery(decodeURIComponent(galleryMatch[1]), env);
  const backupMatch = url.pathname.match(/^\/admin\/api\/galleries\/([^/]+)\/backups$/);
  if (request.method === 'GET' && backupMatch) return listBackups(decodeURIComponent(backupMatch[1]), env);
  if (request.method === 'GET' && url.pathname === '/admin/api/r2/metrics') return r2Metrics(env, url.searchParams.get('refresh') === 'true');
  if (request.method === 'POST' && url.pathname === '/admin/api/r2/analytics-token') return connectAnalytics(request, env);
  if (request.method === 'PUT' && url.pathname === '/admin/api/r2/object') return uploadR2Object(request, env, url);
  if (request.method === 'POST' && url.pathname === '/admin/api/r2/multipart/create') return createR2Multipart(request, env);
  if (request.method === 'PUT' && url.pathname === '/admin/api/r2/multipart/part') return uploadR2Part(request, env, url);
  if (request.method === 'POST' && url.pathname === '/admin/api/r2/multipart/complete') return completeR2Multipart(request, env, url);
  if (request.method === 'POST' && url.pathname === '/admin/api/r2/multipart/abort') return abortR2Multipart(env, url);
  if (request.method === 'GET' && url.pathname === '/admin/api/r2') return listR2(url.searchParams.get('prefix'), env);
  return json({ success: false, message: '找不到管理功能' }, 404);
}

export async function handleAdminRequest(request, env) {
  try {
    return await routeAdminRequest(request, env);
  } catch (error) {
    console.error('Gallery admin request failed:', error);
    return json({ success: false, message: error instanceof Error ? error.message : '雲端操作失敗' }, 400);
  }
}
