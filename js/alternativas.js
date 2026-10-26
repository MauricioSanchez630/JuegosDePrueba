/* ═══════════════════════════════════════════════════════════════
   JUEGO: Alternativas
   Preguntas con 4 opciones desde ../alternativas.json. +10 por acierto.
   Depende de: js/comun.js ($, addPoints, escHtml)
═══════════════════════════════════════════════════════════════ */

const ALT_PER_ROUND = 5;

let alt = {
  bank:          [],
  round:         [],
  index:         0,
  correctCount:  0,
  answered:      false,
  pointsAwarded: new Set()
};

function render(html) { $('gameContent').innerHTML = html; }

function startTrivia() {
  if (alt.bank.length === 0) {
    loadAlternativas().then(() => initTriviaRound());
  } else {
    initTriviaRound();
  }
}

async function loadAlternativas() {
  try {
    const res = await fetch('../alternativas.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error('El archivo está vacío o su formato es incorrecto.');

    const valid = data.filter(q => {
      if (!q || typeof q.pregunta !== 'string' || !q.pregunta.trim()) return false;
      if (!Array.isArray(q.alternativas) || q.alternativas.length !== 4) return false;
      if (q.alternativas.some(a => typeof a !== 'string' || !a.trim())) return false;
      if (typeof q.respuestaCorrecta !== 'number') return false;
      if (q.respuestaCorrecta < 0 || q.respuestaCorrecta > 3) return false;
      return true;
    });

    if (valid.length === 0) throw new Error('No hay preguntas válidas en alternativas.json.');
    alt.bank = valid;
  } catch (err) {
    render(`
      <div class="feedback" style="color:#df6879;margin-bottom:10px">⚠️ No se pudo cargar alternativas.json: ${escHtml(err.message)}</div>
      <p class="small">Asegúrate de ejecutar la página desde un servidor web (no con file://).</p>
      <button class="btn secondary" onclick="startTrivia()">Reintentar</button>`);
    alt.bank = [];
  }
}

function initTriviaRound() {
  if (alt.bank.length === 0) return;

  const shuffled = [...alt.bank].sort(() => Math.random() - .5);
  const selected = shuffled.slice(0, Math.min(ALT_PER_ROUND, shuffled.length));

  alt.round = selected.map(q => {
    const indexed = q.alternativas.map((text, i) => ({ text, isCorrect: i === q.respuestaCorrecta }));
    indexed.sort(() => Math.random() - .5);
    const newCorrect = indexed.findIndex(a => a.isCorrect);
    return {
      id:               q.id ?? q.pregunta,
      pregunta:         q.pregunta.trim(),
      alternativas:     indexed.map(a => a.text),
      respuestaCorrecta: newCorrect,
      explicacion:      typeof q.explicacion === 'string' ? q.explicacion.trim() : ''
    };
  });

  alt.index         = 0;
  alt.correctCount  = 0;
  alt.answered      = false;
  alt.pointsAwarded = new Set();

  nextTrivia();
}

function nextTrivia() {
  alt.answered = false;
  const q      = alt.round[alt.index];
  const total  = alt.round.length;
  const isLast = alt.index === total - 1;

  render(`
    <div class="small" style="margin-bottom:4px">Pregunta ${alt.index + 1} de ${total} · ${alt.correctCount} correctas</div>
    <div class="question">${escHtml(q.pregunta)}</div>
    <div class="answers">
      ${q.alternativas.map((opt, i) =>
        `<button class="answer" id="alt-opt-${i}" onclick="triviaAnswer(this, ${i})">${escHtml(opt)}</button>`
      ).join('')}
    </div>
    <div class="feedback" id="alt-feedback"></div>
    <div id="alt-explain" class="small" style="margin-top:6px;display:none"></div>
    <div class="quiz-footer" style="margin-top:14px">
      <span class="small">+10 puntos por acierto</span>
      <button class="btn" id="alt-next" style="display:none" onclick="advanceTrivia()">
        ${isLast ? 'Ver resultado' : 'Siguiente →'}
      </button>
    </div>`);
}

function triviaAnswer(el, chosen) {
  if (alt.answered) return;
  alt.answered = true;

  const q       = alt.round[alt.index];
  const correct = q.respuestaCorrecta;

  for (let i = 0; i < 4; i++) {
    const btn = $(`alt-opt-${i}`);
    if (btn) btn.disabled = true;
  }

  const fb      = $('alt-feedback');
  const explain = $('alt-explain');

  if (chosen === correct) {
    el.classList.add('correct');
    if (fb) fb.textContent = '✅ ¡Respuesta correcta! +10 puntos';
    const qKey = q.id ?? q.pregunta;
    if (!alt.pointsAwarded.has(qKey)) {
      alt.pointsAwarded.add(qKey);
      addPoints(10);
      alt.correctCount++;
    }
  } else {
    el.classList.add('wrong');
    const correctBtn = $(`alt-opt-${correct}`);
    if (correctBtn) correctBtn.classList.add('correct');
    if (fb) fb.textContent = '❌ Incorrecto. La respuesta correcta está marcada en verde.';
  }

  if (q.explicacion && explain) {
    explain.textContent = '💡 ' + q.explicacion;
    explain.style.display = 'block';
  }

  const nextBtn = $('alt-next');
  if (nextBtn) nextBtn.style.display = 'inline-block';
}

function advanceTrivia() {
  alt.index++;
  if (alt.index >= alt.round.length) {
    const total   = alt.round.length;
    const correct = alt.correctCount;
    const emoji   = correct >= total * .8 ? '🌟' : correct >= total * .5 ? '👍' : '💪';
    render(`
      <div class="question">${emoji} ${correct >= total * .8 ? '¡Excelente trabajo!' : correct >= total * .5 ? '¡Buen intento!' : '¡Sigue practicando!'}</div>
      <p>Respondiste <b>${correct} de ${total}</b> preguntas correctamente.</p>
      <p>Puntos ganados esta partida: <b>${correct * 10}</b></p>
      <button class="btn" onclick="initTriviaRound()">Jugar de nuevo</button>`);
  } else {
    nextTrivia();
  }
}

document.addEventListener('DOMContentLoaded', startTrivia);
