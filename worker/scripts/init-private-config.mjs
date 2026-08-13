import { randomBytes } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const workerDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoDir = path.resolve(workerDir, '..');
const outputPath = path.join(workerDir, 'gallery-config.private.json');
const passwordPath = path.join(workerDir, 'new-passwords.private.txt');
const varsPath = path.join(workerDir, '.dev.vars');
const force = process.argv.includes('--force');

for (const target of [outputPath, passwordPath, varsPath]) {
  if (!force && fs.existsSync(target)) {
    throw new Error(`${path.basename(target)} 已存在；如確定要重新產生，請加上 --force`);
  }
}

const source = fs.readFileSync(path.join(repoDir, 'js/portfolio-data.js'), 'utf8');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(source, context);
const galleries = context.window.PORTFOLIO_DATA?.clientGalleries || [];
if (!galleries.length) throw new Error('portfolio-data.js 找不到可移轉的 clientGalleries');

const privateConfig = galleries.map(gallery => {
  const prefix = gallery.baseUrl ? decodeURIComponent(new URL(gallery.baseUrl).pathname.replace(/^\/+/, '')) : '';
  return {
    id: gallery.id,
    password: randomBytes(12).toString('base64url'),
    clientName: gallery.clientName,
    albumTitle: gallery.albumTitle,
    pageTitle: gallery.pageTitle,
    zipFilename: gallery.zipFilename,
    deliveryDate: gallery.deliveryDate,
    expiryDays: gallery.expiryDays ?? 14,
    isDeleted: gallery.isDeleted === true,
    prefix,
    photos: gallery.photos || []
  };
});

fs.writeFileSync(outputPath, `${JSON.stringify(privateConfig, null, 2)}\n`, { mode: 0o600 });
fs.writeFileSync(passwordPath, `${privateConfig.map(item => `${item.id}: ${item.password}`).join('\n')}\n`, { mode: 0o600 });
fs.writeFileSync(varsPath, `PASSWORD_PEPPER=${randomBytes(32).toString('base64url')}\nTOKEN_SECRET=${randomBytes(32).toString('base64url')}\n`, { mode: 0o600 });
console.log('已建立私密相簿設定、新密碼清單與 Worker secrets（內容未輸出至終端機）。');

