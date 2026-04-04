(function () {

  /* ── THEME ── */
  var THEME_KEY = 'nc-fiodena-theme';
  var body = document.body;
  function applyTheme(t) { body.classList.toggle('dark', t === 'dark'); }
  applyTheme(localStorage.getItem(THEME_KEY) || 'light');
  var themeBtn = document.getElementById('theme-toggle');
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

  function getText(key) {
    var T = window.NCTranslations;
    if (!T) return null;
    var dict = T[currentLang] || T['it'];
    if (dict[key] !== undefined) return dict[key];
    return T['it'] ? T['it'][key] : null;
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = getText(el.getAttribute('data-i18n'));
      if (v !== null) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = getText(el.getAttribute('data-i18n-html'));
      if (v !== null) el.innerHTML = v;
    });
    /* sync active pill */
    document.querySelectorAll('.lang-pill[data-lang]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
    });
  }

  function setLang(lang) {
    var T = window.NCTranslations;
    if (!T || !T[lang]) return;
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    applyTranslations();
  }

  /* wire lang pills — data-lang already in HTML */
  document.querySelectorAll('.lang-pill[data-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLang(btn.getAttribute('data-lang'));
    });
  });

  /* apply on load */
  function init() {
    if (window.NCTranslations) {
      applyTranslations();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
