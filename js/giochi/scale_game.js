/* ==================== SCALE GAME — scale_game.js ==================== */
/*
  MODALITÀ:
  ─ FACILE   : drag-drop chip note negli slot — legenda T/S fissa,
               etichette T/S colorate appaiono dopo verifica
  ─ MEDIO    : scala mostrata, trascina T/S nei gap tra le note
  ─ DIFFICILE: tastiera cromatica reale (tasti bianchi/neri sfalsati),
               seleziona le note nell'ordine corretto
  ─ RANKED   : easy→medium→hard con difficoltà crescente
*/

/* ── Globals ── */
let difficulty          = null;
let gameMode            = "training";
let currentScale        = null;
let roundLocked         = false;
let timerInterval       = null;
let rankedClockInterval = null;

const menu       = document.getElementById("menu");
const game       = document.getElementById("game");
const questionEl = document.getElementById("question");
const feedbackEl = document.getElementById("feedback");
MGHGameUI.ensureRankedHUD();
const timerBox   = document.getElementById("timerBox");
const timerEl    = document.getElementById("timer");
const warning    = document.getElementById("warning");

/* ==================== DATI SCALE ==================== */

function chromFrom(tonic, sharp) {
  const sh = ["Do","Do♯","Re","Re♯","Mi","Fa","Fa♯","Sol","Sol♯","La","La♯","Si"];
  const fl = ["Do","Re♭","Re","Mi♭","Mi","Fa","Sol♭","Sol","La♭","La","Si♭","Si"];
  const base = sharp ? sh : fl;
  let s = base.indexOf(tonic);
  if (s < 0) s = 0;
  const rot = [...base.slice(s), ...base.slice(0, s)];
  rot.push(rot[0]);
  return rot; // 13 elementi: tonica…ottava
}

const SCALES = [
  /* ── FACILE: maggiori ── */
  { name:"Do maggiore",  tonic:"Do",  type:"maggiore", diff:"easy",
    notes:["Do","Re","Mi","Fa","Sol","La","Si","Do"],
    ts:["T","T","S","T","T","T","S"], sharp:true },
  { name:"Sol maggiore", tonic:"Sol", type:"maggiore", diff:"easy",
    notes:["Sol","La","Si","Do","Re","Mi","Fa♯","Sol"],
    ts:["T","T","S","T","T","T","S"], sharp:true },
  { name:"Fa maggiore",  tonic:"Fa",  type:"maggiore", diff:"easy",
    notes:["Fa","Sol","La","Si♭","Do","Re","Mi","Fa"],
    ts:["T","T","S","T","T","T","S"], sharp:false },
  { name:"Re maggiore",  tonic:"Re",  type:"maggiore", diff:"easy",
    notes:["Re","Mi","Fa♯","Sol","La","Si","Do♯","Re"],
    ts:["T","T","S","T","T","T","S"], sharp:true },
  { name:"Si♭ maggiore", tonic:"Si♭", type:"maggiore", diff:"easy",
    notes:["Si♭","Do","Re","Mi♭","Fa","Sol","La","Si♭"],
    ts:["T","T","S","T","T","T","S"], sharp:false },
  { name:"La maggiore",  tonic:"La",  type:"maggiore", diff:"easy",
    notes:["La","Si","Do♯","Re","Mi","Fa♯","Sol♯","La"],
    ts:["T","T","S","T","T","T","S"], sharp:true },
  { name:"Mi♭ maggiore", tonic:"Mi♭", type:"maggiore", diff:"easy",
    notes:["Mi♭","Fa","Sol","La♭","Si♭","Do","Re","Mi♭"],
    ts:["T","T","S","T","T","T","S"], sharp:false },
  /* ── FACILE: minori naturali ── */
  { name:"La minore",    tonic:"La",  type:"minore", diff:"easy",
    notes:["La","Si","Do","Re","Mi","Fa","Sol","La"],
    ts:["T","S","T","T","S","T","T"], sharp:true },
  { name:"Mi minore",    tonic:"Mi",  type:"minore", diff:"easy",
    notes:["Mi","Fa♯","Sol","La","Si","Do","Re","Mi"],
    ts:["T","S","T","T","S","T","T"], sharp:true },
  { name:"Re minore",    tonic:"Re",  type:"minore", diff:"easy",
    notes:["Re","Mi","Fa","Sol","La","Si♭","Do","Re"],
    ts:["T","S","T","T","S","T","T"], sharp:false },
  { name:"Sol minore",   tonic:"Sol", type:"minore", diff:"easy",
    notes:["Sol","La","Si♭","Do","Re","Mi♭","Fa","Sol"],
    ts:["T","S","T","T","S","T","T"], sharp:false },
  { name:"Do minore",    tonic:"Do",  type:"minore", diff:"easy",
    notes:["Do","Re","Mi♭","Fa","Sol","La♭","Si♭","Do"],
    ts:["T","S","T","T","S","T","T"], sharp:false },
  /* ── MEDIO: minori armoniche ── */
  { name:"La minore armonica", tonic:"La", type:"minore armonica", diff:"medium",
    notes:["La","Si","Do","Re","Mi","Fa","Sol♯","La"],
    ts:["T","S","T","T","S","T","S"], sharp:true },
  { name:"Re minore armonica", tonic:"Re", type:"minore armonica", diff:"medium",
    notes:["Re","Mi","Fa","Sol","La","Si♭","Do♯","Re"],
    ts:["T","S","T","T","S","T","S"], sharp:false },
  { name:"Mi minore armonica", tonic:"Mi", type:"minore armonica", diff:"medium",
    notes:["Mi","Fa♯","Sol","La","Si","Do","Re♯","Mi"],
    ts:["T","S","T","T","S","T","S"], sharp:true },
  { name:"Sol minore armonica",tonic:"Sol",type:"minore armonica", diff:"medium",
    notes:["Sol","La","Si♭","Do","Re","Mi♭","Fa♯","Sol"],
    ts:["T","S","T","T","S","T","S"], sharp:false },
  /* ── DIFFICILE ── */
  { name:"Si maggiore",        tonic:"Si",  type:"maggiore", diff:"hard",
    notes:["Si","Do♯","Re♯","Mi","Fa♯","Sol♯","La♯","Si"],
    ts:["T","T","S","T","T","T","S"], sharp:true },
  { name:"Re♭ maggiore",       tonic:"Re♭", type:"maggiore", diff:"hard",
    notes:["Re♭","Mi♭","Fa","Sol♭","La♭","Si♭","Do","Re♭"],
    ts:["T","T","S","T","T","T","S"], sharp:false },
  { name:"Fa♯ maggiore",       tonic:"Fa♯", type:"maggiore", diff:"hard",
    notes:["Fa♯","Sol♯","La♯","Si","Do♯","Re♯","Mi♯","Fa♯"],
    ts:["T","T","S","T","T","T","S"], sharp:true },
  { name:"La minore melodica ↑",tonic:"La", type:"minore melodica", diff:"hard",
    notes:["La","Si","Do","Re","Mi","Fa♯","Sol♯","La"],
    ts:["T","S","T","T","T","T","S"], sharp:true },
  { name:"Do minore armonica",  tonic:"Do", type:"minore armonica", diff:"hard",
    notes:["Do","Re","Mi♭","Fa","Sol","La♭","Si","Do"],
    ts:["T","S","T","T","S","T","S"], sharp:false },
  { name:"Sol♯ minore armonica",tonic:"Sol♯",type:"minore armonica", diff:"hard",
    notes:["Sol♯","La♯","Si","Do♯","Re♯","Mi","Fa♯♯","Sol♯"],
    ts:["T","S","T","T","S","T","S"], sharp:true },
];

let lastScaleName = { easy: null, medium: null, hard: null };

function getPool(poolKey) {
  if (poolKey === "easy")   return SCALES.filter(s => s.diff === "easy");
  if (poolKey === "medium") return SCALES.filter(s => s.diff !== "hard");
  return SCALES;
}

function pickScale(poolKey) {
  const arr  = getPool(poolKey);
  const prev = lastScaleName[poolKey] || "";
  const avail = arr.length > 1 ? arr.filter(s => s.name !== prev) : arr;
  const chosen = avail[Math.floor(Math.random() * avail.length)];
  lastScaleName[poolKey] = chosen.name;
  return chosen;
}

/* ==================== MENU / HEADER ==================== */

function getDifficultyLabel() {
  if (difficulty === "easy")   return "Facile";
  if (difficulty === "medium") return "Medio";
  if (difficulty === "hard")   return "Difficile";
  return "";
}

function setFeedback(msg, state = "neutral") {
  MGH.setGameFeedback(feedbackEl, msg, state);
}

function setDifficulty(level, el) {
  difficulty = level; gameMode = "training";
  MGH.selectExclusive(".menuButton", el);
}

function selectMode(el, mode) {
  if (mode === "ranked") { gameMode = "ranked"; difficulty = null; MGH.selectExclusive(".menuButton", el); }
}

/* ==================== START / BACK ==================== */

function startGame() {
  if (gameMode === "ranked") {
    showRankedIntro({ gameName:"scale", title:"Modalità Classificata",
      text:"10 scale con difficoltà crescente. Il punteggio premia precisione e velocità.",
      onStart: startRankedGame }); return;
  }
  if (!difficulty) { warning.textContent = "Seleziona una difficoltà"; return; }
  warning.textContent = "";
  menu.classList.add("hidden"); game.classList.remove("hidden");
  hideLeaderboardButton(); showBackButton();
  MGH.updateHeaderModeLabel(getDifficultyLabel());
  hideRankedUI(); newRound();
}

function startRankedGame(nickname = "") {
  warning.textContent = "";
  if (typeof startRankedMode !== "function") { warning.textContent = "Errore: ranked.js non caricato."; return; }
  const session = startRankedMode("scale"); session.setUsername(nickname);
  menu.classList.add("hidden"); game.classList.remove("hidden");
  hideLeaderboardButton(); hideBackButton();
  MGH.updateHeaderModeLabel("Classificata");
  showRankedUI(); startRankedClock(); updateRankedUI(); newRound();
}

function goBack() {
  if (gameMode === "ranked") return;
  stopTimer(); stopRankedClock();
  game.classList.add("hidden"); menu.classList.remove("hidden");
  showLeaderboardButton(); showBackButton();
  difficulty = null; gameMode = "training"; currentScale = null; roundLocked = false;
  if (typeof resetRankedMode === "function") resetRankedMode();
  document.querySelectorAll(".selected").forEach(b => b.classList.remove("selected"));
  MGH.updateHeaderModeLabel(""); setFeedback(""); hideRankedUI(); clearGameArea();
}

/* ==================== ROUND DISPATCHER ==================== */

function newRound() {
  roundLocked = false; setFeedback(""); stopTimer(); clearGameArea();
  let poolKey;
  if (gameMode === "ranked") {
    poolKey = getRankedDifficulty();
    startRankedQuestionTimer(); updateRankedUI();
  } else { poolKey = difficulty; }
  currentScale = pickScale(poolKey);
  const activeDiff = gameMode === "ranked" ? poolKey : difficulty;
  if      (activeDiff === "easy")   buildEasyRound();
  else if (activeDiff === "medium") buildMediumRound();
  else                              buildHardRound();
}

function clearGameArea() { const ga = document.getElementById("gameArea"); if (ga) ga.innerHTML = ""; }

/* ================================================================
   MODALITÀ FACILE
   Chip note drag-drop in 8 slot circolari.
   Legenda formula T/S fissa. Etichette T/S colorate dopo verifica.
   La nota doppia (ottava = tonica) è trattata come chip distinta.
================================================================ */

const slotMap = {}; // slotIndex → note

function buildEasyRound() {
  const s = currentScale;
  const isMaj = s.type === "maggiore";
  const formula = isMaj ? "T – T – S – T – T – T – S" : "T – S – T – T – S – T – T";
  questionEl.textContent = `Ordina le note: scala di ${s.name}`;

  const ga = document.getElementById("gameArea");
  ga.innerHTML = `
    <section class="scaleVisualStage gameVisualBox" aria-label="Costruzione della scala">
      <div class="ts-legend">
        <span class="ts-legend-title">Formula ${s.type}:</span>
        <span class="ts-legend-formula">${formula}</span>
      </div>
      <div class="easy-zones-wrap">
        <div class="easy-target">
          <div class="easy-slots-row" id="easySlotsRow"></div>
          <div class="easy-ts-row hidden" id="easyTsRow"></div>
        </div>
        <div class="easy-source" id="easySource"></div>
      </div>
    </section>`;

  /* Crea 8 slot */
  const slotsRow = document.getElementById("easySlotsRow");
  for (let i = 0; i < 8; i++) {
    slotsRow.appendChild(makeSlot(i));
  }

  /* Crea 7 gap T/S (mostrati dopo verifica) */
  const tsRow = document.getElementById("easyTsRow");
  for (let i = 0; i < 7; i++) {
    const g = document.createElement("div");
    g.className = "easyTsGap"; g.id = `tsGap${i}`;
    tsRow.appendChild(g);
  }

  /* Chip note: la tonica appare DUE VOLTE (1ª e ottava) con uid diverso */
  const notesList = s.notes; // 8 elementi, il primo e l'ultimo sono uguali
  const src = document.getElementById("easySource");

  // Mescola una copia degli indici
  const indices = [0,1,2,3,4,5,6,7].sort(() => Math.random() - 0.5);
  // Evita che sia già in ordine
  let tries = 0;
  while (indicesInOrder(indices) && tries++ < 20) indices.sort(() => Math.random() - 0.5);

  indices.forEach(i => {
    src.appendChild(makeNoteChip(notesList[i], i));
  });

  /* Drag-drop su source (ritiro chip dagli slot) */
  src.addEventListener("dragover", e => { e.preventDefault(); src.classList.add("drag-over"); });
  src.addEventListener("dragleave", () => src.classList.remove("drag-over"));
  src.addEventListener("drop", e => {
    e.preventDefault(); src.classList.remove("drag-over");
    if (roundLocked) return;
    const fromSlot = e.dataTransfer.getData("fromSlot");
    if (fromSlot !== "") returnFromSlot(parseInt(fromSlot));
  });
}

function indicesInOrder(arr) { return arr.every((v, i) => v === i); }

/* Slot circolare */
function makeSlot(i) {
  const sl = document.createElement("div");
  sl.className = "easySlot"; sl.dataset.index = i;
  sl.draggable = false;
  sl.addEventListener("dragstart", e => {
    if (roundLocked || !slotMap[i]) {
      e.preventDefault();
      return;
    }

    const { uid, note } = slotMap[i];
    e.dataTransfer.setData("chipUid", String(uid));
    e.dataTransfer.setData("note", note);
    e.dataTransfer.setData("fromSlot", String(i));
    setTimeout(() => sl.classList.add("dragging"), 0);
  });
  sl.addEventListener("dragend", () => sl.classList.remove("dragging"));
  sl.addEventListener("dragover",  e => { e.preventDefault(); sl.classList.add("drag-over"); });
  sl.addEventListener("dragleave", () => sl.classList.remove("drag-over"));
  sl.addEventListener("drop", e => {
    e.preventDefault(); sl.classList.remove("drag-over");
    if (roundLocked) return;
    const uid       = e.dataTransfer.getData("chipUid");
    const note      = e.dataTransfer.getData("note");
    const fromSlot  = e.dataTransfer.getData("fromSlot");
    placeInSlot(uid, note, i, fromSlot !== "" ? parseInt(fromSlot) : null);
  });
  sl.addEventListener("click", () => { if (!roundLocked && slotMap[i]) returnFromSlot(i); });
  /* Touch: drag dallo slot */
  sl.addEventListener("pointerdown", e => {
    if (roundLocked || e.pointerType === "mouse" || !slotMap[i]) return;
    e.preventDefault();
    const { uid, note } = slotMap[i];
    startTouchDrag(sl, uid, note, i, e);
  }, { passive: false });
  return sl;
}

/* Chip nota */
function makeNoteChip(note, uid) {
  const c = document.createElement("div");
  c.className = "noteChip"; c.textContent = note;
  c.dataset.uid = uid; c.dataset.note = note; c.draggable = true;
  c.addEventListener("click", () => {
    if (roundLocked || c.classList.contains("used")) return;
    placeInFirstEmptySlot(uid, note);
  });
  c.addEventListener("dragstart", e => {
    if (roundLocked) { e.preventDefault(); return; }
    e.dataTransfer.setData("chipUid",  String(uid));
    e.dataTransfer.setData("note",     note);
    e.dataTransfer.setData("fromSlot", "");
    setTimeout(() => c.classList.add("dragging"), 0);
  });
  c.addEventListener("dragend",    () => c.classList.remove("dragging"));
  c.addEventListener("pointerdown", e => {
    if (roundLocked || e.pointerType === "mouse") return;
    e.preventDefault(); startTouchDrag(c, uid, note, null, e);
  }, { passive: false });
  return c;
}

function placeInFirstEmptySlot(uid, note) {
  const firstEmptyIndex = Array.from({ length: 8 }, (_, index) => index)
    .find(index => !slotMap[index]);

  if (firstEmptyIndex === undefined) {
    setFeedback("Tutti gli slot sono pieni: clicca su un cerchio per liberarlo.");
    return;
  }

  placeInSlot(uid, note, firstEmptyIndex, null);
}

function placeInSlot(uid, note, targetIdx, fromSlotIdx) {
  /* Se slot occupato, rispedisci quella chip in source */
  if (slotMap[targetIdx]) {
    const { uid: oldUid, note: oldNote } = slotMap[targetIdx];
    delete slotMap[targetIdx];
    setSlotEmpty(targetIdx);
    restoreChipInSource(oldUid, oldNote);
  }
  /* Rimuovi dalla posizione precedente */
  if (fromSlotIdx !== null && fromSlotIdx !== undefined) {
    delete slotMap[fromSlotIdx]; setSlotEmpty(fromSlotIdx);
  } else {
    hideChipInSource(uid);
  }
  slotMap[targetIdx] = { uid, note };
  setSlotFilled(targetIdx, note);
}

function returnFromSlot(i) {
  if (!slotMap[i]) return;
  const { uid, note } = slotMap[i];
  delete slotMap[i]; setSlotEmpty(i);
  restoreChipInSource(uid, note);
}

function setSlotFilled(i, note) {
  const sl = document.querySelector(`.easySlot[data-index="${i}"]`);
  if (sl) {
    sl.textContent = note;
    sl.draggable = true;
    sl.classList.add("filled");
    sl.setAttribute("title", "Clicca o trascina per togliere la nota");
  }
}

function setSlotEmpty(i) {
  const sl = document.querySelector(`.easySlot[data-index="${i}"]`);
  if (sl) {
    sl.textContent = "";
    sl.draggable = false;
    sl.removeAttribute("title");
    sl.classList.remove("filled","correct","wrong","dragging");
  }
}

function hideChipInSource(uid) {
  const c = document.querySelector(`#easySource .noteChip[data-uid="${uid}"]`);
  if (c) c.classList.add("used");
}

function restoreChipInSource(uid, note) {
  const c = document.querySelector(`#easySource .noteChip[data-uid="${uid}"]`);
  if (c) { c.classList.remove("used"); }
  else {
    /* chip non trovata (rara): ricreala */
    document.getElementById("easySource")?.appendChild(makeNoteChip(note, uid));
  }
}

/* Touch drag universale */
let tEl = null, tClone = null, tOX = 0, tOY = 0, tFrom = null, tUid = null, tNote = null;

function startTouchDrag(el, uid, note, fromSlot, e) {
  tEl = el; tUid = uid; tNote = note; tFrom = fromSlot;
  el.setPointerCapture(e.pointerId);
  const r = el.getBoundingClientRect();
  tOX = e.clientX - r.left; tOY = e.clientY - r.top;
  tClone = document.createElement("div");
  tClone.className = "noteChip"; tClone.textContent = note;
  Object.assign(tClone.style, {
    position:"fixed", width:r.width+"px", height:r.height+"px",
    left:r.left+"px", top:r.top+"px",
    opacity:".7", pointerEvents:"none", zIndex:"9999", transition:"none"
  });
  document.body.appendChild(tClone);
  el.style.opacity = ".3";
  el.addEventListener("pointermove",   onTouchMove,   { passive: false });
  el.addEventListener("pointerup",     onTouchUp,     { passive: false });
  el.addEventListener("pointercancel", cleanTouchDrag,{ passive: false });
}

function onTouchMove(e) {
  e.preventDefault();
  if (tClone) { tClone.style.left = (e.clientX - tOX) + "px"; tClone.style.top = (e.clientY - tOY) + "px"; }
}

function onTouchUp(e) {
  e.preventDefault();
  tClone?.remove(); if (tEl) tEl.style.opacity = "";
  const cx = e.clientX, cy = e.clientY;
  let hit = false;
  document.querySelectorAll(".easySlot").forEach(sl => {
    const r = sl.getBoundingClientRect();
    if (cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom) {
      placeInSlot(tUid, tNote, parseInt(sl.dataset.index), tFrom);
      hit = true;
    }
  });
  /* Ritorna in source se droppato fuori dagli slot */
  if (!hit && tFrom !== null) returnFromSlot(tFrom);
  cleanTouchDrag();
}

function cleanTouchDrag() {
  tClone?.remove(); if (tEl) tEl.style.opacity = "";
  tEl?.removeEventListener("pointermove",   onTouchMove);
  tEl?.removeEventListener("pointerup",     onTouchUp);
  tEl?.removeEventListener("pointercancel", cleanTouchDrag);
  tEl = null; tClone = null; tFrom = null; tUid = null; tNote = null;
}

function checkEasyAnswer() {
  const exp = currentScale.notes;
  const filled = Object.keys(slotMap).length;
  if (filled < 8) { setFeedback(`Completa tutti gli 8 slot (${filled}/8).`); return; }
  roundLocked = true;
  let allOk = true;
  for (let i = 0; i < 8; i++) {
    const sl = document.querySelector(`.easySlot[data-index="${i}"]`);
    const placedNote = slotMap[i]?.note;
    if (placedNote === exp[i]) sl?.classList.add("correct");
    else { sl?.classList.add("wrong"); allOk = false; }
  }
  /* Mostra etichette T/S */
  const tsRow = document.getElementById("easyTsRow");
  if (tsRow) {
    tsRow.classList.remove("hidden");
    currentScale.ts.forEach((v, i) => {
      const g = document.getElementById(`tsGap${i}`);
      if (g) { g.textContent = v; g.className = `easyTsGap ts-label ts-${v === "S" ? "s" : "t"}`; }
    });
  }
  if (allOk) setFeedback(MGH.getAnswerFeedback(true), "correct");
  else       setFeedback(MGH.getAnswerFeedback(false, "Ordine corretto: " + exp.join(" – ") + "."), "wrong");
  if (gameMode === "ranked") { handleRankedAnswer(allOk); return; }
  setTimeout(() => { Object.keys(slotMap).forEach(k => delete slotMap[k]); newRound(); }, 2200);
}

function resetEasyRound() {
  Object.keys(slotMap).forEach(k => delete slotMap[k]); buildEasyRound();
}

/* ================================================================
   MODALITÀ MEDIO
   Scala visibile con note fisse. Trascina T o S nei 7 gap.
================================================================ */

const gapMap = {}; // gapIndex → label

function buildMediumRound() {
  const s = currentScale;
  questionEl.textContent = `Trascina T o S nei gap: scala di ${s.name}`;
  const ga = document.getElementById("gameArea");
  ga.innerHTML = `<div class="medium-scale-display" id="medDisplay"></div>
                  <div class="medium-ts-pool" id="medPool"></div>`;

  const display = document.getElementById("medDisplay");
  s.notes.forEach((note, i) => {
    const nd = document.createElement("div"); nd.className = "mediumNote"; nd.textContent = note;
    display.appendChild(nd);
    if (i < s.notes.length - 1) {
      const g = document.createElement("div");
      g.className = "mediumGap"; g.dataset.index = i; g.textContent = "?";
      setupMediumGap(g, i); display.appendChild(g);
    }
  });

  /* Pool chip T/S mescolate */
  const pool = document.getElementById("medPool");
  const needed = [...s.ts].sort(() => Math.random() - 0.5);
  needed.forEach((lbl, idx) => {
    const c = document.createElement("div");
    c.className = "tsChip"; c.textContent = lbl; c.dataset.label = lbl; c.dataset.idx = idx;
    c.draggable = true;
    c.addEventListener("dragstart", e => {
      if (roundLocked) { e.preventDefault(); return; }
      e.dataTransfer.setData("tsLabel", lbl); e.dataTransfer.setData("tsIdx", String(idx));
      setTimeout(() => c.classList.add("dragging"), 0);
    });
    c.addEventListener("dragend", () => c.classList.remove("dragging"));
    c.addEventListener("pointerdown", e => {
      if (roundLocked || e.pointerType === "mouse") return;
      e.preventDefault(); startTsTouchDrag(c, lbl, idx, e);
    }, { passive: false });
    pool.appendChild(c);
  });
}

function setupMediumGap(gap, i) {
  gap.addEventListener("dragover",  e => { e.preventDefault(); gap.classList.add("drag-over"); });
  gap.addEventListener("dragleave", () => gap.classList.remove("drag-over"));
  gap.addEventListener("drop", e => {
    e.preventDefault(); gap.classList.remove("drag-over");
    if (roundLocked) return;
    const lbl = e.dataTransfer.getData("tsLabel");
    const idx = e.dataTransfer.getData("tsIdx");
    placeInGap(lbl, i, idx !== "" ? parseInt(idx) : null);
  });
  gap.addEventListener("click", () => { if (!roundLocked && gapMap[i]) returnGapToPool(i); });
}

function placeInGap(lbl, gi, chipIdx) {
  if (gapMap[gi]) returnGapToPool(gi);
  gapMap[gi] = lbl;
  const g = document.querySelector(`.mediumGap[data-index="${gi}"]`);
  if (g) { g.textContent = lbl; g.classList.add("filled"); }
  if (chipIdx !== null) {
    const c = document.querySelector(`.tsChip[data-idx="${chipIdx}"]`);
    if (c) c.classList.add("used");
  }
}

function returnGapToPool(gi) {
  const lbl = gapMap[gi]; delete gapMap[gi];
  const g = document.querySelector(`.mediumGap[data-index="${gi}"]`);
  if (g) { g.textContent = "?"; g.classList.remove("filled","correct","wrong"); }
  const c = [...document.querySelectorAll(".tsChip.used")].find(x => x.dataset.label === lbl);
  if (c) c.classList.remove("used");
}

/* Touch T/S chips */
let tsEl = null, tsClone = null, tsOX = 0, tsOY = 0;

function startTsTouchDrag(chip, lbl, idx, e) {
  tsEl = chip; chip.setPointerCapture(e.pointerId);
  const r = chip.getBoundingClientRect(); tsOX = e.clientX - r.left; tsOY = e.clientY - r.top;
  tsClone = document.createElement("div"); tsClone.className = "tsChip"; tsClone.textContent = lbl;
  Object.assign(tsClone.style, { position:"fixed", width:r.width+"px", height:r.height+"px",
    left:r.left+"px", top:r.top+"px", opacity:".7", pointerEvents:"none", zIndex:"9999", transition:"none" });
  document.body.appendChild(tsClone); chip.style.opacity = ".3";
  chip.addEventListener("pointermove",   onTsMove,   { passive: false });
  chip.addEventListener("pointerup",     e2 => onTsUp(e2, lbl, idx), { passive: false });
  chip.addEventListener("pointercancel", cleanTsDrag,{ passive: false });
}

function onTsMove(e) {
  e.preventDefault();
  if (tsClone) { tsClone.style.left = (e.clientX - tsOX) + "px"; tsClone.style.top = (e.clientY - tsOY) + "px"; }
}

function onTsUp(e, lbl, idx) {
  e.preventDefault(); tsClone?.remove(); if (tsEl) tsEl.style.opacity = "";
  const cx = e.clientX, cy = e.clientY;
  document.querySelectorAll(".mediumGap").forEach(g => {
    const r = g.getBoundingClientRect();
    if (cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom)
      placeInGap(lbl, parseInt(g.dataset.index), idx);
  });
  cleanTsDrag();
}

function cleanTsDrag() {
  tsClone?.remove(); if (tsEl) tsEl.style.opacity = "";
  tsEl?.removeEventListener("pointermove",   onTsMove);
  tsEl = null; tsClone = null;
}

function checkMediumAnswer() {
  const filled = Object.keys(gapMap).length;
  if (filled < 7) { setFeedback(`Completa tutti i 7 gap (${filled}/7).`); return; }
  roundLocked = true;
  let allOk = true;
  for (let i = 0; i < 7; i++) {
    const g = document.querySelector(`.mediumGap[data-index="${i}"]`);
    if (gapMap[i] === currentScale.ts[i]) g?.classList.add("correct");
    else { g?.classList.add("wrong"); allOk = false; }
  }
  if (allOk) setFeedback(MGH.getAnswerFeedback(true), "correct");
  else setFeedback(MGH.getAnswerFeedback(false, "La sequenza corretta era " + currentScale.ts.join(" – ") + "."), "wrong");
  if (gameMode === "ranked") { handleRankedAnswer(allOk); return; }
  setTimeout(() => { Object.keys(gapMap).forEach(k => delete gapMap[k]); newRound(); }, 2200);
}

function resetMediumRound() {
  Object.keys(gapMap).forEach(k => delete gapMap[k]); buildMediumRound();
}

/* ================================================================
   MODALITÀ DIFFICILE
   Tastiera cromatica con tasti bianchi (assoluti) e neri (sfalsati in alto).
   Il giocatore clicca/tocca i tasti per selezionare le note in ordine.
================================================================ */

const hardSelected = [];

/* Struttura semitoni: quale indice (0-12) è tasto nero */
const IS_BLACK = [false,true,false,true,false,false,true,false,true,false,true,false,false];

function buildHardRound() {
  const s = currentScale;
  const chrom = chromFrom(s.tonic, s.sharp);
  questionEl.textContent = `Costruisci la scala di ${s.name} sulla tastiera`;

  const ga = document.getElementById("gameArea");
  ga.innerHTML = `
    <div class="hard-selected-row" id="hardSelRow">
      <span class="hard-sel-hint" id="hardSelHint">Seleziona ${s.notes.length} note dalla tastiera</span>
    </div>
    <div class="piano-wrap">
      <div class="piano" id="piano"></div>
    </div>`;

  hardSelected.length = 0;
  buildPiano(document.getElementById("piano"), chrom);
}

function buildPiano(container, chrom) {
  const WW = 40, WH = 128, BW = 26, BH = 80;

  /* Indici dei tasti bianchi (in ordine) */
  const whiteIndices = chrom
    .map((_, i) => i)
    .filter(i => !IS_BLACK[i]);

  /* Larghezza totale = numero tasti bianchi × WW */
  container.style.position = "relative";
  container.style.height   = WH + "px";
  container.style.width    = (whiteIndices.length * WW) + "px";

  /* Mappa semitoneIndex → left del tasto bianco */
  const whitePosMap = {};
  whiteIndices.forEach((si, wi) => { whitePosMap[si] = wi * WW; });

  /* 1. Disegna tasti BIANCHI (z-index basso) */
  whiteIndices.forEach((si, wi) => {
    const note = chrom[si];
    const key  = document.createElement("div");
    key.className = "hardKey white-key";
    key.dataset.note = note; key.dataset.si = si;
    Object.assign(key.style, {
      position: "absolute", left: (wi * WW) + "px", top: "0",
      width: WW + "px", height: WH + "px", zIndex: "1"
    });
    key.innerHTML = `<span class="key-label">${note}</span>`;
    key.addEventListener("click", () => onHardKeyClick(note, key));
    container.appendChild(key);
  });

  /* 2. Disegna tasti NERI sopra (z-index alto), posizionati tra i bianchi */
  chrom.forEach((note, si) => {
    if (!IS_BLACK[si]) return;
    /* Trova il bianco precedente e il successivo */
    const prevWhi = whiteIndices.filter(w => w < si).slice(-1)[0];
    const wi      = whiteIndices.indexOf(prevWhi);
    /* Centro del tasto nero = bordo destro del bianco precedente - BW/2 */
    const leftX   = (wi + 1) * WW - BW / 2;
    const key     = document.createElement("div");
    key.className = "hardKey black-key";
    key.dataset.note = note; key.dataset.si = si;
    Object.assign(key.style, {
      position: "absolute", left: leftX + "px", top: "0",
      width: BW + "px", height: BH + "px", zIndex: "2"
    });
    key.innerHTML = `<span class="key-label">${note}</span>`;
    key.addEventListener("click", () => onHardKeyClick(note, key));
    container.appendChild(key);
  });
}

function onHardKeyClick(note, keyEl) {
  if (roundLocked) return;
  const maxNotes = currentScale.notes.length;
  const idx = hardSelected.indexOf(note);
  if (idx !== -1) {
    hardSelected.splice(idx, 1); keyEl.classList.remove("selected");
    renderHardSelected(); return;
  }
  if (hardSelected.length >= maxNotes) { setFeedback(`Puoi selezionare al massimo ${maxNotes} note.`); return; }
  hardSelected.push(note); keyEl.classList.add("selected");
  renderHardSelected(); setFeedback("");
}

function renderHardSelected() {
  const row  = document.getElementById("hardSelRow");
  const hint = document.getElementById("hardSelHint");
  if (!row) return;
  row.querySelectorAll(".hardChip").forEach(c => c.remove());
  if (!hardSelected.length) { if (hint) hint.style.display = ""; return; }
  if (hint) hint.style.display = "none";
  hardSelected.forEach(note => {
    const c = document.createElement("div"); c.className = "noteChip hardChip"; c.textContent = note;
    c.addEventListener("click", () => {
      if (roundLocked) return;
      const i = hardSelected.indexOf(note);
      if (i !== -1) hardSelected.splice(i, 1);
      document.querySelector(`.hardKey[data-note="${CSS.escape(note)}"]`)?.classList.remove("selected");
      renderHardSelected();
    });
    row.appendChild(c);
  });
}

function checkHardAnswer() {
  const exp = currentScale.notes;
  if (hardSelected.length !== exp.length) {
    setFeedback(`Seleziona ${exp.length} note (hai: ${hardSelected.length}).`); return;
  }
  roundLocked = true;
  const allOk = arraysEqual(hardSelected, exp);
  hardSelected.forEach((note, i) => {
    const key = document.querySelector(`.hardKey[data-note="${CSS.escape(note)}"]`);
    if (key) key.classList.add(note === exp[i] ? "key-correct" : "key-wrong");
  });
  if (!allOk) {
    exp.forEach(note => {
      const key = document.querySelector(`.hardKey[data-note="${CSS.escape(note)}"]`);
      if (key && !key.classList.contains("key-correct") && !key.classList.contains("key-wrong"))
        key.classList.add("key-missed");
    });
  }
  if (allOk) setFeedback(MGH.getAnswerFeedback(true), "correct");
  else       setFeedback(MGH.getAnswerFeedback(false, "La scala corretta era " + exp.join(" – ") + "."), "wrong");
  if (gameMode === "ranked") { handleRankedAnswer(allOk); return; }
  setTimeout(newRound, 2400);
}

function resetHardRound() { hardSelected.length = 0; buildHardRound(); }

/* ── Dispatcher checkAnswer / resetRound ── */
function getActiveDiff() {
  return gameMode === "ranked" && typeof getRankedDifficulty === "function"
    ? getRankedDifficulty()
    : difficulty;
}

function checkAnswer() {
  const d = getActiveDiff();
  if      (d === "easy")   checkEasyAnswer();
  else if (d === "medium") checkMediumAnswer();
  else                     checkHardAnswer();
}

function resetRound() {
  if (roundLocked) return;
  const d = getActiveDiff();
  if      (d === "easy")   resetEasyRound();
  else if (d === "medium") resetMediumRound();
  else                     resetHardRound();
}

/* ==================== RANKED ==================== */

function handleRankedAnswer(isCorrect) {
  const session = answerRankedQuestion(isCorrect);
  updateRankedUI();
  if (session && session.isComplete()) {
    setTimeout(showRankedResults, 2400);
  } else {
    setTimeout(() => {
      Object.keys(slotMap).forEach(k => delete slotMap[k]);
      Object.keys(gapMap).forEach(k => delete gapMap[k]);
      hardSelected.length = 0;
      newRound();
    }, 2400);
  }
}

function showRankedUI()  { document.getElementById("rankedUI")?.classList.remove("hidden"); }
function hideRankedUI()  { document.getElementById("rankedUI")?.classList.add("hidden"); }
function hideLeaderboardButton() {
  document.getElementById("rankedLeaderboardBtn")?.classList.add("hidden");
  document.getElementById("gameModeHelpBtn")?.classList.add("hidden");
}
function showLeaderboardButton() {
  document.getElementById("rankedLeaderboardBtn")?.classList.remove("hidden");
  document.getElementById("gameModeHelpBtn")?.classList.remove("hidden");
}
function hideBackButton() { document.getElementById("backButton")?.classList.add("hidden"); }
function showBackButton() { document.getElementById("backButton")?.classList.remove("hidden"); }

function updateRankedUI() {
  if (!currentRankedSession) return;
  const scoreEl   = document.getElementById("rankedScore");
  const counterEl = document.getElementById("rankedQuestionCounter");
  const fillEl    = document.getElementById("rankedProgressFill");
  if (scoreEl)   scoreEl.textContent = currentRankedSession.totalScore;
  if (counterEl) {
    const cur = Math.min(currentRankedSession.currentQuestion + 1, currentRankedSession.maxQuestions);
    counterEl.textContent = `${cur}/${currentRankedSession.maxQuestions}`;
  }
  if (fillEl) {
    const pct = (currentRankedSession.currentQuestion / currentRankedSession.maxQuestions) * 100;
    fillEl.style.width = `${pct}%`;
  }
}

async function showRankedResults() {
  stopTimer(); stopRankedClock();
  const finalData = await finishRankedMode();
  if (!finalData || !finalData.session) { setFeedback("Errore nel salvataggio."); return; }
  const session = finalData.session;
  game.classList.add("hidden"); menu.classList.remove("hidden");
  hideRankedUI(); showLeaderboardButton(); showBackButton();
  warning.textContent = "";
  await showRankedCompletionModal({ gameName:"scale", session, saveResult:finalData.result, saved:finalData.saved });
  MGH.updateHeaderModeLabel("");
  document.querySelectorAll(".selected").forEach(b => b.classList.remove("selected"));
  gameMode = "training"; difficulty = null; currentScale = null; roundLocked = false;
}

/* ==================== TIMER ==================== */

function startTimer(duration) {
  stopTimer(); let t = duration;
  timerEl.textContent = t; timerBox.classList.remove("hidden");
  timerInterval = setInterval(() => {
    t--; timerEl.textContent = t;
    if (t <= 0) {
      stopTimer(); if (!currentScale || roundLocked) return;
      roundLocked = true;
      setFeedback("Tempo scaduto. Scala corretta: " + currentScale.notes.join(" – ") + ".", "wrong");
      if (gameMode === "ranked") handleRankedAnswer(false);
      else setTimeout(newRound, 2200);
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  timerBox?.classList.add("hidden");
}

function startRankedClock() {
  stopRankedClock();
  if (!timerBox || !timerEl || !currentRankedSession) return;
  timerBox.classList.remove("hidden"); timerEl.textContent = "0";
  rankedClockInterval = setInterval(() => {
    timerEl.textContent = String(Math.round((Date.now() - currentRankedSession.startTime) / 1000));
  }, 250);
}

function stopRankedClock() {
  if (rankedClockInterval) { clearInterval(rankedClockInterval); rankedClockInterval = null; }
  if (gameMode === "ranked") timerBox?.classList.add("hidden");
}

/* ==================== UTILS ==================== */

function arraysEqual(a, b) { return a.length === b.length && a.every((v, i) => v === b[i]); }
