/* ==================== INTERVALLI GAME — intervalli_game.js ==================== */
/*
  MODALITÀ:
  ─ FACILE   : riconosci numero e qualità dell'intervallo (2ª minore, 3ª maggiore...)
               le due note sono mostrate sul pentagramma in chiave di Sol
               dopo la risposta appaiono i nomi delle note
  ─ MEDIO    : intervalli da 2ª a 8ª con qualità
  ─ DIFFICILE: intervalli con qualità — maggiore, minore, giusta, eccedente, diminuita
  ─ RANKED   : easy→medium→hard con difficoltà crescente (usa getRankedDifficulty)
*/

/* ── Globals ── */
let difficulty   = null;
let gameMode     = "training";
let currentInterval = null;
let roundLocked  = false;
let rankedTimerInterval = null;
let rankedStartTime = 0;
const INTERVALS_PRO_STORAGE_KEY = "mgh_intervalli_pro";

const menu        = document.getElementById("menu");
const game        = document.getElementById("game");
if (typeof MGHGameUI !== "undefined") MGHGameUI.ensureRankedHUD(game);
const feedbackEl  = document.getElementById("feedback");
const warning     = document.getElementById("warning");
const timerBox    = document.getElementById("timerBox");
const timerEl     = document.getElementById("timer");
const answerBtns  = document.getElementById("buttons");
const note1El     = document.getElementById("note1");
const note2El     = document.getElementById("note2");
const stem1El     = document.getElementById("stem1");
const stem2El     = document.getElementById("stem2");
const ledgerGroup = document.getElementById("ledgerLines");
const label1El    = document.getElementById("noteLabel1");
const label2El    = document.getElementById("noteLabel2");
const accidental1El = document.getElementById("accidental1");
const accidental2El = document.getElementById("accidental2");

/* ==================== DATI INTERVALLI ==================== */

/*
  Ogni intervallo ha:
    name      – nome completo (es. "3ª maggiore")
    short     – nome breve per bottone (es. "3ª magg.")
    number    – numero intervallo (1–8)
    quality   – "giusta"|"maggiore"|"minore"|"eccedente"|"diminuita"|null
    semitones – semitoni totali
    diff      – "easy"|"medium"|"hard"
    note1     – nome nota base (es. "Do")
    note2     – nome nota superiore (es. "Mi")
    y1        – posizione y nota 1 sul pentagramma (chiave di Sol)
    y2        – posizione y nota 2 sul pentagramma
*/

/*
  Mappa note → posizione y in chiave di Sol (pentagramma da y=100 a y=140, step 5)
  Do4=150(taglio), Re4=145(spazio sotto), Mi4=140(riga1), Fa4=135, Sol4=130,
  La4=125, Si4=120, Do5=115, Re5=110, Mi5=105, Fa5=100, Sol5=95(taglio sopra)
*/
const NOTE_Y = {
  "Do4":150, "Re4":145, "Mi4":140, "Fa4":135, "Sol4":130,
  "La4":125, "Si4":120, "Do5":115, "Re5":110, "Mi5":105,
  "Fa5":100, "Sol5":95
};

function parseNoteToken(note) {
  const match = String(note || "").match(/^(Do|Re|Mi|Fa|Sol|La|Si)(bb|##|[#b♯♭]?)(\d)$/);
  if (!match) return { key: note, accidental: "", label: note };

  const accidental = match[2]
    .replace("bb", "♭♭")
    .replace("##", "♯♯")
    .replace("#", "♯")
    .replace("b", "♭");

  return {
    key: `${match[1]}${match[3]}`,
    accidental,
    label: `${match[1]}${accidental}`
  };
}

function noteY(note) {
  return NOTE_Y[parseNoteToken(note).key];
}

function noteName(note) {
  return parseNoteToken(note).label;
}

/*
  Lista completa intervalli.
  Per facile: solo 2ª–5ª, con qualità.
  Per medio:  2ª–8ª, con qualità.
  Per hard:   tutto con qualità.
*/
const INTERVALS = [
  // ── FACILE (2ª–5ª, coppie semplici) ──────────────────────────────────
  { name:"2ª",  short:"2ª",  number:2, quality:null, semitones:2,  diff:"easy",
    note1:"Do4", note2:"Re4" },
  { name:"2ª",  short:"2ª",  number:2, quality:null, semitones:2,  diff:"easy",
    note1:"Re4", note2:"Mi4" },
  { name:"2ª",  short:"2ª",  number:2, quality:null, semitones:1,  diff:"easy",
    note1:"Mi4", note2:"Fa4" },
  { name:"2ª",  short:"2ª",  number:2, quality:null, semitones:2,  diff:"easy",
    note1:"Fa4", note2:"Sol4" },
  { name:"2ª",  short:"2ª",  number:2, quality:null, semitones:2,  diff:"easy",
    note1:"Sol4", note2:"La4" },
  { name:"3ª",  short:"3ª",  number:3, quality:null, semitones:4,  diff:"easy",
    note1:"Do4", note2:"Mi4" },
  { name:"3ª",  short:"3ª",  number:3, quality:null, semitones:3,  diff:"easy",
    note1:"Re4", note2:"Fa4" },
  { name:"3ª",  short:"3ª",  number:3, quality:null, semitones:4,  diff:"easy",
    note1:"Mi4", note2:"Sol4" },
  { name:"3ª",  short:"3ª",  number:3, quality:null, semitones:3,  diff:"easy",
    note1:"Fa4", note2:"La4" },
  { name:"3ª",  short:"3ª",  number:3, quality:null, semitones:4,  diff:"easy",
    note1:"Sol4", note2:"Si4" },
  { name:"4ª",  short:"4ª",  number:4, quality:null, semitones:5,  diff:"easy",
    note1:"Do4", note2:"Fa4" },
  { name:"4ª",  short:"4ª",  number:4, quality:null, semitones:5,  diff:"easy",
    note1:"Re4", note2:"Sol4" },
  { name:"4ª",  short:"4ª",  number:4, quality:null, semitones:5,  diff:"easy",
    note1:"Mi4", note2:"La4" },
  { name:"4ª",  short:"4ª",  number:4, quality:null, semitones:6,  diff:"easy",
    note1:"Fa4", note2:"Si4" },
  { name:"5ª",  short:"5ª",  number:5, quality:null, semitones:7,  diff:"easy",
    note1:"Do4", note2:"Sol4" },
  { name:"5ª",  short:"5ª",  number:5, quality:null, semitones:7,  diff:"easy",
    note1:"Re4", note2:"La4" },
  { name:"5ª",  short:"5ª",  number:5, quality:null, semitones:7,  diff:"easy",
    note1:"Mi4", note2:"Si4" },
  { name:"5ª",  short:"5ª",  number:5, quality:null, semitones:7,  diff:"easy",
    note1:"Sol4", note2:"Re5" },

  // ── MEDIO (aggiunge 6ª, 7ª, 8ª) ──────────────────────────────────────
  { name:"6ª",  short:"6ª",  number:6, quality:null, semitones:9,  diff:"medium",
    note1:"Do4", note2:"La4" },
  { name:"6ª",  short:"6ª",  number:6, quality:null, semitones:9,  diff:"medium",
    note1:"Re4", note2:"Si4" },
  { name:"6ª",  short:"6ª",  number:6, quality:null, semitones:8,  diff:"medium",
    note1:"Mi4", note2:"Do5" },
  { name:"6ª",  short:"6ª",  number:6, quality:null, semitones:9,  diff:"medium",
    note1:"Fa4", note2:"Re5" },
  { name:"7ª",  short:"7ª",  number:7, quality:null, semitones:11, diff:"medium",
    note1:"Do4", note2:"Si4" },
  { name:"7ª",  short:"7ª",  number:7, quality:null, semitones:10, diff:"medium",
    note1:"Re4", note2:"Do5" },
  { name:"7ª",  short:"7ª",  number:7, quality:null, semitones:10, diff:"medium",
    note1:"Mi4", note2:"Re5" },
  { name:"7ª",  short:"7ª",  number:7, quality:null, semitones:10, diff:"medium",
    note1:"Sol4", note2:"Fa5" },
  { name:"8ª",  short:"8ª",  number:8, quality:null, semitones:12, diff:"medium",
    note1:"Do4", note2:"Do5" },
  { name:"8ª",  short:"8ª",  number:8, quality:null, semitones:12, diff:"medium",
    note1:"Sol4", note2:"Sol5" },
  { name:"8ª",  short:"8ª",  number:8, quality:null, semitones:12, diff:"medium",
    note1:"Fa4", note2:"Fa5" },

  // ── DIFFICILE: con qualità ─────────────────────────────────────────────
  { name:"2ª maggiore",   short:"2ª magg.", number:2, quality:"maggiore",  semitones:2,  diff:"hard",
    note1:"Do4", note2:"Re4" },
  { name:"2ª minore",     short:"2ª min.",  number:2, quality:"minore",    semitones:1,  diff:"hard",
    note1:"Mi4", note2:"Fa4" },
  { name:"2ª minore",     short:"2ª min.",  number:2, quality:"minore",    semitones:1,  diff:"hard",
    note1:"Si4", note2:"Do5" },
  { name:"3ª maggiore",   short:"3ª magg.", number:3, quality:"maggiore",  semitones:4,  diff:"hard",
    note1:"Do4", note2:"Mi4" },
  { name:"3ª maggiore",   short:"3ª magg.", number:3, quality:"maggiore",  semitones:4,  diff:"hard",
    note1:"Fa4", note2:"La4" },
  { name:"3ª minore",     short:"3ª min.",  number:3, quality:"minore",    semitones:3,  diff:"hard",
    note1:"Re4", note2:"Fa4" },
  { name:"3ª minore",     short:"3ª min.",  number:3, quality:"minore",    semitones:3,  diff:"hard",
    note1:"La4", note2:"Do5" },
  { name:"4ª giusta",     short:"4ª giusta",number:4, quality:"giusta",    semitones:5,  diff:"hard",
    note1:"Do4", note2:"Fa4" },
  { name:"4ª giusta",     short:"4ª giusta",number:4, quality:"giusta",    semitones:5,  diff:"hard",
    note1:"Sol4", note2:"Do5" },
  { name:"4ª eccedente",  short:"4ª ecc.",  number:4, quality:"eccedente", semitones:6,  diff:"hard",
    note1:"Fa4", note2:"Si4" },
  { name:"5ª giusta",     short:"5ª giusta",number:5, quality:"giusta",    semitones:7,  diff:"hard",
    note1:"Do4", note2:"Sol4" },
  { name:"5ª giusta",     short:"5ª giusta",number:5, quality:"giusta",    semitones:7,  diff:"hard",
    note1:"Re4", note2:"La4" },
  { name:"5ª diminuita",  short:"5ª dim.",  number:5, quality:"diminuita", semitones:6,  diff:"hard",
    note1:"Si4", note2:"Fa5" },
  { name:"6ª maggiore",   short:"6ª magg.", number:6, quality:"maggiore",  semitones:9,  diff:"hard",
    note1:"Do4", note2:"La4" },
  { name:"6ª minore",     short:"6ª min.",  number:6, quality:"minore",    semitones:8,  diff:"hard",
    note1:"Mi4", note2:"Do5" },
  { name:"6ª minore",     short:"6ª min.",  number:6, quality:"minore",    semitones:8,  diff:"hard",
    note1:"La4", note2:"Fa5" },
  { name:"7ª maggiore",   short:"7ª magg.", number:7, quality:"maggiore",  semitones:11, diff:"hard",
    note1:"Do4", note2:"Si4" },
  { name:"7ª minore",     short:"7ª min.",  number:7, quality:"minore",    semitones:10, diff:"hard",
    note1:"Re4", note2:"Do5" },
  { name:"7ª minore",     short:"7ª min.",  number:7, quality:"minore",    semitones:10, diff:"hard",
    note1:"Sol4", note2:"Fa5" },
  { name:"8ª giusta",     short:"8ª giusta",number:8, quality:"giusta",    semitones:12, diff:"hard",
    note1:"Do4", note2:"Do5" },
];

const PRO_INTERVALS = [
  { name:"2ª diminuita",  short:"2ª dim.", number:2, quality:"diminuita", semitones:0,  diff:"hard",
    note1:"Do4", note2:"Rebb4" },
  { name:"2ª eccedente", short:"2ª ecc.", number:2, quality:"eccedente", semitones:3,  diff:"hard",
    note1:"Do4", note2:"Re#4" },
  { name:"3ª diminuita", short:"3ª dim.", number:3, quality:"diminuita", semitones:2,  diff:"hard",
    note1:"Re4", note2:"Fab4" },
  { name:"3ª eccedente", short:"3ª ecc.", number:3, quality:"eccedente", semitones:5,  diff:"hard",
    note1:"Do4", note2:"Mi#4" },
  { name:"4ª diminuita", short:"4ª dim.", number:4, quality:"diminuita", semitones:4,  diff:"hard",
    note1:"Do4", note2:"Fab4" },
  { name:"5ª eccedente", short:"5ª ecc.", number:5, quality:"eccedente", semitones:8,  diff:"hard",
    note1:"Do4", note2:"Sol#4" },
  { name:"6ª diminuita", short:"6ª dim.", number:6, quality:"diminuita", semitones:7,  diff:"hard",
    note1:"Mi4", note2:"Dob5" },
  { name:"6ª eccedente", short:"6ª ecc.", number:6, quality:"eccedente", semitones:10, diff:"hard",
    note1:"Do4", note2:"La#4" },
  { name:"7ª diminuita", short:"7ª dim.", number:7, quality:"diminuita", semitones:9,  diff:"hard",
    note1:"Re4", note2:"Dob5" },
  { name:"7ª eccedente", short:"7ª ecc.", number:7, quality:"eccedente", semitones:12, diff:"hard",
    note1:"Do4", note2:"Si#4" },
  { name:"8ª diminuita", short:"8ª dim.", number:8, quality:"diminuita", semitones:11, diff:"hard",
    note1:"Do4", note2:"Dob5" },
  { name:"8ª eccedente", short:"8ª ecc.", number:8, quality:"eccedente", semitones:13, diff:"hard",
    note1:"Do4", note2:"Do#5" }
];

/* Pool no-repeat */
let lastIntervalName = { easy: null, medium: null, hard: null };

function getPool(poolKey) {
  if (poolKey === "easy")   return INTERVALS.filter(i => i.diff === "easy");
  if (poolKey === "medium") return INTERVALS.filter(i => i.diff !== "hard");
  return isIntervalsProModeEnabled() ? INTERVALS.concat(PRO_INTERVALS) : INTERVALS;
}

function pickInterval(poolKey) {
  const arr  = getPool(poolKey);
  const prev = lastIntervalName[poolKey] || "";
  const avail = arr.length > 1 ? arr.filter(i => getIntervalName(i) + i.note1 !== prev) : arr;
  const chosen = avail[Math.floor(Math.random() * avail.length)];
  lastIntervalName[poolKey] = getIntervalName(chosen) + chosen.note1;
  return chosen;
}

/* ==================== OPZIONI RISPOSTA ==================== */

/*
  I bottoni chiedono sempre numero e qualità dell'intervallo.
  4ª, 5ª e 8ª usano qualità giusta/eccedente/diminuita, non maggiore/minore.
  I distrattori sono scelti tra intervalli plausibili della stessa pool.
*/

const INTERVAL_QUALITY_BY_SEMITONES = {
  1: { 0: "giusta", 1: "eccedente" },
  2: { 0: "diminuita", 1: "minore", 2: "maggiore", 3: "eccedente" },
  3: { 2: "diminuita", 3: "minore", 4: "maggiore", 5: "eccedente" },
  4: { 4: "diminuita", 5: "giusta", 6: "eccedente" },
  5: { 6: "diminuita", 7: "giusta", 8: "eccedente" },
  6: { 7: "diminuita", 8: "minore", 9: "maggiore", 10: "eccedente" },
  7: { 9: "diminuita", 10: "minore", 11: "maggiore", 12: "eccedente" },
  8: { 11: "diminuita", 12: "giusta", 13: "eccedente" }
};

function getIntervalQuality(interval) {
  return interval.quality || INTERVAL_QUALITY_BY_SEMITONES[interval.number]?.[interval.semitones] || "";
}

function getIntervalName(interval) {
  const quality = getIntervalQuality(interval);
  return quality ? `${interval.number}ª ${quality}` : interval.name;
}

function getIntervalShort(interval) {
  return getIntervalName(interval)
    .replace("maggiore", "magg.")
    .replace("minore", "min.")
    .replace("diminuita", "dim.")
    .replace("eccedente", "ecc.");
}

function getAnswerOptions(interval, poolKey) {
  const correct = getIntervalShort(interval);
  const pool = getPool(poolKey);
  const optionCount = poolKey === "hard" ? 6 : 4;
  const sameNumber = getQualityDistractorsForNumber(interval.number)
    .filter(option => option !== correct);
  const nearbySameQuality = pool
    .filter(item => item.number !== interval.number && getIntervalQuality(item) === getIntervalQuality(interval))
    .map(getIntervalShort);
  const nearbyNumbers = pool
    .filter(item => Math.abs(item.number - interval.number) <= 1 && item.number !== interval.number)
    .map(getIntervalShort);
  const otherOptions = pool.map(getIntervalShort).filter(option => option !== correct);
  const candidates = uniqueOptions([...sameNumber, ...nearbySameQuality, ...nearbyNumbers, ...otherOptions]);

  return shuffleOptions([
    correct,
    ...shuffleOptions(candidates).slice(0, optionCount - 1)
  ]);
}

function uniqueOptions(options) {
  return [...new Set(options.filter(Boolean))];
}

function shuffleOptions(options) {
  return [...options].sort(() => Math.random() - 0.5);
}

function getQualityDistractorsForNumber(number) {
  if ([4, 5, 8].includes(number)) {
    return [`${number}ª dim.`, `${number}ª giusta`, `${number}ª ecc.`];
  }
  return [`${number}ª dim.`, `${number}ª min.`, `${number}ª magg.`, `${number}ª ecc.`];
}

function getCorrectAnswer(interval) {
  return getIntervalShort(interval);
}

/* ==================== RENDER SVG ==================== */

function renderStaff(interval) {
  const y1 = noteY(interval.note1);
  const y2 = noteY(interval.note2);

  // Posiziona note
  note1El.setAttribute("cy", y1);
  note1El.setAttribute("transform", `rotate(-15,180,${y1})`);
  note2El.setAttribute("cy", y2);
  note2El.setAttribute("transform", `rotate(-15,300,${y2})`);

  // Gambi: se nota sotto la riga 3 (y>120) → gambo su; sopra → gambo giù
  setStem(stem1El, 180, y1);
  setStem(stem2El, 300, y2);

  // Tagli addizionali
  drawLedgerLines(y1, y2);
  renderAccidental(accidental1El, interval.note1, 158, y1);
  renderAccidental(accidental2El, interval.note2, 278, y2);

  // Nascondi etichette
  label1El.classList.add("hidden");
  label2El.classList.add("hidden");
}

function renderAccidental(accidentalEl, note, x, y) {
  const parsed = parseNoteToken(note);
  if (!accidentalEl || !parsed.accidental) {
    accidentalEl?.classList.add("hidden");
    return;
  }

  accidentalEl.textContent = parsed.accidental;
  accidentalEl.setAttribute("x", x);
  accidentalEl.setAttribute("y", y + 8);
  accidentalEl.classList.remove("hidden");
}

function setStem(stemEl, cx, y) {
  if (y >= 120) {
    // gambo verso l'alto
    const sx = cx + 9;
    stemEl.setAttribute("x1", sx); stemEl.setAttribute("x2", sx);
    stemEl.setAttribute("y1", y); stemEl.setAttribute("y2", y - 42);
  } else {
    // gambo verso il basso
    const sx = cx - 9;
    stemEl.setAttribute("x1", sx); stemEl.setAttribute("x2", sx);
    stemEl.setAttribute("y1", y);   stemEl.setAttribute("y2", y + 42);
  }
}

function drawLedgerLines(y1, y2) {
  ledgerGroup.innerHTML = "";
  [y1, y2].forEach((y, idx) => {
    const cx = idx === 0 ? 180 : 300;
    // Tagli sotto (Do4 = 150, Si3 = 155 ecc.)
    for (let pos = 150; pos <= 160; pos += 10) {
      if (y >= pos) makeLedger(cx, pos);
    }
    // Tagli sopra (Sol5 = 95, La5 = 90 ecc.)
    for (let pos = 90; pos >= 80; pos -= 10) {
      if (y <= pos) makeLedger(cx, pos);
    }
  });
}

function makeLedger(cx, y) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", cx - 16); line.setAttribute("x2", cx + 16);
  line.setAttribute("y1", y);       line.setAttribute("y2", y);
  line.setAttribute("stroke", "currentColor"); line.setAttribute("stroke-width", "1.8");
  ledgerGroup.appendChild(line);
}

function showNoteLabels() {
  label1El.textContent = noteName(currentInterval.note1);
  label2El.textContent = noteName(currentInterval.note2);
  label1El.setAttribute("y", Math.max(noteY(currentInterval.note1) + 22, 165));
  label2El.setAttribute("y", Math.max(noteY(currentInterval.note2) + 22, 165));
  label1El.classList.remove("hidden");
  label2El.classList.remove("hidden");
}

/* ==================== BOTTONI RISPOSTA ==================== */

function buildAnswerButtons(options, correctAnswer) {
  answerBtns.innerHTML = "";
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "noteButton gameAnswerButton intervalBtn";
    btn.textContent = opt;
    btn.addEventListener("click", () => checkAnswer(opt, btn, correctAnswer));
    answerBtns.appendChild(btn);
  });
}

/* ==================== MENU ==================== */

function setDifficulty(level, el) {
  difficulty = level; gameMode = "training";
  warning.textContent = "";
  MGH.selectExclusive(".menuButton", el);
}

function selectRankedMode(el) {
  gameMode = "ranked"; difficulty = null;
  warning.textContent = "";
  MGH.selectExclusive(".menuButton", el);
}

function getDifficultyLabel() {
  if (difficulty === "easy")   return "Facile";
  if (difficulty === "medium") return "Medio";
  if (difficulty === "hard")   return "Difficile";
  return "";
}

/* ==================== PRO INTERVALLI ==================== */

function isIntervalsProModeEnabled() {
  return localStorage.getItem(INTERVALS_PRO_STORAGE_KEY) === "1";
}

function applyIntervalsProMode(isEnabled = isIntervalsProModeEnabled()) {
  document.body.classList.toggle("intervalsProMode", Boolean(isEnabled));
  document.body.classList.toggle("proModeActive", Boolean(isEnabled));
  const button = document.getElementById("intervalsProToggleBtn");
  if (!button) return;
  button.classList.toggle("active", Boolean(isEnabled));
  button.setAttribute("aria-pressed", String(Boolean(isEnabled)));
}

function toggleIntervalsProMode() {
  const nextState = !isIntervalsProModeEnabled();
  localStorage.setItem(INTERVALS_PRO_STORAGE_KEY, nextState ? "1" : "0");
  applyIntervalsProMode(nextState);
}

function ensureIntervalsProToggleButton() {
  if (document.getElementById("intervalsProToggleBtn")) {
    applyIntervalsProMode();
    return;
  }

  const button = document.createElement("button");
  button.id = "intervalsProToggleBtn";
  button.className = "scaleProToggleButton";
  button.type = "button";
  button.textContent = "Pro";
  button.setAttribute("aria-label", "Attiva intervalli alterati Pro");
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", toggleIntervalsProMode);
  document.body.appendChild(button);
  applyIntervalsProMode();
}

document.addEventListener("DOMContentLoaded", ensureIntervalsProToggleButton);

/* ==================== START / BACK ==================== */

function startGame() {
  if (gameMode === "ranked") {
    showRankedIntro({
      gameName: "intervalli",
      title: "Modalità Classificata",
      text: "Riconosci 10 intervalli. La difficoltà cresce durante la partita e il punteggio premia velocità e precisione.",
      onStart: startRankedGame
    });
    return;
  }
  if (!difficulty) { warning.textContent = "Seleziona una difficoltà"; return; }
  warning.textContent = "";
  MGHGameUI.enterTraining({ menu, game, modeLabel: getDifficultyLabel(), feedbackEl });
  showBackButton();
  newRound();
}

function startRankedGame(nickname = "") {
  warning.textContent = "";
  if (typeof startRankedMode !== "function") {
    warning.textContent = "Errore: ranked.js non caricato."; return;
  }
  rankedStartTime = Date.now();
  const session = startRankedMode("intervalli");
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
  difficulty = null; gameMode = "training"; currentInterval = null; roundLocked = false;
  if (typeof resetRankedMode === "function") resetRankedMode();
  MGHGameUI.returnToMenu({ menu, game, feedbackEl });
  showBackButton();
}

/* ==================== ROUND ==================== */

function newRound() {
  roundLocked = false; setFeedback("");
  answerBtns.innerHTML = "";
  label1El.classList.add("hidden");
  label2El.classList.add("hidden");

  let poolKey;
  if (gameMode === "ranked") {
    poolKey = getRankedDifficulty();
    updateRankedUI();
    startRankedQuestionTimer();
  } else {
    poolKey = difficulty;
  }

  currentInterval = pickInterval(poolKey);
  renderStaff(currentInterval);

  const options       = getAnswerOptions(currentInterval, poolKey);
  const correctAnswer = getCorrectAnswer(currentInterval);
  buildAnswerButtons(options, correctAnswer);
}

/* ==================== RISPOSTA ==================== */

function checkAnswer(answer, btn, correctAnswer) {
  if (roundLocked) return;
  roundLocked = true;

  const isCorrect = answer === correctAnswer;

  // Colora bottoni
  document.querySelectorAll("#buttons button").forEach(b => {
    b.disabled = true;
    if (b.textContent === correctAnswer) b.classList.add("correct");
  });
  if (!isCorrect) btn.classList.add("wrong");

  // Mostra nomi note in facile e medio
  const poolKey = gameMode === "ranked"
    ? (typeof getRankedDifficulty === "function" ? getRankedDifficulty() : "easy")
    : difficulty;
  if (poolKey !== "hard") showNoteLabels();

  // Feedback
  if (isCorrect) {
    setFeedback(MGH.getAnswerFeedback(true, ""), "correct");
  } else {
    setFeedback(MGH.getAnswerFeedback(false, `Era: ${getIntervalName(currentInterval)} (${noteName(currentInterval.note1)} – ${noteName(currentInterval.note2)})`), "wrong");
  }

  if (gameMode === "ranked") {
    handleRankedAnswer(isCorrect); return;
  }

  setTimeout(newRound, 1400);
}

function setFeedback(msg, state = "neutral") {
  if (typeof MGH !== "undefined" && MGH.setGameFeedback) {
    MGH.setGameFeedback(feedbackEl, msg, state);
  } else {
    feedbackEl.textContent = msg;
  }
}

/* ==================== RANKED ==================== */

function handleRankedAnswer(isCorrect) {
  const session = answerRankedQuestion(isCorrect);
  updateRankedUI();
  if (session && session.isComplete()) {
    setTimeout(showRankedResults, 1400);
  } else {
    setTimeout(newRound, 1400);
  }
}

function hideLeaderboardButton() {
  document.getElementById("rankedLeaderboardBtn")?.classList.add("hidden");
  document.getElementById("gameModeHelpBtn")?.classList.add("hidden");
  document.getElementById("intervalsProToggleBtn")?.classList.add("hidden");
}
function showLeaderboardButton() {
  document.getElementById("rankedLeaderboardBtn")?.classList.remove("hidden");
  document.getElementById("gameModeHelpBtn")?.classList.remove("hidden");
  document.getElementById("intervalsProToggleBtn")?.classList.remove("hidden");
}
function hideBackButton() { document.getElementById("backButton")?.classList.add("hidden"); }
function showBackButton() { document.getElementById("backButton")?.classList.remove("hidden"); }

function updateRankedUI() {
  if (typeof currentRankedSession === "undefined" || !currentRankedSession) return;
  const scoreEl   = document.getElementById("rankedScore");
  if (scoreEl) scoreEl.textContent = currentRankedSession.totalScore;
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
  MGHGameUI.returnToMenu({ menu, game, feedbackEl });
  showBackButton();
  warning.textContent = "";
  await showRankedCompletionModal({
    gameName: "intervalli", session,
    saveResult: finalData.result, saved: finalData.saved
  });
  gameMode = "training"; difficulty = null; currentInterval = null; roundLocked = false;
}

/* ── Orologio ranked ── */
function startRankedClock() {
  stopRankedClock();
  if (!timerBox || !timerEl) return;
  timerBox.classList.remove("hidden"); timerEl.textContent = "0";
  rankedTimerInterval = setInterval(() => {
    timerEl.textContent = String(Math.round((Date.now() - rankedStartTime) / 1000));
  }, 250);
}

function stopRankedClock() {
  if (rankedTimerInterval) { clearInterval(rankedTimerInterval); rankedTimerInterval = null; }
  timerBox?.classList.add("hidden");
}
