  // Motor únic per a totes les preguntes single i multi.
  document.querySelectorAll('.cq-question').forEach(function (question) {
    var id = question.dataset.id;
    if (!id) {
      throw new Error('Falta data-id a una pregunta del quiz.');
    }
    var type = question.dataset.type;
    if (type !== 'single' && type !== 'multi') {
      throw new Error('data-type invàlid ("' + type + '") a la pregunta "' + id + '".');
    }

    var options = question.querySelectorAll('.cq-option');
    var checkBtn = question.querySelector('.cq-check-btn');
    var feedback = question.querySelector('.cq-feedback');

    options.forEach(function (opt) {
      opt.addEventListener('click', function () {
        if (type === 'single') {
          options.forEach(function (o) { o.classList.remove('cq-selected'); });
          opt.classList.add('cq-selected');
        } else {
          opt.classList.toggle('cq-selected');
        }
        options.forEach(function (o) {
          o.setAttribute('aria-pressed',
            o.classList.contains('cq-selected') ? 'true' : 'false');
        });
      });
    });

    var retry = document.createElement('button');
    retry.type = 'button';
    retry.className = 'cq-check-btn';
    retry.textContent = 'Torna-ho a provar';
    retry.hidden = true;
    checkBtn.parentNode.appendChild(retry);
    retry.addEventListener('click', function () {
      options.forEach(function (o) {
        o.classList.remove('cq-selected', 'cq-correct', 'cq-incorrect');
        o.setAttribute('aria-pressed', 'false');
        o.disabled = false;
        o.querySelectorAll('.cq-result-label').forEach(function (l) { l.remove(); });
      });
      feedback.textContent = '';
      checkBtn.disabled = false;
      retry.hidden = true;
      options[0].focus();
    });

    checkBtn.addEventListener('click', function () {
      if (!Array.from(options).some(function (o) { return o.classList.contains('cq-selected'); })) {
        feedback.textContent = 'Tria almenys una resposta abans de comprovar.';
        return;
      }
      var allCorrect = true;
      var answers = [];
      options.forEach(function (opt) {
        var isCorrect = opt.dataset.correct === 'true';
        var isSelected = opt.classList.contains('cq-selected');

        if (isCorrect) {
          opt.classList.add('cq-correct');
          answers.push(opt.textContent.trim());
        } else if (isSelected) {
          opt.classList.add('cq-incorrect');
        }
        var label = document.createElement('span');
        label.className = 'cq-result-label';
        label.textContent = isCorrect ? ' — Resposta correcta' : (isSelected ? ' — Resposta incorrecta seleccionada' : ' — Resposta incorrecta');
        opt.appendChild(label);
        opt.disabled = true;
        if (isCorrect !== isSelected) {
          allCorrect = false;
        }
      });
      feedback.textContent = (allCorrect ? 'Correcte. ' : 'Incorrecte. ') + 'Resposta: ' + answers.join('; ') + '. ' + (question.dataset.explanation || 'Revisa el concepte al text de la teoria abans de tornar-ho a provar.');
      feedback.className = 'cq-feedback ' + (allCorrect ? 'ok' : 'ko');
      checkBtn.disabled = true;
      retry.hidden = false;
    });
  });
