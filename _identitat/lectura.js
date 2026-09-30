// Tema i eines de lectura; funciona també en HTML autocontingut.
(function () {
  'use strict';
  var root = document.documentElement;
  var key = 'sx-tema';
  var preference = 'auto';
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  try { preference = localStorage.getItem(key) || 'auto'; } catch (e) {}
  if (['auto', 'light', 'dark'].indexOf(preference) < 0) preference = 'auto';

  function apply() {
    root.dataset.theme = preference === 'auto' ? (media.matches ? 'dark' : 'light') : preference;
    document.querySelectorAll('.cq-theme').forEach(function (select) {
      select.value = preference;
    });
  }
  apply();
  function systemChanged() { if (preference === 'auto') apply(); }
  if (media.addEventListener) media.addEventListener('change', systemChanged);
  else if (media.addListener) media.addListener(systemChanged);
  window.addEventListener('storage', function (event) {
    if (event.key !== key && event.key !== null) return;
    preference = ['auto', 'light', 'dark'].indexOf(event.newValue) < 0 ? 'auto' : event.newValue;
    apply();
  });

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.cq-tools').forEach(function (tools) { tools.hidden = false; });
    document.querySelectorAll('.cq-theme').forEach(function (select) {
      select.value = preference;
      select.addEventListener('change', function () {
        preference = select.value;
        try { localStorage.setItem(key, preference); } catch (e) {}
        apply();
      });
    });

    document.querySelectorAll('.cq-block pre').forEach(function (pre) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'cq-copy-btn';
      button.textContent = 'Copia';
      button.setAttribute('aria-label', 'Copia el bloc de codi');
      var status = document.createElement('span');
      status.className = 'cq-copy-status';
      status.setAttribute('role', 'status');
      var bar = document.createElement('div');
      bar.className = 'cq-code-tools';
      bar.appendChild(button);
      bar.appendChild(status);
      pre.parentNode.insertBefore(bar, pre);
      button.addEventListener('click', async function () {
        button.disabled = true;
        try {
          var copied = false;
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
          status.textContent = copied ? 'Copiat.' : 'Selecciona el codi i copia’l amb el teclat.';
        } catch (e) {
          status.textContent = 'Selecciona el codi i copia’l amb el teclat.';
        } finally { button.disabled = false; }
      });
    });

    function normalize(value) {
      return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }
    document.querySelectorAll('.cq-search').forEach(function (search) {
      search.hidden = false;
      var input = search.querySelector('input');
      var results = search.querySelector('.cq-search-results');
      var items = Array.from(results.children);
      var status = search.querySelector('[role="status"]');
      var texts = items.map(function (item) { return normalize(item.textContent); });
      input.addEventListener('input', function () {
        var terms = normalize(input.value).trim().split(/\s+/).filter(Boolean);
        var count = 0;
        items.forEach(function (item, i) {
          var matches = terms.length > 0 && terms.every(function (term) { return texts[i].indexOf(term) >= 0; });
          item.hidden = !matches;
          if (matches) count++;
        });
        results.hidden = !terms.length || !count;
        status.textContent = terms.length ? count + (count === 1 ? ' resultat.' : ' resultats.') : '';
      });
    });
  });
})();
