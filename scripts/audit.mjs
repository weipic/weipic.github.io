import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const failures = [];
let projectFiles;
try {
  projectFiles = execFileSync('rg', ['--files'], { encoding: 'utf8' })
    .trim().split('\n').filter(Boolean);
} catch {
  projectFiles = execFileSync('git', ['ls-files'], { encoding: 'utf8' })
    .trim().split('\n').filter(Boolean);
}
const htmlFiles = projectFiles.filter(file => file.endsWith('.html'));
const frontendFiles = [...htmlFiles, 'js/app.js', 'js/analytics.js', 'js/portfolio-data.js'];
const forbidden = [
  [/https:\/\/pub-[^\s"']+\.r2\.dev/i, '公開 R2 網址', [...frontendFiles, 'GUIDE.md']],
  [/password\s*:\s*["'][^"']+["']/i, '硬編碼密碼', frontendFiles],
  [/cdn\.tailwindcss\.com/i, 'Tailwind CDN', htmlFiles],
  [/cdnjs\.cloudflare\.com\/ajax\/libs\/jszip/i, '遠端 JSZip', htmlFiles],
  [/assets\/images\/profile\/avatar\.png/i, '不存在的 avatar.png', [...htmlFiles, 'GUIDE.md']],
  [/http:\/\/xhslink\.com/i, '不安全的 HTTP 連結', frontendFiles],
  [/(?:translate\.google|translate-pa\.googleapis|googtrans|goog-te|googleTranslateElement)/i, 'Google Translate 殘留程式', [...frontendFiles, 'scripts/modernize-html.mjs']]
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
  for (const requiredSeo of ['rel="canonical"', 'hreflang="zh-TW"', 'hreflang="ja"', 'hreflang="en"', 'hreflang="x-default"']) {
    if (!html.includes(requiredSeo)) failures.push(`${file}: 缺少 SEO 標記 ${requiredSeo}`);
  }
  if (html.includes('<footer') && !html.includes('footer-legal-row flex items-baseline')) {
    failures.push(`${file}: 頁尾版權與隱私權政策未使用文字基線對齊`);
  }
  const localRefs = [...html.matchAll(/(?:src|href)="((?:\/|\.\.\/|\.\/)?(?:assets|css|js)\/[^"?#]+)"/g)].map(match => match[1]);
  for (const ref of localRefs) {
    const resolvedRef = ref.startsWith('/')
      ? ref.slice(1)
      : path.normalize(path.join(path.dirname(file), ref));
    if (!fs.existsSync(resolvedRef)) failures.push(`${file}: 本機資源不存在 ${ref}`);
  }
}

for (const locale of ['en', 'jp']) {
  for (const file of htmlFiles.filter(file => file.startsWith(`${locale}/`))) {
    const html = fs.readFileSync(file, 'utf8');
    const wrongPrefix = locale === 'en' ? '/jp/' : '/en/';
    if (new RegExp(`href="${wrongPrefix}`).test(html)) failures.push(`${file}: 站內連結跳離目前語系`);
    if (!html.includes(`href="/${locale}/`) && !file.endsWith('/index.html')) failures.push(`${file}: 缺少 /${locale}/ 語系內部連結`);
    if (/(?:src|href)="\/(?:assets|css|js)\//.test(html)) failures.push(`${file}: 子目錄資源仍使用根目錄絕對路徑`);
    if (!html.includes('src="../js/app.js"')) failures.push(`${file}: 缺少可供本機開啟的相對 app.js 路徑`);
  }
}

const dataSource = fs.readFileSync('js/portfolio-data.js', 'utf8');
if (!/clientGalleries\s*:\s*\[\s*\]/.test(dataSource)) {
  failures.push('js/portfolio-data.js: 私密相簿設定不得存在前端');
}
if (!fs.existsSync('css/tailwind.generated.css')) failures.push('缺少建置後的 Tailwind CSS');
if (!fs.existsSync('js/vendor/jszip.min.js')) failures.push('缺少本機 JSZip');
const appSource = fs.readFileSync('js/app.js', 'utf8');
if (!/localStorage\.setItem\('preferred_lang'/.test(appSource) || !/getLocalizedPagePath/.test(appSource)) {
  failures.push('js/app.js: 缺少靜態語系路徑與 preferred_lang 偏好記憶邏輯');
}
if (!/function ensureMobileLanguageSelector/.test(appSource) ||
    !/mobileLanguageSelector/.test(appSource) ||
    !/mobileMenu\.querySelector\('\.lang-opt-btn'\)/.test(appSource) ||
    !/grid grid-cols-3 gap-2/.test(appSource)) {
  failures.push('js/app.js: 手機選單缺少三語切換控制');
}
if (!/t\('相簿剩餘 \{days\} 天將自動刪除/.test(appSource) ||
    !/window\.location\.assign\(`\$\{targetPath\}\$\{window\.location\.search\}\$\{window\.location\.hash\}`\)/.test(appSource)) {
  failures.push('js/app.js: 相簿倒數必須使用完整三語句型，語言切換必須保留相簿查詢參數');
}
if (!/function localizeGalleryConfig/.test(appSource) ||
    !/\['clientName', 'albumTitle', 'pageTitle'\]/.test(appSource) ||
    !/matchedGallery = localizeGalleryConfig\(verification\.gallery\)/.test(appSource)) {
  failures.push('js/app.js: 客戶相簿缺少雲端英文／日文欄位選用邏輯');
}
const localeSource = fs.readFileSync('scripts/locales/content.mjs', 'utf8');
for (const countdownTranslation of [
  '相簿剩餘 {days} 天將自動刪除',
  'This gallery will be deleted in {days} days.',
  'このギャラリーはあと{days}日で自動削除されます。'
]) {
  if (!localeSource.includes(countdownTranslation)) failures.push(`scripts/locales/content.mjs: 缺少倒數翻譯 ${countdownTranslation}`);
}

if (failures.length) {
  console.error(`安全與完整性檢查失敗（${failures.length}）：\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`安全與完整性檢查通過：${htmlFiles.length} 個 HTML、${projectFiles.length} 個專案檔案。`);
