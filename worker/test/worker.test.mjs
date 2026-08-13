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
    TOKEN_TTL_SECONDS: '900',
    ALLOWED_ORIGINS: 'https://weipic.github.io',
    AUTH_RATE_LIMITER: { limit: async () => ({ success: true }) },
    GALLERY_CONFIG: {
      get: async (key, type) => type === 'json' ? values.get(key) ?? null : values.get(key) ?? null
    },
    GALLERY_BUCKET: {
      head: async () => hasObject ? { key: 'test/001.jpg', etag: 'test-etag', httpEtag: '"test-etag"' } : null,
      get: async () => hasObject ? {
        body: new Blob(['image']),
        httpEtag: '"test"',
        writeHttpMetadata(headers) { headers.set('Content-Type', 'image/jpeg'); }
      } : null
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
    _imageTransforms: imageTransforms
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
