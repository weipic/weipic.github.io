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
      head: async () => hasObject ? { key: 'test/001.jpg', etag: 'test-etag', httpEtag: '"test-etag"' } : null,
      get: async () => hasObject ? {
        body: new Blob(['image']),
        httpEtag: '"test"',
        writeHttpMetadata(headers) { headers.set('Content-Type', 'image/jpeg'); }
      } : null,
      list: async ({ prefix }) => ({
        objects: [{ key: `${prefix}001.jpg` }, { key: `${prefix}002.jpg` }],
        truncated: false
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
    _values: values
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

async function adminLogin(env) {
  const response = await worker.fetch(new Request('https://worker.example/admin/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://worker.example' },
    body: JSON.stringify({ password: env.ADMIN_PASSWORD })
  }), env);
  assert.equal(response.status, 200);
  return response.headers.get('Set-Cookie').split(';')[0];
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
