/* ═══════════════════════════════════════════════════════════════
   JUEGO: Match — Imagen y concepto
   Relaciona imágenes con conceptos desde ../conceptos-imagenes.json.
   Imágenes en ../imagenes/. +5 por pareja, +10 bonus al completar.
   Depende de: js/comun.js ($, addPoints, escHtml)
═══════════════════════════════════════════════════════════════ */

const MIM_IMG_DIR   = '../imagenes/';
const MIM_PTS_MATCH = 5;
const MIM_PTS_BONUS = 10;

let mim = {
  pairs:         [],
  imgOrder:      [],
  conOrder:      [],
  matched:       new Set(),
  selImg:        null,
  selCon:        null,
  attempts:      0,
  pointsAwarded: new Set()
};

function render(html) { $('gameContent').innerHTML = html; }

function startMatch() {
  if (mim.pairs.length === 0) {
    loadMatchData().then(() => initMatchRound());
  } else {
    initMatchRound();
  }
}

async function loadMatchData() {
  try {
    const res = await fetch('../conceptos-imagenes.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0)
      throw new Error('El archivo está vacío o su formato es incorrecto.');

    const valid = data.filter(d => {
      if (!d || typeof d.imagen !== 'string' || !d.imagen.trim()) return false;
      if (typeof d.concepto !== 'string' || !d.concepto.trim()) return false;
      return true;
    });

    if (valid.length === 0)
      throw new Error('No hay parejas válidas en conceptos-imagenes.json.');

    mim.pairs = valid.map((d, i) => ({ id: i, imagen: d.imagen.trim(), concepto: d.concepto.trim() }));
  } catch (err) {
    render(`
      <div class="feedback" style="color:#df6879;margin-bottom:10px">⚠️ No se pudo cargar conceptos-imagenes.json: ${escHtml(err.message)}</div>
      <p class="small">Asegúrate de ejecutar la página desde un servidor web (no con file://).</p>
      <button class="btn secondary" onclick="startMatch()">Reintentar</button>`);
    mim.pairs = [];
  }
}

function initMatchRound() {
  if (mim.pairs.length === 0) return;

  const ids = mim.pairs.map(p => p.id);
  mim.imgOrder = [...ids].sort(() => Math.random() - .5);
  mim.conOrder = [...ids].sort(() => Math.random() - .5);
  mim.matched       = new Set();
  mim.selImg        = null;
  mim.selCon        = null;
  mim.attempts      = 0;
  mim.pointsAwarded = new Set();

  renderMatch();
}

function renderMatch() {
  const total = mim.pairs.length;
  const found = mim.matched.size;

  const imgCol = mim.imgOrder.map(pairId => {
    const pair      = mim.pairs[pairId];
    const isMatched = mim.matched.has(pairId);
    const isSelImg  = mim.selImg === pairId;
    let cls = 'match-img-btn';
    if (isMatched)     cls += ' mi-matched';
    else if (isSelImg) cls += ' mi-selected';
    const disabled = isMatched ? 'disabled' : '';
    const imgSrc   = MIM_IMG_DIR + pair.imagen;
    return `<button class="${cls}" id="mib-${pairId}" ${disabled} onclick="matchSelectImg(${pairId})" aria-label="${escHtml(pair.concepto)}">
      <img src="${escHtml(imgSrc)}" alt="${escHtml(pair.concepto)}" loading="lazy"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="match-img-error" style="display:none">⚠️ Imagen no encontrada:<br><b>${escHtml(pair.imagen)}</b></div>
      <div class="match-img-label">${isMatched ? '✅ ' + escHtml(pair.concepto) : ''}</div>
    </button>`;
  }).join('');

  const conCol = mim.conOrder.map(pairId => {
    const pair      = mim.pairs[pairId];
    const isMatched = mim.matched.has(pairId);
    const isSelCon  = mim.selCon === pairId;
    let cls = 'match-concept-btn';
    if (isMatched)     cls += ' mc-matched';
    else if (isSelCon) cls += ' mc-selected';
    const disabled = isMatched ? 'disabled' : '';
    return `<button class="${cls}" id="mcb-${pairId}" ${disabled} onclick="matchSelectCon(${pairId})">
      ${escHtml(pair.concepto)}
    </button>`;
  }).join('');

  render(`
    <p class="small" style="margin:0 0 10px">Selecciona una imagen y luego su concepto para hacer la pareja.</p>
    <div class="concept-meta">
      <span class="small">Parejas: <b>${found}/${total}</b></span>
      <span class="small">Intentos: <b id="mim-attempts">${mim.attempts}</b></span>
    </div>
    <div class="match-layout">
      <div>
        <p class="match-col-title">Imágenes</p>
        <div class="match-col" id="mim-img-col">${imgCol}</div>
      </div>
      <div>
        <p class="match-col-title">Conceptos</p>
        <div class="match-col" id="mim-con-col">${conCol}</div>
      </div>
    </div>
    <div class="feedback" id="mim-feedback" style="margin-top:12px;min-height:24px"></div>
    <div style="margin-top:14px">
      <button class="btn secondary" onclick="initMatchRound()">Nueva partida</button>
    </div>`);
}

function matchSelectImg(pairId) {
  if (mim.selImg === pairId) {
    mim.selImg = null;
    clearMatchHighlight('img', pairId);
    return;
  }
  if (mim.selImg !== null) clearMatchHighlight('img', mim.selImg);
  mim.selImg = pairId;
  const btn = $('mib-' + pairId);
  if (btn) { btn.classList.remove('mi-wrong'); btn.classList.add('mi-selected'); }
  if (mim.selCon !== null) evaluateMatch();
}

function matchSelectCon(pairId) {
  if (mim.selCon === pairId) {
    mim.selCon = null;
    clearMatchHighlight('con', pairId);
    return;
  }
  if (mim.selCon !== null) clearMatchHighlight('con', mim.selCon);
  mim.selCon = pairId;
  const btn = $('mcb-' + pairId);
  if (btn) { btn.classList.remove('mc-wrong'); btn.classList.add('mc-selected'); }
  if (mim.selImg !== null) evaluateMatch();
}

function clearMatchHighlight(type, pairId) {
  if (type === 'img') {
    const b = $('mib-' + pairId);
    if (b) b.classList.remove('mi-selected', 'mi-wrong');
  } else {
    const b = $('mcb-' + pairId);
    if (b) b.classList.remove('mc-selected', 'mc-wrong');
  }
}

function evaluateMatch() {
  const imgId = mim.selImg;
  const conId = mim.selCon;
  mim.attempts++;
  const attEl = $('mim-attempts');
  if (attEl) attEl.textContent = mim.attempts;

  const fb = $('mim-feedback');

  if (imgId === conId) {
    mim.matched.add(imgId);
    const imgBtn = $('mib-' + imgId);
    const conBtn = $('mcb-' + conId);
    if (imgBtn) {
      imgBtn.classList.remove('mi-selected');
      imgBtn.classList.add('mi-matched');
      imgBtn.disabled = true;
      const lbl = imgBtn.querySelector('.match-img-label');
      if (lbl) { lbl.style.display = 'block'; lbl.textContent = '✅ ' + mim.pairs[imgId].concepto; }
    }
    if (conBtn) {
      conBtn.classList.remove('mc-selected');
      conBtn.classList.add('mc-matched');
      conBtn.disabled = true;
    }
    mim.selImg = null;
    mim.selCon = null;

    if (!mim.pointsAwarded.has(imgId)) {
      mim.pointsAwarded.add(imgId);
      addPoints(MIM_PTS_MATCH);
    }
    if (fb) fb.textContent = `✅ ¡Correcto! +${MIM_PTS_MATCH} puntos`;

    if (mim.matched.size === mim.pairs.length) {
      const bonus = MIM_PTS_BONUS;
      addPoints(bonus);
      render(`
        <div class="question">🎉 ¡Excelente! Encontraste todas las parejas.</div>
        <p>Intentos realizados: <b>${mim.attempts}</b></p>
        <p>Puntos ganados: <b>${mim.pairs.length * MIM_PTS_MATCH + bonus}</b>
           (${mim.pairs.length} × ${MIM_PTS_MATCH} + ${bonus} de bonificación)</p>
        <button class="btn" onclick="initMatchRound()">Jugar de nuevo</button>`);
    }
  } else {
    const imgBtn = $('mib-' + imgId);
    const conBtn = $('mcb-' + conId);
    if (imgBtn) { imgBtn.classList.remove('mi-selected'); imgBtn.classList.add('mi-wrong'); }
    if (conBtn) { conBtn.classList.remove('mc-selected'); conBtn.classList.add('mc-wrong'); }
    if (fb) fb.textContent = '❌ No coinciden. Intenta otra combinación.';

    setTimeout(() => {
      if ($('mib-' + imgId)) $('mib-' + imgId).classList.remove('mi-wrong');
      if ($('mcb-' + conId)) $('mcb-' + conId).classList.remove('mc-wrong');
      mim.selImg = null;
      mim.selCon = null;
    }, 800);
  }
}

document.addEventListener('DOMContentLoaded', startMatch);
