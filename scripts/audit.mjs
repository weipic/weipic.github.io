import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const failures = [];
const projectFiles = execFileSync('rg', ['--files'], { encoding: 'utf8' })
  .trim().split('\n').filter(Boolean);
const htmlFiles = projectFiles.filter(file => file.endsWith('.html'));
const frontendFiles = [...htmlFiles, 'js/app.js', 'js/analytics.js', 'js/portfolio-data.js'];
const forbidden = [
  [/https:\/\/pub-[^\s"']+\.r2\.dev/i, '公開 R2 網址', [...frontendFiles, 'GUIDE.md']],
  [/password\s*:\s*["'][^"']+["']/i, '硬編碼密碼', frontendFiles],
  [/cdn\.tailwindcss\.com/i, 'Tailwind CDN', htmlFiles],
  [/cdnjs\.cloudflare\.com\/ajax\/libs\/jszip/i, '遠端 JSZip', htmlFiles],
  [/assets\/images\/profile\/avatar\.png/i, '不存在的 avatar.png', [...htmlFiles, 'GUIDE.md']],
  [/http:\/\/xhslink\.com/i, '不安全的 HTTP 連結', frontendFiles]
];

for (const [pattern, label, files] of forbidden) {
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    if (pattern.test(content)) failures.push(`${file}: 發現${label}`);
  }
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  for (const required of ['meta name="referrer"', 'Content-Security-Policy', 'css/tailwind.generated.css']) {
    if (!html.includes(required)) failures.push(`${file}: 缺少 ${required}`);
  }
  for (const translateOrigin of ['https://translate.google.com', 'https://translate.googleapis.com', 'https://translate-pa.googleapis.com', 'https://*.googleapis.com', 'https://www.gstatic.com']) {
    if (!html.includes(translateOrigin)) failures.push(`${file}: CSP 缺少 Google Translate 網域 ${translateOrigin}`);
  }
  const localRefs = [...html.matchAll(/(?:src|href)="((?:assets|css|js)\/[^"?#]+)"/g)].map(match => match[1]);
  for (const ref of localRefs) {
    if (!fs.existsSync(ref)) failures.push(`${file}: 本機資源不存在 ${ref}`);
  }
}

const dataSource = fs.readFileSync('js/portfolio-data.js', 'utf8');
if (!/clientGalleries\s*:\s*\[\s*\]/.test(dataSource)) {
  failures.push('js/portfolio-data.js: 私密相簿設定不得存在前端');
}
if (!fs.existsSync('css/tailwind.generated.css')) failures.push('缺少建置後的 Tailwind CSS');
if (!fs.existsSync('js/vendor/jszip.min.js')) failures.push('缺少本機 JSZip');
const appSource = fs.readFileSync('js/app.js', 'utf8');
if (!/window\.setLanguage\s*=\s*function[\s\S]{0,2500}window\.location\.reload\(\)/.test(appSource)) {
  failures.push('js/app.js: 語言切換後必須重新整理以可靠套用 Google Translate');
}

if (failures.length) {
  console.error(`安全與完整性檢查失敗（${failures.length}）：\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`安全與完整性檢查通過：${htmlFiles.length} 個 HTML、${projectFiles.length} 個專案檔案。`);
