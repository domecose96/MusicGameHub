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
const maxRows = 6;
const dailyMode = "daily";
const statsStorageKey = "musicWordleStatsV3";
const dailyStorageKey = "musicWordleDailyV3";
const settingsStorageKey = "musicWordleSettings";
const validWords = new Set(words.map(word => normalizeWord(word)));

let secret = "";
let currentRow = 0;
let currentGuess = "";
let wordLength = 5;
let mode = null;
let activeMode = null;
let roundLocked = false;
let gameFinished = false;
let lastResult = null;
let countdownTimer = null;
let messageTimer = null;

const grid = document.getElementById("grid");
const game = document.getElementById("game");
const config = document.getElementById("config");
const messageEl = document.getElementById("message");
const headerModeLabel = document.getElementById("headerModeLabel");

// ==================== FUNZIONI UTILI ====================
function normalizeWord(value){
  return String(value || "")
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getTodayKey(){
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
}

function getDaysFromStart(){
  const today = new Date();
  const localMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.floor(localMidnight.getTime() / 86400000);
}

function getWordsForMode(selectedMode){
  return words.filter(word => {
    if(selectedMode === "easy") return word.length === 5;
    if(selectedMode === "medium") return word.length >= 6 && word.length <= 7;
    if(selectedMode === "hard") return word.length >= 8;
    return false;
  });
}

function getModeLabel(selectedMode = activeMode){
  if(selectedMode === dailyMode) return "Parola del giorno";
  if(selectedMode === "easy") return "Facile";
  if(selectedMode === "medium") return "Medio";
  if(selectedMode === "hard") return "Difficile";
  return "";
}

function updateHeaderModeLabel(){
  MGH.updateHeaderModeLabel(getModeLabel());
}

// ==================== MODALITÀ ====================
function selectMode(button, selectedMode){
  mode = selectedMode;
  MGH.selectExclusive("#config .buttonGroup .menuButton", button);
  MGH.setWarning("", "#config .warningText");

  // La scritta sotto Music Wordle cambia solo dopo Start.
  showMessage("");
}

// ==================== PAROLA DEL GIORNO ====================
function startDailyGame(button){
  selectMode(button, dailyMode);
}

function startDailyRound(){
  activeMode = dailyMode;
  pickDailyWord();
  showGame(getModeLabel());
  resetBoardOnly();

  const dailyState = getDailyState();

  if(dailyState && dailyState.date === getTodayKey()){
    restoreDailyBoard(dailyState);

    if(dailyState.finished){
      showMessage("Hai già giocato la parola del giorno.", 2600);
      roundLocked = true;
      gameFinished = true;
      setTimeout(() => showStatsModal(false), 450);
    } else {
      showMessage("Partita del giorno ripristinata.", 1800);
      roundLocked = false;
      gameFinished = false;
    }
  }
}

function pickDailyWord(){
  const dailyWords = getWordsForMode("easy");
  const index = getDaysFromStart() % dailyWords.length;
  secret = dailyWords[index];
  wordLength = secret.length;
}

function getDailyState(){
  try{
    return JSON.parse(localStorage.getItem(dailyStorageKey));
  } catch(error){
    return null;
  }
}

function saveDailyState(finished){
  if(activeMode !== dailyMode) return;

  const guesses = Array.from(document.querySelectorAll(".cell"))
    .slice(0, maxRows * wordLength)
    .reduce((rows, cell, index) => {
      const rowIndex = Math.floor(index / wordLength);

      if(!rows[rowIndex]) rows[rowIndex] = [];

      rows[rowIndex].push({
        text: cell.textContent,
        classes: Array.from(cell.classList).filter(cls =>
          ["correct","present","wrong"].includes(cls)
        )
      });

      return rows;
    }, []);

  localStorage.setItem(dailyStorageKey, JSON.stringify({
    date: getTodayKey(),
    secret,
    wordLength,
    currentRow,
    currentGuess,
    finished,
    guesses,
    lastResult
  }));
}

function restoreDailyBoard(state){
  if(!state || !state.guesses) return;

  const cells = document.querySelectorAll(".cell");

  state.guesses.forEach((row, rowIndex) => {
    row.forEach((savedCell, colIndex) => {
      const cell = cells[rowIndex * wordLength + colIndex];
      if(!cell) return;

      cell.textContent = savedCell.text || "";

      savedCell.classes.forEach(cls => {
        cell.classList.add(cls);
      });

      if(savedCell.text && savedCell.classes[0]){
        updateKeyboardKey(savedCell.text, savedCell.classes[0]);
      }
    });
  });

  currentRow = Number(state.currentRow || 0);
  currentGuess = state.currentGuess || "";
  lastResult = state.lastResult || null;
}

// ==================== START GIOCO ====================
function startGame(){
  if(!mode){
    MGH.setWarning("Seleziona una modalità prima di iniziare", "#config .warningText");
    return;
  }

  MGH.setWarning("", "#config .warningText");
  activeMode = mode;

  if(mode === dailyMode){
    startDailyRound();
    return;
  }

  const filtered = getWordsForMode(mode);
  if(filtered.length === 0){
    showMessage("Nessuna parola disponibile per questa modalità!", 2200);
    return;
  }

  pickRandomWord();
  showGame(getModeLabel());
  resetBoardOnly();
}

// ==================== IMPOSTAZIONI ====================
function getSettings() {
  try {
    return Object.assign(
      { hardMode: false, darkMode: false, highContrast: false },
      JSON.parse(localStorage.getItem(settingsStorageKey)) || {}
    );
  } catch(error) {
    return { hardMode: false, darkMode: false, highContrast: false };
  }
}

function saveSettingsToStorage(settings) {
  localStorage.setItem(settingsStorageKey, JSON.stringify(settings));
}

function syncSettingsInputs(settings) {
  const hardEl = document.getElementById("settingHardMode");
  const darkEl = document.getElementById("settingDarkMode");
  const contrastEl = document.getElementById("settingHighContrast");

  if(hardEl) hardEl.checked = settings.hardMode;
  if(darkEl) darkEl.checked = settings.darkMode;
  if(contrastEl) contrastEl.checked = settings.highContrast;
}

function applySettingsClasses(settings) {
  document.body.classList.toggle("darkMode", settings.darkMode);
  document.body.classList.toggle("highContrast", settings.highContrast);
}

function applySettings() {
  const settings = {
    hardMode: document.getElementById("settingHardMode")?.checked || false,
    darkMode: document.getElementById("settingDarkMode")?.checked || false,
    highContrast: document.getElementById("settingHighContrast")?.checked || false
  };

  saveSettingsToStorage(settings);
  applySettingsClasses(settings);
}

function loadAndApplySettings() {
  const settings = getSettings();
  syncSettingsInputs(settings);
  applySettingsClasses(settings);
}

function showSettingsModal() {
  loadAndApplySettings();
  document.getElementById("settingsModal")?.classList.remove("hidden");
}

function closeSettingsModal() {
  document.getElementById("settingsModal")?.classList.add("hidden");
}

function showGame(label){
  config.classList.add("hidden");
  game.classList.remove("hidden");

  updateHeaderModeLabel();

  const isDailyGame = activeMode === dailyMode;

  const helpButton = document.getElementById("gameHelpBtn");
  if(helpButton){
    helpButton.classList.remove("hidden");
  }

  const settingsButton = document.getElementById("gameSettingsBtn");
  if(settingsButton){
    settingsButton.classList.remove("hidden");
  }

  const statsButton = document.getElementById("gameStatsBtn");
  if(statsButton){
    statsButton.classList.toggle("hidden", !isDailyGame);
  }
}

// ==================== SCELTA PAROLA ====================
function pickRandomWord(){
  const filtered = getWordsForMode(mode);
  secret = filtered[Math.floor(Math.random() * filtered.length)];
  wordLength = secret.length;
}

// ==================== INIZIALIZZA GRIGLIA ====================
function initGrid(){
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${wordLength}, var(--wordle-cell-size))`;

  for(let i = 0; i < maxRows * wordLength; i++){
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

  layout.forEach((row, rowIndex) => {
    const div = document.createElement("div");
    div.className = "keyRow";

    if(rowIndex === 2){
      div.appendChild(makeKey("ENTER", submitGuess, "enterBtn", "actionKey"));
    }

    row.split("").forEach(letter => {
      div.appendChild(makeKey(letter, () => addLetter(letter), `key-${letter}`));
    });

    if(rowIndex === 2){
      div.appendChild(makeKey("⌫", removeLetter, "deleteBtn", "actionKey"));
    }

    keyboard.appendChild(div);
  });

  if(messageEl){
    keyboard.appendChild(messageEl);
  }
}

function makeKey(text, onClick, id, extraClass = ""){
  const key = document.createElement("button");
  key.type = "button";
  key.id = id;
  key.className = `key ${extraClass}`.trim();
  key.textContent = text;
  key.onclick = onClick;
  return key;
}

function updateKeyboardKey(letter, result){
  const key = document.getElementById(`key-${letter}`);
  if(!key) return;

  if(key.classList.contains("correctKey")) return;
  if(key.classList.contains("presentKey") && result === "wrong") return;

  key.classList.remove("correctKey","presentKey","wrongKey");
  if(result === "correct") key.classList.add("correctKey");
  if(result === "present") key.classList.add("presentKey");
  if(result === "wrong") key.classList.add("wrongKey");
}

// ==================== GESTIONE INPUT ====================
function addLetter(letter){
  if(roundLocked || gameFinished) return;
  if(currentGuess.length < wordLength){
    currentGuess += letter;
    updateGrid();
    saveDailyState(false);
  }
}

function removeLetter(){
  if(roundLocked || gameFinished) return;
  currentGuess = currentGuess.slice(0, -1);
  updateGrid();
  saveDailyState(false);
}

function updateGrid(){
  const cells = document.querySelectorAll(".cell");
  for(let i = 0; i < wordLength; i++){
    const cell = cells[currentRow * wordLength + i];
    if(cell) cell.textContent = currentGuess[i] || "";
  }
}

// ==================== INVIO ====================
function submitGuess(){
  if(roundLocked || gameFinished) return;

  currentGuess = normalizeWord(currentGuess);

  if(currentGuess.length !== wordLength){
    showMessage(`Inserisci ${wordLength} lettere`, 2200);
    shakeCurrentRow();
    return;
  }

  if(!validWords.has(currentGuess)){
    showMessage("Parola non valida", 2200);
    shakeCurrentRow();
    return;
  }

  if(currentGuess.length !== secret.length){
    showMessage(`La parola deve avere ${wordLength} lettere`, 2200);
    shakeCurrentRow();
    return;
  }

  const hardModeError = getHardModeError();
  if(hardModeError){
    showMessage(hardModeError, 2400);
    shakeCurrentRow();
    return;
  }

  roundLocked = true;
  showMessage("");

  const guessToReveal = currentGuess;
  const result = evaluateGuess(guessToReveal, secret);

  revealGuess(guessToReveal, result, () => {
    finishTurn(guessToReveal, result);
  });
}

function getHardModeError() {
  const settings = getSettings();
  if(!settings.hardMode || currentRow === 0) return null;

  const cells = document.querySelectorAll(".cell");

  for(let row = 0; row < currentRow; row++){
    for(let col = 0; col < wordLength; col++){
      const cell = cells[row * wordLength + col];
      const letter = cell?.textContent.trim().toUpperCase();
      if(!letter) continue;

      if(cell.classList.contains("correct") && currentGuess[col] !== letter){
        return `La posizione ${col + 1} deve essere ${letter}`;
      }

      if(cell.classList.contains("present") && !currentGuess.includes(letter)){
        return `Il tentativo deve contenere ${letter}`;
      }
    }
  }

  return null;
}

// ==================== CONTROLLO RISULTATO ====================
function evaluateGuess(guess, target){
  const result = Array(guess.length).fill("wrong");
  const remaining = target.split("");

  // Prima passata: lettere verdi
  for(let i = 0; i < guess.length; i++){
    if(guess[i] === target[i]){
      result[i] = "correct";
      remaining[i] = null;
    }
  }

  // Seconda passata: lettere gialle, con gestione corretta dei doppioni
  for(let i = 0; i < guess.length; i++){
    if(result[i] === "correct") continue;
    const index = remaining.indexOf(guess[i]);
    if(index !== -1){
      result[i] = "present";
      remaining[index] = null;
    }
  }

  return result;
}

function revealGuess(guess, result, done){
  const cells = document.querySelectorAll(".cell");
  let completed = 0;

  for(let i = 0; i < wordLength; i++){
    const cell = cells[currentRow * wordLength + i];

    setTimeout(() => {
      cell.classList.add("flip");

      setTimeout(() => {
        cell.classList.remove("flip");
        cell.classList.add(result[i]);
        updateKeyboardKey(guess[i], result[i]);
        completed++;
        if(completed === wordLength) done();
      }, 180);

    }, i * 260);
  }
}

function finishTurn(guess, result){
  const won = guess === secret;
  currentRow++;
  currentGuess = "";

  if(won){
    endGame(true, currentRow, result);
    return;
  }

  if(currentRow >= maxRows){
    endGame(false, 0, result);
    return;
  }

  saveDailyState(false);
  roundLocked = false;
}

function endGame(won, attempts, result){
  gameFinished = true;
  roundLocked = true;

  lastResult = {
    won,
    attempts,
    mode,
    date: getTodayKey(),
    wordLength,
    rows: collectResultRows()
  };

  if(activeMode === dailyMode){
    saveStats(won, attempts);
    saveDailyState(true);
  }

  if(won){
    showMessage("Hai indovinato!");
  } else {
    showMessage("Hai sbagliato! La parola era " + secret);
  }

  if(activeMode === dailyMode){
    setTimeout(() => showStatsModal(true), 700);
  }
}

function collectResultRows(){
  const rows = [];
  const cells = document.querySelectorAll(".cell");

  for(let r = 0; r < currentRow; r++){
    let row = "";
    for(let c = 0; c < wordLength; c++){
      const cell = cells[r * wordLength + c];
      if(cell.classList.contains("correct")) row += "🟩";
      else if(cell.classList.contains("present")) row += "🟨";
      else row += "⬛";
    }
    rows.push(row);
  }

  return rows;
}

// ==================== STATISTICHE ====================
function getDefaultStats(){
  return {
    games: 0,
    wins: 0,
    currentStreak: 0,
    maxStreak: 0,
    distribution: {1:0,2:0,3:0,4:0,5:0,6:0}
  };
}

function getStats(){
  try{
    return Object.assign(getDefaultStats(), JSON.parse(localStorage.getItem(statsStorageKey)) || {});
  } catch(error){
    return getDefaultStats();
  }
}

function saveStats(won, attempts){
  const stats = getStats();
  stats.games++;

  if(won){
    stats.wins++;
    stats.currentStreak++;
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    stats.distribution[attempts] = (stats.distribution[attempts] || 0) + 1;
  } else {
    stats.currentStreak = 0;
  }

  localStorage.setItem(statsStorageKey, JSON.stringify(stats));
}

function showStatsModal(fromEndGame = false){
  if(activeMode !== dailyMode){
    showMessage("Le statistiche sono disponibili solo per la parola del giorno.", 2400);
    return;
  }

  const modal = document.getElementById("statsModal");
  const stats = getStats();
  const winPercent = stats.games ? Math.round((stats.wins / stats.games) * 100) : 0;

  document.getElementById("statGames").textContent = stats.games;
  document.getElementById("statWinPercent").textContent = winPercent;
  document.getElementById("statCurrentStreak").textContent = stats.currentStreak;
  document.getElementById("statMaxStreak").textContent = stats.maxStreak;

  renderDistribution(stats);
  updateShareButton();
  updateCountdown();

  modal.classList.remove("hidden");
  startCountdown();
}

function closeStatsModal(){
  document.getElementById("statsModal")?.classList.add("hidden");
  stopCountdown();
}

function renderDistribution(stats){
  const container = document.getElementById("guessDistribution");
  const maxValue = Math.max(1, ...Object.values(stats.distribution).map(Number));
  container.innerHTML = "";

  for(let i = 1; i <= maxRows; i++){
    const value = Number(stats.distribution[i] || 0);
    const row = document.createElement("div");
    row.className = "distRow";

    const label = document.createElement("span");
    label.textContent = i;

    const bar = document.createElement("div");
    bar.className = "distBar";
    bar.style.width = `${Math.max(8, (value / maxValue) * 100)}%`;
    bar.textContent = value;

    if(lastResult && lastResult.won && lastResult.attempts === i){
      bar.classList.add("active");
    }

    row.appendChild(label);
    row.appendChild(bar);
    container.appendChild(row);
  }
}

// ==================== COUNTDOWN ====================
function getNextMidnight(){
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
}

function updateCountdown(){
  const countdown = document.getElementById("countdown");
  if(!countdown) return;

  const diff = Math.max(0, getNextMidnight() - new Date());
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  countdown.textContent = [hours, minutes, seconds]
    .map(value => String(value).padStart(2,"0"))
    .join(":");
}

function startCountdown(){
  stopCountdown();
  updateCountdown();
  countdownTimer = setInterval(updateCountdown, 1000);
}

function stopCountdown(){
  if(countdownTimer){
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
}

// ==================== CONDIVISIONE ====================
function updateShareButton(){
  const shareBtn = document.getElementById("shareBtn");
  if(!shareBtn) return;
  shareBtn.disabled = !lastResult;
}

function shareResult(){
  if(!lastResult) return;

  const attemptsText = lastResult.won ? `${lastResult.attempts}/${maxRows}` : `X/${maxRows}`;
  const title = lastResult.mode === dailyMode ? "Music Wordle del giorno" : `Music Wordle ${getModeLabel()}`;
  const text = `${title} ${attemptsText}\n\n${lastResult.rows.join("\n")}`;

  if(navigator.share){
    navigator.share({ text }).catch(() => copyResult(text));
  } else {
    copyResult(text);
  }
}

function copyResult(text){
  navigator.clipboard?.writeText(text);
  showMessage("Risultato copiato!");
}

// ==================== MODALE COME GIOCARE ====================
function showHelpModal(){
  const modal = document.getElementById("helpModal");
  modal?.classList.remove("hidden");
  animateHelpExamples();
}

function animateHelpExamples(){
  document.querySelectorAll(".exampleCell").forEach(cell => {
    const savedResult = cell.dataset.result || ["correct","present","wrong"].find(cls => cell.classList.contains(cls)) || "";
    cell.dataset.result = savedResult;
    cell.classList.remove("exampleFlip","correct","present","wrong");
    void cell.offsetWidth;
  });

  document.querySelectorAll(".exampleRow").forEach((row, rowIndex) => {
    row.querySelectorAll(".exampleCell").forEach((cell, cellIndex) => {
      const delay = rowIndex * 780 + cellIndex * 115;
      setTimeout(() => cell.classList.add("exampleFlip"), delay);
      if(cell.dataset.result){
        setTimeout(() => cell.classList.add(cell.dataset.result), delay + 290);
      }
    });
  });
}

function closeHelpModal(){
  document.getElementById("helpModal")?.classList.add("hidden");
}

// ==================== MESSAGGI ====================
function showMessage(msg, duration = 0){
  if(!messageEl) return;

  if(messageTimer){
    clearTimeout(messageTimer);
    messageTimer = null;
  }

  messageEl.textContent = msg;
  messageEl.classList.toggle("isVisible", Boolean(msg));

  if(msg && duration > 0){
    messageTimer = setTimeout(() => {
      messageEl.textContent = "";
      messageEl.classList.remove("isVisible");
      messageTimer = null;
    }, duration);
  }
}

function shakeCurrentRow(){
  const cells = document.querySelectorAll(".cell");
  for(let i = 0; i < wordLength; i++){
    const cell = cells[currentRow * wordLength + i];
    if(!cell) continue;
    cell.classList.add("shake");
    setTimeout(() => cell.classList.remove("shake"), 430);
  }
}

// ==================== RESET ====================
function resetBoardOnly(){
  roundLocked = false;
  gameFinished = false;
  currentRow = 0;
  currentGuess = "";
  lastResult = null;
  initGrid();
  createKeyboard();
  showMessage("");
}

function resetGame(){
  if(mode === dailyMode){
    pickDailyWord();
  } else {
    pickRandomWord();
  }
  resetBoardOnly();
}

// ==================== INIT ====================
createKeyboard(); // opzionale: tastiera visibile anche prima
loadAndApplySettings();

document.addEventListener("keydown", e => {
  if(e.key === "Escape"){
    closeHelpModal();
    closeStatsModal();
    closeSettingsModal();
    return;
  }

  if(game.classList.contains("hidden")) return;
  if(!document.getElementById("helpModal")?.classList.contains("hidden")) return;
  if(!document.getElementById("statsModal")?.classList.contains("hidden")) return;
  if(!document.getElementById("settingsModal")?.classList.contains("hidden")) return;

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
