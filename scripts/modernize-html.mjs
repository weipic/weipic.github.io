import fs from 'node:fs';

const files = [
  'index.html', 'commercial.html', 'portrait.html', 'concert.html', 'event.html',
  'sports.html', 'graduation.html', 'landscape.html', 'contact.html', 'download.html',
  '404.html', 'johnson50.html', '2026WelcomeParty.html', 'KumamotoCityGuide.html',
  'yeh_photo.notes.html'
];

const csp = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://translate.google.com https://translate.googleapis.com https://*.googleapis.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://translate.googleapis.com https://www.gstatic.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob: https://weipic-api.weipic2023.workers.dev https://www.google-analytics.com https://translate.google.com https://www.google.com https://www.gstatic.com https://fonts.gstatic.com https://*.googleusercontent.com; connect-src 'self' https://weipic-api.weipic2023.workers.dev https://www.google-analytics.com https://region1.google-analytics.com https://formsubmit.co https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com https://*.googleapis.com https://*.googleusercontent.com https://play.google.com; frame-src https:; object-src 'none'; base-uri 'self'; form-action 'self' https://formsubmit.co; upgrade-insecure-requests";

const existingFiles = files.filter(file => fs.existsSync(file));

for (const file of existingFiles) {
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/\s*<!-- Google tag \(gtag\.js\) -->\s*<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-LFTXPZPNPL"><\/script>\s*<script>[\s\S]*?gtag\('config', 'G-LFTXPZPNPL'\);\s*<\/script>\s*/m, '\n');
  html = html.replace(/<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>/g, '<link rel="stylesheet" href="css/tailwind.generated.css" />');
  html = html.replace(/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/jszip\/3\.10\.1\/jszip\.min\.js"><\/script>/g, '<script src="js/vendor/jszip.min.js"></script>');
  html = html.replace(/content="https:\/\/pub-[^"]+\.r2\.dev\/[^"]+"/g, 'content="https://weipic.github.io/assets/images/download_cover.jpg"');
  html = html.replace(/assets\/images\/profile\/avatar\.png/g, 'assets/images/profile/avatar.webp');
  html = html.replace(/相簿已過下載期限/g, '已過下載期限或已被下架');
  html = html.replace(/隱私說明|隱私權說明/g, '隱私權政策');
  html = html.replace(/, maximum-scale=1\.0, user-scalable=no/g, '');
  html = html.replace(/<meta name="referrer"[^>]*>\s*/g, '');
  html = html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>\s*/g, '');
  html = html.replace(/(<meta name="viewport"[^>]*>)/, `$1\n  <meta name="referrer" content="strict-origin-when-cross-origin" />\n  <meta http-equiv="Content-Security-Policy" content="${csp}" />`);
  if (!html.includes('js/analytics.js')) {
    html = html.replace(/(\s*<script src="js\/portfolio-data\.js"><\/script>)/, '\n  <script src="js/analytics.js"></script>$1');
  }
  if (!html.includes('href="privacy.html"')) {
    html = html.replace(
      /(<p class="text-xs text-gray-500(?: pt-1)?">© 2026 Wei\.pictures\. All rights reserved\.<\/p>)/,
      '<div class="flex items-center gap-3 text-xs text-gray-500">$1<a href="privacy.html" class="hover:text-amber-400">隱私權政策</a></div>'
    );
  }
  fs.writeFileSync(file, html);
}

// Keep the privacy page navigation and footer identical to the homepage.
const homepage = fs.readFileSync('index.html', 'utf8');
const homepageHeader = homepage.match(/<header class="header-glass[\s\S]*?<\/header>/)?.[0];
const homepageFooter = homepage.match(/<footer class="bg-\[#08080a\][\s\S]*?<\/footer>/)?.[0];
if (!homepageHeader || !homepageFooter) throw new Error('無法從 index.html 讀取共用導覽列或頁尾');

let privacy = fs.readFileSync('privacy.html', 'utf8').replace(/隱私說明|隱私權說明/g, '隱私權政策');
const privacyHeader = homepageHeader
  .replace('class="nav-link active">關於我與經歷', 'class="nav-link">關於我與經歷')
  .replace('href="#categories-section"', 'href="index.html#categories-section"');
privacy = privacy.replace(/<header[\s\S]*?<\/header>/, privacyHeader);
privacy = privacy.replace(/<body class="[^"]*">/, '<body class="min-h-screen bg-[#0a0a0c] text-[#f5f5f7] antialiased flex flex-col">');
privacy = privacy.replace('<main class="mx-auto max-w-4xl px-6 py-14 sm:py-20">', '<main class="mx-auto w-full max-w-4xl flex-grow px-6 pb-20 pt-32 sm:pt-36">');
if (!privacy.includes('<footer class="bg-[#08080a]')) {
  privacy = privacy.replace(/\s*<script src="js\/analytics\.js"><\/script>/, `\n  ${homepageFooter}\n  <script src="js/analytics.js"></script>`);
}
if (!privacy.includes('js/portfolio-data.js')) {
  privacy = privacy.replace('</body>', '  <script src="js/portfolio-data.js"></script>\n  <script src="js/app.js"></script>\n</body>');
}
fs.writeFileSync('privacy.html', privacy);

console.log(`已更新 ${existingFiles.length} 個 HTML 頁面的本機資源、隱私與安全設定。`);
