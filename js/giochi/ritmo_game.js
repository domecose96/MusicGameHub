/* ==================== RITMO GAME — ritmo_game.js ==================== */
/*
  MODALITÀ:
  ─ FACILE   : tempo 4/4 · slot iniziali suggeriti
               figure: semibreve(4), minima(2), semiminima(1), croma(0.5), semicroma(0.25)
               + le rispettive pause
  ─ MEDIO    : tempi 4/4, 3/4, 2/4 · più slot iniziali
  ─ DIFFICILE: + 6/8 (unità = croma=1) · ancora più slot
  ─ RANKED   : easy→medium→hard crescente

  LOGICA VERIFICA: sul VALORE RITMICO TOTALE, non sulla figura esatta.
  Semiminima + pausa semiminima = 1+1 = 2 tempi = minima. Tutto corretto.
*/

/* ── Config immagini ── */
const IMG = {
  semibreve:           "../img/semibreve.webp",
  minima:              "../img/minima.webp",
  semiminima:          "../img/semiminima.webp",
  croma:               "../img/croma.webp",
  semicroma:           "../img/semicroma.webp",
  "pausa-semibreve":   "../img/pausa_semibreve.webp",
  "pausa-minima":      "../img/pausa_minima.webp",
  "pausa-semiminima":  "../img/pausa_semiminima.webp",
  "pausa-croma":       "../img/pausa_croma.webp",
  "pausa-semicroma":   "../img/pausa_semicroma.webp",
};

/* ── Definizione figure ── */
const FIGURES = [
  { id:"semibreve",           label:"Semibreve",           val:4,    val68:6,   pause:false },
  { id:"minima",              label:"Minima",              val:2,    val68:3,   pause:false },
  { id:"semiminima",          label:"Semiminima",          val:1,    val68:1.5, pause:false },
  { id:"croma",               label:"Croma",               val:0.5,  val68:1,   pause:false },
  { id:"semicroma",           label:"Semicroma",           val:0.25, val68:0.5, pause:false },
  { id:"pausa-semibreve",     label:"Pausa semibreve",     val:4,    val68:6,   pause:true  },
  { id:"pausa-minima",        label:"Pausa minima",        val:2,    val68:3,   pause:true  },
  { id:"pausa-semiminima",    label:"Pausa semiminima",    val:1,    val68:1.5, pause:true  },
  { id:"pausa-croma",         label:"Pausa croma",         val:0.5,  val68:1,   pause:true  },
  { id:"pausa-semicroma",     label:"Pausa semicroma",     val:0.25, val68:0.5, pause:true  },
];

/* ── Tempi ── */
const TIME_SIGS = {
  easy:   [{ sig:"4/4", beats:4, unit:"bin" }],
  medium: [
    { sig:"4/4", beats:4, unit:"bin" },
    { sig:"3/4", beats:3, unit:"bin" },
    { sig:"2/4", beats:2, unit:"bin" },
  ],
  hard: [
    { sig:"4/4", beats:4, unit:"bin" },
    { sig:"3/4", beats:3, unit:"bin" },
    { sig:"2/4", beats:2, unit:"bin" },
    { sig:"6/8", beats:6, unit:"68"  },
  ],
};

/* Figure disponibili */
const POOL_IDS = {
  easy:   ["semibreve","minima","semiminima","croma",
           "pausa-semibreve","pausa-minima","pausa-semiminima","pausa-croma"],
  medium: ["semibreve","minima","semiminima","croma","semicroma",
           "pausa-semibreve","pausa-minima","pausa-semiminima","pausa-croma","pausa-semicroma"],
  hard:   ["semibreve","minima","semiminima","croma","semicroma",
           "pausa-semibreve","pausa-minima","pausa-semiminima","pausa-croma","pausa-semicroma"],
};

/* Numero di slot iniziali */
const INITIAL_SLOTS = { easy:[1], medium:[2,3], hard:[4,5] };
const MAX_SEQUENCE_CELLS = { easy:5, medium:6, hard:6 };

/* ── Globals ── */
let difficulty   = null;
let gameMode     = "training";
let roundLocked  = false;
let rankedTimerInterval = null;
let rankedStartTime = 0;

let currentTimeSig   = null;
let givenFigures     = [];
let missingFigures   = [];
let slotContents     = [];
let nSlots           = 0;

const menu       = document.getElementById("menu");
const game       = document.getElementById("game");
const feedbackEl = document.getElementById("feedback");
const warning    = document.getElementById("warning");

if (typeof MGHGameUI !== "undefined") MGHGameUI.ensureRankedHUD(game);

const timerBox   = document.getElementById("timerBox");
const timerEl    = document.getElementById("timer");
const slotsDiv   = document.getElementById("battutaSlots");
const poolDiv    = document.getElementById("figurePool");
const timeSigEl  = document.getElementById("timeSigDisplay");
const questionTextEl = document.getElementById("questionText");

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

function getDiffLabel() {
  if (difficulty === "easy")   return "Facile";
  if (difficulty === "medium") return "Medio";
  if (difficulty === "hard")   return "Difficile";
  return "";
}

function startGame() {
  if (gameMode === "ranked") {
    showRankedIntro({
      gameName: "ritmo_battuta",
      title: "Modalità Classificata",
      text: "Completa 10 battute. La difficoltà cresce e il punteggio premia la velocità.",
      onStart: startRankedGame
    });
    return;
  }
  if (!difficulty) { warning.textContent = "Seleziona una difficoltà"; return; }
  warning.textContent = "";
  MGHGameUI.enterTraining({ menu, game, modeLabel: getDiffLabel(), feedbackEl });
  showBackButton();
  newRound();
}

function startRankedGame(nickname = "") {
  warning.textContent = "";
  if (typeof startRankedMode !== "function") {
    warning.textContent = "Errore: ranked.js non caricato."; return;
  }
  rankedStartTime = Date.now();
  const session = startRankedMode("ritmo_battuta");
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
  difficulty = null; gameMode = "training"; roundLocked = false;
  if (typeof resetRankedMode === "function") resetRankedMode();
  MGHGameUI.returnToMenu({ menu, game, feedbackEl });
  showBackButton();
}

/* ==================== GENERAZIONE ROUND ==================== */

function getActiveDiff() {
  return gameMode === "ranked" && typeof getRankedDifficulty === "function"
    ? getRankedDifficulty()
    : difficulty;
}

function newRound() {
  roundLocked = false; setFeedback("");

  if (gameMode === "ranked") { updateRankedUI(); startRankedQuestionTimer(); }

  const diff = getActiveDiff();
  const timeSigs = TIME_SIGS[diff];
  currentTimeSig = timeSigs[Math.floor(Math.random() * timeSigs.length)];

  const ic = INITIAL_SLOTS[diff];
  nSlots = ic[Math.floor(Math.random() * ic.length)];

  const { given, missing } = generateBattuta(currentTimeSig, diff, nSlots);
  givenFigures   = given;
  missingFigures = missing;

  timeSigEl.textContent = currentTimeSig.sig;
  if (questionTextEl) questionTextEl.textContent = `Completa la battuta in ${currentTimeSig.sig}`;
  renderBattuta();
  renderPool(diff);
}

function generateBattuta(timeSig, diff, nMissing) {
  const totalUnits = timeSig.beats;
  const is68 = timeSig.unit === "68";
  const maxCells = MAX_SEQUENCE_CELLS[diff] || 7;

  const usable = FIGURES.filter(f => POOL_IDS[diff].includes(f.id));

  let sequence = [];
  let attempts = 0;
  while (attempts < 400) {
    sequence = buildSequence(usable, totalUnits, is68);
    if (sequence && sequence.length > nMissing && sequence.length <= maxCells) break;
    attempts++;
  }

  if (!sequence || sequence.length <= nMissing || sequence.length > maxCells) {
    sequence = fallbackSequence(totalUnits, is68);
  }

  const missing = sequence.slice(sequence.length - nMissing);
  const given   = sequence.slice(0, sequence.length - nMissing);

  return { given, missing };
}

function buildSequence(usable, total, is68) {
  let seq = [], rem = total;
  let tries = 0;
  while (rem > 0.001 && tries++ < 30) {
    const candidates = usable.filter(f => {
      const v = is68 ? f.val68 : f.val;
      return v <= rem + 0.001;
    });
    if (!candidates.length) return null;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    seq.push(pick);
    rem -= is68 ? pick.val68 : pick.val;
  }
  if (Math.abs(rem) > 0.01) return null;
  return seq;
}

function fallbackSequence(total, is68) {
  const unitFig = is68
    ? FIGURES.find(f => f.id === "croma")
    : FIGURES.find(f => f.id === "semiminima");
  const count = Math.round(total);
  return Array(count).fill(unitFig);
}

/* ==================== RENDER BATTUTA ==================== */

function renderBattuta() {
  slotsDiv.innerHTML = "";

  /* Figure già presenti */
  givenFigures.forEach(fig => {
    const el = document.createElement("div");
    el.className = "figCell givenCell";
    el.title = fig.label;
    const img = document.createElement("img");
    img.src = IMG[fig.id]; img.alt = fig.label;
    img.className = "figImg";
    el.appendChild(img);
    const lbl = document.createElement("span");
    lbl.className = "figCellLabel"; lbl.textContent = fig.label;
    el.appendChild(lbl);
    slotsDiv.appendChild(el);
  });

  /* Slot dinamici */
  slotContents = new Array(nSlots).fill(null);
  for (let i = 0; i < nSlots; i++) {
    slotsDiv.appendChild(makeSlot(i));
  }

}

function makeSlot(i) {
  const slot = document.createElement("div");
  slot.className = "figCell slotCell empty";
  slot.dataset.slot = i;
  slot.draggable = false;

  slot.addEventListener("dragstart", e => {
    if (roundLocked || slotContents[i] === null) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("figId", slotContents[i]);
    e.dataTransfer.setData("fromSlot", String(i));
    setTimeout(() => slot.classList.add("dragging"), 0);
  });
  slot.addEventListener("dragend", () => slot.classList.remove("dragging"));
  slot.addEventListener("dragover",  e => { e.preventDefault(); slot.classList.add("drag-over"); });
  slot.addEventListener("dragleave", () => slot.classList.remove("drag-over"));
  slot.addEventListener("drop", e => {
    e.preventDefault(); slot.classList.remove("drag-over");
    if (roundLocked) return;
    const figId    = e.dataTransfer.getData("figId");
    const fromSlot = e.dataTransfer.getData("fromSlot");
    placeInSlot(figId, i, fromSlot !== "" ? parseInt(fromSlot) : null);
  });
  slot.addEventListener("click", () => {
    if (roundLocked || slotContents[i] === null) return;
    returnToPool(i);
  });
  slot.addEventListener("pointerdown", e => {
    if (roundLocked || e.pointerType === "mouse" || slotContents[i] === null) return;
    e.preventDefault();
    startTouchDrag(slot, slotContents[i], i, e);
  }, { passive: false });
  return slot;
}

function renderSlot(i) {
  const slot = document.querySelector(`.slotCell[data-slot="${i}"]`);
  if (!slot) return;
  slot.innerHTML = "";
  const figId = slotContents[i];
  if (figId) {
    const fig = FIGURES.find(f => f.id === figId);
    slot.classList.remove("empty", "correct", "wrong");
    slot.draggable = true;
    slot.setAttribute("title", "Clicca o trascina per togliere la figura");
    const img = document.createElement("img");
    img.src = IMG[figId]; img.alt = fig.label; img.className = "figImg";
    slot.appendChild(img);
    const lbl = document.createElement("span");
    lbl.className = "figCellLabel"; lbl.textContent = fig.label;
    slot.appendChild(lbl);
  } else {
    slot.classList.add("empty");
    slot.classList.remove("correct", "wrong");
    slot.draggable = false;
    slot.removeAttribute("title");
  }
}

/* ==================== POOL ==================== */

function renderPool(diff) {
  poolDiv.innerHTML = "";
  const correctIds = [...new Set(missingFigures.map(f => f.id))];
  const allIds = POOL_IDS[diff];
  const otherIds = allIds.filter(id => !correctIds.includes(id))
                         .sort(() => Math.random() - 0.5)
                         .slice(0, Math.max(0, 6 - correctIds.length));
  const poolIds = [...correctIds, ...otherIds].sort(() => Math.random() - 0.5);

  poolIds.forEach(figId => {
    const fig = FIGURES.find(f => f.id === figId);
    const el = document.createElement("div");
    el.className = "figCell poolCell";
    el.dataset.figId = figId;
    el.draggable = true;
    el.title = fig.label;

    const img = document.createElement("img");
    img.src = IMG[figId]; img.alt = fig.label; img.className = "figImg";
    el.appendChild(img);
    const lbl = document.createElement("span");
    lbl.className = "figCellLabel"; lbl.textContent = fig.label;
    el.appendChild(lbl);

    el.addEventListener("click", () => {
      if (roundLocked) return;
      placeInFirstEmptySlot(figId);
    });
    el.addEventListener("dragstart", e => {
      if (roundLocked) { e.preventDefault(); return; }
      e.dataTransfer.setData("figId",    figId);
      e.dataTransfer.setData("fromSlot", "");
      setTimeout(() => el.classList.add("dragging"), 0);
    });
    el.addEventListener("dragend", () => el.classList.remove("dragging"));
    el.addEventListener("pointerdown", e => {
      if (roundLocked || e.pointerType === "mouse") return;
      e.preventDefault(); startTouchDrag(el, figId, null, e);
    }, { passive: false });

    poolDiv.appendChild(el);
  });

  poolDiv.addEventListener("dragover",  e => { e.preventDefault(); poolDiv.classList.add("pool-over"); });
  poolDiv.addEventListener("dragleave", () => poolDiv.classList.remove("pool-over"));
  poolDiv.addEventListener("drop", e => {
    e.preventDefault(); poolDiv.classList.remove("pool-over");
    if (roundLocked) return;
    const fromSlot = e.dataTransfer.getData("fromSlot");
    if (fromSlot !== "") returnToPool(parseInt(fromSlot));
  });
}

/* ==================== DRAG & DROP ==================== */

function placeInFirstEmptySlot(figId) {
  const firstEmptyIndex = slotContents.findIndex(value => value === null);
  if (firstEmptyIndex === -1) {
    setFeedback("Tutti gli slot sono pieni: clicca su uno slot per liberarlo.");
    return;
  }
  placeInSlot(figId, firstEmptyIndex, null);
}

function placeInSlot(figId, slotIdx, fromSlotIdx) {
  if (slotContents[slotIdx] !== null) {
    slotContents[slotIdx] = null;
  }
  if (fromSlotIdx !== null && fromSlotIdx !== undefined) {
    slotContents[fromSlotIdx] = null;
    renderSlot(fromSlotIdx);
  }
  slotContents[slotIdx] = figId;
  renderSlot(slotIdx);
}

function returnToPool(slotIdx) {
  slotContents[slotIdx] = null;
  renderSlot(slotIdx);
}

let tEl=null, tClone=null, tOX=0, tOY=0, tFrom=null, tFigId=null;

function startTouchDrag(el, figId, fromSlot, e) {
  tEl=el; tFigId=figId; tFrom=fromSlot;
  el.setPointerCapture(e.pointerId);
  const r = el.getBoundingClientRect();
  tOX=e.clientX-r.left; tOY=e.clientY-r.top;
  tClone = el.cloneNode(true);
  Object.assign(tClone.style, {
    position:"fixed", width:r.width+"px", height:r.height+"px",
    left:r.left+"px", top:r.top+"px",
    opacity:".75", pointerEvents:"none", zIndex:"9999", transition:"none"
  });
  document.body.appendChild(tClone);
  el.style.opacity = ".3";
  el.addEventListener("pointermove",   onTM,  { passive:false });
  el.addEventListener("pointerup",     onTU,  { passive:false });
  el.addEventListener("pointercancel", cleanT,{ passive:false });
}

function onTM(e) {
  e.preventDefault();
  if (tClone) { tClone.style.left=(e.clientX-tOX)+"px"; tClone.style.top=(e.clientY-tOY)+"px"; }
}

function onTU(e) {
  e.preventDefault();
  tClone?.remove(); if (tEl) tEl.style.opacity="";
  const cx=e.clientX, cy=e.clientY;
  let hit=false;
  document.querySelectorAll(".slotCell").forEach(slot => {
    const r=slot.getBoundingClientRect();
    if (cx>=r.left&&cx<=r.right&&cy>=r.top&&cy<=r.bottom) {
      placeInSlot(tFigId, parseInt(slot.dataset.slot), tFrom);
      hit=true;
    }
  });
  if (!hit && tFrom!==null) {
    const pr=poolDiv.getBoundingClientRect();
    if (cx>=pr.left&&cx<=pr.right&&cy>=pr.top&&cy<=pr.bottom) returnToPool(tFrom);
  }
  cleanT();
}

function cleanT() {
  tClone?.remove(); if (tEl) tEl.style.opacity="";
  tEl?.removeEventListener("pointermove",   onTM);
  tEl?.removeEventListener("pointerup",     onTU);
  tEl?.removeEventListener("pointercancel", cleanT);
  tEl=null; tClone=null; tFrom=null; tFigId=null;
}

/* ==================== VERIFICA ==================== */

function checkAnswer() {
  if (roundLocked) return;

  roundLocked = true;
  const is68 = currentTimeSig.unit === "68";

  /* Valore totale atteso (somma figure mancanti) */
  const expectedUnits = missingFigures.reduce((sum, fig) => {
    return sum + (is68 ? fig.val68 : fig.val);
  }, 0);

  /* Valore totale inserito (slot vuoti ignorati) */
  const insertedUnits = slotContents.reduce((sum, figId) => {
    if (!figId) return sum;
    const fig = FIGURES.find(f => f.id === figId);
    return sum + (is68 ? fig.val68 : fig.val);
  }, 0);

  /* Corretto se i valori coincidono */
  const allOk = Math.abs(insertedUnits - expectedUnits) < 0.01;

  /* Colora gli slot */
  slotContents.forEach((figId, i) => {
    const slot = document.querySelector(`.slotCell[data-slot="${i}"]`);
    if (figId) slot?.classList.add(allOk ? "correct" : "wrong");
  });

  if (allOk) {
    setFeedback("✔ Perfetto! La battuta è completa!");
  } else {
    const needed = Math.round(expectedUnits * 100) / 100;
    const got    = Math.round(insertedUnits * 100) / 100;
    const unit   = is68 ? "cromi" : "tempi";
    setFeedback(`✖ Non corretto. Servivano ${needed} ${unit}, hai inserito ${got}.`);
  }

  if (gameMode === "ranked") { handleRankedAnswer(allOk); return; }
  setTimeout(newRound, 2000);
}

function setFeedback(msg) {
  if (feedbackEl) feedbackEl.textContent = msg;
}

/* ==================== RANKED ==================== */

function handleRankedAnswer(isCorrect) {
  const session = answerRankedQuestion(isCorrect);
  updateRankedUI();
  if (session && session.isComplete()) {
    setTimeout(showRankedResults, 2000);
  } else {
    setTimeout(newRound, 2000);
  }
}

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
    gameName:"ritmo_battuta", session, saveResult:finalData.result, saved:finalData.saved
  });
  gameMode="training"; difficulty=null; roundLocked=false;
}

function startRankedClock() {
  stopRankedClock();
  if (!timerBox || !timerEl) return;
  timerBox.classList.remove("hidden"); timerEl.textContent="0";
  rankedTimerInterval = setInterval(() => {
    timerEl.textContent = String(Math.round((Date.now()-rankedStartTime)/1000));
  }, 250);
}

function stopRankedClock() {
  if (rankedTimerInterval) { clearInterval(rankedTimerInterval); rankedTimerInterval=null; }
  timerBox?.classList.add("hidden");
}
