// ==================== PAROLE MUSICALI ====================
const words = [
  // FACILE: solo parole di 5 lettere
  "PIANO","VIOLA","FLUTO","CORNO","RITMO","SCALA","TEMPO","ACUTO","BASSO",
  "TENOR","CANTO","SUONO","CELLO","BANJO","BONGO","TASTI","ALTRO",
  // MEDIO: 6-7 lettere
  "ARMONIA","DINAMICA","MELODIA","LEGATO","SOPRANO","OTTAVA","FORTE","LENTO","STACCATO",
  "TROMBA","TIMPANI","CLARINO","FAGOTTO","MAESTRO","PARTITA","TONALITA","FLAUTO",
  // DIFFICILE: 8+ lettere
  "CONTRALTO","CRESCENDO","DIMINUENDO","SINFONIA","POLIFONIA","LEGENDARIO","MODULAZIONE",
  "METRONOMO","PERCUSSIONE","CONTROBASSO","ARPEGGIARE","ARMONIZZARE","TRASCRIZIONE","CHITARRA"
];

// ==================== VARIABILI GLOBALI ====================
let secret = "";
let currentRow = 0;
let currentGuess = "";
let maxRows = 6;
let wordLength = 5;
let mode = null;
let roundLocked = false;

const grid = document.getElementById("grid");
const game = document.getElementById("game");
const config = document.getElementById("config");
const messageEl = document.getElementById("message");

// ==================== NAVIGAZIONE ====================
function goHome(){
  document.getElementById("homeBtn").classList.add("selected");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 150);
}

// ==================== MODALITÀ ====================
function selectMode(button, selectedMode){
  mode = selectedMode;
  document.querySelectorAll("#config .buttonGroup .menuButton").forEach(btn =>
    btn.classList.remove("selected")
  );
  button.classList.add("selected");
}

// ==================== START GIOCO ====================
function startGame(){
  if(!mode){
    showMessage("Seleziona una modalità!");
    return;
  }

  // Controlla che ci siano parole per la modalità
  let filtered = words.filter(w => {
    if(mode==="easy") return w.length === 5;
    if(mode==="medium") return w.length >= 6 && w.length <= 7;
    if(mode==="hard") return w.length >= 8;
  });

  if(filtered.length === 0){
    alert("Nessuna parola disponibile per questa modalità!");
    return; // esce senza avviare il gioco
  }

  config.classList.add("hidden");
  game.classList.remove("hidden");

  resetGame(); // pickWord + initGrid + tastiera
}

// ==================== SCELTA PAROLA ====================
function pickWord(){
  let filtered = words.filter(w => {
    if(mode==="easy") return w.length === 5;
    if(mode==="medium") return w.length >= 6 && w.length <= 7;
    if(mode==="hard") return w.length >= 8;
  });

  secret = filtered[Math.floor(Math.random() * filtered.length)];
  wordLength = secret.length;
}

// ==================== INIZIALIZZA GRIGLIA ====================
function initGrid(){
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${wordLength}, var(--wordle-cell-size))`;
  for(let i=0; i<maxRows*wordLength; i++){
    const cell = document.createElement("div");
    cell.classList.add("cell");
    grid.appendChild(cell);
  }
}

// ==================== TASTIERA ====================
function createKeyboard(){
  const layout = ["QWERTYUIOP","ASDFGHJKL","ZXCVBNM"];
  const keyboard = document.getElementById("keyboard");
  keyboard.innerHTML = "";

  layout.forEach((row, rowIndex)=>{
    const div = document.createElement("div");
    div.className = "keyRow";

    row.split("").forEach((letter, i)=>{
      const key = document.createElement("div");
      key.className="key";
      key.textContent=letter;
      key.onclick=()=>addLetter(letter);
      div.appendChild(key);

      // Aggiungi Enter a sinistra della Z
      if(rowIndex === 2 && i === 0){
        const enterKey = document.createElement("div");
        enterKey.id="enterBtn";
        enterKey.className="key";
        enterKey.textContent="ENTER";
        enterKey.onclick=submitGuess;
        div.insertBefore(enterKey, key);
      }

      // Aggiungi Cancella a destra della M
      if(rowIndex === 2 && i === row.length - 1){
        const deleteKey = document.createElement("div");
        deleteKey.id="deleteBtn";
        deleteKey.className="key";
        deleteKey.textContent="⌫";
        deleteKey.onclick=removeLetter;
        div.appendChild(deleteKey);
      }

    });

    keyboard.appendChild(div);
  });

  if(messageEl){
    keyboard.appendChild(messageEl);
  }
}

// ==================== GESTIONE INPUT ====================
function addLetter(letter){
  if(roundLocked) return;
  if(currentGuess.length<wordLength){
    currentGuess+=letter;
    updateGrid();
  }
}

function removeLetter(){
  if(roundLocked) return;
  currentGuess=currentGuess.slice(0,-1);
  updateGrid();
}

function updateGrid(){
  const cells=document.querySelectorAll(".cell");
  for(let i=0;i<wordLength;i++){
    const cell=cells[currentRow*wordLength+i];
    cell.textContent=currentGuess[i]||"";
  }
}

// ==================== INVIO ====================
function submitGuess(){
  if(roundLocked) return;
  if(currentGuess.length !== wordLength){
    showMessage(`Inserisci ${wordLength} lettere`);
    return;
  }

  const cells = document.querySelectorAll(".cell");
  const secretArray = secret.split("");
  const guessArray = currentGuess.split("");
  const revealDelay = (wordLength - 1) * 300 + 220;
  const restartDelay = revealDelay + 1500;

  roundLocked = true;

  showMessage("");

  for(let i=0;i<wordLength;i++){
    const cell = cells[currentRow*wordLength+i];

    setTimeout(()=>{
      cell.classList.add("flip");

      setTimeout(()=>{
        if(guessArray[i] === secretArray[i]){
          cell.classList.add("correct");
        } else if(secretArray.includes(guessArray[i])){
          cell.classList.add("present");
        } else {
          cell.classList.add("wrong");
        }
        cell.classList.remove("flip");
      },200);

    }, i*300);
  }

  if(currentGuess === secret){
    setTimeout(() => {
      showMessage("Hai indovinato!");
    }, revealDelay);
    setTimeout(() => {
      resetGame();
    }, restartDelay);
    return;
  }

  currentRow++;
  currentGuess="";

  if(currentRow >= maxRows){
    setTimeout(() => {
      showMessage("Hai sbagliato! La parola era " + secret);
    }, revealDelay);
    setTimeout(() => {
      resetGame();
    }, restartDelay);
  } else {
    roundLocked = false;
  }
}

// ==================== MESSAGGI ====================
function showMessage(msg){
  if(!messageEl) return;
  messageEl.textContent = msg;
  messageEl.classList.toggle("isVisible", Boolean(msg));
}

// ==================== RESET ====================
function resetGame(){
  roundLocked = false;
  currentRow=0;
  currentGuess="";
  pickWord();
  initGrid();
  createKeyboard();
  showMessage("");
}

// ==================== INIT ====================
// Non chiamare pickWord qui! Si fa solo dopo che l’utente seleziona la modalità
createKeyboard(); // opzionale: tastiera visibile anche prima

document.addEventListener("keydown", e => {
  if(game.classList.contains("hidden")) return;

  const key = e.key.toUpperCase();

  if(key === "ENTER"){
    e.preventDefault();
    submitGuess();
    return;
  }

  if(key === "BACKSPACE"){
    e.preventDefault();
    removeLetter();
    return;
  }

  if(/^[A-Z]$/.test(key)){
    addLetter(key);
  }
});
