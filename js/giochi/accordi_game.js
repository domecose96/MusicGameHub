/* ==================== COSTRUISCI L'ACCORDO ==================== */

const ACCORDI_GAME_NAME = "accordi";
const KEYBOARD_START_MIDI = 48;
const KEYBOARD_END_MIDI = 72;
const WHITE_PITCH_CLASSES = new Set([0, 2, 4, 5, 7, 9, 11]);
const NOTE_NAMES = ["Do", "Do♯", "Re", "Re♯", "Mi", "Fa", "Fa♯", "Sol", "Sol♯", "La", "La♯", "Si"];
const NATURAL_ROOTS = [0, 2, 4, 5, 7, 9, 11];
const ALL_ROOTS = Array.from({ length: 12 }, (_, index) => index);
const CHORD_TYPES = Object.freeze({
  major: { label: "maggiore", intervals: [0, 4, 7] },
  minor: { label: "minore", intervals: [0, 3, 7] },
  diminished: { label: "diminuito", intervals: [0, 3, 6] },
  augmented: { label: "aumentato", intervals: [0, 4, 8] }
});
const INVERSION_LABELS = ["in stato fondamentale", "in primo rivolto", "in secondo rivolto"];

let difficulty = null;
let gameMode = "training";
let currentChord = null;
let selectedNotes = [];
let roundLocked = false;
let previousChordKey = "";
let audioContext = null;

const menu = document.getElementById("menu");
const game = document.getElementById("game");
const warning = document.getElementById("warning");
const questionText = document.getElementById("questionText");
const selectedNotesEl = document.getElementById("selectedNotes");
const pianoKeyboard = document.getElementById("pianoKeyboard");
const feedbackEl = document.getElementById("feedback");
const verifyButton = document.getElementById("verifyChordButton");
const playButton = document.getElementById("playChordButton");
const clearButton = document.getElementById("clearChordButton");

MGHGameUI.ensureRankedHUD(game);
buildKeyboard();
renderSelection();

function setDifficulty(level, button) {
  difficulty = level;
  gameMode = "training";
  MGH.setWarning("", "#warning");
  MGH.selectExclusive(".accordiModeGroup .menuButton", button);
}

function selectRankedMode(button) {
  difficulty = null;
  gameMode = "ranked";
  MGH.setWarning("", "#warning");
  MGH.selectExclusive(".accordiModeGroup .menuButton", button);
}

function getDifficultyLabel(level = difficulty) {
  if (level === "easy") return "Facile";
  if (level === "medium") return "Medio";
  if (level === "hard") return "Difficile";
  return "";
}

function startGame() {
  if (gameMode === "ranked") {
    showRankedIntro({
      gameName: ACCORDI_GAME_NAME,
      title: "Modalità Classificata",
      text: "Costruisci 10 accordi. La difficoltà cresce fino ai rivolti e il punteggio premia velocità e precisione.",
      onStart: startRankedGame
    });
    return;
  }

  if (!difficulty) {
    MGH.setWarning("Seleziona una difficoltà", "#warning");
    return;
  }

  MGH.setWarning("", "#warning");
  MGHGameUI.enterTraining({ menu, game, modeLabel: getDifficultyLabel(), feedbackEl });
  showBackButton();
  newRound();
}

function startRankedGame(nickname = "") {
  const session = startRankedMode(ACCORDI_GAME_NAME);
  session.setUsername(nickname);
  MGHGameUI.enterRanked({
    menu,
    game,
    score: session.totalScore,
    current: session.currentQuestion,
    total: session.maxQuestions,
    feedbackEl
  });
  hideBackButton();
  startRankedElapsedTimer(session.startTime);
  updateRankedUI();
  newRound();
}

function goBack() {
  if (gameMode === "ranked") return;
  roundLocked = false;
  difficulty = null;
  currentChord = null;
  selectedNotes = [];
  if (typeof resetRankedMode === "function") resetRankedMode();
  MGHGameUI.returnToMenu({ menu, game, feedbackEl });
  showBackButton();
  resetKeyboardState();
  renderSelection();
}

function goHome() {
  window.location.href = "../index.html";
}

function newRound() {
  roundLocked = false;
  selectedNotes = [];
  setFeedback("");
  resetKeyboardState();
  setGameControlsDisabled(false);

  const level = gameMode === "ranked" ? getRankedDifficulty() : difficulty;
  currentChord = createChordQuestion(level);
  questionText.textContent = getChordPrompt(currentChord);
  renderSelection();

  if (gameMode === "ranked") {
    updateRankedUI();
    startRankedQuestionTimer();
  }
}

function createChordQuestion(level) {
  const rootPool = level === "easy" ? NATURAL_ROOTS : ALL_ROOTS;
  const typePool = level === "easy"
    ? ["major", "minor"]
    : ["major", "minor", "diminished", "augmented"];
  let question = null;

  for (let attempt = 0; attempt < 16; attempt++) {
    const root = rootPool[Math.floor(Math.random() * rootPool.length)];
    const type = typePool[Math.floor(Math.random() * typePool.length)];
    const inversion = level === "hard" ? Math.floor(Math.random() * 3) : null;
    const key = `${root}:${type}:${inversion ?? "any"}`;
    question = { root, type, inversion, key, level };
    if (key !== previousChordKey) break;
  }

  previousChordKey = question.key;
  return question;
}

function getChordPrompt(chord) {
  const quality = CHORD_TYPES[chord.type];
  const inversion = chord.inversion === null ? "" : ` ${INVERSION_LABELS[chord.inversion]}`;
  return `Costruisci ${NOTE_NAMES[chord.root]} ${quality.label}${inversion}`;
}

function getExpectedPitchClasses(chord = currentChord) {
  return CHORD_TYPES[chord.type].intervals.map(interval => (chord.root + interval) % 12);
}

function getOrderedPitchClasses(chord = currentChord) {
  const pitchClasses = getExpectedPitchClasses(chord);
  if (chord.inversion === null || chord.inversion === 0) return pitchClasses;
  return [...pitchClasses.slice(chord.inversion), ...pitchClasses.slice(0, chord.inversion)];
}

function buildKeyboard() {
  pianoKeyboard.replaceChildren();
  let whiteIndex = 0;

  for (let midi = KEYBOARD_START_MIDI; midi <= KEYBOARD_END_MIDI; midi++) {
    const pitchClass = midi % 12;
    const isWhite = WHITE_PITCH_CLASSES.has(pitchClass);
    const key = document.createElement("button");
    key.type = "button";
    key.className = `chordPianoKey ${isWhite ? "whiteKey" : "blackKey"}`;
    key.dataset.midi = String(midi);
    key.dataset.pitchClass = String(pitchClass);
    key.style.setProperty("--white-index", String(whiteIndex));
    key.setAttribute("aria-label", `${NOTE_NAMES[pitchClass]} ${getOctaveNumber(midi)}`);
    key.setAttribute("aria-pressed", "false");
    key.innerHTML = `<span>${NOTE_NAMES[pitchClass]}</span>`;
    key.addEventListener("click", () => toggleNote(midi, key));
    pianoKeyboard.appendChild(key);
    if (isWhite) whiteIndex++;
  }
}

function getOctaveNumber(midi) {
  return Math.floor(midi / 12) - 1;
}

function toggleNote(midi, key) {
  if (roundLocked) return;
  const index = selectedNotes.indexOf(midi);

  if (index >= 0) {
    selectedNotes.splice(index, 1);
    key.classList.remove("selected");
    key.setAttribute("aria-pressed", "false");
  } else {
    if (selectedNotes.length >= 3) {
      setFeedback("Puoi selezionare esattamente tre note.", "neutral");
      return;
    }
    selectedNotes.push(midi);
    selectedNotes.sort((a, b) => a - b);
    key.classList.add("selected");
    key.setAttribute("aria-pressed", "true");
  }

  setFeedback("");
  renderSelection();
  playNote(midi, 0.42);
}

function renderSelection() {
  if (!selectedNotes.length) {
    selectedNotesEl.textContent = "Nessuna nota";
    return;
  }
  selectedNotesEl.textContent = selectedNotes
    .map(midi => `${NOTE_NAMES[midi % 12]}${getOctaveNumber(midi)}`)
    .join(" · ");
}

function clearSelection() {
  if (roundLocked) return;
  selectedNotes = [];
  document.querySelectorAll(".chordPianoKey.selected").forEach(key => {
    key.classList.remove("selected");
    key.setAttribute("aria-pressed", "false");
  });
  setFeedback("");
  renderSelection();
}

function checkChord() {
  if (roundLocked) return;
  if (selectedNotes.length !== 3) {
    setFeedback("Seleziona tre note prima di verificare.", "neutral");
    return;
  }

  roundLocked = true;
  const selectedPitchClasses = selectedNotes.map(midi => midi % 12);
  const expectedPitchClasses = getExpectedPitchClasses();
  const hasCorrectNotes = new Set(selectedPitchClasses).size === 3 &&
    expectedPitchClasses.every(pitchClass => selectedPitchClasses.includes(pitchClass));
  const hasCorrectBass = currentChord.inversion === null ||
    selectedPitchClasses[0] === getOrderedPitchClasses()[0];
  const isCorrect = hasCorrectNotes && hasCorrectBass;

  revealKeyboardResult(isCorrect, expectedPitchClasses);
  setGameControlsDisabled(true);
  playSelectedChord();

  const correctNotes = getOrderedPitchClasses().map(pitchClass => NOTE_NAMES[pitchClass]).join(" · ");
  if (isCorrect) {
    setFeedback(MGH.getAnswerFeedback(true, "Accordo costruito correttamente."), "correct");
  } else {
    setFeedback(MGH.getAnswerFeedback(false, `Le note corrette sono: ${correctNotes}.`), "wrong");
  }

  if (gameMode === "ranked") {
    handleRankedAnswer(isCorrect);
    return;
  }

  window.setTimeout(newRound, 2200);
}

function revealKeyboardResult(isCorrect, expectedPitchClasses) {
  document.querySelectorAll(".chordPianoKey").forEach(key => {
    const pitchClass = Number(key.dataset.pitchClass);
    if (key.classList.contains("selected")) {
      key.classList.add(isCorrect ? "correctKey" : "wrongKey");
    } else if (!isCorrect && expectedPitchClasses.includes(pitchClass)) {
      key.classList.add("correctKey");
    }
  });
}

function resetKeyboardState() {
  document.querySelectorAll(".chordPianoKey").forEach(key => {
    key.disabled = false;
    key.classList.remove("selected", "correctKey", "wrongKey");
    key.setAttribute("aria-pressed", "false");
  });
}

function setGameControlsDisabled(disabled) {
  document.querySelectorAll(".chordPianoKey").forEach(key => {
    key.disabled = disabled;
  });
  verifyButton.disabled = disabled;
  clearButton.disabled = disabled;
  playButton.disabled = disabled && !selectedNotes.length;
}

function playSelectedChord() {
  if (!selectedNotes.length) {
    if (!roundLocked) setFeedback("Seleziona almeno una nota da ascoltare.", "neutral");
    return;
  }
  playChord(selectedNotes);
}

function getAudioContext() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioContext = new AudioContextClass();
  }
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}

function midiToFrequency(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function playNote(midi, duration = 0.5, startDelay = 0) {
  const context = getAudioContext();
  if (!context) return;
  const start = context.currentTime + startDelay;
  const gain = context.createGain();
  const oscillator = context.createOscillator();
  oscillator.type = "triangle";
  oscillator.frequency.value = midiToFrequency(midi);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.13, start + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.04);
}

function playChord(midis) {
  [...midis].sort((a, b) => a - b).forEach(midi => playNote(midi, 1.05));
}

function setFeedback(message, state = "neutral") {
  MGH.setGameFeedback(feedbackEl, message, state);
}

function handleRankedAnswer(isCorrect) {
  const session = answerRankedQuestion(isCorrect);
  updateRankedUI();
  if (session?.isComplete()) {
    window.setTimeout(showRankedResults, 2200);
  } else {
    window.setTimeout(newRound, 2200);
  }
}

function updateRankedUI() {
  if (!currentRankedSession) return;
  updateRankedProgressUI({
    score: currentRankedSession.totalScore,
    current: currentRankedSession.currentQuestion,
    total: currentRankedSession.maxQuestions
  });
}

async function showRankedResults() {
  stopRankedElapsedTimer();
  const finalData = await finishRankedMode();
  if (!finalData?.session) {
    setFeedback("Errore nel salvataggio della classifica.", "wrong");
    return;
  }

  MGHGameUI.returnToMenu({ menu, game, feedbackEl });
  showBackButton();
  await showRankedCompletionModal({
    gameName: ACCORDI_GAME_NAME,
    session: finalData.session,
    saveResult: finalData.result,
    saved: finalData.saved
  });
  gameMode = "training";
  difficulty = null;
  currentChord = null;
  selectedNotes = [];
  roundLocked = false;
}

function hideLeaderboardButton() {
  document.getElementById("rankedLeaderboardBtn")?.classList.add("hidden");
  document.getElementById("gameModeHelpBtn")?.classList.add("hidden");
}

function showLeaderboardButton() {
  document.getElementById("rankedLeaderboardBtn")?.classList.remove("hidden");
  document.getElementById("gameModeHelpBtn")?.classList.remove("hidden");
}

function hideBackButton() {
  document.getElementById("backButton")?.classList.add("hidden");
}

function showBackButton() {
  document.getElementById("backButton")?.classList.remove("hidden");
}
