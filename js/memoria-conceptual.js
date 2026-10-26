/* ═══════════════════════════════════════════════════════════════
   JUEGO: Memoria Conceptual
   Asocia concepto con respuesta desde ../datos/MC<curso>.json según
   el curso elegido en index.html (parámetro ?curso= o localStorage).
   +10 por pareja, +20 bonus de eficiencia al completar.
   Depende de: js/comun.js ($, addPoints, escHtml, getCursoSeleccionado)
═══════════════════════════════════════════════════════════════ */

const MC_MAX_PAIRS = 6;

let mc = {
  curso:         null,
  pairs:         [],
  tiles:         [],
  flipped:       [],
  matched:       new Set(),
  lock:          false,
  moves:         0,
  pointsAwarded: new Set()
};

function render(html) { $('gameContent').innerHTML = html; }

function startMemory() {
  // Determinar el curso elegido en la página principal.
  mc.curso = getCursoSeleccionado();
  if (!mc.curso) {
    mcShowNoCourse();
    return;
  }
  if (!mc.pairs || mc.pairs.length === 0) {
    loadConceptos().then(() => initMemoryRound(MC_MAX_PAIRS));
  } else {
    initMemoryRound(MC_MAX_PAIRS);
  }
}

function mcShowNoCourse() {
  render(`
    <div class="feedback" style="margin-bottom:10px">📚 Primero elige tu curso en la página principal.</div>
    <p class="small">Las parejas de Memoria Conceptual dependen del curso seleccionado.</p>
    <a class="btn" href="../index.html#juegos">Ir a elegir mi curso</a>`);
}

async function loadConceptos() {
  const archivo = `../datos/MC${mc.curso.id}.json`;
  try {
    const res = await fetch(archivo, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error('Datos vacíos o formato incorrecto.');
    const valid = data.filter(d => d && typeof d.concepto === 'string' && d.concepto.trim() &&
                                       typeof d.respuesta === 'string' && d.respuesta.trim());
    if (valid.length === 0) throw new Error(`Ninguna entrada válida para ${mc.curso.label}.`);
    mc.pairs = valid.map((d, i) => ({ concepto: d.concepto.trim(), respuesta: d.respuesta.trim(), id: i }));
  } catch (err) {
    render(`<div class="feedback" style="color:#df6879">⚠️ No se pudo cargar MC${mc.curso.id}.json: ${escHtml(err.message)}</div>
      <p class="small">Asegúrate de ejecutar la página desde un servidor web (no directamente con file://).</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">
        <button class="btn secondary" onclick="startMemory()">Reintentar</button>
        <a class="btn secondary" href="../index.html#juegos">Cambiar curso</a>
      </div>`);
    mc.pairs = [];
  }
}

function initMemoryRound(maxPairs) {
  if (!mc.pairs || mc.pairs.length === 0) return;

  const shuffledPairs = [...mc.pairs].sort(() => Math.random() - .5).slice(0, maxPairs);
  const tiles = [];
  shuffledPairs.forEach(p => {
    tiles.push({ text: p.concepto,  pairId: p.id, role: 'concepto'  });
    tiles.push({ text: p.respuesta, pairId: p.id, role: 'respuesta' });
  });
  tiles.sort(() => Math.random() - .5);

  mc.tiles         = tiles;
  mc.flipped       = [];
  mc.matched       = new Set();
  mc.lock          = false;
  mc.moves         = 0;
  mc.pointsAwarded = new Set();

  renderMemory();
}

function renderMemory() {
  const total  = mc.tiles.length / 2;
  const found  = mc.matched.size;
  const remain = total - found;

  const curso = mc.curso ? escHtml(mc.curso.label) : '';

  render(`
    <div class="small" style="margin:0 0 8px">📖 ${curso}</div>
    <div class="concept-meta">
      <span class="small">Parejas encontradas: <b>${found}/${total}</b> · Pendientes: <b>${remain}</b></span>
      <span class="small">Movimientos: <b id="mc-moves">${mc.moves}</b></span>
    </div>
    <div class="concept-grid" id="mc-grid">
      ${mc.tiles.map((t, i) => {
        const isMatched = mc.matched.has(t.pairId);
        const isFlipped = mc.flipped.includes(i);
        const faceDown  = !isMatched && !isFlipped;
        let cls = 'concept-tile';
        if (isMatched)      cls += ' matched';
        else if (isFlipped) cls += ' selected';
        else                cls += ' face-down';
        return `<button class="${cls}" id="mct-${i}" onclick="flipConceptTile(${i})" ${isMatched ? 'disabled' : ''}>${faceDown ? '?' : escHtml(t.text)}</button>`;
      }).join('')}
    </div>
    <div class="feedback" id="mc-feedback" style="margin-top:12px"></div>
    <div style="margin-top:14px">
      <button class="btn secondary" onclick="initMemoryRound(${MC_MAX_PAIRS})">Nueva partida</button>
    </div>`);
}

function flipConceptTile(i) {
  if (mc.lock) return;
  if (mc.flipped.includes(i)) return;
  if (mc.matched.has(mc.tiles[i].pairId)) return;

  mc.flipped.push(i);
  const btn = $('mct-' + i);
  btn.classList.remove('face-down');
  btn.classList.add('selected');
  btn.textContent = mc.tiles[i].text;

  if (mc.flipped.length < 2) return;

  mc.moves++;
  const movEl = $('mc-moves');
  if (movEl) movEl.textContent = mc.moves;

  const [a, b]  = mc.flipped;
  const tileA   = mc.tiles[a];
  const tileB   = mc.tiles[b];
  const isMatch = tileA.pairId === tileB.pairId && tileA.role !== tileB.role;

  if (isMatch) {
    mc.matched.add(tileA.pairId);
    [$('mct-' + a), $('mct-' + b)].forEach(el => {
      if (!el) return;
      el.classList.remove('selected');
      el.classList.add('matched');
      el.disabled = true;
    });
    mc.flipped = [];

    if (!mc.pointsAwarded.has(tileA.pairId)) {
      mc.pointsAwarded.add(tileA.pairId);
      addPoints(10);
    }

    const fb = $('mc-feedback');
    if (fb) fb.textContent = '✅ ¡Pareja correcta! +10 puntos';

    if (mc.matched.size === mc.tiles.length / 2) {
      const bonus = mc.moves <= mc.tiles.length ? 20 : 0;
      if (bonus > 0) addPoints(bonus);
      render(`
        <div class="question">🎉 ¡Completaste todas las parejas!</div>
        <p>Movimientos: <b>${mc.moves}</b> · Parejas: <b>${mc.matched.size}</b></p>
        ${bonus > 0 ? `<p>🌟 ¡Bono de eficiencia! +${bonus} puntos extra</p>` : ''}
        <p>Total ganado esta partida: <b>${mc.matched.size * 10 + bonus} puntos</b></p>
        <button class="btn" onclick="initMemoryRound(${MC_MAX_PAIRS})">Jugar de nuevo</button>`);
    }
  } else {
    mc.lock = true;
    const fb = $('mc-feedback');
    if (fb) fb.textContent = '❌ No coinciden, sigue intentando.';
    [$('mct-' + a), $('mct-' + b)].forEach(el => {
      if (el) el.classList.add('wrong-flash');
    });
    setTimeout(() => {
      const elA = $('mct-' + a), elB = $('mct-' + b);
      if (elA) { elA.textContent = '?'; elA.className = 'concept-tile face-down'; }
      if (elB) { elB.textContent = '?'; elB.className = 'concept-tile face-down'; }
      mc.flipped = [];
      mc.lock    = false;
    }, 900);
  }
}

document.addEventListener('DOMContentLoaded', startMemory);
