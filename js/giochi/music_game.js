/* ==================== VARIABILI GLOBALI ==================== */
let difficulty = null;
let clef = null;
let currentNote;
let gameMode = "training";
let rankedCorrect = 0;
let rankedWrong = 0;
let rankedScore = 0;
let rankedQuestionIndex = 0;
let rankedStartTime = 0;
let rankedQuestionStart = 0;

const noteElement = document.getElementById("note");
const ledgerGroup = document.getElementById("ledgerLines");
const buttonsDiv = document.getElementById("buttons");
const clefSymbol = document.getElementById("clefSymbol");
const feedbackEl = document.getElementById("feedback");
const warning = document.getElementById("warning");
const menu = document.getElementById("menu");
const game = document.getElementById("game");

const buttonNames = ["Do","Re","Mi","Fa","Sol","La","Si"];

/* ==================== CREAZIONE BOTTONI NOTE ==================== */
buttonNames.forEach(name=>{
  const btn = document.createElement("button");
  btn.innerText = name;
  btn.classList.add("noteButton");
  btn.onclick = () => checkAnswer(name, btn);
  buttonsDiv.appendChild(btn);
});

/* ==================== FUNZIONI MENU ==================== */
function selectButton(groupClass, element){
  MGH.selectExclusive(groupClass, element);
}

function setDifficulty(level, el){
  difficulty = level;
  gameMode = "training";
  warning.textContent = "";
  selectButton(".menuButton", el);
}

function selectRankedMode(el){
  difficulty = null;
  gameMode = "ranked";
  warning.textContent = "";
  selectButton(".menuButton", el);
}

// gestione chiave separata per calibrare posizione e grandezza
function setClef(type, el){
  clef = type;
  warning.textContent = "";
  let clefChar, posY, fontSize;
  if(type === "treble"){
    clefChar = "𝄞";
    posY = 145;   // posizione verticale chiave violino
    fontSize = 95; // grandezza chiave violino
  } else { // basso
    clefChar = "𝄢";
    posY = 139;   // posizione verticale chiave basso
    fontSize = 65; // grandezza chiave basso
  }
  clefSymbol.textContent = clefChar;
  clefSymbol.setAttribute("y", posY);
  clefSymbol.setAttribute("font-size", fontSize);
  selectButton(".symbolButton", el);
}

function startGame(){
  if(gameMode === "ranked"){
    if(!clef){
      warning.textContent = "Seleziona una chiave prima di iniziare la classificata";
      return;
    }

    showRankedIntro({
      gameName: "note",
      title: "Modalità Classificata",
      text: "Indovina 10 note. La difficoltà cresce durante la partita e il punteggio premia velocità e precisione.",
      onStart: startRankedGame
    });
    return;
  }

  if(!difficulty || !clef){
    warning.textContent = "Seleziona modalità e chiave prima di iniziare";
    return;
  }
  warning.textContent = "";
  menu.classList.add("hidden");
  game.classList.remove("hidden");
  hideRankedUI();
  hideLeaderboardButton();
  MGH.updateHeaderModeLabel(difficulty === "easy" ? "Facile" : "Difficile");
  newNote();
}

function startRankedGame(){
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
  MGH.updateHeaderModeLabel("Classificata");
  updateRankedProgressUI({ score: rankedScore, current: rankedQuestionIndex, total: RANKED_DEFAULT_QUESTIONS });
  newNote();
}

function goBack(){

  game.classList.add("hidden");
  menu.classList.remove("hidden");

  difficulty = null;
  clef = null;
  gameMode = "training";
  rankedQuestionIndex = 0;

  document.querySelectorAll(".selected").forEach(btn=>{
    btn.classList.remove("selected");
  });

  resetButtons();
  hideRankedUI();
  showLeaderboardButton();
  MGH.updateHeaderModeLabel("");
}


/* ==================== NOTE ==================== */
function getNotes(){
  const positionsEasy = [140,135,130,125,120,115,110,105,100]; // facile
  const positionsHard = [165,160,155,150,145,140,135,130,125,120,115,110,105,100,95,90,85,80]; // difficile

  const rankedDifficulty = gameMode === "ranked" ? getRankedDifficultyForNoteGame() : null;
  const activeDifficulty = rankedDifficulty || difficulty;
  const positions = activeDifficulty === "easy" ? positionsEasy : positionsHard;

  let names = [];
  if(clef === "treble"){
    names = activeDifficulty === "easy"
      ? ["Mi","Fa","Sol","La","Si","Do","Re","Mi","Fa"]
      : ["Sol","La","Si","Do","Re","Mi","Fa","Sol","La","Si","Do","Re","Mi","Fa","Sol","La","Si","Do"];
  } else {
    names = activeDifficulty === "easy"
      ? ["Sol","La","Si","Do","Re","Mi","Fa","Sol","La"]
      : ["Si","Do","Re","Mi","Fa","Sol","La","Si","Do","Re","Mi","Fa","Sol","La","Si","Do","Re","Mi"];
  }

  return positions.map((y,i)=>({name:names[i], y:y}));
}

function newNote(){
  resetButtons();
  setFeedback("");
  const notes = getNotes();
  currentNote = notes[Math.floor(Math.random()*notes.length)];
  noteElement.setAttribute("cy", currentNote.y);
  drawLedgerLines(currentNote.y);
  rankedQuestionStart = Date.now();
}

function getRankedDifficultyForNoteGame(){
  if(rankedQuestionIndex < 4) return "easy";
  return "hard";
}

/* ==================== RIGHE AGGIUNTIVE ==================== */
function drawLedgerLines(y){
  ledgerGroup.innerHTML = "";
  const activeDifficulty = gameMode === "ranked" ? getRankedDifficultyForNoteGame() : difficulty;
  if(activeDifficulty === "easy") return;

  for(let pos=150; pos<=165; pos+=10){
    if(y >= pos) createLedger(pos);
  }

  for(let pos=90; pos>=80; pos-=10){
    if(y <= pos) createLedger(pos);
  }
}

function createLedger(y){
  const line = document.createElementNS("http://www.w3.org/2000/svg","line");
  line.setAttribute("x1",210);
  line.setAttribute("x2",250);
  line.setAttribute("y1",y);
  line.setAttribute("y2",y);
  line.setAttribute("stroke","black");
  line.setAttribute("stroke-width","2");
  ledgerGroup.appendChild(line);
}

/* ==================== CONTROLLO RISPOSTA ==================== */


function checkAnswer(answer, button){
  // rimuove subito qualsiasi bordo residuo dai bottoni
  document.querySelectorAll("#buttons button").forEach(btn=>{
    btn.style.borderColor = "transparent";
    btn.style.boxShadow = "none";
  });

  button.style.pointerEvents = "none"; // blocca clic multipli
  button.blur(); // elimina focus/arancione residuo

  const isCorrect = answer === currentNote.name;

  if(isCorrect){
    button.classList.add("correct"); // bordo verde
    setFeedback("Hai indovinato! Arriva una nuova nota...");
  } else {
    button.classList.add("wrong");   // bordo rosso
    highlightCorrect();
    setFeedback(`Hai sbagliato! La risposta giusta era ${currentNote.name}.`);
  }

  if(gameMode === "ranked"){
    handleRankedAnswer(isCorrect);
    return;
  }

  setTimeout(()=>{
    button.style.pointerEvents = "auto";
    // rimuove bordo dopo 1 secondo
    button.classList.remove("correct","wrong");
    button.style.borderColor = "transparent";
    button.style.boxShadow = "none";

    newNote();
  },1000);
}

function handleRankedAnswer(isCorrect){
  const elapsed = (Date.now() - rankedQuestionStart) / 1000;

  if(isCorrect){
    rankedCorrect++;
    rankedScore += elapsed <= 2 ? 125 : elapsed <= 5 ? 110 : 100;
  } else {
    rankedWrong++;
  }

  rankedQuestionIndex++;
  updateRankedProgressUI({ score: rankedScore, current: rankedQuestionIndex, total: RANKED_DEFAULT_QUESTIONS });

  setTimeout(async () => {
    resetButtons();

    if(rankedQuestionIndex >= RANKED_DEFAULT_QUESTIONS){
      await finishRankedGame();
    } else {
      newNote();
    }
  }, 1000);
}

async function finishRankedGame(){
  const totalTime = Math.round((Date.now() - rankedStartTime) / 1000);
  const saved = await saveRankedScore({
    gameName: "note",
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
  MGH.updateHeaderModeLabel("");
  warning.innerHTML = `Classificata completata! Punteggio: <strong>${Math.round(rankedScore)}</strong> · Corrette: <strong>${rankedCorrect}/${RANKED_DEFAULT_QUESTIONS}</strong>${saved ? "" : " · salvataggio non riuscito"}`;
  document.querySelectorAll(".selected").forEach(btn=>btn.classList.remove("selected"));
  gameMode = "training";
  difficulty = null;
}

function highlightCorrect(){
  document.querySelectorAll("#buttons button").forEach(btn=>{
    if(btn.innerText === currentNote.name){
      btn.classList.add("correct");
    }
  });
}

function resetButtons(){
  document.querySelectorAll("#buttons button").forEach(btn=>{
    btn.classList.remove("correct","wrong");
    btn.style.pointerEvents = "auto";
  });
}

function setFeedback(message){
  if(feedbackEl) feedbackEl.textContent = message;
}
