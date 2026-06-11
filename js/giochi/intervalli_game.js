/* ==================== INTERVALLI GAME — intervalli_game.js ==================== */
/*
  MODALITÀ:
  ─ FACILE   : riconosci l'intervallo per numero (2ª, 3ª, 4ª, 5ª)
               le due note sono mostrate sul pentagramma in chiave di Sol
               dopo la risposta appaiono i nomi delle note
  ─ MEDIO    : intervalli da 2ª a 8ª (unisono incluso)
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

const menu        = document.getElementById("menu");
const game        = document.getElementById("game");
const feedbackEl  = document.getElementById("feedback");
const warning     = document.getElementById("warning");
const timerBox    = document.getElementById("timerBox");
const timerEl     = document.getElementById("timer");
const answerBtns  = document.getElementById("answerButtons");
const note1El     = document.getElementById("note1");
const note2El     = document.getElementById("note2");
const stem1El     = document.getElementById("stem1");
const stem2El     = document.getElementById("stem2");
const ledgerGroup = document.getElementById("ledgerLines");
const label1El    = document.getElementById("noteLabel1");
const label2El    = document.getElementById("noteLabel2");

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

/* Label breve senza ottava */
function noteName(n) { return n.replace(/\d/,""); }

/*
  Lista completa intervalli.
  Per facile: solo 2ª–5ª, qualità non mostrata (solo numero).
  Per medio:  2ª–8ª, qualità non mostrata.
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
  { name:"4ª",  short:"4ª",  number:4, quality:null, semitones:5,  diff:"easy",
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
  { name:"7ª",  short:"7ª",  number:7, quality:null, semitones:11, diff:"medium",
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

/* Pool no-repeat */
let lastIntervalName = { easy: null, medium: null, hard: null };

function getPool(poolKey) {
  if (poolKey === "easy")   return INTERVALS.filter(i => i.diff === "easy");
  if (poolKey === "medium") return INTERVALS.filter(i => i.diff !== "hard");
  return INTERVALS;
}

function pickInterval(poolKey) {
  const arr  = getPool(poolKey);
  const prev = lastIntervalName[poolKey] || "";
  const avail = arr.length > 1 ? arr.filter(i => i.name + i.note1 !== prev) : arr;
  const chosen = avail[Math.floor(Math.random() * avail.length)];
  lastIntervalName[poolKey] = chosen.name + chosen.note1;
  return chosen;
}

/* ==================== OPZIONI RISPOSTA ==================== */

/*
  Per facile e medio: bottoni con numero intervallo (2ª, 3ª, … 5ª/8ª)
  Per difficile: bottoni con nome completo qualità (3ª magg., 4ª giusta, ecc.)
  I distrattori sono scelti tra intervalli plausibili della stessa pool.
*/

function getAnswerOptions(interval, poolKey) {
  if (poolKey === "easy") {
    return ["2ª","3ª","4ª","5ª"];
  }
  if (poolKey === "medium") {
    return ["2ª","3ª","4ª","5ª","6ª","7ª","8ª"];
  }
  // Hard: costruiamo un set di distrattori plausibili
  const allShorts = [...new Set(INTERVALS.map(i => i.short))];
  // Assicuriamo che la risposta corretta ci sia
  const correct = interval.short;
  let pool = allShorts.filter(s => s !== correct);
  // Scegliamo 5 distrattori random
  pool = pool.sort(() => Math.random() - 0.5).slice(0, 5);
  pool.push(correct);
  return pool.sort(() => Math.random() - 0.5);
}

function getCorrectAnswer(interval, poolKey) {
  if (poolKey === "hard") return interval.short;
  return interval.number + "ª";
}

/* ==================== RENDER SVG ==================== */

function renderStaff(interval) {
  const y1 = NOTE_Y[interval.note1];
  const y2 = NOTE_Y[interval.note2];

  // Posiziona note
  note1El.setAttribute("cy", y1);
  note1El.setAttribute("transform", `rotate(-15,180,${y1})`);
  note2El.setAttribute("cy", y2);
  note2El.setAttribute("transform", `rotate(-15,300,${y2})`);

  // Gambi: se nota sotto la riga 3 (y>120) → gambo su; sopra → gambo giù
  setStem(stem1El, 180, 191, y1);
  setStem(stem2El, 300, 311, y2);

  // Tagli addizionali
  drawLedgerLines(y1, y2);

  // Nascondi etichette
  label1El.classList.add("hidden");
  label2El.classList.add("hidden");
}

function setStem(stemEl, cx, sx, y) {
  if (y >= 120) {
    // gambo verso l'alto
    stemEl.setAttribute("x1", sx); stemEl.setAttribute("x2", sx);
    stemEl.setAttribute("y1", y - 7); stemEl.setAttribute("y2", y - 42);
  } else {
    // gambo verso il basso
    stemEl.setAttribute("x1", cx - 11); stemEl.setAttribute("x2", cx - 11);
    stemEl.setAttribute("y1", y + 7);   stemEl.setAttribute("y2", y + 42);
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
  label1El.setAttribute("y", Math.max(NOTE_Y[currentInterval.note1] + 22, 165));
  label2El.setAttribute("y", Math.max(NOTE_Y[currentInterval.note2] + 22, 165));
  label1El.classList.remove("hidden");
  label2El.classList.remove("hidden");
}

/* ==================== BOTTONI RISPOSTA ==================== */

function buildAnswerButtons(options, correctAnswer) {
  answerBtns.innerHTML = "";
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "intervalBtn";
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
  menu.classList.add("hidden");
  game.classList.remove("hidden");
  hideLeaderboardButton();
  hideRankedUI();
  MGH.updateHeaderModeLabel(getDifficultyLabel());
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
  menu.classList.add("hidden");
  game.classList.remove("hidden");
  hideLeaderboardButton(); hideBackButton();
  MGH.updateHeaderModeLabel("Classificata");
  showRankedUI();
  startRankedClock();
  updateRankedUI();
  newRound();
}

function goBack() {
  if (gameMode === "ranked") return;
  stopRankedClock();
  game.classList.add("hidden");
  menu.classList.remove("hidden");
  difficulty = null; gameMode = "training"; currentInterval = null; roundLocked = false;
  if (typeof resetRankedMode === "function") resetRankedMode();
  document.querySelectorAll(".selected").forEach(b => b.classList.remove("selected"));
  MGH.updateHeaderModeLabel("");
  setFeedback(""); hideRankedUI();
  showLeaderboardButton(); showBackButton();
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
  const correctAnswer = getCorrectAnswer(currentInterval, poolKey);
  buildAnswerButtons(options, correctAnswer);
}

/* ==================== RISPOSTA ==================== */

function checkAnswer(answer, btn, correctAnswer) {
  if (roundLocked) return;
  roundLocked = true;

  const isCorrect = answer === correctAnswer;

  // Colora bottoni
  document.querySelectorAll(".intervalBtn").forEach(b => {
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
    setFeedback(MGH.getAnswerFeedback(false, `Era: ${currentInterval.name} (${noteName(currentInterval.note1)} – ${noteName(currentInterval.note2)})`), "wrong");
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
  if (typeof currentRankedSession === "undefined" || !currentRankedSession) return;
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
  stopRankedClock();
  const finalData = await finishRankedMode();
  if (!finalData || !finalData.session) { setFeedback("Errore nel salvataggio."); return; }
  const session = finalData.session;
  game.classList.add("hidden");
  menu.classList.remove("hidden");
  hideRankedUI(); showLeaderboardButton(); showBackButton();
  warning.textContent = "";
  await showRankedCompletionModal({
    gameName: "intervalli", session,
    saveResult: finalData.result, saved: finalData.saved
  });
  MGH.updateHeaderModeLabel("");
  document.querySelectorAll(".selected").forEach(b => b.classList.remove("selected"));
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
