// Aparença, còpia i cerca. Navegació i contingut continuen sent HTML.
(function () {
  'use strict';
  var root = document.documentElement;
  var key = 'sx-tema';
  var preference = 'auto';
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  try { preference = localStorage.getItem(key) || 'auto'; } catch (e) {}
  if (!['auto', 'light', 'dark'].includes(preference)) preference = 'auto';
  function apply() {
    root.dataset.theme = preference === 'auto' ? (media.matches ? 'dark' : 'light') : preference;
    document.querySelectorAll('.cq-theme').forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.preference === preference));
    });
  }
  apply();
  function systemChanged() { if (preference === 'auto') apply(); }
  if (media.addEventListener) media.addEventListener('change', systemChanged);
  else if (media.addListener) media.addListener(systemChanged);
  window.addEventListener('storage', function (event) {
    if (event.key !== key && event.key !== null) return;
    preference = ['auto', 'light', 'dark'].includes(event.newValue) ? event.newValue : 'auto';
    apply();
  });
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.cq-theme').forEach(function (button) {
      button.disabled = false;
      button.addEventListener('click', function () {
        preference = button.dataset.preference;
        try { localStorage.setItem(key, preference); } catch (e) {}
        apply();
      });
    });
    apply();
    document.querySelectorAll('.cq-code').forEach(function (block) {
      var pre = block.querySelector('pre');
      var button = block.querySelector('.cq-copy-btn');
      var status = block.querySelector('[role="status"]');
      var reset;
      button.disabled = false;
      button.addEventListener('click', async function () {
        button.disabled = true;
        clearTimeout(reset);
        var copied = false;
        try {
          if (navigator.clipboard && window.isSecureContext) {
            try { await navigator.clipboard.writeText(pre.textContent); copied = true; } catch (e) {}
          }
          if (!copied) {
            var text = document.createElement('textarea');
            text.value = pre.textContent;
            text.className = 'cq-copy-buffer';
            text.setAttribute('aria-label', 'Codi per copiar');
            document.body.appendChild(text);
            try { text.select(); copied = document.execCommand('copy'); }
            finally { text.remove(); button.focus(); }
          }
        } catch (e) {} finally { button.disabled = false; }
        button.textContent = copied ? 'Copiat' : 'Copia';
        status.textContent = copied ? 'Copiat' : 'Selecciona el codi i copia’l amb el teclat.';
        status.classList.toggle('cq-copy-error', !copied);
        if (copied) reset = setTimeout(function () { button.textContent = 'Copia'; status.textContent = ''; }, 2500);
      });
    });
    function normalize(value) {
      return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }
    document.querySelectorAll('.cq-search').forEach(function (search) {
      var input = search.querySelector('input');
      var results = search.querySelector('.cq-search-results');
      var status = search.querySelector('[role="status"]');
      var catalog;
      var loading;
      function render() {
        var terms = normalize(input.value).trim().split(/\s+/).filter(Boolean);
        results.replaceChildren();
        status.textContent = '';
        results.hidden = true;
        if (!terms.length || !catalog) return;
        var matches = catalog.filter(function (item) {
          var text = normalize([item.code, item.title, item.description, item.ra, item.type].join(' '));
          return terms.every(function (term) { return text.includes(term); });
        });
        matches.forEach(function (item) {
          var li = document.createElement('li');
          var link = document.createElement('a');
          link.href = item.url;
          link.textContent = item.code + ' · ' + item.title;
          var description = document.createElement('span');
          description.className = 'muted';
          description.textContent = item.description;
          li.append(link, description);
          results.appendChild(li);
        });
        results.hidden = !matches.length;
        status.textContent = matches.length ? matches.length + (matches.length === 1 ? ' resultat.' : ' resultats.') : 'No s’ha trobat cap material. Prova amb DHCP, Kea o DNS.';
      }
      async function load() {
        if (catalog) return;
        if (!loading) loading = (async function () {
          try {
            var embedded = document.getElementById('cq-cataleg');
            if (embedded) catalog = JSON.parse(embedded.textContent);
            else {
              var response = await fetch(search.dataset.index);
              if (!response.ok) throw new Error('Índex no disponible');
              catalog = await response.json();
            }
            if (!Array.isArray(catalog)) throw new Error('Índex no vàlid');
            render();
          } catch (e) {
            catalog = null;
            loading = null;
            status.textContent = 'La cerca no està disponible. Obre un RA per consultar els materials.';
          }
        })();
        await loading;
      }
      search.addEventListener('toggle', function () { if (search.open) load(); });
      input.addEventListener('input', function () { if (catalog) render(); else load(); });
    });
  });
})();
