/* ═══════════════════════════════════════════════════════════════
   JUEGO: Desafío sorpresa
   Elige al azar entre Reto matemático, Alternativas o Sinónimos
   y redirige a la página del juego elegido.
   Depende de: js/comun.js ($, rand)
═══════════════════════════════════════════════════════════════ */

const SURPRISE_GAMES = [
  { page: 'reto-matematico.html',  nombre: 'Reto matemático',  emoji: '➗' },
  { page: 'alternativas.html',     nombre: 'Alternativas',     emoji: '🌎' },
  { page: 'sinonimos.html',        nombre: 'Sinónimos exprés', emoji: '📖' }
];

function render(html) { $('gameContent').innerHTML = html; }

function sortearDesafio() {
  const elegido = SURPRISE_GAMES[rand(0, SURPRISE_GAMES.length - 1)];
  render(`
    <div style="text-align:center;padding:14px 0">
      <div class="question" style="justify-content:center">🎯 Tu desafío sorpresa es…</div>
      <div style="font-size:3rem;margin:10px 0">${elegido.emoji}</div>
      <p style="font-size:1.2rem;font-weight:800;margin:0 0 20px">${elegido.nombre}</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">
        <a class="btn" href="${elegido.page}">Jugar ${escHtml(elegido.nombre)}</a>
        <button class="btn secondary" onclick="sortearDesafio()">Sortear otro</button>
      </div>
    </div>`);
}

document.addEventListener('DOMContentLoaded', sortearDesafio);
