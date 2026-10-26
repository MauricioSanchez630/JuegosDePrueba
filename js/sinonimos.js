/* ═══════════════════════════════════════════════════════════════
   JUEGO: Sinónimos exprés
   Elige la palabra con significado parecido. +10 puntos por acierto.
   Depende de: js/comun.js ($, addPoints)
═══════════════════════════════════════════════════════════════ */

const synonyms = [
  { w: 'ALEGRE',   a: ['Contento', 'Enfadado', 'Cansado', 'Silencioso'], c: 0 },
  { w: 'RÁPIDO',   a: ['Lento', 'Veloz', 'Pequeño', 'Suave'],            c: 1 },
  { w: 'ENORME',   a: ['Gigante', 'Delgado', 'Breve', 'Débil'],          c: 0 },
  { w: 'COMENZAR', a: ['Terminar', 'Parar', 'Iniciar', 'Olvidar'],       c: 2 },
  { w: 'HERMOSO',  a: ['Bonito', 'Oscuro', 'Lejano', 'Difícil'],         c: 0 }
];

let synIndex   = 0;
let synCorrect = 0;

function render(html) { $('gameContent').innerHTML = html; }

function startSynonym() {
  synIndex   = 0;
  synCorrect = 0;
  synonyms.sort(() => Math.random() - .5);
  nextSynonym();
}

function nextSynonym() {
  const q = synonyms[synIndex % synonyms.length];
  render(`
    <div class="small">Pregunta ${synIndex + 1} de 5</div>
    <div class="question">¿Qué palabra significa algo parecido a «${q.w.toLowerCase()}»?</div>
    <div class="answers">
      ${q.a.map((v, i) => `<button class="answer" onclick="synAnswer(this,${i},${q.c})">${v}</button>`).join('')}
    </div>
    <div class="feedback" id="feedback"></div>
    <div class="quiz-footer">
      <span class="small">+10 puntos por acierto</span>
      <button class="btn" id="next" style="display:none" onclick="advanceSyn()">
        ${synIndex === 4 ? 'Terminar' : 'Siguiente →'}
      </button>
    </div>`);
}

function synAnswer(el, v, c) {
  if ($('next').style.display !== 'none') return;
  document.querySelectorAll('.answer').forEach(x => x.disabled = true);
  if (v === c) {
    el.classList.add('correct');
    $('feedback').textContent = '¡Exacto! +10 puntos';
    addPoints(10);
    synCorrect++;
  } else {
    el.classList.add('wrong');
    document.querySelectorAll('.answer')[c].classList.add('correct');
    $('feedback').textContent = '¡Buen intento!';
  }
  $('next').style.display = 'inline-block';
}

function advanceSyn() {
  synIndex++;
  if (synIndex >= 5) {
    render(`
      <div class="question">Acertaste ${synCorrect} de 5 palabras. 📖</div>
      <button class="btn" onclick="startSynonym()">Practicar de nuevo</button>`);
  } else {
    nextSynonym();
  }
}

document.addEventListener('DOMContentLoaded', startSynonym);
