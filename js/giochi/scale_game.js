/* ==================== SCALE GAME — scale_game.js ==================== */
/*
  MODALITÀ:
  ─ FACILE   : drag-drop chip note negli slot — legenda T/S fissa,
               etichette T/S colorate appaiono dopo verifica
  ─ MEDIO    : scala mostrata, trascina T/S nei gap tra le note
  ─ DIFFICILE: tastiera cromatica reale (tasti bianchi/neri sfalsati),
               clicca le note nell'ordine corretto
  ─ RANKED   : easy→medium→hard con difficoltà crescente
*/

/* ── Globals ── */
let difficulty          = null;
let gameMode            = "training";
let currentScale        = null;
let roundLocked         = false;

const menu       = document.getElementById("menu");
const game       = document.getElementById("game");
const questionEl = document.getElementById("question");
const feedbackEl = document.getElementById("feedback");
MGHGameUI.ensureRankedHUD();
const warning    = document.getElementById("warning");
const SCALE_PRO_STORAGE_KEY = "mgh_scale_pro_mode";

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

function isPianoBlackNote(note) {
  return /[♯♭]/.test(normalizeAccidentals(note));
}

function getKeyboardNotesForScale(scale) {
  const chrom = chromFrom(scale.tonic, scale.sharp);
  const base = scale.sharp
    ? ["Do","Do♯","Re","Re♯","Mi","Fa","Fa♯","Sol","Sol♯","La","La♯","Si"]
    : ["Do","Re♭","Re","Mi♭","Mi","Fa","Sol♭","Sol","La♭","La","Si♭","Si"];
  const tonicIndex = base.indexOf(scale.tonic);
  const keyboardNotes = [...chrom];

  if (isPianoBlackNote(keyboardNotes[0])) {
    keyboardNotes.unshift(base[(tonicIndex - 1 + base.length) % base.length]);
  }

  if (isPianoBlackNote(keyboardNotes[keyboardNotes.length - 1])) {
    keyboardNotes.push(base[(tonicIndex + 1) % base.length]);
  }

  return keyboardNotes;
}

function getKeyboardKeysForScale(scale) {
  const scaleLabelBySemitone = new Map();
  scale.notes.forEach(note => {
    const semitone = getNoteSemitone(note);
    if (semitone !== null && !scaleLabelBySemitone.has(semitone)) {
      scaleLabelBySemitone.set(semitone, note);
    }
  });

  return getKeyboardNotesForScale(scale).map(pianoNote => {
    const semitone = getNoteSemitone(pianoNote);
    return {
      pianoNote,
      answerNote: scaleLabelBySemitone.get(semitone) || pianoNote,
      label: pianoNote
    };
  });
}

const NOTE_BASE_SEMITONES = {
  Do: 0,
  Re: 2,
  Mi: 4,
  Fa: 5,
  Sol: 7,
  La: 9,
  Si: 11
};

function normalizeAccidentals(note) {
  return String(note || "")
    .replace(/#/g, "♯")
    .replace(/b/g, "♭")
    .trim();
}

function getNoteSemitone(note) {
  const clean = normalizeAccidentals(note);
  const base = Object.keys(NOTE_BASE_SEMITONES).find(name => clean.startsWith(name));
  if (!base) return null;

  const accidentals = clean.slice(base.length);
  const alteration = Array.from(accidentals).reduce((sum, char) => {
    if (char === "♯") return sum + 1;
    if (char === "♭") return sum - 1;
    return sum;
  }, 0);

  return (NOTE_BASE_SEMITONES[base] + alteration + 120) % 12;
}

function getIntervalSemitones(fromNote, toNote) {
  const from = getNoteSemitone(fromNote);
  const to = getNoteSemitone(toNote);
  if (from === null || to === null) return null;
  return (to - from + 12) % 12;
}

function formatToneValue(semitones) {
  if (semitones === null) return "?";
  if (semitones === 0) return "0";
  if (semitones === 1) return "S";
  if (semitones === 2) return "T";
  return `${semitones / 2}T`;
}

function getToneLabelClass(semitones) {
  if (semitones === 1) return "ts-s";
  if (semitones === 2) return "ts-t";
  return "ts-wide";
}

const SCALE_LETTERS = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"];
const MAJOR_TONICS = ["Do", "Sol", "Re", "La", "Mi", "Si", "Fa♯", "Re♭", "La♭", "Mi♭", "Si♭", "Fa"];
const MINOR_TONICS = ["La", "Mi", "Si", "Fa♯", "Do♯", "La♭", "Mi♭", "Si♭", "Fa", "Do", "Sol", "Re"];
const SCALE_PATTERNS = [
  { type: "maggiore", tonics: MAJOR_TONICS, intervals: [0, 2, 4, 5, 7, 9, 11, 12] },
  { type: "minore naturale", tonics: MINOR_TONICS, intervals: [0, 2, 3, 5, 7, 8, 10, 12] },
  { type: "minore armonica", tonics: MINOR_TONICS, intervals: [0, 2, 3, 5, 7, 8, 11, 12] },
  { type: "minore melodica", tonics: MINOR_TONICS, intervals: [0, 2, 3, 5, 7, 9, 11, 12] }
];

function getNoteBaseName(note) {
  const clean = normalizeAccidentals(note);
  return SCALE_LETTERS.find(name => clean.startsWith(name)) || "";
}

function getAccidentalText(alteration) {
  if (alteration > 0) return "♯".repeat(alteration);
  if (alteration < 0) return "♭".repeat(Math.abs(alteration));
  return "";
}

function normalizeAlteration(alteration) {
  let safeAlteration = alteration;
  while (safeAlteration > 6) safeAlteration -= 12;
  while (safeAlteration < -6) safeAlteration += 12;
  return safeAlteration;
}

function spellScaleDegree(letter, targetSemitone) {
  const naturalSemitone = NOTE_BASE_SEMITONES[letter];
  const alteration = normalizeAlteration(targetSemitone - naturalSemitone);
  return `${letter}${getAccidentalText(alteration)}`;
}

function buildScaleNotes(tonic, intervals) {
  const tonicBase = getNoteBaseName(tonic);
  const tonicLetterIndex = SCALE_LETTERS.indexOf(tonicBase);
  const tonicSemitone = getNoteSemitone(tonic);

  return intervals.map((interval, index) => {
    const letter = SCALE_LETTERS[(tonicLetterIndex + index) % SCALE_LETTERS.length];
    const targetSemitone = (tonicSemitone + interval) % 12;
    return spellScaleDegree(letter, targetSemitone);
  });
}

function buildScaleIntervals(intervals) {
  return intervals.slice(0, -1).map((interval, index) =>
    formatToneValue(intervals[index + 1] - interval)
  );
}

function createGeneratedScale(tonic, type, intervals) {
  return {
    name: `${tonic} ${type}`,
    tonic,
    type,
    diff: "pro",
    notes: buildScaleNotes(tonic, intervals),
    ts: buildScaleIntervals(intervals),
    sharp: !tonic.includes("♭")
  };
}

const PRO_SCALES = SCALE_PATTERNS.flatMap(pattern =>
  pattern.tonics.map(tonic => createGeneratedScale(tonic, pattern.type, pattern.intervals))
);

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
  { name:"Si minore",    tonic:"Si",  type:"minore", diff:"easy",
    notes:["Si","Do♯","Re","Mi","Fa♯","Sol","La","Si"],
    ts:["T","S","T","T","S","T","T"], sharp:true },
  { name:"Fa♯ minore",   tonic:"Fa♯", type:"minore", diff:"easy",
    notes:["Fa♯","Sol♯","La","Si","Do♯","Re","Mi","Fa♯"],
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
  if (isScaleProModeEnabled()) return PRO_SCALES;

  if (poolKey === "easy" || poolKey === "medium" || poolKey === "hard") {
    return SCALES.filter(s => s.diff === "easy");
  }
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

/* ==================== PRO VISUALE SCALE ==================== */

function isScaleProModeEnabled() {
  return localStorage.getItem(SCALE_PRO_STORAGE_KEY) === "1";
}

function applyScaleProMode(isEnabled = isScaleProModeEnabled()) {
  document.body.classList.toggle("scaleProMode", Boolean(isEnabled));
  document.body.classList.toggle("proModeActive", Boolean(isEnabled));
  const button = document.getElementById("scaleProToggleBtn");
  if (!button) return;
  button.classList.toggle("active", Boolean(isEnabled));
  button.setAttribute("aria-pressed", String(Boolean(isEnabled)));
}

function toggleScaleProMode() {
  const nextState = !isScaleProModeEnabled();
  localStorage.setItem(SCALE_PRO_STORAGE_KEY, nextState ? "1" : "0");
  applyScaleProMode(nextState);
}

function ensureScaleProToggleButton() {
  if (document.getElementById("scaleProToggleBtn")) {
    applyScaleProMode();
    return;
  }

  const button = document.createElement("button");
  button.id = "scaleProToggleBtn";
  button.className = "scaleProToggleButton";
  button.type = "button";
  button.textContent = "Pro";
  button.setAttribute("aria-label", "Attiva modalità Pro");
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", toggleScaleProMode);
  document.body.appendChild(button);
  applyScaleProMode();
}

document.addEventListener("DOMContentLoaded", ensureScaleProToggleButton);

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
  const session = startRankedMode("scale");
  session.setUsername(nickname);
  MGHGameUI.enterRanked({
    menu,
    game,
    score: session.totalScore,
    current: session.currentQuestion,
    total: session.maxQuestions,
    feedbackEl
  });
  hideBackButton();
  startRankedClock();
  updateRankedUI();
  newRound();
}

function goBack() {
  if (gameMode === "ranked") return;
  stopRankedClock();
  game.classList.add("hidden"); menu.classList.remove("hidden");
  showLeaderboardButton(); showBackButton();
  difficulty = null; gameMode = "training"; currentScale = null; roundLocked = false;
  if (typeof resetRankedMode === "function") resetRankedMode();
  document.querySelectorAll(".selected").forEach(b => b.classList.remove("selected"));
  MGH.updateHeaderModeLabel(""); setFeedback(""); hideRankedUI(); clearGameArea();
}

/* ==================== ROUND DISPATCHER ==================== */

function newRound() {
  roundLocked = false; setFeedback(""); clearGameArea();
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
  const formula = s.ts.join(" – ");
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
  let correctItems = 0;
  for (let i = 0; i < 8; i++) {
    const sl = document.querySelector(`.easySlot[data-index="${i}"]`);
    const placedNote = slotMap[i]?.note;
    if (placedNote === exp[i]) {
      sl?.classList.add("correct");
      correctItems++;
    } else {
      sl?.classList.add("wrong");
      allOk = false;
    }
  }
  /* Mostra etichette T/S */
  const tsRow = document.getElementById("easyTsRow");
  if (tsRow) {
    tsRow.classList.remove("hidden");
    for (let i = 0; i < 7; i++) {
      const fromNote = slotMap[i]?.note;
      const toNote = slotMap[i + 1]?.note;
      const semitones = getIntervalSemitones(fromNote, toNote);
      const value = formatToneValue(semitones);
      const g = document.getElementById(`tsGap${i}`);
      if (g) {
        g.textContent = value;
        g.className = `easyTsGap ts-label ${getToneLabelClass(semitones)}`;
      }
    }
  }
  if (allOk) setFeedback(MGH.getAnswerFeedback(true), "correct");
  else       setFeedback(MGH.getAnswerFeedback(false, "Ordine corretto: " + exp.join(" – ") + "."), "wrong");
  if (gameMode === "ranked") {
    handleRankedAnswer(allOk, { correctItems, totalItems: exp.length });
    return;
  }
  setTimeout(() => { Object.keys(slotMap).forEach(k => delete slotMap[k]); newRound(); }, 2200);
}

function resetEasyRound() {
  Object.keys(slotMap).forEach(k => delete slotMap[k]); buildEasyRound();
}

/* ================================================================
   MODALITÀ MEDIO
   Scala visibile con note fisse. Trascina T o S nei 7 gap.
================================================================ */

const gapMap = {}; // gapIndex → { label, chipIdx }

function buildMediumRound() {
  const s = currentScale;
  questionEl.textContent = `Trascina gli intervalli nei gap: scala di ${s.name}`;
  const ga = document.getElementById("gameArea");
  ga.innerHTML = `
    <section class="mediumVisualStage gameVisualBox" aria-label="Completa toni e semitoni">
      <div class="medium-notes-row" id="medNotesRow"></div>
      <div class="medium-gaps-row" id="medGapsRow"></div>
      <div class="medium-ts-pool" id="medPool"></div>
    </section>`;

  const notesRow = document.getElementById("medNotesRow");
  const gapsRow = document.getElementById("medGapsRow");
  s.notes.forEach((note, i) => {
    const nd = document.createElement("div"); nd.className = "mediumNote"; nd.textContent = note;
    notesRow.appendChild(nd);
    if (i < s.notes.length - 1) {
      const g = document.createElement("div");
      g.className = "mediumGap"; g.dataset.index = i; g.textContent = "?";
      setupMediumGap(g, i); gapsRow.appendChild(g);
    }
  });

  /* Pool chip T/S mescolate */
  const pool = document.getElementById("medPool");
  const needed = [...s.ts].sort(() => Math.random() - 0.5);
  needed.forEach((lbl, idx) => {
    const c = document.createElement("div");
    c.className = "tsChip"; c.textContent = lbl; c.dataset.label = lbl; c.dataset.idx = idx;
    c.draggable = true;
    c.addEventListener("click", () => {
      if (roundLocked || c.classList.contains("used")) return;
      placeInFirstEmptyGap(lbl, idx);
    });
    c.addEventListener("dragstart", e => {
      if (roundLocked) { e.preventDefault(); return; }
      e.dataTransfer.setData("tsLabel", lbl); e.dataTransfer.setData("tsIdx", String(idx));
      e.dataTransfer.setData("fromGap", "");
      setTimeout(() => c.classList.add("dragging"), 0);
    });
    c.addEventListener("dragend", () => c.classList.remove("dragging"));
    c.addEventListener("pointerdown", e => {
      if (roundLocked || e.pointerType === "mouse") return;
      e.preventDefault(); startTsTouchDrag(c, lbl, idx, e);
    }, { passive: false });
    pool.appendChild(c);
  });

  pool.addEventListener("dragover", e => { e.preventDefault(); pool.classList.add("drag-over"); });
  pool.addEventListener("dragleave", () => pool.classList.remove("drag-over"));
  pool.addEventListener("drop", e => {
    e.preventDefault();
    pool.classList.remove("drag-over");
    if (roundLocked) return;
    const fromGap = e.dataTransfer.getData("fromGap");
    if (fromGap !== "") returnGapToPool(parseInt(fromGap));
  });
}

function setupMediumGap(gap, i) {
  gap.draggable = false;
  gap.addEventListener("dragstart", e => {
    if (roundLocked || !gapMap[i]) {
      e.preventDefault();
      return;
    }

    e.dataTransfer.setData("tsLabel", gapMap[i].label);
    e.dataTransfer.setData("tsIdx", gapMap[i].chipIdx !== null ? String(gapMap[i].chipIdx) : "");
    e.dataTransfer.setData("fromGap", String(i));
    setTimeout(() => gap.classList.add("dragging"), 0);
  });
  gap.addEventListener("dragend", () => gap.classList.remove("dragging"));
  gap.addEventListener("dragover",  e => { e.preventDefault(); gap.classList.add("drag-over"); });
  gap.addEventListener("dragleave", () => gap.classList.remove("drag-over"));
  gap.addEventListener("drop", e => {
    e.preventDefault(); gap.classList.remove("drag-over");
    if (roundLocked) return;
    const lbl = e.dataTransfer.getData("tsLabel");
    const idx = e.dataTransfer.getData("tsIdx");
    const fromGap = e.dataTransfer.getData("fromGap");
    placeInGap(
      lbl,
      i,
      idx !== "" ? parseInt(idx) : null,
      fromGap !== "" ? parseInt(fromGap) : null
    );
  });
  gap.addEventListener("click", () => { if (!roundLocked && gapMap[i]) returnGapToPool(i); });
}

function placeInGap(lbl, gi, chipIdx, fromGapIdx = null) {
  if (!lbl) return;
  if (fromGapIdx === gi) return;

  const movingData = fromGapIdx !== null && fromGapIdx !== undefined ? gapMap[fromGapIdx] : null;
  const sourceChipIdx = chipIdx !== null && chipIdx !== undefined
    ? chipIdx
    : movingData?.chipIdx ?? null;

  if (gapMap[gi]) returnGapToPool(gi);
  if (fromGapIdx !== null && fromGapIdx !== undefined) {
    clearGap(fromGapIdx);
  }
  gapMap[gi] = { label: lbl, chipIdx: sourceChipIdx };
  const g = document.querySelector(`.mediumGap[data-index="${gi}"]`);
  if (g) {
    g.textContent = lbl;
    g.draggable = true;
    g.classList.add("filled");
    g.setAttribute("title", "Clicca o trascina per togliere");
  }
  if (sourceChipIdx !== null) {
    const c = document.querySelector(`.tsChip[data-idx="${sourceChipIdx}"]`);
    if (c) c.classList.add("used");
  }
}

function placeInFirstEmptyGap(lbl, chipIdx) {
  const firstEmptyIndex = Array.from({ length: 7 }, (_, index) => index)
    .find(index => !gapMap[index]);

  if (firstEmptyIndex === undefined) {
    setFeedback("Tutti i gap sono pieni: clicca su un quadrato per liberarlo.");
    return;
  }

  placeInGap(lbl, firstEmptyIndex, chipIdx);
}

function clearGap(gi) {
  delete gapMap[gi];
  const g = document.querySelector(`.mediumGap[data-index="${gi}"]`);
  if (g) {
    g.textContent = "?";
    g.draggable = false;
    g.removeAttribute("title");
    g.classList.remove("filled","correct","wrong","dragging");
  }
}

function returnGapToPool(gi) {
  const data = gapMap[gi];
  clearGap(gi);
  const c = data?.chipIdx !== null && data?.chipIdx !== undefined
    ? document.querySelector(`.tsChip.used[data-idx="${data.chipIdx}"]`)
    : [...document.querySelectorAll(".tsChip.used")].find(x => x.dataset.label === data?.label);
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
  let correctItems = 0;
  for (let i = 0; i < 7; i++) {
    const g = document.querySelector(`.mediumGap[data-index="${i}"]`);
    if (gapMap[i]?.label === currentScale.ts[i]) {
      g?.classList.add("correct");
      correctItems++;
    } else {
      g?.classList.add("wrong");
      allOk = false;
    }
  }
  if (allOk) setFeedback(MGH.getAnswerFeedback(true), "correct");
  else setFeedback(MGH.getAnswerFeedback(false, "La sequenza corretta era " + currentScale.ts.join(" – ") + "."), "wrong");
  if (gameMode === "ranked") {
    handleRankedAnswer(allOk, { correctItems, totalItems: currentScale.ts.length });
    return;
  }
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

function buildHardRound() {
  const s = currentScale;
  const keyboardKeys = getKeyboardKeysForScale(s);
  questionEl.textContent = `Costruisci la scala di ${s.name} sulla tastiera`;

  const ga = document.getElementById("gameArea");
  ga.innerHTML = `
    <section class="hardVisualStage gameVisualBox" aria-label="Costruzione della scala sulla tastiera">
      <div class="hard-selected-row" id="hardSelRow">
        <span class="hard-sel-hint" id="hardSelHint">Seleziona ${s.notes.length} note dalla tastiera</span>
      </div>
      <div class="piano-wrap">
        <div class="piano" id="piano"></div>
      </div>
    </section>`;

  hardSelected.length = 0;
  buildPiano(document.getElementById("piano"), keyboardKeys);
}

function buildPiano(container, keyboardKeys) {
  const WW = 40, WH = 128, BW = 26, BH = 80;

  /* Indici dei tasti bianchi (in ordine) */
  const whiteIndices = keyboardKeys
    .map((_, i) => i)
    .filter(i => !isPianoBlackNote(keyboardKeys[i].pianoNote));

  /* Larghezza totale = numero tasti bianchi × WW. */
  container.style.position = "relative";
  container.style.height   = WH + "px";
  container.style.width    = (whiteIndices.length * WW) + "px";

  /* Mappa semitoneIndex → left del tasto bianco */
  const whitePosMap = {};
  whiteIndices.forEach((si, wi) => { whitePosMap[si] = wi * WW; });

  /* 1. Disegna tasti BIANCHI (z-index basso) */
  whiteIndices.forEach(si => {
    const keyData = keyboardKeys[si];
    const key  = document.createElement("div");
    key.className = "hardKey white-key";
    key.dataset.note = keyData.answerNote; key.dataset.si = si; key.dataset.keyId = String(si);
    Object.assign(key.style, {
      position: "absolute", left: whitePosMap[si] + "px", top: "0",
      width: WW + "px", height: WH + "px", zIndex: "1"
    });
    key.innerHTML = `<span class="key-label">${keyData.label}</span>`;
    key.addEventListener("click", () => onHardKeyClick(keyData.label, keyData.answerNote, key));
    container.appendChild(key);
  });

  /* 2. Disegna tasti NERI sopra (z-index alto), posizionati tra i bianchi */
  keyboardKeys.forEach((keyData, si) => {
    if (!isPianoBlackNote(keyData.pianoNote)) return;
    /* Posiziona ogni nero tra due bianchi, come una tastiera reale. */
    const prevWhi = whiteIndices.filter(w => w < si).slice(-1)[0];
    const previousWhiteCount = prevWhi === undefined ? 0 : whiteIndices.indexOf(prevWhi) + 1;
    /* Centro del tasto nero = bordo destro del bianco precedente - BW/2 */
    const leftX   = previousWhiteCount * WW - BW / 2;
    const key     = document.createElement("div");
    key.className = "hardKey black-key";
    key.dataset.note = keyData.answerNote; key.dataset.si = si; key.dataset.keyId = String(si);
    Object.assign(key.style, {
      position: "absolute", left: leftX + "px", top: "0",
      width: BW + "px", height: BH + "px", zIndex: "2"
    });
    key.innerHTML = `<span class="key-label">${keyData.label}</span>`;
    key.addEventListener("click", () => onHardKeyClick(keyData.label, keyData.answerNote, key));
    container.appendChild(key);
  });
}

function onHardKeyClick(label, note, keyEl) {
  if (roundLocked) return;
  const maxNotes = currentScale.notes.length;
  const keyId = keyEl.dataset.keyId || keyEl.dataset.si;
  const idx = hardSelected.findIndex(item => item.keyId === keyId);
  if (idx !== -1) {
    hardSelected.splice(idx, 1);
    keyEl.classList.remove("selected");
    renderHardSelected(); return;
  }
  if (hardSelected.length >= maxNotes) { setFeedback(`Puoi selezionare al massimo ${maxNotes} note.`); return; }
  hardSelected.push({ note, label, keyId });
  keyEl.classList.add("selected");
  renderHardSelected(); setFeedback("");
}

function renderHardSelected() {
  const row  = document.getElementById("hardSelRow");
  const hint = document.getElementById("hardSelHint");
  if (!row) return;
  row.querySelectorAll(".hardChip").forEach(c => c.remove());
  if (!hardSelected.length) { if (hint) hint.style.display = ""; return; }
  if (hint) hint.style.display = "none";
  hardSelected.forEach((item, index) => {
    const c = document.createElement("div");
    c.className = "noteChip hardChip";
    c.textContent = item.label;
    c.draggable = false;
    c.dataset.selectedIndex = String(index);
    c.addEventListener("click", () => {
      if (roundLocked) return;
      removeHardSelectedAt(index);
    });
    row.appendChild(c);
  });
}

function removeHardSelectedAt(index) {
  const selected = hardSelected[index];
  if (!selected) return;

  hardSelected.splice(index, 1);
  document.querySelector(`.hardKey[data-key-id="${CSS.escape(selected.keyId)}"]`)?.classList.remove("selected");
  renderHardSelected();
}

function checkHardAnswer() {
  const exp = currentScale.notes;
  if (hardSelected.length !== exp.length) {
    setFeedback(`Seleziona ${exp.length} note (hai: ${hardSelected.length}).`); return;
  }
  roundLocked = true;
  const selectedNotes = hardSelected.map(item => item.note);
  const allOk = arraysEqual(selectedNotes, exp);
  let correctItems = 0;
  hardSelected.forEach((item, i) => {
    const chip = document.querySelector(`.hardChip[data-selected-index="${i}"]`);
    const isItemCorrect = item.note === exp[i];
    if (isItemCorrect) correctItems++;
    if (chip) chip.classList.add(isItemCorrect ? "correct" : "wrong");
  });
  if (allOk) setFeedback(MGH.getAnswerFeedback(true), "correct");
  else       setFeedback(MGH.getAnswerFeedback(false, "La scala corretta era " + exp.join(" – ") + "."), "wrong");
  if (gameMode === "ranked") {
    handleRankedAnswer(allOk, { correctItems, totalItems: exp.length });
    return;
  }
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

function handleRankedAnswer(isCorrect, partialCredit = null) {
  const answer = partialCredit
    ? {
        isCorrect,
        partialCredit,
        details: {
          scale: currentScale?.name || "",
          correctItems: partialCredit.correctItems,
          totalItems: partialCredit.totalItems
        }
      }
    : isCorrect;
  const session = answerRankedQuestion(answer);
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

function hideLeaderboardButton() {
  document.getElementById("rankedLeaderboardBtn")?.classList.add("hidden");
  document.getElementById("gameModeHelpBtn")?.classList.add("hidden");
  document.getElementById("scaleProToggleBtn")?.classList.add("hidden");
}
function showLeaderboardButton() {
  document.getElementById("rankedLeaderboardBtn")?.classList.remove("hidden");
  document.getElementById("gameModeHelpBtn")?.classList.remove("hidden");
  document.getElementById("scaleProToggleBtn")?.classList.remove("hidden");
}
function hideBackButton() { document.getElementById("backButton")?.classList.add("hidden"); }
function showBackButton() { document.getElementById("backButton")?.classList.remove("hidden"); }

function updateRankedUI() {
  if (!currentRankedSession) return;
  updateRankedProgressUI({
    score: currentRankedSession.totalScore,
    current: currentRankedSession.currentQuestion,
    total: currentRankedSession.maxQuestions
  });
}

async function showRankedResults() {
  stopRankedClock();
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

function startRankedClock() {
  startRankedElapsedTimer(currentRankedSession?.startTime);
}

function stopRankedClock() {
  stopRankedElapsedTimer();
}

/* ==================== UTILS ==================== */

function arraysEqual(a, b) { return a.length === b.length && a.every((v, i) => v === b[i]); }
