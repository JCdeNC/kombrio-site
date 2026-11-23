/* Kombrio · site public : langues (PT par défaut, EN, FR), contact, onglets de la FAQ.
   Les textes portugais sont dans le HTML ; chaque page ajoute ses traductions dans window.PAGE_T. */
(function () {
  var WHATSAPP = '5521995852273'; // numéro Kombrio confirmé par JC le 23/11/2026
  var COMMON = {
    en: {
      'nav.partners': 'Businesses', 'nav.guides': 'Guides', 'nav.faq': 'FAQ', 'nav.dl': 'Get the app', 'nav.app': 'Sign in',
      'c.t': 'Shall we talk?', 'c.p': 'Restaurant, shop, guide or agency in Rio: the Kombrio team answers you.', 'c.wa': 'Message us on WhatsApp',
      'ft.priv': 'Privacy policy (soon)', 'ft.terms': 'Terms of use (soon)', 'ft.city': '© 2026 Kombrio · Rio de Janeiro'
    },
    fr: {
      'nav.partners': 'Établissements', 'nav.guides': 'Guides', 'nav.faq': 'FAQ', 'nav.dl': 'Installer l’app', 'nav.app': 'Connexion',
      'c.t': 'On en parle ?', 'c.p': 'Restaurant, boutique, guide ou agence à Rio : l’équipe Kombrio vous répond.', 'c.wa': 'Écrire sur WhatsApp',
      'ft.priv': 'Politique de confidentialité (bientôt)', 'ft.terms': 'Conditions d’utilisation (bientôt)', 'ft.city': '© 2026 Kombrio · Rio de Janeiro'
    }
  };
  var WA_MSG = { pt: 'Olá! Quero saber mais sobre a Kombrio.', en: 'Hello! I would like to know more about Kombrio.', fr: 'Bonjour ! J’aimerais en savoir plus sur Kombrio.' };
  var PAGE = window.PAGE_T || {};
  var PT = {};
  var els = document.querySelectorAll('[data-t]');
  for (var i = 0; i < els.length; i++) {
    var el = els[i];
    PT[el.getAttribute('data-t')] = el.hasAttribute('data-html') ? el.innerHTML : el.textContent;
  }
  function pick(l, k) {
    if (l !== 'pt') {
      if (PAGE[l] && PAGE[l][k] != null) return PAGE[l][k];
      if (COMMON[l] && COMMON[l][k] != null) return COMMON[l][k];
    }
    return PT[k];
  }
  function setLang(l) {
    if (l !== 'pt' && l !== 'en' && l !== 'fr') l = 'pt';
    for (var i = 0; i < els.length; i++) {
      var el = els[i], v = pick(l, el.getAttribute('data-t'));
      if (v == null) continue;
      if (el.hasAttribute('data-html')) el.innerHTML = v; else el.textContent = v;
    }
    document.documentElement.lang = l === 'pt' ? 'pt-BR' : l;
    var bs = document.querySelectorAll('.seg button');
    for (var j = 0; j < bs.length; j++) bs[j].className = bs[j].getAttribute('data-l') === l ? 'on' : '';
    var was = document.querySelectorAll('[data-wa]');
    for (var w = 0; w < was.length; w++) was[w].href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(WA_MSG[l]);
    try { localStorage.setItem('kombrio-site-lang', l); } catch (e) { /* stockage indisponible */ }
    if (typeof window.onLang === 'function') window.onLang(l);
  }
  var segs = document.querySelectorAll('.seg button');
  for (var s = 0; s < segs.length; s++) segs[s].onclick = function () { setLang(this.getAttribute('data-l')); };

  var start = '';
  var q = /[?&]lang=(pt|en|fr)/.exec(location.search);
  if (q) start = q[1];
  if (!start) { try { start = localStorage.getItem('kombrio-site-lang') || ''; } catch (e) { start = ''; } }
  if (!start) {
    var n = (navigator.language || 'pt').slice(0, 2).toLowerCase();
    start = n === 'pt' || n === 'es' ? 'pt' : (n === 'fr' ? 'fr' : 'en');
  }
  setLang(start);

  /* Onglets de la FAQ (faq.html) : #estabelecimentos, #guias, #agencias, #turistas */
  var tabs = document.querySelectorAll('[data-aud-tab]');
  if (tabs.length) {
    var show = function (id, scroll) {
      var found = false;
      for (var i = 0; i < tabs.length; i++) {
        var on = tabs[i].getAttribute('data-aud-tab') === id;
        if (on) found = true;
        tabs[i].className = on ? 'on' : '';
        tabs[i].setAttribute('aria-selected', on ? 'true' : 'false');
        document.getElementById('aud-' + tabs[i].getAttribute('data-aud-tab')).hidden = !on;
      }
      if (!found) show('estabelecimentos', false);
    };
    for (var t = 0; t < tabs.length; t++) tabs[t].onclick = function () {
      var id = this.getAttribute('data-aud-tab');
      show(id);
      try { history.replaceState(null, '', '#' + id); } catch (e) { /* rien */ }
    };
    show((location.hash || '#estabelecimentos').slice(1));
    window.addEventListener('hashchange', function () { show(location.hash.slice(1)); });
  }
})();
