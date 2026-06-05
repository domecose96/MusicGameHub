/* ==================== VARIABILI GLOBALI ==================== */
let difficulty = null;
let gameMode = "training";
let currentTarget = null;
let timerInterval = null;
let rankedClockInterval = null;
let timeLeft = 5;
let questionStartTime = null;
let roundLocked = false;

MGHGameUI.ensureRankedHUD();

const menu = document.getElementById("menu");
const game = document.getElementById("game");
const questionEl = document.getElementById("question");
const feedbackEl = document.getElementById("feedback");
const answerNote = document.getElementById("answerNote");
const timerBox = document.getElementById("timerBox");
const timerEl = document.getElementById("timer");
const warning = document.getElementById("warning");

const zones = document.querySelectorAll(".hitZone");

/* ==================== POSIZIONI ==================== */
const positions = {
  line1: { label: "1ª riga", y: 160 },
  space1: { label: "1º spazio", y: 150 },
  line2: { label: "2ª riga", y: 140 },
  space2: { label: "2º spazio", y: 130 },
  line3: { label: "3ª riga", y: 120 },
  space3: { label: "3º spazio", y: 110 },
  line4: { label: "4ª riga", y: 100 },
  space4: { label: "4º spazio", y: 90 },
  line5: { label: "5ª riga", y: 80 },

  spaceTop1: { label: "spazio sopra il pentagramma", y: 70 },
  ledgerTop1: { label: "1° taglio addizionale sopra", y: 60 },
  spaceTop2: { label: "spazio sopra il 1° taglio addizionale", y: 50 },
  ledgerTop2: { label: "2° taglio addizionale sopra", y: 40 },

  spaceBottom1: { label: "spazio sotto il pentagramma", y: 170 },
  ledgerBottom1: { label: "1° taglio addizionale sotto", y: 180 },
  spaceBottom2: { label: "spazio sotto il 1° taglio addizionale", y: 190 },
  ledgerBottom2: { label: "2° taglio addizionale sotto", y: 200 }
};

/* ==================== HEADER MODE ==================== */
function getDifficultyLabel() {
  if (difficulty === "easy") return "Facile";
  if (difficulty === "medium") return "Medio";
  if (difficulty === "hard") return "Difficile";
  return "";
}

/* ==================== MENU ==================== */
function selectButton(groupClass, element) {
  MGH.selectExclusive(groupClass, element);
}

function setDifficulty(level, el) {
  difficulty = level;
  gameMode = "training";
  selectButton(".menuButton", el);
}

function selectMode(el, mode) {
  if (mode === "ranked") {
    gameMode = "ranked";
    difficulty = null;
    selectButton(".menuButton", el);
  }
}

/* ==================== START ==================== */
function startGame() {
  if (gameMode === "ranked") {
    showRankedIntro({
      gameName: "pentagramma",
      title: "Modalità Classificata",
      text: "Orientati sul pentagramma per 10 domande. La difficoltà cresce durante la partita e il punteggio premia velocità e precisione.",
      onStart: startRankedGame
    });
    return;
  }

  if (!difficulty) {
    warning.textContent = "Seleziona una difficoltà";
    return;
  }

  warning.textContent = "";

  showBackButton();
  MGHGameUI.enterTraining({ menu, game, modeLabel: getDifficultyLabel(), feedbackEl });
  newRound();
}

function startRankedGame(nickname = "") {
  warning.textContent = "";

  if (typeof startRankedMode !== "function") {
    warning.textContent = "Errore: ranked.js non è stato caricato.";
    return;
  }

  const rankedSession = startRankedMode("pentagramma");
  rankedSession.setUsername(nickname);

  hideBackButton();
  startRankedClock();
  MGHGameUI.enterRanked({ menu, game, feedbackEl });
  updateRankedUI();

  newRound();
}

function goBack() {
  if (gameMode === "ranked") return;

  stopTimer();
  stopRankedClock();

  showBackButton();

  difficulty = null;
  gameMode = "training";
  currentTarget = null;
  questionStartTime = null;
  roundLocked = false;

  if (typeof resetRankedMode === "function") {
    resetRankedMode();
  }

  clearBoard();
  MGHGameUI.returnToMenu({ menu, game, feedbackEl });
}

/* ==================== ROUND ==================== */
function newRound() {
  clearBoard();
  setFeedback("");
  roundLocked = false;
  if (gameMode !== "ranked") {
    stopTimer();
  }

  let pool = [];

  if (gameMode === "ranked") {
    const rankedDifficulty = getRankedDifficulty();

    if (rankedDifficulty === "easy") {
      pool = ["line1", "space1", "line2", "space2", "line3", "space3", "line4", "space4", "line5"];
    }

    if (rankedDifficulty === "medium") {
      pool = [
        "spaceTop1",
        "ledgerTop1",
        "spaceTop2",
        "ledgerTop2",
        "spaceBottom1",
        "ledgerBottom1",
        "spaceBottom2",
        "ledgerBottom2"
      ];
    }

    if (rankedDifficulty === "hard") {
      pool = Object.keys(positions);
    }

    startRankedQuestionTimer();
    updateRankedUI();
  }

  if (gameMode === "training") {
    if (difficulty === "easy") {
      pool = ["line1", "space1", "line2", "space2", "line3", "space3", "line4", "space4", "line5"];
    }

    if (difficulty === "medium") {
      pool = [
        "spaceTop1",
        "ledgerTop1",
        "spaceTop2",
        "ledgerTop2",
        "spaceBottom1",
        "ledgerBottom1",
        "spaceBottom2",
        "ledgerBottom2"
      ];
    }

    if (difficulty === "hard") {
      pool = Object.keys(positions);
      startTimer(5);
    }
  }

  const id = pickRandomNoRepeat(pool, { namespace: "pentagramma-question" });
  currentTarget = id;
  questionStartTime = Date.now();

  questionEl.textContent = "Clicca: " + positions[id].label;
}

/* ==================== CLICK ==================== */
zones.forEach(zone => {
  zone.addEventListener("click", () => {
    if (!currentTarget || roundLocked) return;
    roundLocked = true;

    const id = zone.dataset.id;
    const isCorrect = id === currentTarget;

    if (gameMode !== "ranked") {
      stopTimer();
    }

    if (isCorrect) {
      showCorrect();
    } else {
      showWrong();
    }

    if (gameMode === "ranked") {
      handleRankedAnswer(isCorrect);
      return;
    }

    setTimeout(newRound, 1200);
  });
});

/* ==================== RANKED ==================== */
function handleRankedAnswer(isCorrect) {
  const session = answerRankedQuestion(isCorrect);

  updateRankedUI();

  if (session && session.isComplete()) {
    setTimeout(showRankedResults, 1200);
  } else {
    setTimeout(newRound, 1200);
  }
}

function hideBackButton() {
  document.getElementById("backButton")?.classList.add("hidden");
}

function showBackButton() {
  document.getElementById("backButton")?.classList.remove("hidden");
}

function updateRankedUI() {
  if (!currentRankedSession) return;

  updateRankedProgressUI({
    score: currentRankedSession.totalScore,
    current: currentRankedSession.currentQuestion,
    total: currentRankedSession.maxQuestions
  });
}

async function showRankedResults() {
  stopTimer();
  stopRankedClock();

  const finalData = await finishRankedMode();

  if (!finalData || !finalData.session) {
    setFeedback("Errore nel salvataggio della classificata.");
    return;
  }

  const session = finalData.session;

  showBackButton();

  warning.textContent = "";
  MGHGameUI.returnToMenu({ menu, game, feedbackEl });
  await showRankedCompletionModal({
    gameName: "pentagramma",
    session,
    saveResult: finalData.result,
    saved: finalData.saved
  });

  gameMode = "training";
  difficulty = null;
  currentTarget = null;
  roundLocked = false;
}

/* ==================== FEEDBACK ==================== */
function showCorrect() {
  const pos = positions[currentTarget];

  answerNote.setAttribute("cx", 310);
  answerNote.setAttribute("cy", pos.y);
  answerNote.setAttribute("opacity", 1);

  setFeedback(MGH.getAnswerFeedback(true), "correct");
}

function showWrong() {
  const pos = positions[currentTarget];

  answerNote.setAttribute("cx", 310);
  answerNote.setAttribute("cy", pos.y);
  answerNote.setAttribute("opacity", 1);

  setFeedback(MGH.getAnswerFeedback(false, "La risposta corretta era " + pos.label + "."), "wrong");
}

function showTimeExpired() {
  const pos = positions[currentTarget];

  answerNote.setAttribute("cx", 310);
  answerNote.setAttribute("cy", pos.y);
  answerNote.setAttribute("opacity", 1);

  setFeedback("Tempo scaduto. La risposta corretta era " + pos.label + ".", "wrong");
}

function setFeedback(msg, state = "neutral") {
  MGH.setGameFeedback(feedbackEl, msg, state);
}

/* ==================== TIMER ==================== */
function startTimer(duration = 5) {
  stopTimer();

  timeLeft = duration;
  timerEl.textContent = timeLeft;
  timerBox.classList.remove("hidden");

  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      stopTimer();

      if (!currentTarget || roundLocked) return;
      roundLocked = true;

      showTimeExpired();

      if (gameMode === "ranked") {
        handleRankedAnswer(false);
      } else {
        setTimeout(newRound, 1200);
      }
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  timerBox?.classList.add("hidden");
}

function startRankedClock() {
  stopRankedClock();
  if (!timerBox || !timerEl || !currentRankedSession) return;

  timerBox.classList.remove("hidden");
  timerEl.textContent = "0";

  rankedClockInterval = setInterval(() => {
    timerEl.textContent = String(Math.round((Date.now() - currentRankedSession.startTime) / 1000));
  }, 250);
}

function stopRankedClock() {
  if (rankedClockInterval) {
    clearInterval(rankedClockInterval);
    rankedClockInterval = null;
  }

  if (gameMode === "ranked") {
    timerBox?.classList.add("hidden");
  }
}

/* ==================== RESET ==================== */
function clearBoard() {
  answerNote.setAttribute("opacity", 0);
}
