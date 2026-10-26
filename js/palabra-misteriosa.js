/* ═══════════════════════════════════════════════════════════════
   JUEGO: Palabra misteriosa
   Adivina la palabra a partir de sus letras y una pista. +15 puntos.
   Depende de: js/comun.js ($, rand, addPoints)
═══════════════════════════════════════════════════════════════ */

const words = [
  { w: 'PLANETA',    h: 'Cuerpo celeste que gira alrededor de una estrella.' },
  { w: 'BIBLIOTECA', h: 'Lugar donde puedes encontrar muchos libros.' },
  { w: 'MARIPOSA',   h: 'Insecto con alas coloridas.' },
  { w: 'CUADERNO',   h: 'Sirve para escribir apuntes y hacer tareas.' },
  { w: 'VOLCAN',     h: 'Montaña que puede expulsar lava.' },
  { w: 'AMISTAD',    h: 'Vínculo de cariño y confianza entre personas.' }
];

let wordSecret = '';
let wordHint   = '';
let wordSolved = false; // evita sumar puntos más de una vez por palabra

function render(html) { $('gameContent').innerHTML = html; }

function startWord() {
  const item   = words[rand(0, words.length - 1)];
  wordSecret   = item.w;
  wordHint     = item.h;
  wordSolved   = false;
  const scrambled = wordSecret.split('').sort(() => Math.random() - .5).join(' · ');

  render(`
    <div class="small">Ordena las letras en tu mente</div>
    <div class="question" style="letter-spacing:.15em">${scrambled}</div>
    <p><b>Pista:</b> ${wordHint}</p>
    <input class="word-input" id="wordInput" placeholder="Escribe tu respuesta" autocomplete="off" maxlength="16">
    <div class="feedback" id="feedback"></div>
    <button class="btn" onclick="checkWord()">Comprobar</button>
    <button class="btn secondary" onclick="showHint()">Ver una pista extra</button>
    <button class="btn secondary" onclick="startWord()">Otra palabra</button>`);
  $('wordInput').focus();
}

function showHint() {
  $('feedback').textContent = 'Empieza con «' + wordSecret[0] + '» y tiene ' + wordSecret.length + ' letras.';
}

function checkWord() {
  const v = $('wordInput').value.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  if (v === wordSecret) {
    if (!wordSolved) {           // sumar puntos solo la primera vez
      wordSolved = true;
      addPoints(15);
    }
    $('feedback').textContent = '¡Correcto! +15 puntos 🎉';
  } else {
    $('feedback').textContent = 'Todavía no. ¡Prueba otra vez!';
  }
}

document.addEventListener('DOMContentLoaded', startWord);
