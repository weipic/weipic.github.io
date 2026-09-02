import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { localeDefinitions } from './locales/content.mjs';

const rootDir = process.cwd();
const pages = [
  'index.html', 'commercial.html', 'portrait.html', 'concert.html', 'event.html',
  'sports.html', 'graduation.html', 'landscape.html', 'contact.html', 'download.html',
  'privacy.html', '404.html'
];
const siteUrl = 'https://wei.pictures';
const localizableDataKeys = new Set([
  'name', 'subTitle', 'tagline', 'location', 'label', 'bio', 'skills', 'brand',
  'role', 'category', 'description', 'logoText', 'title', 'titleEn', 'client',
  'result', 'badge', 'albumTitle', 'clientName', 'pageTitle', 'tabTitle',
  'ogTitle', 'ogDescription', 'linkLabel'
]);

function replaceAllMapped(source, translations) {
  return Object.entries(translations)
    .sort(([a], [b]) => b.length - a.length)
    .reduce((result, [from, to]) => result.split(from).join(to), source);
}

function pageSlug(file) {
  return file === 'index.html' ? '' : file.replace(/\.html$/, '');
}

function pageUrl(prefix, file) {
  const slug = pageSlug(file);
  return `${siteUrl}${prefix ? `/${prefix}` : ''}/${slug}`;
}

function seoLinks(file, canonicalUrl) {
  const slug = pageSlug(file);
  const suffix = slug ? `/${slug}` : '/';
  return [
    `  <link rel="canonical" href="${canonicalUrl}" />`,
    `  <link rel="alternate" hreflang="zh-TW" href="${siteUrl}${suffix}" />`,
    `  <link rel="alternate" hreflang="ja" href="${siteUrl}/jp${suffix}" />`,
    `  <link rel="alternate" hreflang="en" href="${siteUrl}/en${suffix}" />`,
    `  <link rel="alternate" hreflang="x-default" href="${siteUrl}${suffix}" />`
  ].join('\n');
}

function rewriteInternalLinks(html, prefix) {
  html = html.replace(/href="\/?(index|commercial|portrait|concert|event|sports|graduation|landscape|contact|download|privacy|404)(?:\.html)?(#[^"]*)?"/g, (_, page, hash = '') => {
    const slug = page === 'index' ? '' : page;
    const base = prefix ? `/${prefix}/` : '/';
    return `href="${base}${slug}${hash}"`;
  });
  if (prefix) html = html.replace(/href="\/(#[^"]*)?"/g, (_, hash = '') => `href="/${prefix}/${hash}"`);
  return html.replace(/[ \t]+$/gm, '');
}

function stripRootPreferenceRedirect(html) {
  return html
    .replace(/\s*<!-- WEI_LANGUAGE_REDIRECT_START -->[\s\S]*?<!-- WEI_LANGUAGE_REDIRECT_END -->\s*/g, '\n')
    .replace(/\s*<script>\s*\(\(\) => \{\s*try \{\s*const preferred = localStorage\.getItem\('preferred_lang'\);[\s\S]*?\}\)\(\);\s*<\/script>\s*/m, '\n');
}

function addSeo(html, file, prefix) {
  const canonicalUrl = pageUrl(prefix, file);
  html = html.replace(/\s*<link rel="canonical"[^>]*>\s*/g, '\n');
  html = html.replace(/\s*<link rel="alternate"[^>]*>\s*/g, '\n');
  if (/<meta name="robots"[^>]*>/.test(html)) {
    html = html.replace(/(<meta name="robots"[^>]*>)/, `$1\n${seoLinks(file, canonicalUrl)}`);
  } else {
    html = html.replace(/(<meta http-equiv="Content-Security-Policy"[^>]*>)/, `$1\n${seoLinks(file, canonicalUrl)}`);
  }
  html = html.replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonicalUrl}" />`);
  html = html.replace(/<meta name="twitter:url" content="[^"]*" \/>/, `<meta name="twitter:url" content="${canonicalUrl}" />`);
  return html;
}

function rootPreferenceRedirect(file) {
  const slug = pageSlug(file);
  return `  <!-- WEI_LANGUAGE_REDIRECT_START -->
  <script>
    (() => {
      let preferred = '';
      let preferenceSource = '';
      try {
        preferred = localStorage.getItem('pref_lang') || '';
        preferenceSource = localStorage.getItem('pref_lang_source') || '';
      } catch (_) {}
      const localeCandidates = [];
      try {
        if (Array.isArray(navigator.languages)) localeCandidates.push(...navigator.languages);
      } catch (_) {}
      localeCandidates.push(navigator.language || '');
      try { localeCandidates.push(Intl.DateTimeFormat().resolvedOptions().locale || ''); } catch (_) {}
      const normalizedLanguages = [...new Set(localeCandidates
        .map(language => String(language || '').toLowerCase().replaceAll('_', '-'))
        .filter(Boolean))];
      const matchesLanguage = codes => normalizedLanguages.some(language =>
        codes.some(code => language === code || language.startsWith(code + '-'))
      );
      const isChinese = matchesLanguage(['zh', 'yue', 'cmn']);
      const isJapanese = matchesLanguage(['ja']);
      // Repair the English value written by the previous detector on Chinese
      // systems, while preserving English explicitly selected by the user.
      if (isChinese && preferred === 'en' && preferenceSource !== 'manual') {
        preferred = 'zh-TW';
        try {
          localStorage.setItem('pref_lang', preferred);
          localStorage.setItem('pref_lang_source', 'auto');
        } catch (_) {}
        return;
      }
      if (preferred !== 'jp' && preferred !== 'en') {
        if (preferred === 'zh-TW') return;
        if (isChinese) {
          preferred = 'zh-TW';
          try {
            localStorage.setItem('pref_lang', preferred);
            localStorage.setItem('pref_lang_source', 'auto');
          } catch (_) {}
          return;
        }
        preferred = isJapanese ? 'jp' : 'en';
        try {
          localStorage.setItem('pref_lang', preferred);
          localStorage.setItem('pref_lang_source', 'auto');
        } catch (_) {}
      }
      const target = window.location.protocol === 'file:'
        ? preferred + '/${slug || 'index'}.html'
        : '/' + preferred + '/${slug}';
      window.location.replace(target + window.location.search + window.location.hash);
    })();
  </script>
  <!-- WEI_LANGUAGE_REDIRECT_END -->`;
}

function localizedPreferenceRedirect(file, locale) {
  const slug = pageSlug(file);
  return `  <!-- WEI_LANGUAGE_PREFERENCE_START -->
  <script>
    (() => {
      const current = '${locale.prefix}';
      let preferred = '';
      try { preferred = localStorage.getItem('pref_lang') || ''; } catch (_) {}
      if (!['zh-TW', 'jp', 'en'].includes(preferred)) {
        try {
          localStorage.setItem('pref_lang', current);
          localStorage.setItem('pref_lang_source', 'route');
        } catch (_) {}
        return;
      }
      if (preferred === current) return;
      const prefix = preferred === 'zh-TW' ? '' : '/' + preferred;
      const target = window.location.protocol === 'file:'
        ? (preferred === 'zh-TW' ? '../' : '../' + preferred + '/') + '${slug || 'index'}.html'
        : prefix + '/${slug}';
      window.location.replace(target + window.location.search + window.location.hash);
    })();
  </script>
  <!-- WEI_LANGUAGE_PREFERENCE_END -->`;
}

function prepareHtml(source, file, locale) {
  const { code, prefix, htmlTranslations } = locale;
  let html = replaceAllMapped(stripRootPreferenceRedirect(source), htmlTranslations);
  if (code === 'en') {
    html = html.replace(
      /(<a\b[^>]*data-footer-category[^>]*>)([^<]*?) Photography(<\/a>)/g,
      '$1$2$3'
    );
  }
  html = html.replace(/<html lang="[^"]+"/, `<html lang="${code}"`);
  html = addSeo(html, file, prefix);
  html = rewriteInternalLinks(html, prefix);
  html = html
    .replace(/(?:src|href)="\/?(assets|css|js)\//g, match => match.replace(/="\/?/, '="../'))
    .replace(/\s*<script src="\.\.\/js\/i18n\.js"><\/script>/g, '')
    .replace(/<script src="\.\.\/js\/portfolio-data\.js"><\/script>/, `<script src="../js/portfolio-data.${prefix}.js"></script>`)
    .replace(/<script src="\.\.\/js\/app\.js"><\/script>/, '<script src="../js/i18n.js"></script>\n  <script src="../js/app.js"></script>');
  html = html.replace('</head>', `${localizedPreferenceRedirect(file, locale)}\n</head>`);
  return html;
}

function loadPortfolioData() {
  const source = fs.readFileSync(path.join(rootDir, 'js/portfolio-data.js'), 'utf8');
  const context = { window: {} };
  vm.runInNewContext(source, context, { filename: 'js/portfolio-data.js' });
  return context.window.PORTFOLIO_DATA;
}

function localizeData(value, translations, prefix, key = '') {
  if (Array.isArray(value)) return value.map(item => localizeData(item, translations, prefix, key));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([childKey, childValue]) => [
      childKey,
      localizeData(childValue, translations, prefix, childKey)
    ]));
  }
  if (typeof value === 'string' && value.startsWith('assets/')) return `../${value}`;
  if (typeof value === 'string' && key === 'href' && /^[a-z0-9_-]+\.html(?:#.*)?$/i.test(value)) {
    const [file, hash = ''] = value.split('#');
    return `${file}${hash ? `#${hash}` : ''}`;
  }
  if (typeof value === 'string' && localizableDataKeys.has(key)) {
    return translations[value] ?? value;
  }
  return value;
}

function buildI18nRuntime() {
  const dictionaries = Object.fromEntries(Object.values(localeDefinitions).map(locale => [locale.code, locale.uiTranslations]));
  return `/* Generated by scripts/build-locales.mjs. */
(() => {
  const dictionaries = ${JSON.stringify(dictionaries, null, 2)};
  const getLanguage = () => {
    const segments = location.pathname.split('/').filter(Boolean);
    return segments.includes('jp') ? 'ja' : (segments.includes('en') ? 'en' : 'zh-TW');
  };
  const translate = (value, language = getLanguage()) => dictionaries[language]?.[value] ?? value;
  const replacePhrases = (value, language) => {
    if (!value || language === 'zh-TW') return value;
    return Object.entries(dictionaries[language] || {})
      .sort(([a], [b]) => b.length - a.length)
      .reduce((result, [from, to]) => result.split(from).join(to), value);
  };
  const localizeNode = (root) => {
    const language = getLanguage();
    if (language === 'zh-TW') return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (node.parentElement?.closest('script, style, code')) return;
      node.nodeValue = replacePhrases(node.nodeValue, language);
    });
    const elements = root.nodeType === Node.ELEMENT_NODE ? [root, ...root.querySelectorAll('*')] : [...document.querySelectorAll('*')];
    elements.forEach(element => ['aria-label', 'title', 'placeholder', 'content'].forEach(attribute => {
      if (element.hasAttribute?.(attribute)) element.setAttribute(attribute, replacePhrases(element.getAttribute(attribute), language));
    }));
  };
  window.WEI_I18N = { translate, localizeNode, getLanguage };
  const start = () => {
    localizeNode(document);
    new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) localizeNode(node);
      if (node.nodeType === Node.TEXT_NODE) node.nodeValue = replacePhrases(node.nodeValue, getLanguage());
    }))).observe(document.body, { childList: true, subtree: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
`;
}

const sourcePages = Object.fromEntries(pages.map(file => [file, fs.readFileSync(path.join(rootDir, file), 'utf8')]));
const data = loadPortfolioData();

for (const [file, source] of Object.entries(sourcePages)) {
  let rootHtml = addSeo(rewriteInternalLinks(stripRootPreferenceRedirect(source), ''), file, '');
  rootHtml = rootHtml.replace('</head>', `${rootPreferenceRedirect(file)}\n</head>`);
  if (!rootHtml.includes('js/i18n.js')) rootHtml = rootHtml.replace('<script src="js/app.js"></script>', '<script src="js/i18n.js"></script>\n  <script src="js/app.js"></script>');
  fs.writeFileSync(path.join(rootDir, file), rootHtml);
}

for (const locale of Object.values(localeDefinitions)) {
  fs.mkdirSync(path.join(rootDir, locale.prefix), { recursive: true });
  for (const [file, source] of Object.entries(sourcePages)) {
    fs.writeFileSync(path.join(rootDir, locale.prefix, file), prepareHtml(source, file, locale));
  }
  const localizedData = localizeData(data, locale.dataTranslations, locale.prefix);
  fs.writeFileSync(
    path.join(rootDir, `js/portfolio-data.${locale.prefix}.js`),
    `/* Generated by scripts/build-locales.mjs. */\nwindow.PORTFOLIO_DATA = ${JSON.stringify(localizedData, null, 2)};\n`
  );
}

fs.writeFileSync(path.join(rootDir, 'js/i18n.js'), buildI18nRuntime());
console.log(`Built ${pages.length * Object.keys(localeDefinitions).length} localized HTML pages and native language assets.`);
