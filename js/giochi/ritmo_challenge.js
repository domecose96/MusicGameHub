const rhythmValues = [
  { id: "semibreve", label: "Semibreve", beats: 4, img: "../img/semibreve.png" },
  { id: "minima", label: "Minima", beats: 2, img: "../img/minima.png" },
  { id: "semiminima", label: "Semiminima", beats: 1, img: "../img/semiminima.png" },
  { id: "croma", label: "Croma", beats: 0.5, img: "../img/croma.png" },
  { id: "pausa_semibreve", label: "Pausa di semibreve", beats: 4, img: "../img/pausa_semibreve.png" },
  { id: "pausa_minima", label: "Pausa di minima", beats: 2, img: "../img/pausa_minima.png" },
  { id: "pausa_semiminima", label: "Pausa di semiminima", beats: 1, img: "../img/pausa_semiminima.png" },
  { id: "pausa_croma", label: "Pausa di croma", beats: 0.5, img: "../img/pausa_croma.png" }
];

const difficultyConfig = {
  easy: { length: 2, pool: ["semibreve", "minima", "semiminima"] },
  medium: { length: 3, pool: ["semibreve", "minima", "semiminima", "croma", "pausa_minima", "pausa_semiminima"] },
  hard: { length: 4, pool: ["semibreve", "minima", "semiminima", "croma", "pausa_semibreve", "pausa_minima", "pausa_semiminima", "pausa_croma"] }
};

let difficulty = null;
let gameMode = "training";
let currentTotal = 0;
let rankedCorrect = 0;
let rankedWrong = 0;
let rankedScore = 0;
let rankedQuestionIndex = 0;
let rankedStartTime = 0;
let rankedQuestionStart = 0;

const menu = document.getElementById("menu");
const game = document.getElementById("game");
const warning = document.getElementById("warning");
const sequenceEl = document.getElementById("rhythmSequence");
const answersEl = document.getElementById("answers");
const infoEl = document.getElementById("rhythmInfo");
const headerModeLabel = document.getElementById("headerModeLabel");

function getDifficultyLabel(){
  if(difficulty === "easy") return "Facile";
  if(difficulty === "medium") return "Medio";
  if(difficulty === "hard") return "Difficile";
  return "";
}

function updateHeaderModeLabel(label = ""){
  MGH.updateHeaderModeLabel(label);
}

function setDifficulty(level, button) {
  difficulty = level;
  gameMode = "training";
  warning.textContent = "";

  MGH.selectExclusive("#menu .menuButton", button);
}

function selectRankedMode(button) {
  difficulty = null;
  gameMode = "ranked";
  warning.textContent = "";
  MGH.selectExclusive("#menu .menuButton", button);
}

function startGame() {
  if (gameMode === "ranked") {
    showRankedIntro({
      gameName: "ritmo",
      title: "Modalità Classificata",
      text: "Risolvi 10 sequenze ritmiche. La difficoltà cresce e il punteggio premia velocità e precisione.",
      onStart: startRankedGame
    });
    return;
  }

  if (!difficulty) {
    warning.textContent = "Seleziona una difficoltà prima di iniziare.";
    return;
  }

  menu.classList.add("hidden");
  game.classList.remove("hidden");
  hideLeaderboardButton();
  hideRankedUI();

  updateHeaderModeLabel(getDifficultyLabel());
  nextRound();
}

function startRankedGame() {
  warning.textContent = "";
  rankedCorrect = 0;
  rankedWrong = 0;
  rankedScore = 0;
  rankedQuestionIndex = 0;
  rankedStartTime = Date.now();

  menu.classList.add("hidden");
  game.classList.remove("hidden");
  hideLeaderboardButton();
  showRankedUI();
  updateHeaderModeLabel("Classificata");
  updateRankedProgressUI({ score: rankedScore, current: rankedQuestionIndex, total: RANKED_DEFAULT_QUESTIONS });
  nextRound();
}

function nextRound() {
  const activeDifficulty = gameMode === "ranked" ? getRankedRhythmDifficulty() : difficulty;
  const config = difficultyConfig[activeDifficulty];
  const figures = [];

  for (let i = 0; i < config.length; i++) {
    const randomId = config.pool[Math.floor(Math.random() * config.pool.length)];
    figures.push(rhythmValues.find(item => item.id === randomId));
  }

  currentTotal = figures.reduce((sum, figure) => sum + figure.beats, 0);
  renderSequence(figures);
  renderAnswers(currentTotal);
  infoEl.textContent = "";
  rankedQuestionStart = Date.now();
}

function getRankedRhythmDifficulty() {
  if (rankedQuestionIndex < 3) return "easy";
  if (rankedQuestionIndex < 7) return "medium";
  return "hard";
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
    const offset = offsets[Math.floor(Math.random() * offsets.length)];
    const candidate = Number((correctTotal + offset).toFixed(1));
    if (candidate > 0) options.add(candidate);
  }

  Array.from(options)
    .sort(() => Math.random() - 0.5)
    .forEach(option => {
      const button = document.createElement("button");
      button.className = "noteButton";
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
    infoEl.textContent = "Giusto! Nuova sequenza in arrivo...";
  } else {
    button.classList.add("wrong");
    infoEl.textContent = `Quasi! Il totale corretto era ${formatBeats(currentTotal)}.`;

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
  const elapsed = (Date.now() - rankedQuestionStart) / 1000;

  if (isCorrect) {
    rankedCorrect++;
    rankedScore += elapsed <= 3 ? 125 : elapsed <= 7 ? 110 : 100;
  } else {
    rankedWrong++;
  }

  rankedQuestionIndex++;
  updateRankedProgressUI({ score: rankedScore, current: rankedQuestionIndex, total: RANKED_DEFAULT_QUESTIONS });

  setTimeout(async () => {
    if (rankedQuestionIndex >= RANKED_DEFAULT_QUESTIONS) {
      await finishRankedGame();
    } else {
      nextRound();
    }
  }, 1200);
}

async function finishRankedGame() {
  const totalTime = Math.round((Date.now() - rankedStartTime) / 1000);
  const saved = await saveRankedScore({
    gameName: "ritmo",
    totalScore: rankedScore,
    correct: rankedCorrect,
    wrong: rankedWrong,
    totalQuestions: RANKED_DEFAULT_QUESTIONS,
    totalTime
  });

  game.classList.add("hidden");
  menu.classList.remove("hidden");
  hideRankedUI();
  showLeaderboardButton();
  updateHeaderModeLabel("");
  warning.innerHTML = `Classificata completata! Punteggio: <strong>${Math.round(rankedScore)}</strong> · Corrette: <strong>${rankedCorrect}/${RANKED_DEFAULT_QUESTIONS}</strong>${saved ? "" : " · salvataggio non riuscito"}`;
  document.querySelectorAll(".selected").forEach(btn => btn.classList.remove("selected"));
  gameMode = "training";
  difficulty = null;
}

function formatBeats(value) {
  return Number.isInteger(value) ? `${value} tempi` : `${value} tempo`;
}

function goBack() {
  game.classList.add("hidden");
  menu.classList.remove("hidden");

  infoEl.textContent = "";
  answersEl.innerHTML = "";
  sequenceEl.innerHTML = "";

  document.querySelectorAll(".selected").forEach(btn => {
    btn.classList.remove("selected");
  });

  difficulty = null;
  gameMode = "training";
  currentTotal = 0;

  updateHeaderModeLabel("");
  hideRankedUI();
  showLeaderboardButton();
}
