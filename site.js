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
    var sels = document.querySelectorAll('.langsw select'), lbls = document.querySelectorAll('.langsw-l');
    for (var j = 0; j < sels.length; j++) sels[j].value = l;
    for (var k = 0; k < lbls.length; k++) lbls[k].textContent = l.toUpperCase();
    var was = document.querySelectorAll('[data-wa]');
    for (var w = 0; w < was.length; w++) was[w].href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(WA_MSG[l]);
    if (typeof window.onLang === 'function') window.onLang(l);
  }
  // Choix manuel : mémorisé (clé « -choix », l'ancienne clé était posée d'office et bloquait la détection).
  var KEY = 'kombrio-site-lang-choix';
  var sels0 = document.querySelectorAll('.langsw select');
  for (var s = 0; s < sels0.length; s++) sels0[s].onchange = function () {
    try { localStorage.setItem(KEY, this.value); } catch (e) { /* stockage indisponible */ }
    setLang(this.value);
  };

  // Langue de départ : ?lang= dans le lien, sinon le choix manuel, sinon la langue de l'appareil.
  function deviceLang() {
    var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'pt'];
    for (var i = 0; i < list.length; i++) {
      var n = String(list[i]).slice(0, 2).toLowerCase();
      if (n === 'pt' || n === 'es') return 'pt';
      if (n === 'fr') return 'fr';
      if (n === 'en') return 'en';
    }
    return 'en';
  }
  var start = '';
  var q = /[?&]lang=(pt|en|fr)/.exec(location.search);
  if (q) start = q[1];
  if (!start) { try { start = localStorage.getItem(KEY) || ''; } catch (e) { start = ''; } }
  if (!start) start = deviceLang();
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
