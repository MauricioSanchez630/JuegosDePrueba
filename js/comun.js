/* ═══════════════════════════════════════════════════════════════
   AULA PLAY · Funciones comunes a todas las páginas
   Incluye: acceso al DOM, utilidades, y el sistema de puntuación
   persistente (localStorage) compartido entre index y los juegos.
═══════════════════════════════════════════════════════════════ */

/* Atajo para document.getElementById */
const $ = id => document.getElementById(id);

/* Número entero aleatorio entre min y max (ambos inclusive).
   NOTA: el proyecto original usaba rand() sin definirla; aquí queda
   definida de forma explícita. */
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/* Escapa caracteres HTML para insertar texto de datos de forma segura */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ─────────────────────────────────────────────────────────────
   PUNTUACIÓN PERSISTENTE
   Los puntos se guardan en localStorage para compartirse entre
   la página principal y todas las páginas de juego.
───────────────────────────────────────────────────────────── */
const SCORE_KEY = 'aulaplay_score';

function getPoints() {
  const v = parseInt(localStorage.getItem(SCORE_KEY), 10);
  return Number.isFinite(v) ? v : 0;
}

function setPoints(n) {
  localStorage.setItem(SCORE_KEY, String(n));
  renderScore();
}

/* Suma n puntos al total global y actualiza la vista */
function addPoints(n) {
  setPoints(getPoints() + n);
}

/* Refleja el total en cualquier elemento con id="score" presente */
function renderScore() {
  const el = $('score');
  if (el) el.textContent = getPoints();
}

/* Al cargar la página, pinta el puntaje actual si existe el contador.
   Se escucha también 'storage' para sincronizar entre pestañas. */
document.addEventListener('DOMContentLoaded', renderScore);
window.addEventListener('storage', e => { if (e.key === SCORE_KEY) renderScore(); });

/* ─────────────────────────────────────────────────────────────
   CURSO SELECCIONADO (compartido entre index y los juegos)
   El curso elegido en index.html se guarda en localStorage y se
   propaga a las páginas de juego vía el parámetro de URL ?curso=.
   Los juegos que dependen del curso usan getCursoSeleccionado()
   para cargar el JSON correspondiente a ese curso.
───────────────────────────────────────────────────────────── */
const CURSO_KEY = 'aulaplay_curso';

/* Metadatos de los 8 cursos de educación básica.
   id     → sufijo usado en los nombres de archivo JSON (VF, ALT, MC)
   num    → número del curso (1..8), valor del selector de index
   label  → nombre legible para mostrar en la interfaz */
const CURSOS = [
  { id: 'primero', num: '1', label: 'Primero básico' },
  { id: 'segundo', num: '2', label: 'Segundo básico' },
  { id: 'tercero', num: '3', label: 'Tercero básico' },
  { id: 'cuarto',  num: '4', label: 'Cuarto básico'  },
  { id: 'quinto',  num: '5', label: 'Quinto básico'  },
  { id: 'sexto',   num: '6', label: 'Sexto básico'   },
  { id: 'septimo', num: '7', label: 'Séptimo básico' },
  { id: 'octavo',  num: '8', label: 'Octavo básico'  }
];

/* Devuelve el curso buscándolo por su num ('1'..'8') o por su id. */
function buscarCurso(valor) {
  if (valor === undefined || valor === null) return null;
  const v = String(valor).trim();
  if (!v) return null;
  return CURSOS.find(c => c.num === v || c.id === v) || null;
}

/* Guarda el curso seleccionado (acepta num o id) en localStorage. */
function setCursoSeleccionado(valor) {
  const curso = buscarCurso(valor);
  if (curso) localStorage.setItem(CURSO_KEY, curso.id);
}

/* Obtiene el curso activo. Prioridad:
   1) parámetro ?curso= de la URL (al abrir un juego desde index)
   2) valor guardado en localStorage
   Devuelve el objeto del curso o null si no hay ninguno válido. */
function getCursoSeleccionado() {
  let desdeUrl = null;
  try {
    const params = new URLSearchParams(window.location.search);
    desdeUrl = params.get('curso');
  } catch { /* URL no disponible */ }

  const curso = buscarCurso(desdeUrl) || buscarCurso(localStorage.getItem(CURSO_KEY));
  /* Si vino por URL y es válido, lo persistimos para futuras visitas. */
  if (curso && desdeUrl) localStorage.setItem(CURSO_KEY, curso.id);
  return curso;
}
