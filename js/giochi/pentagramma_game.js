/* ==================== VARIABILI GLOBALI ==================== */
let difficulty = null;
let gameMode = "training";
let currentTarget = null;
let timerInterval = null;
let timeLeft = 5;
let questionStartTime = null;

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

function updateHeaderModeLabel(label = "") {
  MGH.updateHeaderModeLabel(label);
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

  menu.classList.add("hidden");
  game.classList.remove("hidden");

  hideLeaderboardButton();
  showBackButton();

  updateHeaderModeLabel(getDifficultyLabel());

  hideRankedUI();
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

  menu.classList.add("hidden");
  game.classList.remove("hidden");

  hideLeaderboardButton();
  hideBackButton();

  updateHeaderModeLabel("Classificata");

  showRankedUI();
  updateRankedUI();

  newRound();
}

function goBack() {
  if (gameMode === "ranked") return;

  stopTimer();

  game.classList.add("hidden");
  menu.classList.remove("hidden");

  showLeaderboardButton();
  showBackButton();

  difficulty = null;
  gameMode = "training";
  currentTarget = null;
  questionStartTime = null;

  if (typeof resetRankedMode === "function") {
    resetRankedMode();
  }

  document.querySelectorAll(".selected").forEach(btn => {
    btn.classList.remove("selected");
  });

  updateHeaderModeLabel("");
  clearBoard();
  setFeedback("");
  hideRankedUI();
}

/* ==================== ROUND ==================== */
function newRound() {
  clearBoard();
  setFeedback("");
  stopTimer();

  let pool = [];

  if (gameMode === "ranked") {
    const rankedDifficulty = getRankedDifficulty();

    if (rankedDifficulty === "easy") {
      pool = ["line1", "space1", "line2", "space2", "line3", "space3", "line4", "space4", "line5"];
    }

    if (rankedDifficulty === "medium") {
      pool = Object.keys(positions).filter(id => !id.includes("ledger"));
    }

    if (rankedDifficulty === "hard") {
      pool = Object.keys(positions);
    }

    startTimer(5);
    startRankedQuestionTimer();
    updateRankedUI();
  }

  if (gameMode === "training") {
    if (difficulty === "easy") {
      pool = ["line1", "space1", "line2", "space2", "line3", "space3", "line4", "space4", "line5"];
    }

    if (difficulty === "medium") {
      pool = Object.keys(positions);
    }

    if (difficulty === "hard") {
      pool = Object.keys(positions);
      startTimer(5);
    }
  }

  const id = pool[Math.floor(Math.random() * pool.length)];
  currentTarget = id;
  questionStartTime = Date.now();

  questionEl.textContent = "Clicca: " + positions[id].label;
}

/* ==================== CLICK ==================== */
zones.forEach(zone => {
  zone.addEventListener("click", () => {
    if (!currentTarget) return;

    const id = zone.dataset.id;
    const isCorrect = id === currentTarget;

    stopTimer();

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

function showRankedUI() {
  const rankedUI = document.getElementById("rankedUI");
  if (rankedUI) rankedUI.classList.remove("hidden");
}

function hideRankedUI() {
  const rankedUI = document.getElementById("rankedUI");
  if (rankedUI) rankedUI.classList.add("hidden");
}

function hideLeaderboardButton() {
  document.getElementById("rankedLeaderboardBtn")?.classList.add("hidden");
}

function showLeaderboardButton() {
  document.getElementById("rankedLeaderboardBtn")?.classList.remove("hidden");
}

function hideBackButton() {
  document.getElementById("backButton")?.classList.add("hidden");
}

function showBackButton() {
  document.getElementById("backButton")?.classList.remove("hidden");
}

function updateRankedUI() {
  if (!currentRankedSession) return;

  const scoreEl = document.getElementById("rankedScore");
  const counterEl = document.getElementById("rankedQuestionCounter");
  const fillEl = document.getElementById("rankedProgressFill");

  if (scoreEl) {
    scoreEl.textContent = currentRankedSession.totalScore;
  }

  if (counterEl) {
    const current = Math.min(
      currentRankedSession.currentQuestion + 1,
      currentRankedSession.maxQuestions
    );

    counterEl.textContent = `${current}/${currentRankedSession.maxQuestions}`;
  }

  if (fillEl) {
    const progress =
      (currentRankedSession.currentQuestion / currentRankedSession.maxQuestions) * 100;

    fillEl.style.width = `${progress}%`;
  }
}

async function showRankedResults() {
  stopTimer();

  const finalData = await finishRankedMode();

  if (!finalData || !finalData.session) {
    setFeedback("Errore nel salvataggio della classificata.");
    return;
  }

  const session = finalData.session;

  game.classList.add("hidden");
  menu.classList.remove("hidden");
  hideRankedUI();

  showLeaderboardButton();
  showBackButton();

  warning.innerHTML =
    `Classificata completata! ` +
    `Punteggio: <strong>${session.totalScore}</strong> · ` +
    `Corrette: <strong>${session.correct}/${session.maxQuestions}</strong> · ` +
    `Accuratezza: <strong>${session.accuracy}%</strong>`;

  updateHeaderModeLabel("");

  document.querySelectorAll(".selected").forEach(btn => {
    btn.classList.remove("selected");
  });

  gameMode = "training";
  difficulty = null;
  currentTarget = null;
}

/* ==================== FEEDBACK ==================== */
function showCorrect() {
  const pos = positions[currentTarget];

  answerNote.setAttribute("cx", 310);
  answerNote.setAttribute("cy", pos.y);
  answerNote.setAttribute("opacity", 1);

  setFeedback("✔ Corretto!");
}

function showWrong() {
  const pos = positions[currentTarget];

  answerNote.setAttribute("cx", 310);
  answerNote.setAttribute("cy", pos.y);
  answerNote.setAttribute("opacity", 1);

  setFeedback("✖ Sbagliato! Era: " + pos.label);
}

function showTimeExpired() {
  const pos = positions[currentTarget];

  answerNote.setAttribute("cx", 310);
  answerNote.setAttribute("cy", pos.y);
  answerNote.setAttribute("opacity", 1);

  setFeedback("⏱ Tempo scaduto! La risposta corretta era: " + pos.label);
}

function setFeedback(msg) {
  if (feedbackEl) feedbackEl.textContent = msg;
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

      if (!currentTarget) return;

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

/* ==================== RESET ==================== */
function clearBoard() {
  answerNote.setAttribute("opacity", 0);
}
