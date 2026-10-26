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
