(function initConsentAwareAnalytics() {
  const STORAGE_KEY = 'wei_analytics_consent';
  const MEASUREMENT_ID = 'G-LFTXPZPNPL';

  function loadAnalytics() {
    if (document.getElementById('google-analytics-script') || document.getElementById('password-section')) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      anonymize_ip: true
    });
    const script = document.createElement('script');
    script.id = 'google-analytics-script';
    script.async = true;
    script.referrerPolicy = 'no-referrer';
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
    document.head.appendChild(script);
  }

  function saveChoice(choice) {
    localStorage.setItem(STORAGE_KEY, choice);
    document.getElementById('analytics-consent-banner')?.remove();
    if (choice === 'granted') loadAnalytics();
  }

  function showConsentBanner() {
    if (document.getElementById('analytics-consent-banner') || document.getElementById('password-section')) return;
    const banner = document.createElement('section');
    banner.id = 'analytics-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie 與隱私權設定');
    banner.className = 'fixed bottom-4 left-4 right-4 sm:left-auto sm:max-w-md z-[10000] rounded-2xl border border-white/15 bg-[#111218]/20 backdrop-blur-lg p-4 shadow-2xl';
    banner.innerHTML = `
      <p class="text-sm font-semibold text-white">Cookie 與隱私權設定</p>
      <p class="mt-1 text-xs leading-relaxed text-gray-300">本網站使用 Cookie 及相關技術以提升您的瀏覽體驗並優化網站服務。繼續瀏覽本網站即表示您同意我們的 Cookie 政策。詳見<a href="privacy.html" class="text-amber-400 underline">隱私權政策</a>。</p>
      <div class="mt-3 flex gap-2">
        <button type="button" data-consent="denied" class="flex-1 rounded-lg border border-white/15 bg-[#111218]/60 px-3 py-2 text-xs text-gray-200 hover:bg-[#111218]/75">拒絕</button>
        <button type="button" data-consent="granted" class="flex-1 rounded-lg bg-amber-400 px-3 py-2 text-xs font-semibold text-black hover:bg-amber-300">接受所有 Cookie</button>
      </div>
    `;
    banner.addEventListener('click', event => {
      const button = event.target.closest('[data-consent]');
      if (button) saveChoice(button.dataset.consent);
    });
    document.body.appendChild(banner);
  }

  window.resetAnalyticsConsent = function resetAnalyticsConsent() {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('password-section')) return;
    const choice = localStorage.getItem(STORAGE_KEY);
    if (choice === 'granted') loadAnalytics();
    else if (choice !== 'denied') showConsentBanner();
  });
})();
