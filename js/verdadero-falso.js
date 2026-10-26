/* ═══════════════════════════════════════════════════════════════
   JUEGO: Verdadero o Falso
   Preguntas por curso desde ../datos/VF<curso>.json. +10 por acierto.
   Depende de: js/comun.js ($, addPoints, escHtml)
═══════════════════════════════════════════════════════════════ */

const VF_COURSES = [
  { id: 'primero',  label: 'Primero básico',  num: '1°', file: '../datos/VFprimero.json'  },
  { id: 'segundo',  label: 'Segundo básico',  num: '2°', file: '../datos/VFsegundo.json'  },
  { id: 'tercero',  label: 'Tercero básico',  num: '3°', file: '../datos/VFtercero.json'  },
  { id: 'cuarto',   label: 'Cuarto básico',   num: '4°', file: '../datos/VFcuarto.json'   },
  { id: 'quinto',   label: 'Quinto básico',   num: '5°', file: '../datos/VFquinto.json'   },
  { id: 'sexto',    label: 'Sexto básico',    num: '6°', file: '../datos/VFsexto.json'    },
  { id: 'septimo',  label: 'Séptimo básico',  num: '7°', file: '../datos/VFseptimo.json'  },
  { id: 'octavo',   label: 'Octavo básico',   num: '8°', file: '../datos/VFoctavo.json'   }
];
const VF_PER_ROUND   = 5;
const VF_PTS_CORRECT = 10;

let vf = {
  course:      null,
  questions:   [],
  index:       0,
  correct:     0,
  answered:    false,
  pointsGiven: new Set()
};

function render(html) { $('gameContent').innerHTML = html; }

function startVF() {
  const courseButtons = VF_COURSES.map(c =>
    `<button class="vf-course-btn" onclick="vfSelectCourse('${c.id}')">
       <span class="vf-course-num">${c.num}</span>${escHtml(c.label)}
     </button>`
  ).join('');

  render(`
    <p class="small" style="margin:0 0 10px">Selecciona tu curso para comenzar:</p>
    <div class="vf-course-grid">${courseButtons}</div>`);
}

function vfSelectCourse(courseId) {
  const course = VF_COURSES.find(c => c.id === courseId);
  if (!course) return;
  vf.course = course;

  render(`<div class="small" style="text-align:center;padding:20px">
    Cargando preguntas de <b>${escHtml(course.label)}</b>…</div>`);

  fetch(course.file, { cache: 'no-store' })
    .then(res => {
      if (!res.ok) throw new Error(`No se pudo cargar el archivo (HTTP ${res.status}). Verifica que el servidor esté activo.`);
      return res.json();
    })
    .then(data => vfValidateAndStart(data))
    .catch(err  => vfShowError(err.message));
}

function vfValidateAndStart(data) {
  if (!data || !Array.isArray(data.preguntas)) {
    return vfShowError('El archivo no tiene el campo "preguntas" o su formato es incorrecto.');
  }
  if (data.preguntas.length === 0) {
    return vfShowError(`El archivo de ${escHtml(vf.course.label)} no contiene preguntas.`);
  }

  const seenIds = new Set();
  const valid = data.preguntas.filter(q => {
    if (!q || typeof q.afirmacion !== 'string' || !q.afirmacion.trim()) return false;
    if (typeof q.respuesta !== 'boolean') return false;
    if (typeof q.explicacion !== 'string' || !q.explicacion.trim()) return false;
    if (q.id !== undefined) {
      if (seenIds.has(q.id)) return false;
      seenIds.add(q.id);
    }
    return true;
  });

  if (valid.length === 0) {
    return vfShowError(`No hay preguntas válidas en el archivo de ${escHtml(vf.course.label)}. Verifica que cada pregunta tenga afirmación, respuesta booleana y explicación.`);
  }

  const shuffled = [...valid].sort(() => Math.random() - .5);
  vf.questions   = shuffled.slice(0, Math.min(VF_PER_ROUND, shuffled.length));
  vf.index       = 0;
  vf.correct     = 0;
  vf.answered    = false;
  vf.pointsGiven = new Set();

  vfShowQuestion();
}

function vfShowError(msg) {
  render(`
    <div class="feedback" style="color:#df6879;margin-bottom:12px">⚠️ ${escHtml(msg)}</div>
    <p class="small">No se cargaron preguntas de otro curso como sustitución.</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">
      <button class="btn secondary" onclick="vfSelectCourse('${vf.course ? vf.course.id : ''}')">Reintentar</button>
      <button class="btn secondary" onclick="startVF()">Volver a cursos</button>
    </div>`);
}

function vfShowQuestion() {
  vf.answered  = false;
  const q      = vf.questions[vf.index];
  const total  = vf.questions.length;
  const isLast = vf.index === total - 1;
  const curso  = vf.course ? escHtml(vf.course.label) : '';
  const tema   = q.tema ? `<span class="small" style="margin:0">📚 ${escHtml(q.tema)}</span>` : '';

  render(`
    <div class="vf-meta">
      <span class="small" style="margin:0">Pregunta <b>${vf.index + 1}</b> de <b>${total}</b> · ✅ <b>${vf.correct}</b> correctas</span>
      ${tema}
    </div>
    <div class="small" style="margin:0 0 6px;color:light-dark(#5142c8,#c4bcff)">📖 ${curso}</div>
    <div class="vf-afirmacion" id="vf-afirmacion">${escHtml(q.afirmacion)}</div>
    <div class="vf-btns">
      <button class="vf-btn vf-btn-v" id="vf-btn-v" onclick="vfAnswer(true)">✅ VERDADERO</button>
      <button class="vf-btn vf-btn-f" id="vf-btn-f" onclick="vfAnswer(false)">❌ FALSO</button>
    </div>
    <div class="feedback" id="vf-feedback" style="min-height:22px"></div>
    <div class="vf-explain" id="vf-explain"></div>
    <div class="quiz-footer" style="margin-top:14px">
      <span class="small">+${VF_PTS_CORRECT} pts por acierto</span>
      <button class="btn" id="vf-next" style="display:none" onclick="vfAdvance()">
        ${isLast ? 'Ver resultado' : 'Siguiente →'}
      </button>
    </div>`);
}

function vfAnswer(chosen) {
  if (vf.answered) return;
  vf.answered   = true;
  const q       = vf.questions[vf.index];
  const correct = q.respuesta;
  const btnV    = $('vf-btn-v');
  const btnF    = $('vf-btn-f');
  const fb      = $('vf-feedback');
  const explain = $('vf-explain');

  if (btnV) btnV.disabled = true;
  if (btnF) btnF.disabled = true;

  const chosenBtn  = chosen ? btnV  : btnF;
  const correctBtn = correct ? btnV : btnF;

  if (chosen === correct) {
    if (chosenBtn) chosenBtn.classList.add('vf-chosen-correct');
    if (fb) fb.textContent = '✅ ¡Correcto! Muy bien.';
    const qKey = q.id ?? q.afirmacion;
    if (!vf.pointsGiven.has(qKey)) {
      vf.pointsGiven.add(qKey);
      addPoints(VF_PTS_CORRECT);
      vf.correct++;
    }
  } else {
    if (chosenBtn)  chosenBtn.classList.add('vf-chosen-wrong');
    if (correctBtn) correctBtn.classList.add('vf-show-correct');
    const correctLabel = correct ? 'VERDADERO' : 'FALSO';
    if (fb) fb.textContent = `❌ ¡Buen intento! La respuesta correcta es: ${correctLabel}.`;
  }

  if (q.explicacion && explain) {
    explain.textContent = '💡 ' + q.explicacion;
    explain.style.display = 'block';
  }

  const nextBtn = $('vf-next');
  if (nextBtn) nextBtn.style.display = 'inline-block';
}

function vfAdvance() {
  vf.index++;
  if (vf.index >= vf.questions.length) {
    vfShowResult();
  } else {
    vfShowQuestion();
  }
}

function vfShowResult() {
  const total   = vf.questions.length;
  const correct = vf.correct;
  const wrong   = total - correct;
  const pct     = Math.round((correct / total) * 100);
  const pts     = correct * VF_PTS_CORRECT;
  const emoji   = pct >= 80 ? '🌟' : pct >= 50 ? '👍' : '💪';
  const mensaje = pct >= 80 ? '¡Excelente trabajo!' : pct >= 50 ? '¡Buen intento, sigue practicando!' : '¡Sigue aprendiendo, puedes mejorar!';
  const curso   = vf.course ? escHtml(vf.course.label) : '';

  render(`
    <div class="question" style="margin-bottom:18px">${emoji} ${mensaje}</div>
    <div style="background:light-dark(#f4f2ff,#2b2b42);border-radius:13px;padding:16px;margin-bottom:18px">
      <div class="vf-result-row"><span>📖 Curso</span><b>${curso}</b></div>
      <div class="vf-result-row"><span>📝 Preguntas respondidas</span><b>${total}</b></div>
      <div class="vf-result-row"><span>✅ Respuestas correctas</span><b>${correct}</b></div>
      <div class="vf-result-row"><span>❌ Respuestas incorrectas</span><b>${wrong}</b></div>
      <div class="vf-result-row"><span>📊 Porcentaje de aciertos</span><b>${pct}%</b></div>
      <div class="vf-result-row"><span>⭐ Puntos obtenidos</span><b>${pts}</b></div>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn" onclick="vfSelectCourse('${vf.course ? vf.course.id : ''}')">Jugar de nuevo (${curso})</button>
      <button class="btn secondary" onclick="startVF()">Cambiar curso</button>
    </div>`);
}

document.addEventListener('DOMContentLoaded', startVF);
