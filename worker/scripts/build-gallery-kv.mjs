import { createHmac } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const workerDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const configPath = path.join(workerDir, 'gallery-config.private.json');
const varsPath = path.join(workerDir, '.dev.vars');
const outputDir = path.join(workerDir, '.generated');
const outputPath = path.join(outputDir, 'gallery-kv.json');

if (!fs.existsSync(configPath) || !fs.existsSync(varsPath)) {
  throw new Error('請先執行 npm run init:config');
}

const vars = Object.fromEntries(fs.readFileSync(varsPath, 'utf8')
  .split(/\r?\n/)
  .filter(Boolean)
  .map(line => {
    const index = line.indexOf('=');
    return [line.slice(0, index), line.slice(index + 1)];
  }));
if (!vars.PASSWORD_PEPPER || !vars.TOKEN_SECRET) throw new Error('.dev.vars 缺少必要 secrets');

const galleries = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const ids = new Set();
const digests = new Set();
const entries = [];
const digestPassword = password => createHmac('sha256', vars.PASSWORD_PEPPER).update(password).digest('base64url');

for (const gallery of galleries) {
  const id = String(gallery.id || '').trim();
  const password = String(gallery.password || '');
  if (!id || ids.has(id.toLowerCase())) throw new Error(`相簿 ID 缺漏或重複：${id}`);
  if (!password.length) throw new Error(`${id} 的密碼不可空白`);
  if (!Array.isArray(gallery.photos) || !gallery.photos.length) throw new Error(`${id} 沒有照片清單`);
  if (gallery.photos.some(photo => String(typeof photo === 'string' ? photo : photo?.filename || '').includes('..'))) {
    throw new Error(`${id} 的照片路徑包含不安全的 ..`);
  }
  ids.add(id.toLowerCase());
  const digest = digestPassword(password);
  if (digests.has(digest)) throw new Error('相簿密碼不得重複');
  digests.add(digest);
  const { password: _, ...safeGallery } = gallery;
  safeGallery.passwordDigest = digest;
  entries.push({ key: `gallery:${id.toLowerCase()}`, value: JSON.stringify(safeGallery) });
  entries.push({ key: `password-index:${digest}`, value: id });
}

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(entries, null, 2)}\n`, { mode: 0o600 });
console.log(`已建立 ${entries.length} 筆 KV 匯入資料：${path.relative(workerDir, outputPath)}`);
