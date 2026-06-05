// ==================== PAROLE MUSICALI ====================

const words = [
 
  // ── 5 lettere (35) ─────────────────────────────────────────────────────
  "ACUTO",      
  "ARCHI",      
  "BANDA",      
  "BASSO",
  "BONGO",
  "CANTO",
  "CELLA",      
  "CELLO",
  "CORDA",
  "CORNO",
  "CROMA",
  "FORTE",
  "GRADO",      
  "GRAVE",
  "LARGO",
  "LENTO",
  "LIUTO",      
  "MESSA",      
  "MEZZA",      
  "NENIA",      
  "OPERA",
  "PAUSA",
  "PIANO",
  "RITMO",
  "RONDO",
  "SCALA",
  "SEGNO",      
  "SORDO",
  "SUONO",
  "TASTO",      
  "TASTI",
  "TEMPO",
  "TESTO",      
  "TUTTI",
  "VIOLA",
 
  // ── 6 lettere (28) ─────────────────────────────────────────────────────
  "ADAGIO",    
  "ARIOSO", 
  "CANONE",
  "CORALE",
  "FLAUTO",
  "FUGATO",
  "LEGATO",
  "MARACA",
  "MINORE",
  "MODALE",
  "MOTIVO",   
  "ORGANO",
  "OTTAVA",
  "OTTONE",
  "PEDALE",
  "PRESTO",
  "QUARTA",
  "QUINTA",
  "RUBATO",  
  "SONATA",
  "TENORE",
  "TIMBRO",
  "TONICA",
  "TRIADE",
  "TRILLO",
  "TROMBA",
  "VIVACE",
 
  // ── 7 lettere (36) ─────────────────────────────────────────────────────
  "ACCORDO",
  "ALLEGRO",
  "ANDANTE",
  "ARMONIA",
  "BALLATA",
  "BATTUTA",
  "CADENZA",
  "CANTATA",
  "CANTORE",
  "CEMBALO",
  "CODETTA",    // ★ breve coda — sostituisce CODALETTA (inesistente)
  "CORISTA",
  "FAGOTTO",
  "MAESTRO",
  "MELISMA",
  "MELODIA",
  "MONODIA",
  "MOTETTO",
  "OBOISTA",
  "OTTETTO",
  "PIANOLA",
  "PORTATO",
  "RIPRESA",
  "ROMANZA",
  "SECONDA",
  "SESTINA",
  "SETTIMA",
  "SINCOPE",
  "SOLISTA",
  "SOPRANO",
  "SORDINA",
  "TERZINA",
  "TIMPANI",
  "TOCCATA",
  "UNISONO",
  "VIBRATO",
 
  // ── 8 lettere (32) ─────────────────────────────────────────────────────
  "ARMONICA",
  "ARPEGGIO",
  "BARITONO",
  "BASSISTA",
  "BELCANTO",
  "CAVATINA",    // ★ breve aria d'opera (es. "Casta diva")
  "CHITARRA",
  "CONCERTO",
  "DIAPASON",
  "DINAMICA",
  "FALSETTO",
  "GLISSATO",
  "LIBRETTO",
  "MAESTOSO",
  "MARCIALE",
  "MINUETTO",
  "MONODICO",
  "NOTTURNO",
  "OPERETTA",
  "ORATORIO",
  "PIANISTA",
  "PRELUDIO",
  "REGISTRO",
  "SERENATA",
  "SINFONIA",
  "SPARTITO",
  "STACCATO",
  "TONALITA",
  "TROMBONE",
  "VIOLISTA",
  "XILOFONO",
 
  // ── 9 lettere (35) ─────────────────────────────────────────────────────
  "ATONALITA",
  "BAGATELLA",
  "CABALETTA",   // ★ breve aria d'opera dell'800 (es. "Di quella pira")
  "CANTABILE",
  "CAPRICCIO",
  "CONTRALTO",
  "CRESCENDO",
  "CROMATICA",
  "CROMATICO",
  "DIATONICA",
  "DIRETTORE",
  "ENARMONIA",
  "GLISSANDO",
  "GRUPPETTO",
  "LEITMOTIV",
  "MADRIGALE",
  "MANDOLINO",
  "METRONOMO",
  "MICROTONO",
  "MOTIVETTO",   // ★ su richiesta — piccolo motivo melodico
  "MUSICISTA",
  "ORCHESTRA",
  "ORGANISTA",
  "OUVERTURE",
  "PARTITURA",
  "PASSAGGIO",
  "PIZZICATO",
  "POLIFONIA",
  "RICERCARE",   // ★ sostituisce RICERCAR — forma italiana corretta (9 lett.)
  "RISONANZA",
  "SARABANDA",
  "SASSOFONO",
  "SINFONICO",
  "SMORZANDO",
  "VIBRAFONO",
 
  // ── 10 lettere (23) ────────────────────────────────────────────────────
  "CANZONIERE",
  "CLARINETTO",
  "COLORATURA",
  "CONCERTINO",
  "CONDUTTORE",  // ★ su richiesta — motivo conduttore / direttore d'orchestra
  "CONSONANZA",
  "CROMATISMO",
  "DISSONANZA",
  "ESECUZIONE",
  "ESTENSIONE",
  "FORTISSIMO",
  "INTERMEZZO",
  "MELODRAMMA",
  "MEZZOFORTE",
  "MEZZOPIANO",
  "PIANISSIMO",
  "POLIFONICO",
  "POLIRITMIA",
  "RECITATIVO",
  "RITARDANDO",  // ★ indicazione di rallentamento graduale
  "TIMPANISTA",
  "VARIAZIONE",
  "VIOLINISTA",
 
  // ── 11 lettere (22) ────────────────────────────────────────────────────
  "ACCELERANDO",
  "ACCORDATORE",
  "CHITARRISTA",
  "COMPOSITORE",
  "CONTROBASSO",
  "CONTROTEMPO",
  "DECRESCENDO",
  "DODECAFONIA",
  "FISARMONICA",
  "INTONAZIONE",
  "MODULAZIONE",
  "MUSICOLOGIA",
  "ORCHESTRALE",
  "PASSACAGLIA",
  "PERCUSSIONE",
  "POLIFONISTA",
  "RALLENTANDO",
  "RINFORZANDO",
  "STRUMENTALE",
  "TROMBONISTA",
  "VIOLONCELLO",
  "VIRTUOSISMO",
 
  // ── 12 lettere (12) ────────────────────────────────────────────────────
  "ABBELLIMENTO",
  "ACCIACCATURA",
  "APPOGGIATURA",
  "CLAVICEMBALO",
  "COMPOSIZIONE",
  "CONTRABBASSO",
  "CONTRAPPUNTO",
  "MEZZOSOPRANO",
  "SASSOFONISTA",
  "STRUMENTISTA",
  "TEMPERAMENTO", // ★ es. temperamento equabile — sistema di accordatura
  "TROMBETTISTA",
 
  // ── 13 lettere (4) ─────────────────────────────────────────────────────
  "ARTICOLAZIONE",
  "CLARINETTISTA",
  "CONCERTAZIONE",
  "TRASPOSIZIONE",
 
  // ── 14 lettere (4) ─────────────────────────────────────────────────────
  "ARMONIZZAZIONE",
  "ORCHESTRAZIONE",
  "PERCUSSIONISTA",
  "STRUMENTAZIONE",
 
  // ── 15 lettere (3) ─────────────────────────────────────────────────────
  "ACCOMPAGNAMENTO",
  "IMPROVVISAZIONE",
  "INTERPRETAZIONE",
 
];
 

// ==================== VARIABILI GLOBALI ====================
const maxRows = 6;
const dailyMode = "daily";
const rankedMode = "ranked";
const statsStorageKey = "musicWordleStatsV3";
const statsLegacyStorageKeys = ["musicWordleStatsV2", "musicWordleStats"];
const dailyStorageKey = "musicWordleDailyV3";
const dailyCompletionStorageKey = "musicWordleDailyCompletedDateV3";
const settingsStorageKey = "musicWordleSettings";
const validWords = new Set(words.map(word => normalizeWord(word)));

let secret = "";
let currentRow = 0;
let currentGuess = "";
let wordLength = 5;
let dailyDifficulty = "easy";
let mode = null;
let activeMode = null;
let roundLocked = false;
let gameFinished = false;
let lastResult = null;
let countdownTimer = null;
let messageTimer = null;
let pendingRankedCompletionPayload = null;

const grid = document.getElementById("grid");
const game = document.getElementById("game");
const config = document.getElementById("config");
const messageEl = document.getElementById("message");
const headerModeLabel = document.getElementById("headerModeLabel");
const dailyWordNumberBadge = document.getElementById("dailyWordNumberBadge");

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

function getWordDifficulty(word){
  if(word.length === 5) return "easy";
  if(word.length >= 6 && word.length <= 7) return "medium";
  return "hard";
}

function getDifficultyName(selectedDifficulty = dailyDifficulty){
  if(selectedDifficulty === "easy") return "facile";
  if(selectedDifficulty === "medium") return "media";
  if(selectedDifficulty === "hard") return "difficile";
  return "facile";
}

function getModeLabel(selectedMode = activeMode){
  if(selectedMode === dailyMode) return "Parola del giorno";
  if(selectedMode === rankedMode) return "Classificata";
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

    if(dailyState.finished || isDailyCompletedToday()){
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
  const dailyWords = words;
  const index = getDaysFromStart() % dailyWords.length;
  secret = dailyWords[index];
  wordLength = secret.length;
  dailyDifficulty = getWordDifficulty(secret);
}

function getDailyWordNumber(){
  return (getDaysFromStart() % words.length) + 1;
}

function updateDailyWordNumberBadge(){
  if(!dailyWordNumberBadge) return;

  const isDailyGame = activeMode === dailyMode || activeMode === rankedMode;
  dailyWordNumberBadge.textContent = `Parola #${getDailyWordNumber()}`;
  dailyWordNumberBadge.title = "Numero della parola del giorno";
  dailyWordNumberBadge.classList.toggle("hidden", !isDailyGame);
}

function getDailyState(){
  try{
    return JSON.parse(localStorage.getItem(dailyStorageKey));
  } catch(error){
    return null;
  }
}

function markDailyCompletedToday(){
  localStorage.setItem(dailyCompletionStorageKey, getTodayKey());
}

function isDailyCompletedToday(){
  const dailyState = getDailyState();
  const inferredFinished = Boolean(dailyState && dailyState.date === getTodayKey() && (
    dailyState.finished ||
    dailyState.currentRow >= maxRows ||
    (dailyState.guesses || []).some(row =>
      row.map(cell => cell.text || "").join("").toUpperCase() === String(dailyState.secret || "").toUpperCase()
    )
  ));

  if(inferredFinished){
    markDailyCompletedToday();
  }

  return localStorage.getItem(dailyCompletionStorageKey) === getTodayKey() ||
    inferredFinished;
}

function updateDailyAvailabilityBadge(){
  const badge = document.getElementById("dailyAvailabilityBadge");
  if(!badge) return;

  badge.classList.toggle("dailyAvailable", !isDailyCompletedToday());
}

function saveDailyState(finished){
  if(activeMode !== dailyMode && activeMode !== rankedMode) return;

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
    dailyDifficulty,
    currentRow,
    currentGuess,
    finished,
    guesses,
    lastResult
  }));

  if(finished){
    markDailyCompletedToday();
  }

  updateDailyAvailabilityBadge();
}

function restoreDailyBoard(state){
  if(!state || !state.guesses) return;

  secret = state.secret || secret;
  wordLength = Number(state.wordLength || secret.length || wordLength);
  dailyDifficulty = state.dailyDifficulty || getWordDifficulty(secret);
  initGrid();
  createKeyboard();

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

  if(mode === rankedMode){
    if(isDailyCompletedToday()){
      startRankedRound();
      return;
    }

    showRankedIntro({
      gameName: "wordle",
      title: "Wordle Classificato",
      text: "La parola è quella del giorno. Il punteggio premia chi indovina con meno tentativi e aggiunge un bonus se giochi con la modalità difficile attiva.",
      onStart: startRankedRound
    });
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

function startRankedRound(){
  activeMode = rankedMode;
  pickDailyWord();
  showGame(getModeLabel());
  resetBoardOnly();

  const dailyState = getDailyState();

  if(dailyState && dailyState.date === getTodayKey()){
    restoreDailyBoard(dailyState);

    if(dailyState.finished || isDailyCompletedToday()){
      showMessage("Hai già giocato la parola del giorno. Torna domani per una nuova sfida.", 2800);
      roundLocked = true;
      gameFinished = true;
      setTimeout(() => showStatsModal(false), 450);
    } else {
      showMessage("Partita del giorno ripristinata.", 1800);
      roundLocked = false;
      gameFinished = false;
    }

    return;
  }

  if(isDailyCompletedToday()){
    showMessage("Hai già giocato la parola del giorno. Torna domani per una nuova sfida.", 2800);
    roundLocked = true;
    gameFinished = true;
    return;
  }

  showMessage(`Wordle classificato: parola ${getDifficultyName()}, più punti se è più difficile.`, 2600);
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
  document.getElementById("rankedLeaderboardBtn")?.classList.add("hidden");
  document.getElementById("gameModeHelpBtn")?.classList.add("hidden");

  updateHeaderModeLabel();

  const isDailyGame = activeMode === dailyMode || activeMode === rankedMode;

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

  updateDailyWordNumberBadge();
}

// ==================== SCELTA PAROLA ====================
function pickRandomWord(){
  const filtered = getWordsForMode(mode);
  secret = pickRandomNoRepeat(filtered, { namespace: `wordle-${mode}-${wordLength || "any"}` });
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

  if(activeMode === dailyMode || activeMode === rankedMode){
    saveStats(won, attempts);
    saveDailyState(true);
  }

  if(activeMode === rankedMode){
    saveRankedWordleResult(won, attempts).then(payload => {
      pendingRankedCompletionPayload = payload;
      showStatsModal(true);
    });
  }

  if(won){
    showMessage(MGH.getAnswerFeedback(true), 0, "correct");
  } else {
    showMessage(MGH.getAnswerFeedback(false, "La parola corretta era " + secret + "."), 0, "wrong");
  }

  if(activeMode === dailyMode){
    setTimeout(() => showStatsModal(true), 700);
  }
}

async function saveRankedWordleResult(won, attempts){
  const settings = getSettings();
  const hardBonus = settings.hardMode ? 150 : 0;
  const difficultyScores = {
    easy: { base: 1000, penalty: 140 },
    medium: { base: 1350, penalty: 120 },
    hard: { base: 1750, penalty: 100 }
  };
  const scoreConfig = difficultyScores[dailyDifficulty] || difficultyScores.easy;
  const score = won
    ? Math.max(100, scoreConfig.base - ((attempts - 1) * scoreConfig.penalty) + hardBonus)
    : 0;

  let saved = null;

  try {
    saved = await saveRankedScore({
      gameName: "wordle",
      mode: settings.hardMode ? "ranked_hard" : "ranked",
      totalScore: score,
      correct: won ? 1 : 0,
      wrong: won ? attempts - 1 : maxRows,
      totalQuestions: 1,
      totalTime: attempts,
      accuracy: won ? 100 : 0,
      answers: [{
        date: getTodayKey(),
        difficulty: dailyDifficulty,
        wordLength,
        attempts: won ? attempts : "X",
        hardMode: settings.hardMode
      }]
    });
  } catch(error) {
    console.error("Salvataggio ranked Wordle fallito", error);
  }

  return {
    gameName: "wordle",
    saveResult: saved,
    totalScore: score,
    correct: won ? 1 : 0,
    totalQuestions: 1,
    accuracy: won ? 100 : 0,
    totalTime: attempts,
    saved: Boolean(saved)
  };
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

function getStatsStorageKeys(){
  const user = typeof getRankedAuthUser === "function" ? getRankedAuthUser() : null;
  const keys = [];

  if(user?.id){
    keys.push(`${statsStorageKey}_${user.id}`);
  }

  keys.push(statsStorageKey, ...statsLegacyStorageKeys);
  return [...new Set(keys)];
}

function normalizeStats(rawStats){
  const defaults = getDefaultStats();
  const stats = Object.assign({}, defaults, rawStats || {});
  stats.distribution = Object.assign({}, defaults.distribution, rawStats?.distribution || {});
  stats.games = Number(stats.games) || 0;
  stats.wins = Number(stats.wins) || 0;
  stats.currentStreak = Number(stats.currentStreak) || 0;
  stats.maxStreak = Number(stats.maxStreak) || 0;
  return stats;
}

function getStats(){
  const keys = getStatsStorageKeys();

  for(const key of keys){
    try{
      const stored = JSON.parse(localStorage.getItem(key) || "null");
      const stats = normalizeStats(stored);

      if(stats.games > 0){
        localStorage.setItem(keys[0], JSON.stringify(stats));
        localStorage.setItem(statsStorageKey, JSON.stringify(stats));
        return stats;
      }
    } catch(error){
      // Ignora chiavi vecchie o corrotte e passa alla successiva.
    }
  }

  return getDefaultStats();
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

  const serializedStats = JSON.stringify(stats);
  getStatsStorageKeys().forEach(key => {
    if(key === statsStorageKey || key.startsWith(`${statsStorageKey}_`)){
      localStorage.setItem(key, serializedStats);
    }
  });
}

function showStatsModal(fromEndGame = false){
  if(activeMode !== dailyMode && activeMode !== rankedMode){
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

  if(pendingRankedCompletionPayload){
    const payload = pendingRankedCompletionPayload;
    pendingRankedCompletionPayload = null;
    returnToModeSelectionAfterRankedWordle();
    setTimeout(() => showRankedCompletionModal(payload), 120);
  }
}

function returnToModeSelectionAfterRankedWordle(){
  game.classList.add("hidden");
  config.classList.remove("hidden");
  document.getElementById("gameHelpBtn")?.classList.add("hidden");
  document.getElementById("gameSettingsBtn")?.classList.add("hidden");
  document.getElementById("gameStatsBtn")?.classList.add("hidden");
  dailyWordNumberBadge?.classList.add("hidden");
  updateDailyAvailabilityBadge();
  if(typeof showLeaderboardButton === "function") showLeaderboardButton();
  if(window.MGH?.updateHeaderModeLabel) MGH.updateHeaderModeLabel("");
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
function showMessage(msg, duration = 0, state = "neutral"){
  if(!messageEl) return;

  if(messageTimer){
    clearTimeout(messageTimer);
    messageTimer = null;
  }

  MGH.setGameFeedback(messageEl, msg, state);
  messageEl.classList.toggle("isVisible", Boolean(msg));

  if(msg && duration > 0){
    messageTimer = setTimeout(() => {
      MGH.setGameFeedback(messageEl, "");
      messageEl.classList.remove("isVisible");
      messageEl.classList.remove("feedbackCorrect", "feedbackWrong", "feedbackNeutral");
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
updateDailyAvailabilityBadge();

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
