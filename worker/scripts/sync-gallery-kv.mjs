import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const workerDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const generatedPath = path.join(workerDir, '.generated', 'gallery-kv.json');
const wranglerPath = path.join(workerDir, 'node_modules', '.bin', process.platform === 'win32' ? 'wrangler.cmd' : 'wrangler');
const shouldApply = process.argv.includes('--apply');
const managedPrefixes = ['gallery:', 'password-index:'];

if (!fs.existsSync(generatedPath)) {
  throw new Error('找不到 .generated/gallery-kv.json，請先執行 npm run build:config');
}

const desiredEntries = JSON.parse(fs.readFileSync(generatedPath, 'utf8'));
if (!Array.isArray(desiredEntries) || desiredEntries.length === 0) {
  throw new Error('KV 匯入檔不可為空，已停止同步以避免誤刪線上資料');
}

const desiredKeys = new Set(desiredEntries.map(entry => entry?.key).filter(Boolean));
const desiredGalleryCount = [...desiredKeys].filter(key => key.startsWith('gallery:')).length;
const desiredPasswordIndexCount = [...desiredKeys].filter(key => key.startsWith('password-index:')).length;
if (!desiredGalleryCount || desiredGalleryCount !== desiredPasswordIndexCount) {
  throw new Error('相簿 key 與密碼索引數量不一致，已停止同步');
}

function listRemoteKeys(prefix) {
  const output = execFileSync(wranglerPath, [
    'kv', 'key', 'list',
    '--binding', 'GALLERY_CONFIG',
    '--remote',
    '--prefix', prefix
  ], { cwd: workerDir, encoding: 'utf8' });
  const entries = JSON.parse(output);
  return entries.map(entry => entry?.name).filter(Boolean);
}

const remoteKeys = managedPrefixes.flatMap(listRemoteKeys);
const staleKeys = remoteKeys.filter(key => !desiredKeys.has(key));
const staleGalleryIds = staleKeys
  .filter(key => key.startsWith('gallery:'))
  .map(key => key.slice('gallery:'.length));
const stalePasswordIndexCount = staleKeys.filter(key => key.startsWith('password-index:')).length;

console.log(`本機設定：${desiredGalleryCount} 個相簿`);
console.log(`待移除舊相簿：${staleGalleryIds.length ? staleGalleryIds.join(', ') : '無'}`);
console.log(`待移除舊密碼索引：${stalePasswordIndexCount} 筆`);

if (!shouldApply) {
  console.log('目前為檢查模式；加上 --apply 才會上傳及刪除線上 KV。');
  process.exit(0);
}

execFileSync(wranglerPath, [
  'kv', 'bulk', 'put', generatedPath,
  '--binding', 'GALLERY_CONFIG',
  '--remote'
], { cwd: workerDir, stdio: 'inherit' });

if (staleKeys.length) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'weipic-gallery-kv-'));
  const deletePath = path.join(tempDir, 'stale-keys.json');
  try {
    fs.writeFileSync(deletePath, JSON.stringify(staleKeys), { mode: 0o600 });
    execFileSync(wranglerPath, [
      'kv', 'bulk', 'delete', deletePath,
      '--binding', 'GALLERY_CONFIG',
      '--remote',
      '--force'
    ], { cwd: workerDir, stdio: 'inherit' });
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

console.log('相簿 KV 同步完成；private 設定中不存在的舊 ID 與密碼索引已失效。');
