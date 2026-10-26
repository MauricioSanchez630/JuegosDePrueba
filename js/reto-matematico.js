/* ═══════════════════════════════════════════════════════════════
   JUEGO: Reto matemático
   Operaciones con dificultad creciente. +10 puntos por acierto.
   Depende de: js/comun.js ($, rand, addPoints)
═══════════════════════════════════════════════════════════════ */

let questionIndex = 0;
let correctCount  = 0;

/* Renderiza HTML dentro del panel del juego */
function render(html) { $('gameContent').innerHTML = html; }

function startMath() {
  questionIndex = 0;
  correctCount  = 0;
  nextMath();
}

function nextMath() {
  let a, b, op, ans;
  const level = Math.floor(questionIndex / 3);
  op = ['+', '−', '×'][Math.min(2, level)];
  if (op === '+')      { a = rand(2, 30); b = rand(2, 30); ans = a + b; }
  else if (op === '−') { a = rand(10, 40); b = rand(1, a); ans = a - b; }
  else                 { a = rand(2, 12); b = rand(2, 10); ans = a * b; }

  const choices = new Set([ans]);
  while (choices.size < 4) choices.add(ans + rand(-12, 12));
  const opts = [...choices].sort(() => Math.random() - .5);

  render(`
    <div class="small">Pregunta ${questionIndex + 1} de 5 · ${correctCount} correctas</div>
    <div class="question">¿Cuánto es ${a} ${op} ${b}?</div>
    <div class="answers">
      ${opts.map(v => `<button class="answer" onclick="mathAnswer(this,${v},${ans})">${v}</button>`).join('')}
    </div>
    <div class="feedback" id="feedback"></div>
    <div class="quiz-footer">
      <span class="small">+10 puntos por acierto</span>
      <button class="btn" id="next" style="display:none" onclick="advanceMath()">
        ${questionIndex === 4 ? 'Ver resultado' : 'Siguiente →'}
      </button>
    </div>`);
}

function mathAnswer(el, v, ans) {
  if ($('next').style.display !== 'none') return;
  document.querySelectorAll('.answer').forEach(x => x.disabled = true);
  if (v === ans) {
    el.classList.add('correct');
    $('feedback').textContent = '¡Muy bien! +10 puntos';
    addPoints(10);
    correctCount++;
  } else {
    el.classList.add('wrong');
    $('feedback').textContent = '¡Buen intento! La respuesta era ' + ans + '.';
    document.querySelectorAll('.answer').forEach(x => { if (Number(x.textContent) === ans) x.classList.add('correct'); });
  }
  $('next').style.display = 'inline-block';
}

function advanceMath() {
  questionIndex++;
  if (questionIndex >= 5) {
    render(`
      <div class="question">${correctCount >= 4 ? '🌟 ¡Excelente trabajo!' : correctCount >= 2 ? '👍 ¡Vas progresando!' : '💪 ¡Sigue practicando!'}</div>
      <p>Acertaste ${correctCount} de 5 preguntas y ganaste ${correctCount * 10} puntos en esta partida.</p>
      <button class="btn" onclick="startMath()">Jugar otra vez</button>`);
  } else {
    nextMath();
  }
}

/* Iniciar automáticamente al cargar la página */
document.addEventListener('DOMContentLoaded', startMath);
