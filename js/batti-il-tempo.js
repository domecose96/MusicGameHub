const BPM = 80;
const BEAT_DURATION = 60000 / BPM;
const MEASURE_BEATS = 4;
const TOTAL_BEATS = 8;
const LEVEL_ROUNDS = 10;
const SCORE_START_X = 160;
const SCORE_MIDDLE_X = 420;
const SCORE_END_X = 680;
const BEAT_SLOT_WIDTH = (SCORE_MIDDLE_X - SCORE_START_X) / MEASURE_BEATS;
const FEEDBACK_Y = 181;
const SOUND_METRONOME = { frequency: 330, volume: 0.10 };
const SOUND_PATTERN = { frequency: 620, volume: 0.18 };
const SOUND_TAP = { frequency: 820, volume: 0.16 };
const INPUT_ARM_MS = 180;
const PERFECT_MS = 55;
const GOOD_MS = 105;
const ERROR_MS = 155;

const LEVEL_NAMES = {
  1: "Facile",
  2: "Medio",
  3: "Difficile"
};

const LEVEL_POOLS = {
  1: [1, 2, 4],
  2: [1, 2, 4, "rest1", "rest2"],
  3: [0.5, [0.5, 0.5], 1, 2, "rest1", "rest2"]
};

let selectedLevel = null;
let gameMode = "training";
let currentLevel = 1;
let currentPattern = [];
let levelRoundIndex = 0;
let levelPatterns = [];
let events = [];
let taps = [];
let phase = "idle";
let performanceStart = 0;
let audioContext = null;
let timers = [];
let scheduledAudioNodes = [];
let retryWithoutPlayback = false;
let rankedTimerInterval = null;
let rankedStartTime = 0;

const menu = document.getElementById("menu");
const game = document.getElementById("game");
const warning = document.getElementById("warning");
const feedbackEl = document.getElementById("feedback");
const svg = document.getElementById("rhythmSvg");
const questionTextEl = document.getElementById("questionText");
const levelLabel = document.getElementById("levelLabel");
const bpmLabel = document.getElementById("bpmLabel");
const scoreLabel = document.getElementById("scoreLabel");
const beginButton = document.getElementById("beginButton");
const playIcon = document.getElementById("playIcon");
const tapButton = document.getElementById("tapButton");
const countdownOverlay = document.getElementById("countdownOverlay");

if (typeof MGHGameUI !== "undefined") MGHGameUI.ensureRankedHUD(game);

const timerBox = document.getElementById("timerBox");
const timerEl = document.getElementById("timer");

function setLevel(level, el) {
  selectedLevel = level;
  gameMode = "training";
  warning.textContent = "";
  MGH.selectExclusive(".menuButton", el);
}

function selectRankedMode(el) {
  selectedLevel = null;
  gameMode = "ranked";
  warning.textContent = "";
  MGH.selectExclusive(".menuButton", el);
}

function startGame() {
  if (gameMode === "ranked") {
    showRankedIntro({
      gameName: "batti_tempo",
      title: "Modalità Classificata",
      text: "Batti 10 ritmi in 4/4. La difficoltà cresce da Facile a Difficile.",
      onStart: startRankedGame
    });
    return;
  }
  if (!selectedLevel) {
    warning.textContent = "Seleziona una difficoltà";
    return;
  }
  currentLevel = selectedLevel;
  resetLevelSequence();
  warning.textContent = "";
  MGHGameUI.enterTraining({ menu, game, modeLabel: getLevelName(currentLevel), feedbackEl });
  showBackButton();
  loadNewPattern();
}

function startRankedGame(nickname = "") {
  if (typeof startRankedMode !== "function") {
    warning.textContent = "Errore: ranked.js non caricato.";
    return;
  }
  rankedStartTime = Date.now();
  const session = startRankedMode("batti_tempo");
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
  startRankedClock();
  updateRankedUI();
  currentLevel = getRankedLevel();
  resetLevelSequence();
  loadNewPattern();
}

function getRankedLevel() {
  if (!currentRankedSession) return 1;
  const question = currentRankedSession.currentQuestion + 1;
  if (question <= 4) return 1;
  if (question <= 7) return 2;
  return 3;
}

function changeLevel() {
  if (gameMode === "ranked") return;
  clearAllTimers();
  phase = "idle";
  selectedLevel = null;
  MGHGameUI.returnToMenu({ menu, game, feedbackEl });
  resetLevelSequence();
  showBackButton();
}

function loadNewPattern() {
  clearAllTimers();
  phase = "idle";
  retryWithoutPlayback = false;
  taps = [];
  currentPattern = getCurrentLevelPattern();
  events = buildEvents(currentPattern);
  updateLabels(0);
  drawNotation();
  setControls({ begin: false, tap: false });
  setTapLabel("Clicca qui per iniziare");
  questionTextEl.textContent = "Leggi le due battute, poi premi Play";
  setFeedback("");
}

function resetLevelSequence() {
  levelRoundIndex = 0;
  let previousKey = patternKey(currentPattern);
  levelPatterns = Array.from({ length: LEVEL_ROUNDS }, () => {
    const pattern = buildDistinctLevelRoundPattern(currentLevel, previousKey);
    previousKey = patternKey(pattern);
    return pattern;
  });
}

function getCurrentLevelPattern() {
  if (!levelPatterns.length) resetLevelSequence();
  return levelPatterns[levelRoundIndex] || buildLevelRoundPattern(currentLevel);
}

function buildLevelRoundPattern(level) {
  for (let attempt = 0; attempt < 20; attempt++) {
    const pattern = [...buildRandomMeasure(level), ...buildRandomMeasure(level)];
    if (isCompleteTwoMeasurePattern(pattern)) return pattern;
  }
  return [...buildRandomMeasure(1), ...buildRandomMeasure(1)];
}

function buildDistinctLevelRoundPattern(level, avoidKey) {
  let pattern = buildLevelRoundPattern(level);
  for (let attempt = 0; attempt < 20 && patternKey(pattern) === avoidKey; attempt++) {
    pattern = buildLevelRoundPattern(level);
  }
  return pattern;
}

function patternKey(pattern) {
  return pattern.map(item => Array.isArray(item) ? item.join("+") : String(item)).join("|");
}

function buildRandomMeasure(level) {
  for (let attempt = 0; attempt < 30; attempt++) {
    const pattern = [];
    let remaining = MEASURE_BEATS;
    while (remaining > 0) {
      const pool = LEVEL_POOLS[level] || LEVEL_POOLS[1];
      const options = pool.filter(value => getDurationValue(value) <= remaining);
      const value = options[Math.floor(Math.random() * options.length)];
      if (Array.isArray(value)) pattern.push(...value);
      else pattern.push(value);
      remaining -= getDurationValue(value);
    }
    if (hasRequiredMaterial(pattern, level)) return pattern;
  }
  return level === 3 ? [0.5, 0.5, 1, 2] : level === 2 ? [1, "rest1", 1, 1] : [1, 1, 1, 1];
}

function hasRequiredMaterial(pattern, level) {
  const hasNotes = pattern.some(item => typeof item !== "string");
  const hasRest = pattern.some(item => typeof item === "string");
  const hasEighth = pattern.some(item => item === 0.5);
  if (!hasNotes) return false;
  if (level === 2) return hasRest;
  if (level === 3) return hasEighth;
  return true;
}

function getLevelName(level) {
  return LEVEL_NAMES[level] || LEVEL_NAMES[1];
}

function isCompleteTwoMeasurePattern(pattern) {
  let beat = 0;
  let hasMiddleBar = false;
  for (const item of pattern) {
    beat += getDurationValue(item);
    if (Math.abs(beat - MEASURE_BEATS) < 0.001) hasMiddleBar = true;
    if (beat > MEASURE_BEATS && !hasMiddleBar) return false;
  }
  return hasMiddleBar && Math.abs(beat - TOTAL_BEATS) < 0.001;
}

function getDurationValue(item) {
  if (Array.isArray(item)) return item.reduce((sum, value) => sum + getDurationValue(value), 0);
  return typeof item === "string" ? Number(item.replace("rest", "")) : Number(item);
}

function buildEvents(pattern) {
  if (!isCompleteTwoMeasurePattern(pattern)) {
    pattern = buildLevelRoundPattern(1);
  }
  let beat = 0;
  return pattern.map((item, index) => {
    const rest = typeof item === "string";
    const duration = getDurationValue(item);
    const event = {
      id: index,
      rest,
      duration,
      onsetBeat: beat,
      expectedMs: beat * BEAT_DURATION,
      matched: false,
      result: null,
      score: 0
    };
    beat += duration;
    return event;
  });
}

function togglePlay() {
  if (phase === "countdown" || phase === "listen" || phase === "perform") {
    stopPerformance();
    return;
  }
  beginPerformance();
}

function stopPerformance() {
  clearAllTimers();
  phase = "idle";
  retryWithoutPlayback = false;
  taps = [];
  events.forEach(event => {
    event.matched = false;
    event.result = null;
    event.score = 0;
  });
  drawNotation();
  setControls({ begin: false, tap: false });
  setTapLabel("Clicca qui per iniziare");
  questionTextEl.textContent = "Leggi le due battute, poi premi Play";
}

function beginPerformance() {
  if (phase === "countdown" || phase === "listen" || phase === "perform") return;
  clearAllTimers();
  ensureAudioContext();
  const skipPlayback = retryWithoutPlayback;
  retryWithoutPlayback = false;
  taps = [];
  events.forEach(event => {
    event.matched = false;
    event.result = null;
    event.score = 0;
  });
  drawNotation();
  phase = "countdown";
  setControls({ begin: true, tap: true });
  updatePlayButton();
  setTapLabel("Preparati...");
  questionTextEl.textContent = "Preparati: segui il metronomo";

  const startDelay = 120;
  const perfZero = performance.now() + startDelay;
  const listenStart = perfZero + MEASURE_BEATS * BEAT_DURATION;
  const performStart = skipPlayback
    ? listenStart
    : listenStart + TOTAL_BEATS * BEAT_DURATION;
  const endTime = performStart + TOTAL_BEATS * BEAT_DURATION;
  const audioZero = audioContext.currentTime + startDelay / 1000;

  scheduleCountIn(perfZero, audioZero);
  if (!skipPlayback) {
    scheduleAtTime(listenStart, () => {
      phase = "listen";
      questionTextEl.textContent = "Ascolta le due battute";
    });
    scheduleMetronomeAudio(audioZero, MEASURE_BEATS, TOTAL_BEATS);
    schedulePatternAudio(audioZero, MEASURE_BEATS);
  }

  scheduleAtTime(performStart - INPUT_ARM_MS, () => {
    phase = "perform";
    drawNotation();
    questionTextEl.textContent = skipPlayback ? "Ora parti tu" : "Ora batti lo stesso ritmo";
    setControls({ begin: true, tap: false });
    setTapLabel("Tocca qui o premi Spazio");
    performanceStart = performStart;
  });
  scheduleMetronomeAudio(audioZero, MEASURE_BEATS + (skipPlayback ? 0 : TOTAL_BEATS), TOTAL_BEATS);
  scheduleAtTime(endTime + 120, finishPerformance);
}

function scheduleCountIn(perfZero, audioZero) {
  countdownOverlay.classList.remove("hidden");
  for (let beat = 0; beat < 4; beat++) {
    scheduleAtTime(perfZero + beat * BEAT_DURATION, () => {
      countdownOverlay.textContent = String(4 - beat);
    });
    scheduleWoodblockAt(audioZero + beatDurationSeconds() * beat, SOUND_METRONOME.frequency, SOUND_METRONOME.volume);
  }
  scheduleAtTime(perfZero + MEASURE_BEATS * BEAT_DURATION, () => {
    countdownOverlay.classList.add("hidden");
    countdownOverlay.textContent = "";
  });
}

function handleTap() {
  if ((phase === "idle" || phase === "finished") && !beginButton.disabled) {
    beginPerformance();
    return;
  }
  if (phase !== "perform") return;
  scheduleWoodblockAt(audioContext.currentTime, SOUND_TAP.frequency, SOUND_TAP.volume);
  const timestamp = performance.now() - performanceStart;
  const result = scoreTap(timestamp);
  taps.push({ timestamp, ...result });
  flashTapButton();
  drawNotation();
}

function scoreTap(timestamp) {
  const candidates = events.filter(event => !event.rest && !event.matched);
  let nearest = null;
  candidates.forEach(event => {
    const diff = Math.abs(timestamp - event.expectedMs);
    if (!nearest || diff < nearest.diff) nearest = { event, diff };
  });

  if (!nearest || nearest.diff > ERROR_MS) {
    return {
      kind: "extra",
      score: 0,
      x: getXForMs(timestamp),
      message: "Click extra"
    };
  }

  const { event, diff } = nearest;
  event.matched = true;
  if (diff <= PERFECT_MS) {
    event.result = "perfect";
    event.score = 100;
    return { kind: "perfect", score: 100, eventId: event.id, x: getNoteXForEvent(event) };
  }
  if (diff <= GOOD_MS) {
    event.result = "good";
    event.score = 70;
    return { kind: "good", score: 70, eventId: event.id, x: getNoteXForEvent(event) };
  }
  event.result = "error";
  event.score = 0;
  return { kind: "error", score: 0, eventId: event.id, x: getXForMs(timestamp) };
}

function finishPerformance() {
  phase = "finished";
  setControls({ begin: false, tap: true });
  updatePlayButton();
  events.forEach(event => {
    if (!event.rest && !event.matched) event.result = "missed";
  });
  const result = calculateScore();
  updateLabels(result.total);
  updateFeedback(result);
  drawNotation();

  if (gameMode === "ranked") {
    handleRankedAnswer(result.success);
    return;
  }

  if (!result.success) {
    phase = "idle";
    retryWithoutPlayback = true;
    setControls({ begin: true, tap: true });
    setTapLabel("Preparati...");
    questionTextEl.textContent = "Non ancora perfetto: 4 colpi e riparti tu";
    scheduleAt(2400, beginPerformance);
  } else {
    setControls({ begin: false, tap: false });
    setTapLabel("Clicca qui per iniziare");
    advanceLevelRound();
  }
}

function calculateScore() {
  let total = 0;
  let streak = 0;
  let bestStreak = 0;
  events.forEach(event => {
    if (event.rest) return;
    if (event.score > 0) {
      streak += 1;
      bestStreak = Math.max(bestStreak, streak);
      total += event.score + Math.min(30, streak * 5);
    } else {
      streak = 0;
    }
  });
  const noteEvents = events.filter(event => !event.rest);
  const wrongClicks = taps.filter(tap => tap.kind === "extra").length;
  const correctNotes = noteEvents.filter(event => event.result === "perfect" || event.result === "good").length;
  const success = wrongClicks === 0 && correctNotes === noteEvents.length;
  return { total, bestStreak, wrongClicks, correctNotes, noteCount: noteEvents.length, success };
}

function updateFeedback(result) {
  const errors = result.noteCount - result.correctNotes + result.wrongClicks;
  if (result.success) {
    setFeedback(`✔ Ottimo controllo del tempo! Punteggio ${result.total}, serie ${result.bestStreak}.`);
  } else {
    setFeedback(`✖ Errori: ${errors}. Punteggio ${result.total}. Conta i 4 tempi: il ritmo riparte finché non è perfetto.`);
  }
}

function retryRhythm() {
  clearAllTimers();
  retryWithoutPlayback = false;
  taps = [];
  events.forEach(event => {
    event.matched = false;
    event.result = null;
    event.score = 0;
  });
  phase = "idle";
  updateLabels(0);
  setControls({ begin: false, tap: false });
  setTapLabel("Clicca qui per iniziare");
  setFeedback("");
  drawNotation();
}

function advanceLevelRound() {
  if (gameMode === "ranked") return;
  if (levelRoundIndex >= LEVEL_ROUNDS - 1) {
    questionTextEl.textContent = "Difficoltà completata!";
    setFeedback("✔ Hai completato i 10 ritmi della difficoltà.");
    return;
  }
  levelRoundIndex += 1;
  scheduleAt(1400, loadNewPattern);
}

function drawNotation() {
  svg.innerHTML = "";
  drawStaff();
  drawClef();
  drawTimeSignature();
  drawBarLines();
  events.forEach(event => {
    if (event.rest) drawRest(event);
    else drawNote(event);
  });
  drawEighthBeams();
  updateFeedback();
}

function drawStaff() {
  addSvg("line", { x1: 70, y1: 102, x2: 700, y2: 102, class: "svgRhythmLine", stroke: "#000000", "stroke-width": 2.2, opacity: 1 });
  addSvg("line", { x1: SCORE_MIDDLE_X, y1: 82, x2: SCORE_MIDDLE_X, y2: 122, class: "svgBarLine svgMiddleBarLine", stroke: "#000000", "stroke-width": 2.2, opacity: 1 });
}

function drawClef() {
  addSvg("line", { x1: 92, y1: 84, x2: 92, y2: 120, class: "svgBarLine", stroke: "#000000", "stroke-width": 2.8, opacity: 1 });
  addSvg("line", { x1: 100, y1: 84, x2: 100, y2: 120, class: "svgBarLine", stroke: "#000000", "stroke-width": 2.8, opacity: 1 });
}

function drawTimeSignature() {
  ["4", "4"].forEach((value, index) => {
    const text = addSvg("text", {
      x: 132,
      y: index === 0 ? 101 : 126,
      "font-size": 32,
      "font-family": "Arial, sans-serif",
      "font-weight": 900,
      fill: "#000000",
      opacity: 1,
      "text-anchor": "middle"
    });
    text.textContent = value;
  });
}

function drawBarLines() {
  addSvg("line", { x1: 160, y1: 82, x2: 160, y2: 122, class: "svgBarLine", stroke: "#000000", "stroke-width": 2.2, opacity: 1 });
  addSvg("line", { x1: 680, y1: 82, x2: 680, y2: 122, class: "svgBarLine", stroke: "#000000", "stroke-width": 2.2, opacity: 1 });
  addSvg("line", { x1: 690, y1: 82, x2: 690, y2: 122, class: "svgBarLine svgFinalBarLine", stroke: "#000000", "stroke-width": 5.6, opacity: 1 });
}

function drawNote(event) {
  const x = getNoteXForEvent(event);
  const y = 102;
  const isHalf = event.duration === 2;
  const isWhole = event.duration === 4;
  if (event.duration === 0.5 && isDrawnInEighthBeam(event)) return;
  if (event.duration === 0.5) {
    drawSingleEighthNote(x);
    return;
  }
  if (event.duration === 1) {
    drawQuarterNote(x);
    return;
  }
  if (event.duration === 2) {
    drawHalfNote(x);
    return;
  }
  if (event.duration === 4) {
    drawWholeNote(x);
    return;
  }
  addSvg("ellipse", {
    cx: x,
    cy: y,
    rx: isWhole ? 13 : 10,
    ry: isWhole ? 7.5 : 7,
    transform: isWhole ? undefined : `rotate(-18 ${x} ${y})`,
    class: "svgNoteHead",
    fill: isHalf || isWhole ? "#fffdfa" : "#000000",
    stroke: "#000000",
    "stroke-width": 2.35,
    opacity: 1
  });
  if (isWhole) return;
  addSvg("line", { x1: x + 9, y1: y - 2, x2: x + 9, y2: 60, class: "svgStem", stroke: "#000000", "stroke-width": 2.55, opacity: 1 });
}

function drawQuarterNote(x) {
  drawQuarterNoteShape(x, "svgQuarterNote");
}

function drawQuarterNoteShape(x, className) {
  addSvg("path", {
    d: "M840 1288 c0 -630 0 -641 -19 -624 -26 24 -104 46 -160 46 -184 0 -371 -138 -371 -274 0 -131 163 -202 332 -145 114 38 201 117 238 216 19 52 20 77 20 738 0 678 0 685 -20 685 -20 0 -20 -7 -20 -642z",
    class: className,
    fill: "#000000",
    stroke: "none",
    transform: `translate(${x - 25.6} 119.8) scale(0.038 -0.038)`,
    opacity: 1
  });
}

function drawHalfNote(x) {
  addSvg("path", {
    d: "M840 1288 c0 -630 0 -641 -19 -624 -26 24 -104 46 -160 46 -184 0 -371 -138 -371 -274 0 -131 163 -202 332 -145 114 38 201 117 238 216 19 52 20 77 20 738 0 678 0 685 -20 685 -20 0 -20 -7 -20 -642z",
    class: "svgHalfNote",
    fill: "#000000",
    stroke: "none",
    transform: `translate(${x - 25.6} 119.8) scale(0.038 -0.038)`,
    opacity: 1
  });
  addSvg("ellipse", {
    cx: x - 4,
    cy: 101,
    rx: 7.8,
    ry: 4.8,
    transform: `rotate(-20 ${x - 4} 101)`,
    class: "svgHalfNoteHole",
    fill: "#ffffff",
    stroke: "none",
    opacity: 1
  });
}

function drawWholeNote(x) {
  addSvg("path", {
    d: "M800 1540 c-169 -21 -366 -98 -481 -186 -165 -127 -223 -283 -169 -456 56 -183 212 -317 460 -396 397 -126 820 -79 1088 123 154 116 218 268 178 424 -64 248 -292 413 -660 476 -114 19 -319 27 -416 15z",
    class: "svgWholeNote",
    fill: "#000000",
    stroke: "none",
    transform: `translate(${x - 17.5} 121.6) scale(0.0195 -0.0195)`,
    opacity: 1
  });
  addSvg("ellipse", {
    cx: x + 2,
    cy: 102,
    rx: 10,
    ry: 5.3,
    transform: `rotate(-12 ${x + 2} 102)`,
    class: "svgWholeNoteHole",
    fill: "#ffffff",
    stroke: "none",
    opacity: 1
  });
}

function drawRest(event) {
  const x = getNoteXForEvent(event);
  if (event.duration === 2) {
    addSvg("rect", { x: x - 12, y: 94, width: 24, height: 8, class: "svgRest", fill: "#000000", stroke: "#000000", "stroke-width": 2, opacity: 1 });
    return;
  }
  drawQuarterRest(x);
}

function drawQuarterRest(x) {
  addSvg("path", {
    d: "M1007 1969 c-28 -16 -20 -41 38 -108 75 -89 90 -122 89 -206 0 -87 -24 -138 -98 -206 -182 -170 -186 -175 -186 -208 0 -18 5 -42 11 -53 6 -12 81 -104 165 -205 85 -100 154 -185 154 -187 0 -2 -17 4 -38 14 -54 26 -188 60 -238 60 -27 0 -51 -7 -68 -21 -54 -42 -29 -180 66 -359 57 -109 125 -203 139 -195 14 9 11 24 -10 53 -46 65 -66 217 -37 286 21 50 51 66 123 66 71 0 125 -18 201 -68 43 -28 55 -32 67 -22 8 7 15 18 15 25 0 7 -50 70 -111 141 -131 152 -149 185 -149 274 0 108 34 163 175 280 86 72 123 129 111 172 -6 22 -366 456 -390 470 -6 3 -19 2 -29 -3z",
    class: "svgQuarterRest",
    fill: "#000000",
    stroke: "none",
    transform: `translate(${x - 36.5} 139.2) scale(0.032 -0.032)`,
    opacity: 1
  });
}

function drawEighthBeams() {
  for (let index = 0; index < events.length - 1; index++) {
    const first = events[index];
    const second = events[index + 1];
    if (!canBeamEighths(first, second)) continue;
    drawEighthBeam(first, second);
    index += 1;
  }
}

function drawEighthBeam(first, second) {
  const x1 = getNoteXForEvent(first);
  const x2 = getNoteXForEvent(second);
  const stemXOffset = 7;
  const beamY = 58;
  [x1, x2].forEach(x => {
    drawQuarterNoteShape(x, "svgQuarterNote svgDoubleEighthNoteHead");
    addSvg("rect", {
      x: x + stemXOffset - 4,
      y: 42,
      width: 10,
      height: beamY - 42,
      class: "svgStemTrim",
      fill: "#ffffff",
      stroke: "none",
      opacity: 1
    });
  });
  addSvg("rect", {
    x: x1 + stemXOffset,
    y: beamY,
    width: x2 - x1,
    height: 8,
    rx: 0,
    class: "svgBeam",
    fill: "#000000",
    stroke: "none",
    opacity: 1
  });
}

function drawSingleEighthNote(x) {
  drawQuarterNoteShape(x, "svgSingleEighthNoteHead");
  addSvg("path", {
    d: "M1200 2240 l0 -655 27 -6 c15 -3 69 -27 121 -52 201 -98 303 -261 318 -508 5 -79 2 -104 -21 -184 -14 -51 -48 -146 -75 -211 -49 -121 -53 -153 -8 -76 58 99 137 328 157 460 29 186 -44 382 -217 581 -160 186 -214 254 -243 308 -34 63 -60 167 -60 241 l0 47 -35 0 -35 0 0 -655z",
    class: "svgSingleEighthNoteStem",
    fill: "#000000",
    stroke: "none",
    transform: `translate(${x - 21} 99) scale(0.024 -0.024)`,
    opacity: 1
  });
}

function isDrawnInEighthBeam(event) {
  if (event.rest || event.duration !== 0.5) return false;
  const previous = events[event.id - 1];
  const next = events[event.id + 1];
  const previousPairStart = events[event.id - 2];
  if (canBeamEighths(previous, event) && !canBeamEighths(previousPairStart, previous)) return true;
  if (canBeamEighths(event, next) && !canBeamEighths(previous, event)) return true;
  return false;
}

function canBeamEighths(first, second) {
  if (!first || !second || first.rest || second.rest) return false;
  if (first.duration !== 0.5 || second.duration !== 0.5) return false;
  if (Math.abs(second.onsetBeat - first.onsetBeat - 0.5) > 0.001) return false;
  return Math.floor(first.onsetBeat / MEASURE_BEATS) === Math.floor(second.onsetBeat / MEASURE_BEATS);
}

function updateFeedback() {
  events.forEach(event => {
    if (event.rest || !event.result) return;
    const good = event.result === "perfect" || event.result === "good";
    if (!good && event.result !== "missed") return;
    const noteX = getFeedbackXForEvent(event);
    drawFeedbackMark({ x: noteX, ok: good });
  });

  taps.filter(tap => tap.kind === "error" || tap.kind === "extra").forEach(tap => {
    drawFeedbackMark({ x: tap.x, ok: false });
  });
}

function drawFeedbackMark({ x, ok }) {
  const markX = clampScoreX(x);
  const group = addSvg("g", {});
  const circle = addSvg("circle", {
    cx: markX,
    cy: FEEDBACK_Y,
    r: ok ? 13 : 11,
    class: ok ? "svgFeedbackPerfect" : "svgFeedbackError"
  });
  const label = addSvg("text", {
    x: markX,
    y: FEEDBACK_Y,
    class: "svgFeedbackText",
    "font-size": ok ? 18 : 16
  });
  label.textContent = ok ? "✓" : "×";
  group.appendChild(circle);
  group.appendChild(label);
  svg.appendChild(group);
}

function addSvg(tag, attrs = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (value !== undefined && value !== null) el.setAttribute(key, value);
  });
  svg.appendChild(el);
  return el;
}

function getNoteXForEvent(event) {
  const measureIndex = Math.floor(event.onsetBeat / MEASURE_BEATS);
  const localBeat = event.onsetBeat - measureIndex * MEASURE_BEATS;
  const measureStart = measureIndex === 0 ? SCORE_START_X : SCORE_MIDDLE_X;
  const duration = Math.min(event.duration, MEASURE_BEATS - localBeat);
  return measureStart + BEAT_SLOT_WIDTH * (localBeat + duration / 2);
}

function getFeedbackXForEvent(event) {
  const x = getNoteXForEvent(event);
  if (event.duration === 4) return x + 2;
  if (event.duration === 2) return x - 4;
  return x - 3;
}

function getTimelineXForBeat(beat) {
  const measureIndex = Math.max(0, Math.min(1, Math.floor(beat / MEASURE_BEATS)));
  const localBeat = Math.max(0, Math.min(MEASURE_BEATS, beat - measureIndex * MEASURE_BEATS));
  const measureStart = measureIndex === 0 ? SCORE_START_X : SCORE_MIDDLE_X;
  return measureStart + BEAT_SLOT_WIDTH * localBeat;
}

function getXForMs(ms) {
  return getTimelineXForBeat(ms / BEAT_DURATION);
}

function clampScoreX(x) {
  return Math.max(SCORE_START_X + 12, Math.min(SCORE_END_X - 16, x));
}

function scheduleAt(delayMs, callback) {
  timers.push(setTimeout(callback, Math.max(0, delayMs)));
}

function scheduleAtTime(targetTime, callback) {
  scheduleAt(targetTime - performance.now(), callback);
}

function schedulePatternAudio(audioZero, startBeat) {
  events.forEach(event => {
    if (event.rest) return;
    const time = audioZero + beatDurationSeconds() * (startBeat + event.onsetBeat);
    scheduleWoodblockAt(time, SOUND_PATTERN.frequency, SOUND_PATTERN.volume);
  });
}

function scheduleMetronomeAudio(audioZero, startBeat, beatCount = MEASURE_BEATS) {
  for (let beat = 0; beat < beatCount; beat++) {
    scheduleWoodblockAt(audioZero + beatDurationSeconds() * (startBeat + beat), SOUND_METRONOME.frequency, SOUND_METRONOME.volume);
  }
}

function beatDurationSeconds() {
  return BEAT_DURATION / 1000;
}

function ensureAudioContext() {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === "suspended") audioContext.resume();
}

function scheduleWoodblockAt(time, frequency, volume) {
  if (!audioContext) return;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(frequency, time);
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(volume, time + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.085);
  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.start(time);
  osc.stop(time + 0.09);
  scheduledAudioNodes.push(osc);
  osc.onended = () => {
    scheduledAudioNodes = scheduledAudioNodes.filter(node => node !== osc);
  };
}

function setControls({ begin, tap }) {
  beginButton.disabled = false;
  tapButton.disabled = tap;
  updatePlayButton();
}

function setTapLabel(label) {
  tapButton.textContent = label;
}

function updatePlayButton() {
  const playing = phase === "countdown" || phase === "listen" || phase === "perform";
  if (playIcon) playIcon.textContent = playing ? "⏸" : "▶";
  beginButton.setAttribute("aria-label", playing ? "Pausa" : "Avvia");
  beginButton.classList.toggle("isPlaying", playing);
}

function updateLabels(score) {
  const ranked = gameMode === "ranked";
  levelLabel.textContent = getLevelName(currentLevel);
  bpmLabel.textContent = `${BPM} BPM`;
  scoreLabel.textContent = ranked ? `Score ${score}` : `${levelRoundIndex + 1}/${LEVEL_ROUNDS}`;
  levelLabel.classList.toggle("hidden", ranked);
  scoreLabel.classList.toggle("hidden", ranked);
}

function flashTapButton() {
  tapButton.classList.remove("tapPulse");
  void tapButton.offsetWidth;
  tapButton.classList.add("tapPulse");
}

function setFeedback(message) {
  if (typeof MGH !== "undefined" && typeof MGH.setGameFeedback === "function") MGH.setGameFeedback(feedbackEl, message);
  else if (feedbackEl) feedbackEl.textContent = message;
}

function clearAllTimers() {
  timers.forEach(timer => {
    if (typeof timer === "number") {
      clearTimeout(timer);
      cancelAnimationFrame(timer);
    }
  });
  timers = [];
  scheduledAudioNodes.forEach(node => {
    try {
      node.stop();
    } catch (error) {
      // Already ended.
    }
  });
  scheduledAudioNodes = [];
  countdownOverlay.classList.add("hidden");
  countdownOverlay.textContent = "";
}

function hideBackButton() {
  document.getElementById("backButton")?.classList.add("hidden");
}

function showBackButton() {
  document.getElementById("backButton")?.classList.remove("hidden");
}

function updateRankedUI() {
  if (typeof currentRankedSession === "undefined" || !currentRankedSession) return;
  updateRankedProgressUI({
    score: currentRankedSession.totalScore,
    current: currentRankedSession.currentQuestion,
    total: currentRankedSession.maxQuestions
  });
}

function handleRankedAnswer(isCorrect) {
  const session = answerRankedQuestion(isCorrect);
  updateRankedUI();
  if (session && session.isComplete()) {
    setTimeout(showRankedResults, 1700);
  } else {
    setTimeout(() => {
      currentLevel = getRankedLevel();
      resetLevelSequence();
      loadNewPattern();
    }, 1700);
  }
}

async function showRankedResults() {
  stopRankedClock();
  const finalData = await finishRankedMode();
  if (!finalData || !finalData.session) {
    setFeedback("Errore nel salvataggio.");
    return;
  }
  const session = finalData.session;
  MGHGameUI.returnToMenu({ menu, game, feedbackEl });
  showBackButton();
  warning.textContent = "";
  await showRankedCompletionModal({
    gameName: "batti_tempo",
    session,
    saveResult: finalData.result,
    saved: finalData.saved
  });
  gameMode = "training";
  selectedLevel = null;
  phase = "idle";
}

function startRankedClock() {
  stopRankedClock();
  if (!timerBox || !timerEl) return;
  timerBox.classList.remove("hidden");
  timerEl.textContent = "0";
  rankedTimerInterval = setInterval(() => {
    timerEl.textContent = String(Math.round((Date.now() - rankedStartTime) / 1000));
  }, 250);
}

function stopRankedClock() {
  if (rankedTimerInterval) {
    clearInterval(rankedTimerInterval);
    rankedTimerInterval = null;
  }
  timerBox?.classList.add("hidden");
}

document.addEventListener("keydown", event => {
  if (!isSpaceKey(event)) return;
  if (event.repeat) return;
  if (game.classList.contains("hidden")) return;
  event.preventDefault();
  handleTap();
});

document.addEventListener("keyup", event => {
  if (!isSpaceKey(event)) return;
  if (game.classList.contains("hidden")) return;
  event.preventDefault();
});

function isSpaceKey(event) {
  return event.code === "Space" || event.key === " " || event.key === "Spacebar";
}
