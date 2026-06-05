const rhythmValues = [
  { id: "semibreve", label: "Semibreve", beats: 4, img: "../img/semibreve.webp" },
  { id: "minima", label: "Minima", beats: 2, img: "../img/minima.webp" },
  { id: "semiminima", label: "Semiminima", beats: 1, img: "../img/semiminima.webp" },
  { id: "croma", label: "Croma", beats: 0.5, img: "../img/croma.webp" },
  { id: "pausa_semibreve", label: "Pausa di semibreve", beats: 4, img: "../img/pausa_semibreve.webp" },
  { id: "pausa_minima", label: "Pausa di minima", beats: 2, img: "../img/pausa_minima.webp" },
  { id: "pausa_semiminima", label: "Pausa di semiminima", beats: 1, img: "../img/pausa_semiminima.webp" },
  { id: "pausa_croma", label: "Pausa di croma", beats: 0.5, img: "../img/pausa_croma.webp" }
];

const difficultyConfig = {
  easy: { length: 2, pool: ["semibreve", "minima", "semiminima"] },
  medium: { length: 3, pool: ["semibreve", "minima", "semiminima", "croma", "pausa_minima", "pausa_semiminima"] },
  hard: { length: 4, pool: ["semibreve", "minima", "semiminima", "croma", "pausa_semibreve", "pausa_minima", "pausa_semiminima", "pausa_croma"] }
};

let difficulty = null;
let gameMode = "training";
let currentTotal = 0;
let rankedTimerInterval = null;
let rankedElapsed = 0;

const menu = document.getElementById("menu");
const game = document.getElementById("game");
const warning = document.getElementById("warning");
const sequenceEl = document.getElementById("rhythmSequence");
const answersEl = document.getElementById("answers");
const infoEl = document.getElementById("rhythmInfo");

MGHGameUI.ensureRankedHUD();

function getDifficultyLabel(){
  if(difficulty === "easy") return "Facile";
  if(difficulty === "medium") return "Medio";
  if(difficulty === "hard") return "Difficile";
  return "";
}

function updateHeaderModeLabel(label = ""){
  MGHGameUI.setHeader(label);
}

function setDifficulty(level, button) {
  difficulty = level;
  gameMode = "training";
  MGHGameUI.setWarning(warning, "");

  MGH.selectExclusive("#menu .menuButton", button);
}

function selectRankedMode(button) {
  difficulty = null;
  gameMode = "ranked";
  MGHGameUI.setWarning(warning, "");
  MGH.selectExclusive("#menu .menuButton", button);
}

function startGame() {
  if (gameMode === "ranked") {
    showRankedIntro({
      gameName: "ritmo",
      title: "Modalità Classificata",
      text: "Risolvi 10 sequenze di figure. La difficoltà cresce e il punteggio premia velocità e precisione.",
      onStart: startRankedGame
    });
    return;
  }

  if (!difficulty) {
    MGHGameUI.setWarning(warning, "Seleziona una difficoltà prima di iniziare.");
    return;
  }

  MGHGameUI.enterTraining({ menu, game, modeLabel: getDifficultyLabel(), feedbackEl: infoEl });
  stopRankedTimer();
  nextRound();
}

function startRankedGame() {
  MGHGameUI.setWarning(warning, "");
  const rankedSession = startRankedMode("ritmo");
  MGHGameUI.enterRanked({
    menu,
    game,
    score: rankedSession.totalScore,
    current: rankedSession.currentQuestion,
    total: rankedSession.maxQuestions,
    feedbackEl: infoEl
  });
  startRankedElapsedTimer();
  nextRound();
}

function nextRound() {
  const activeDifficulty = gameMode === "ranked" ? getRankedDifficulty() : difficulty;
  const config = difficultyConfig[activeDifficulty];
  const figures = [];

  for (let i = 0; i < config.length; i++) {
    const randomId = pickRandomNoRepeat(config.pool, { namespace: `ritmo-piece-${i}` });
    figures.push(rhythmValues.find(item => item.id === randomId));
  }

  currentTotal = figures.reduce((sum, figure) => sum + figure.beats, 0);
  renderSequence(figures);
  renderAnswers(currentTotal);
  MGHGameUI.clearFeedback(infoEl);
  if (gameMode === "ranked") startRankedQuestionTimer();
}

function renderSequence(figures) {
  sequenceEl.innerHTML = "";

  figures.forEach(figure => {
    const card = document.createElement("div");
    card.className = "rhythmCard";

    const img = document.createElement("img");
    img.src = figure.img;
    img.alt = figure.label;

    card.appendChild(img);
    sequenceEl.appendChild(card);
  });
}

function renderAnswers(correctTotal) {
  answersEl.innerHTML = "";

  const options = new Set([correctTotal]);
  const offsets = [-2, -1, -0.5, 0.5, 1, 2];

  while (options.size < 4) {
    const offset = pickRandomNoRepeat(offsets, { namespace: "ritmo-answer-offset" });
    const candidate = Number((correctTotal + offset).toFixed(1));
    if (candidate > 0) options.add(candidate);
  }

  Array.from(options)
    .sort(() => Math.random() - 0.5)
    .forEach(option => {
      const button = document.createElement("button");
      button.className = "noteButton gameAnswerButton";
      button.textContent = formatBeats(option);
      button.onclick = () => checkAnswer(option, button);
      answersEl.appendChild(button);
    });
}

function checkAnswer(selected, button) {
  const buttons = document.querySelectorAll("#answers .noteButton");

  buttons.forEach(btn => {
    btn.style.pointerEvents = "none";
    btn.classList.remove("correct", "wrong");
  });

  const isCorrect = selected === currentTotal;

  if (isCorrect) {
    button.classList.add("correct");
    MGH.setGameFeedback(infoEl, MGH.getAnswerFeedback(true, "Nuova sequenza in arrivo."), "correct");
  } else {
    button.classList.add("wrong");
    MGH.setGameFeedback(infoEl, MGH.getAnswerFeedback(false, `Il totale corretto era ${formatBeats(currentTotal)}.`), "wrong");

    buttons.forEach(btn => {
      if (btn.textContent === formatBeats(currentTotal)) {
        btn.classList.add("correct");
      }
    });
  }

  if (gameMode === "ranked") {
    handleRankedAnswer(isCorrect);
    return;
  }

  setTimeout(() => {
    nextRound();
  }, 1200);
}

function handleRankedAnswer(isCorrect) {
  const rankedSession = answerRankedQuestion(isCorrect);
  if (!rankedSession) return;

  updateRankedProgressUI({
    score: rankedSession.totalScore,
    current: rankedSession.currentQuestion,
    total: rankedSession.maxQuestions
  });

  setTimeout(async () => {
    if (rankedSession.isComplete()) {
      await finishRankedGame();
    } else {
      nextRound();
    }
  }, 1200);
}

async function finishRankedGame() {
  stopRankedTimer();
  const finalData = await finishRankedMode();
  if (!finalData) return;

  MGHGameUI.returnToMenu({ menu, game, feedbackEl: infoEl });
  MGHGameUI.setWarning(warning, "");
  await showRankedCompletionModal({
    gameName: "ritmo",
    session: finalData.session,
    saveResult: finalData.result,
    saved: finalData.saved
  });
  resetRankedMode();
  gameMode = "training";
  difficulty = null;
}

function formatBeats(value) {
  return Number.isInteger(value) ? `${value} tempi` : `${value} tempo`;
}

function goBack() {
  if (gameMode === "ranked") return;

  stopRankedTimer();
  MGHGameUI.returnToMenu({ menu, game, feedbackEl: infoEl });
  answersEl.innerHTML = "";
  sequenceEl.innerHTML = "";

  difficulty = null;
  gameMode = "training";
  currentTotal = 0;
}

function startRankedElapsedTimer() {
  stopRankedTimer();
  rankedElapsed = 0;

  const timerBox = document.getElementById("timerBox");
  const timerEl = document.getElementById("timer");

  timerBox?.classList.remove("hidden");
  if (timerEl) timerEl.textContent = "0";

  rankedTimerInterval = window.setInterval(() => {
    rankedElapsed++;
    if (timerEl) timerEl.textContent = rankedElapsed;
  }, 1000);
}

function stopRankedTimer() {
  if (rankedTimerInterval) {
    window.clearInterval(rankedTimerInterval);
    rankedTimerInterval = null;
  }

  document.getElementById("timerBox")?.classList.add("hidden");
}
