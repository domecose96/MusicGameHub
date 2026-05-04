/* ==================== VARIABILI GLOBALI ==================== */
let difficulty = null;
let currentTarget = null;
let timerInterval = null;
let timeLeft = 5;

const menu = document.getElementById("menu");
const game = document.getElementById("game");
const questionEl = document.getElementById("question");
const feedbackEl = document.getElementById("feedback");
const answerNote = document.getElementById("answerNote");
const timerBox = document.getElementById("timerBox");
const timerEl = document.getElementById("timer");
const warning = document.getElementById("warning");
const headerModeLabel = document.getElementById("headerModeLabel");

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
function getDifficultyLabel(){
  if(difficulty === "easy") return "Facile";
  if(difficulty === "medium") return "Medio";
  if(difficulty === "hard") return "Difficile";
  return "";
}

function updateHeaderModeLabel(label = ""){
  if(!headerModeLabel) return;

  headerModeLabel.textContent = label;
  headerModeLabel.classList.toggle("hidden", !label);
}

/* ==================== MENU ==================== */
function selectButton(groupClass, element){
  document.querySelectorAll(groupClass).forEach(btn=>{
    btn.classList.remove("selected");
  });
  element.classList.add("selected");
}

function setDifficulty(level, el){
  difficulty = level;
  selectButton(".menuButton", el);
}

/* ==================== START ==================== */
function startGame(){
  if(!difficulty){
    warning.textContent = "Seleziona una difficoltà";
    return;
  }

  warning.textContent = "";

  menu.classList.add("hidden");
  game.classList.remove("hidden");

  updateHeaderModeLabel(getDifficultyLabel());
  newRound();
}

function goBack(){
  stopTimer();

  game.classList.add("hidden");
  menu.classList.remove("hidden");

  difficulty = null;
  currentTarget = null;

  document.querySelectorAll(".selected").forEach(btn=>{
    btn.classList.remove("selected");
  });

  updateHeaderModeLabel("");
  clearBoard();
  setFeedback("");
}

/* ==================== ROUND ==================== */
function newRound(){
  clearBoard();
  setFeedback("");

  let pool = [];

  if(difficulty === "easy"){
    pool = ["line1","space1","line2","space2","line3","space3","line4","space4","line5"];
  }

  if(difficulty === "medium"){
    pool = Object.keys(positions);
  }

  if(difficulty === "hard"){
    pool = Object.keys(positions);
    startTimer();
  }

  const id = pool[Math.floor(Math.random() * pool.length)];
  currentTarget = id;

  questionEl.textContent = "Clicca: " + positions[id].label;
}

/* ==================== CLICK ==================== */
zones.forEach(zone=>{
  zone.addEventListener("click", ()=>{
    if(!currentTarget) return;

    const id = zone.dataset.id;

    stopTimer();

    if(id === currentTarget){
      showCorrect();
    } else {
      showWrong();
    }

    setTimeout(newRound, 1200);
  });
});

/* ==================== FEEDBACK ==================== */
function showCorrect(){
  const pos = positions[currentTarget];

  answerNote.setAttribute("cx", 310);
  answerNote.setAttribute("cy", pos.y);
  answerNote.setAttribute("opacity", 1);

  setFeedback("✔ Corretto!");
}

function showWrong(){
  const pos = positions[currentTarget];

  answerNote.setAttribute("cx", 310);
  answerNote.setAttribute("cy", pos.y);
  answerNote.setAttribute("opacity", 1);

  setFeedback("✖ Sbagliato! Era: " + pos.label);
}

function setFeedback(msg){
  if(feedbackEl) feedbackEl.textContent = msg;
}

/* ==================== TIMER ==================== */
function startTimer(){
  stopTimer();

  timeLeft = 5;
  timerEl.textContent = timeLeft;
  timerBox.classList.remove("hidden");

  timerInterval = setInterval(()=>{
    timeLeft--;
    timerEl.textContent = timeLeft;

    if(timeLeft <= 0){
      stopTimer();
      showWrong();
      setTimeout(newRound, 1200);
    }
  },1000);
}

function stopTimer(){
  if(timerInterval){
    clearInterval(timerInterval);
    timerInterval = null;
  }

  timerBox?.classList.add("hidden");
}

/* ==================== RESET ==================== */
function clearBoard(){
  answerNote.setAttribute("opacity", 0);
}

/* ==================== HOME ==================== */
function goHome(){
  const btn = document.getElementById("homeBtn");
  btn.classList.add("selected");

  setTimeout(()=>{
    window.location.href = "index.html";
  },150);
}