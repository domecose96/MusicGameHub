const rhythmValues = [
  { id: "semibreve", label: "Semibreve", beats: 4, img: "img/semibreve.png" },
  { id: "minima", label: "Minima", beats: 2, img: "img/minima.png" },
  { id: "semiminima", label: "Semiminima", beats: 1, img: "img/semiminima.png" },
  { id: "croma", label: "Croma", beats: 0.5, img: "img/croma.png" },
  { id: "pausa_semibreve", label: "Pausa di semibreve", beats: 4, img: "img/pausa_semibreve.png" },
  { id: "pausa_minima", label: "Pausa di minima", beats: 2, img: "img/pausa_minima.png" },
  { id: "pausa_semiminima", label: "Pausa di semiminima", beats: 1, img: "img/pausa_semiminima.png" },
  { id: "pausa_croma", label: "Pausa di croma", beats: 0.5, img: "img/pausa_croma.png" }
];

const difficultyConfig = {
  easy: { length: 2, pool: ["semibreve", "minima", "semiminima"] },
  medium: { length: 3, pool: ["semibreve", "minima", "semiminima", "croma", "pausa_minima", "pausa_semiminima"] },
  hard: { length: 4, pool: ["semibreve", "minima", "semiminima", "croma", "pausa_semibreve", "pausa_minima", "pausa_semiminima", "pausa_croma"] }
};

let difficulty = null;
let currentTotal = 0;

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
  warning.textContent = "";

  MGH.selectExclusive("#menu .menuButton", button);
}

function startGame() {
  if (!difficulty) {
    warning.textContent = "Seleziona una difficoltà prima di iniziare.";
    return;
  }

  menu.classList.add("hidden");
  game.classList.remove("hidden");

  updateHeaderModeLabel(getDifficultyLabel());
  nextRound();
}

function nextRound() {
  const config = difficultyConfig[difficulty];
  const figures = [];

  for (let i = 0; i < config.length; i++) {
    const randomId = config.pool[Math.floor(Math.random() * config.pool.length)];
    figures.push(rhythmValues.find(item => item.id === randomId));
  }

  currentTotal = figures.reduce((sum, figure) => sum + figure.beats, 0);
  renderSequence(figures);
  renderAnswers(currentTotal);
  infoEl.textContent = "";
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

  if (selected === currentTotal) {
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

  setTimeout(() => {
    nextRound();
  }, 1200);
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
  currentTotal = 0;

  updateHeaderModeLabel("");
}
