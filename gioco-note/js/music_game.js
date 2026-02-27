/* ==================== VARIABILI GLOBALI ==================== */
let difficulty = null;
let clef = null;
let currentNote;

const noteElement = document.getElementById("note");
const ledgerGroup = document.getElementById("ledgerLines");
const buttonsDiv = document.getElementById("buttons");
const clefSymbol = document.getElementById("clefSymbol");

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
  document.querySelectorAll(groupClass).forEach(btn=>{
    btn.classList.remove("selected");
  });
  element.classList.add("selected");
}

function setDifficulty(level, el){
  difficulty = level;
  selectButton(".menuButton", el);
}

// gestione chiave separata per calibrare posizione e grandezza
function setClef(type, el){
  clef = type;
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
  if(!difficulty || !clef){
    alert("Seleziona modalità e chiave prima di iniziare");
    return;
  }
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  newNote();
}

function goBack(){

  document.getElementById("game").classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");

  difficulty = null;
  clef = null;

  document.querySelectorAll(".selected").forEach(btn=>{
    btn.classList.remove("selected");
  });

  resetButtons();
}


/* ==================== NOTE ==================== */
function getNotes(){
  const positionsEasy = [140,135,130,125,120,115,110,105,100]; // facile
  const positionsHard = [165,160,155,150,145,140,135,130,125,120,115,110,105,100,95,90,85,80]; // difficile

  const positions = difficulty === "easy" ? positionsEasy : positionsHard;

  let names = [];
  if(clef === "treble"){
    names = difficulty === "easy" 
      ? ["Mi","Fa","Sol","La","Si","Do","Re","Mi","Fa"]
      : ["Sol","La","Si","Do","Re","Mi","Fa","Sol","La","Si","Do","Re","Mi","Fa","Sol","La","Si","Do"];
  } else {
    names = difficulty === "easy" 
      ? ["Sol","La","Si","Do","Re","Mi","Fa","Sol","La"]
      : ["Si","Do","Re","Mi","Fa","Sol","La","Si","Do","Re","Mi","Fa","Sol","La","Si","Do","Re","Mi"];
  }

  return positions.map((y,i)=>({name:names[i], y:y}));
}

function newNote(){
  resetButtons();
  const notes = getNotes();
  currentNote = notes[Math.floor(Math.random()*notes.length)];
  noteElement.setAttribute("cy", currentNote.y);
  drawLedgerLines(currentNote.y);
}

/* ==================== RIGHE AGGIUNTIVE ==================== */
function drawLedgerLines(y){
  ledgerGroup.innerHTML = "";
  if(difficulty === "easy") return;

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

  if(answer === currentNote.name){
    button.classList.add("correct"); // bordo verde
  } else {
    button.classList.add("wrong");   // bordo rosso
    highlightCorrect();
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

function goHome() {
  // Colora il bottone come selezionato
  const btn = document.getElementById("homeBtn");
  btn.classList.add("selected");

  // Torna alla home dopo breve delay per mostrare l'effetto
  setTimeout(() => {
    window.location.href = "index.html"; // sostituisci con il tuo file home
  }, 150);
}