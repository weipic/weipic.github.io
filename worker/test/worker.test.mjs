import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import test from 'node:test';
import worker from '../src/index.js';

const pepper = 'test-password-pepper-with-enough-entropy';
const tokenSecret = 'test-token-secret-with-enough-entropy';
const password = '1';
const digest = createHmac('sha256', pepper).update(password).digest('base64url');

function makeEnv({ hasObject = true } = {}) {
  const imageTransforms = [];
  const r2Values = new Map(hasObject ? [
    ['test/001.jpg', { size: 5, contentType: 'image/jpeg' }],
    ['new-client/001.jpg', { size: 5, contentType: 'image/jpeg' }],
    ['new-client/002.jpg', { size: 6, contentType: 'image/jpeg' }]
  ] : []);
  const multipartValues = new Map();
  const gallery = {
    id: 'test-album',
    passwordDigest: digest,
    albumTitle: 'Test Album',
    deliveryDate: '2099.01.01',
    expiryDays: 14,
    prefix: 'test/',
    photos: ['001.jpg']
  };
  const values = new Map([
    ['gallery:test-album', gallery],
    [`password-index:${digest}`, gallery.id]
  ]);
  return {
    PASSWORD_PEPPER: pepper,
    TOKEN_SECRET: tokenSecret,
    ADMIN_PASSWORD: 'test-admin-password',
    TOKEN_TTL_SECONDS: '900',
    ALLOWED_ORIGINS: 'https://weipic.github.io',
    CLOUDFLARE_ACCOUNT_ID: 'test-account',
    R2_BUCKET_NAME: 'test-bucket',
    AUTH_RATE_LIMITER: { limit: async () => ({ success: true }) },
    GALLERY_CONFIG: {
      get: async (key, type) => {
        const value = values.get(key);
        if (value == null) return null;
        if (type === 'json') return typeof value === 'string' ? JSON.parse(value) : value;
        return typeof value === 'string' ? value : JSON.stringify(value);
      },
      put: async (key, value) => values.set(key, value),
      delete: async key => values.delete(key),
      list: async ({ prefix = '' }) => ({
        keys: [...values.keys()].filter(key => key.startsWith(prefix)).sort().map(name => ({ name })),
        list_complete: true
      })
    },
    GALLERY_BUCKET: {
      head: async key => r2Values.has(key) ? { key, size: r2Values.get(key).size, etag: 'test-etag', httpEtag: '"test-etag"' } : null,
      get: async key => r2Values.has(key) ? {
        body: new Blob(['image']),
        httpEtag: '"test"',
        writeHttpMetadata(headers) { headers.set('Content-Type', 'image/jpeg'); }
      } : null,
      put: async (key, body) => {
        const bytes = await new Response(body).arrayBuffer();
        r2Values.set(key, { size: bytes.byteLength, contentType: 'application/octet-stream' });
        return { key, size: bytes.byteLength, httpEtag: '"put-etag"' };
      },
      list: async ({ prefix = '' }) => ({
        objects: [...r2Values.entries()].filter(([key]) => key.startsWith(prefix)).map(([key, value]) => ({ key, size: value.size })),
        truncated: false
      }),
      createMultipartUpload: async key => {
        const uploadId = `upload-${multipartValues.size + 1}`;
        multipartValues.set(uploadId, { key, parts: new Map() });
        return { key, uploadId };
      },
      resumeMultipartUpload: (key, uploadId) => ({
        async uploadPart(partNumber, body) {
          const upload = multipartValues.get(uploadId);
          if (!upload || upload.key !== key) throw new Error('NoSuchUpload');
          const bytes = await new Response(body).arrayBuffer();
          upload.parts.set(partNumber, bytes);
          return { partNumber, etag: `etag-${partNumber}` };
        },
        async complete(parts) {
          const upload = multipartValues.get(uploadId);
          if (!upload || parts.length !== upload.parts.size) throw new Error('InvalidPart');
          const size = [...upload.parts.values()].reduce((total, bytes) => total + bytes.byteLength, 0);
          r2Values.set(key, { size, contentType: 'application/octet-stream' });
          multipartValues.delete(uploadId);
          return { key, size, httpEtag: '"multipart-etag"' };
        },
        async abort() { multipartValues.delete(uploadId); }
      })
    },
    IMAGES: {
      input() {
        const handle = {
          transform(options) { imageTransforms.push(options); return handle; },
          output(options) {
            imageTransforms.push(options);
            return { response: () => new Response(new Blob(['preview']), { headers: { 'Content-Type': 'image/webp' } }) };
          }
        };
        return handle;
      }
    },
    _imageTransforms: imageTransforms,
    _values: values,
    _r2Values: r2Values
  };
}

function authRequest(body, origin = 'https://weipic.github.io') {
  return new Request('https://worker.example/api/gallery/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin },
    body: JSON.stringify(body)
  });
}

test('a non-empty password of any length can issue private Worker URLs', async () => {
  const env = makeEnv();
  const response = await worker.fetch(authRequest({ albumId: 'test-album', password }), env);
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.equal(data.gallery.isDeleted, undefined);
  assert.match(data.gallery.photos[0].originalUrl, /^https:\/\/worker\.example\/api\/gallery\//);
  assert.match(data.gallery.photos[0].displayUrl, /variant=grid/);
  assert.match(data.gallery.photos[0].lightboxUrl, /variant=lightbox/);
  assert.notEqual(data.gallery.photos[0].displayUrl, data.gallery.photos[0].originalUrl);
  assert.doesNotMatch(JSON.stringify(data), /test\/001\.jpg/);
});

test('grid and lightbox previews are resized while the original stays untouched', async () => {
  const env = makeEnv();
  const auth = await worker.fetch(authRequest({ albumId: 'test-album', password }), env);
  const gallery = (await auth.json()).gallery;
  for (const [url, width] of [
    [gallery.photos[0].displayUrl, 800],
    [gallery.photos[0].lightboxUrl, 1600]
  ]) {
    const response = await worker.fetch(new Request(url, { headers: { Origin: 'https://weipic.github.io' } }), env);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('Content-Type'), 'image/webp');
    assert.equal(env._imageTransforms.at(-2).width, width);
  }
  const transformCount = env._imageTransforms.length;
  const original = await worker.fetch(new Request(gallery.photos[0].originalUrl, { headers: { Origin: 'https://weipic.github.io' } }), env);
  assert.equal(original.status, 200);
  assert.equal(original.headers.get('Content-Type'), 'image/jpeg');
  assert.equal(env._imageTransforms.length, transformCount);
});

test('removed R2 prefix returns the expired or deleted state', async () => {
  const response = await worker.fetch(authRequest({ albumId: 'test-album', password }), makeEnv({ hasObject: false }));
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.equal(data.gallery.isDeleted, true);
  assert.deepEqual(data.gallery.photos, []);
});

test('wrong password and unapproved origin are rejected', async () => {
  const wrong = await worker.fetch(authRequest({ albumId: 'test-album', password: 'incorrect-password' }), makeEnv());
  assert.equal(wrong.status, 401);
  const origin = await worker.fetch(authRequest({ albumId: 'test-album', password }, 'https://evil.example'), makeEnv());
  assert.equal(origin.status, 403);
});

async function adminLogin(env, adminPassword = env.ADMIN_PASSWORD, expectedStatus = 200) {
  const response = await worker.fetch(new Request('https://worker.example/admin/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://worker.example' },
    body: JSON.stringify({ password: adminPassword })
  }), env);
  assert.equal(response.status, expectedStatus);
  return response.headers.get('Set-Cookie')?.split(';')[0] || '';
}

function adminRequest(path, cookie, options = {}) {
  return new Request(`https://worker.example${path}`, {
    ...options,
    headers: {
      Cookie: cookie,
      Origin: 'https://worker.example',
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
}

test('admin page is isolated and login rate-protected', async () => {
  const env = makeEnv();
  const page = await worker.fetch(new Request('https://worker.example/admin'), env);
  assert.equal(page.status, 200);
  assert.match(page.headers.get('Content-Security-Policy'), /frame-ancestors 'none'/);
  assert.doesNotMatch(await page.text(), /passwordDigest|test-password-pepper/);

  const denied = await worker.fetch(new Request('https://worker.example/admin/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://worker.example' },
    body: JSON.stringify({ password: 'wrong' })
  }), env);
  assert.equal(denied.status, 401);
});

test('admin can change the password without storing plaintext credentials', async () => {
  const env = makeEnv();
  const oldCookie = await adminLogin(env);
  const mismatch = await worker.fetch(adminRequest('/admin/api/password', oldCookie, {
    method: 'POST',
    body: JSON.stringify({
      currentPassword: env.ADMIN_PASSWORD,
      newPassword: 'memorable-password',
      confirmPassword: 'different-password'
    })
  }), env);
  assert.equal(mismatch.status, 400);

  const changed = await worker.fetch(adminRequest('/admin/api/password', oldCookie, {
    method: 'POST',
    body: JSON.stringify({
      currentPassword: env.ADMIN_PASSWORD,
      newPassword: 'memorable-password',
      confirmPassword: 'memorable-password'
    })
  }), env);
  assert.equal(changed.status, 200);
  const newCookie = changed.headers.get('Set-Cookie').split(';')[0];
  assert.notEqual(newCookie, oldCookie);
  assert.notEqual(env._values.get('admin:password-digest'), 'memorable-password');

  const oldSession = await worker.fetch(adminRequest('/admin/api/galleries', oldCookie), env);
  assert.equal(oldSession.status, 200);
  await adminLogin(env, env.ADMIN_PASSWORD, 401);
  await adminLogin(env, 'memorable-password', 200);
});

test('admin can create, list, scan, and delete a gallery without exposing digests', async () => {
  const env = makeEnv();
  const cookie = await adminLogin(env);
  const created = await worker.fetch(adminRequest('/admin/api/galleries', cookie, {
    method: 'POST',
    body: JSON.stringify({
      originalId: '',
      generatePassword: true,
      gallery: {
        id: 'new-client', clientName: 'New Client', albumTitle: 'New Album',
        deliveryDate: '2099-02-03', expiryDays: 14, prefix: 'new-client/',
        photos: ['001.jpg', '002.jpg'], isDeleted: false
      }
    })
  }), env);
  const createdData = await created.json();
  assert.equal(created.status, 200);
  assert.ok(createdData.generatedPassword);
  assert.equal(createdData.gallery.passwordDigest, undefined);
  assert.ok(env._values.has('gallery:new-client'));

  const list = await worker.fetch(adminRequest('/admin/api/galleries', cookie), env);
  const listed = await list.json();
  assert.equal(list.status, 200);
  assert.equal(listed.galleries.some(item => item.id === 'new-client'), true);
  assert.doesNotMatch(JSON.stringify(listed), /passwordDigest/);

  const r2 = await worker.fetch(adminRequest('/admin/api/r2?prefix=new-client', cookie), env);
  assert.deepEqual((await r2.json()).filenames, ['001.jpg', '002.jpg']);

  const removed = await worker.fetch(adminRequest('/admin/api/galleries/new-client', cookie, { method: 'DELETE' }), env);
  assert.equal(removed.status, 200);
  assert.equal(env._values.has('gallery:new-client'), false);
  assert.equal([...env._values.keys()].some(key => key.startsWith('gallery-backup:new-client:')), true);
});

test('admin can inspect R2 storage and upload small and multipart objects', async () => {
  const env = makeEnv();
  const cookie = await adminLogin(env);
  const metrics = await worker.fetch(adminRequest('/admin/api/r2/metrics', cookie), env);
  const metricsData = await metrics.json();
  assert.equal(metrics.status, 200);
  assert.equal(metricsData.objectCount, 3);
  assert.equal(metricsData.payloadSize, 16);
  assert.equal(metricsData.available, false);

  const small = new Blob(['photo'], { type: 'image/jpeg' });
  const uploaded = await worker.fetch(adminRequest('/admin/api/r2/object?prefix=uploads&filename=small.jpg&size=5&overwrite=false', cookie, {
    method: 'PUT', body: small, headers: { 'Content-Type': 'image/jpeg' }
  }), env);
  assert.equal(uploaded.status, 200);
  assert.equal(env._r2Values.get('uploads/small.jpg').size, 5);

  const created = await worker.fetch(adminRequest('/admin/api/r2/multipart/create', cookie, {
    method: 'POST',
    body: JSON.stringify({ prefix: 'uploads/', filename: 'large.jpg', size: 60 * 1024 * 1024, contentType: 'image/jpeg' })
  }), env);
  const createData = await created.json();
  assert.equal(created.status, 200);
  const query = new URLSearchParams({ key: createData.key, uploadId: createData.uploadId, partNumber: '1' });
  const part = await worker.fetch(adminRequest(`/admin/api/r2/multipart/part?${query}`, cookie, {
    method: 'PUT', body: new Blob(['part']), headers: { 'Content-Type': 'application/octet-stream' }
  }), env);
  const partData = await part.json();
  assert.equal(part.status, 200);
  const completeQuery = new URLSearchParams({ key: createData.key, uploadId: createData.uploadId });
  const completed = await worker.fetch(adminRequest(`/admin/api/r2/multipart/complete?${completeQuery}`, cookie, {
    method: 'POST', body: JSON.stringify({ parts: [{ partNumber: partData.partNumber, etag: partData.etag }] })
  }), env);
  assert.equal(completed.status, 200);
  assert.equal(env._r2Values.get('uploads/large.jpg').size, 4);
});

test('analytics token is verified and encrypted before R2 operation metrics are stored', async () => {
  const env = makeEnv();
  const cookie = await adminLogin(env);
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({
    data: { viewer: { accounts: [{ r2OperationsAdaptiveGroups: [
      { sum: { requests: 12 }, dimensions: { actionType: 'ListObjects' } },
      { sum: { requests: 34 }, dimensions: { actionType: 'GetObject' } }
    ] }] } }
  }), { headers: { 'Content-Type': 'application/json' } });
  try {
    const token = 'analytics-read-only-token-for-test';
    const connected = await worker.fetch(adminRequest('/admin/api/r2/analytics-token', cookie, {
      method: 'POST', body: JSON.stringify({ token })
    }), env);
    assert.equal(connected.status, 200);
    const encrypted = env._values.get('admin:analytics-token-encrypted');
    assert.ok(encrypted);
    assert.doesNotMatch(encrypted, new RegExp(token));

    const metrics = await worker.fetch(adminRequest('/admin/api/r2/metrics?refresh=true', cookie), env);
    const data = await metrics.json();
    assert.equal(data.available, true);
    assert.equal(data.classA, 12);
    assert.equal(data.classB, 34);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
