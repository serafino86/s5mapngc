(function () {
  /* ── THEME ── */
  var THEME_KEY = 'nc-fiodena-theme';
  var body = document.body;
  var themeBtn = document.getElementById('theme-toggle');

  function applyTheme(t) { body.classList.toggle('dark', t === 'dark'); }
  applyTheme(localStorage.getItem(THEME_KEY) || 'light');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = body.classList.contains('dark') ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  /* ── I18N ── */
  var LANG_KEY = 'nc-fiodena-lang';
  var currentLang = localStorage.getItem(LANG_KEY) || 'it';

  function t(key) {
    var T = window.NCTranslations;
    if (!T) return '';
    var lang = T[currentLang] || T['it'];
    return lang[key] !== undefined ? lang[key] : (T['it'][key] || '');
  }

  function applyTranslations() {
    /* text nodes */
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.dataset.i18n);
    });
    /* html nodes */
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      el.innerHTML = t(el.dataset.i18nHtml);
    });
    /* placeholders */
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    /* active lang pill */
    document.querySelectorAll('.lang-pill').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });
  }

  function setLang(lang) {
    if (!window.NCTranslations || !window.NCTranslations[lang]) return;
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    applyTranslations();
  }

  /* wire lang pills */
  document.querySelectorAll('.lang-pill').forEach(function (btn) {
    btn.dataset.lang = btn.textContent.trim().toLowerCase();
    btn.addEventListener('click', function () { setLang(btn.dataset.lang); });
  });

  /* run after translations.js is loaded */
  function init() {
    if (window.NCTranslations) {
      applyTranslations();
    } else {
      document.addEventListener('nc-translations-ready', applyTranslations);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
