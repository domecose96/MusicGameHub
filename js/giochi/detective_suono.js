const DETECTIVE_GAME_NAME = "detective_suono";
const TOTAL_QUESTIONS = 10;

const modeConfig = {
  easy: {
    label: "Facile",
    pool: ["type", "pitch", "volume", "duration"],
    combined: false
  },
  medium: {
    label: "Medio",
    pool: ["pitchVolume", "pitchDuration", "typeVolume"],
    combined: true
  },
  hard: {
    label: "Difficile",
    pool: ["full"],
    combined: true
  }
};

let selectedMode = null;
let gameMode = "training";
let currentQuestion = null;
let questionIndex = 0;
let score = 0;
let correctCount = 0;
let wrongCount = 0;
let questionStart = 0;
let rankedStart = 0;
let answered = false;
let audioContext = null;

const menu = document.getElementById("menu");
const game = document.getElementById("game");
const warning = document.getElementById("warning");
const questionText = document.getElementById("questionText");
const clueType = document.getElementById("clueType");
const wavePath = document.getElementById("wavePath");
const answersEl = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const questionCounter = document.getElementById("questionCounter");
const detectiveHud = document.getElementById("detectiveHud");
const timerBox = document.getElementById("timerBox");
const timerEl = document.getElementById("timer");
let rankedTimerInterval = null;

function getModeLabel() {
  if (gameMode === "ranked") return "Classificata";
  return modeConfig[selectedMode]?.label || "";
}

function setDetectiveMode(mode, button) {
  selectedMode = mode;
  gameMode = "training";
  warning.textContent = "";
  MGH.selectExclusive("#menu .menuButton", button);
}

function selectDetectiveRanked(button) {
  selectedMode = null;
  gameMode = "ranked";
  warning.textContent = "";
  MGH.selectExclusive("#menu .menuButton", button);
}

function startDetectiveGame() {
  if (gameMode === "ranked") {
    showRankedIntro({
      gameName: DETECTIVE_GAME_NAME,
      title: "Detective del suono classificata",
      text: "Analizza 10 indizi sonori. Il punteggio premia precisione, difficoltà e velocità.",
      onStart: startRankedDetective
    });
    return;
  }

  if (!selectedMode) {
    warning.textContent = "Seleziona una modalità prima di iniziare.";
    return;
  }

  beginGame();
}

function startRankedDetective() {
  selectedMode = null;
  gameMode = "ranked";
  rankedStart = Date.now();
  beginGame();
}

function beginGame() {
  questionIndex = 0;
  score = 0;
  correctCount = 0;
  wrongCount = 0;
  warning.textContent = "";
  menu.classList.add("hidden");
  game.classList.remove("hidden");
  feedback.textContent = "";
  feedback.classList.remove("wrong");

  if (gameMode === "ranked") {
    hideLeaderboardButton();
    showRankedUI();
    detectiveHud?.classList.add("hidden");
    startRankedTimer();
    updateRankedProgressUI({ score, current: questionIndex, total: TOTAL_QUESTIONS });
  } else {
    hideLeaderboardButton();
    hideRankedUI();
    detectiveHud?.classList.add("hidden");
    stopRankedTimer();
  }

  MGH.updateHeaderModeLabel(getModeLabel());
  nextDetectiveQuestion();
}

function getActiveConfig() {
  if (gameMode !== "ranked") return modeConfig[selectedMode];

  if (questionIndex < 3) return modeConfig.easy;
  if (questionIndex < 7) return modeConfig.medium;
  return modeConfig.hard;
}

function getTotalQuestions() {
  return gameMode === "ranked" ? TOTAL_QUESTIONS : null;
}

function nextDetectiveQuestion() {
  const total = getTotalQuestions();
  if (total && questionIndex >= total) {
    finishDetectiveGame();
    return;
  }

  answered = false;
  currentQuestion = createQuestion(getActiveConfig());
  renderQuestion(currentQuestion);
  questionStart = Date.now();
  questionCounter.textContent = total ? `${questionIndex + 1}/${total}` : `${questionIndex + 1}`;

  if (gameMode === "ranked") {
    updateRankedProgressUI({ score, current: questionIndex, total: TOTAL_QUESTIONS });
  }
}

function createQuestion(config) {
  const questionKind = randomItem(config.pool);
  const clue = createClue(questionKind);

  if (questionKind === "type") {
    return buildQuestion(clue, "Suono o rumore?", "type", ["Suono", "Rumore"]);
  }

  if (questionKind === "pitch") {
    return buildQuestion(clue, "Il suono è grave o acuto?", "pitch", ["Grave", "Acuto"]);
  }

  if (questionKind === "volume") {
    return buildQuestion(clue, "Il suono è forte o debole?", "volume", ["Forte", "Debole"]);
  }

  if (questionKind === "duration") {
    return buildQuestion(clue, "Il suono è lungo o corto?", "duration", ["Lungo", "Corto"]);
  }

  if (questionKind === "pitchVolume") {
    return buildCombinedQuestion(clue, "Che caratteristiche riconosci?", ["pitch", "volume"]);
  }

  if (questionKind === "pitchDuration") {
    return buildCombinedQuestion(clue, "Che caratteristiche riconosci?", ["pitch", "duration"]);
  }

  if (questionKind === "typeVolume") {
    return buildCombinedQuestion(clue, "Che caratteristiche riconosci?", ["type", "volume"]);
  }

  return buildCombinedQuestion(clue, "Analizza l'indizio sonoro.", ["type", "pitch", "volume", "duration"]);
}

function createClue(questionKind) {
  const type = questionKind === "typeVolume" || questionKind === "type"
    ? randomItem(["sound", "noise"])
    : questionKind === "full"
      ? randomItem(["sound", "noise"])
      : "sound";

  return {
    type,
    pitch: randomItem(["low", "high"]),
    volume: randomItem(["soft", "loud"]),
    duration: randomItem(["short", "long"])
  };
}

function buildQuestion(clue, title, attribute, labels) {
  const correct = labelFor(clue[attribute], attribute);
  const options = labels.map((label) => ({
    label,
    correct: label === correct
  }));

  return {
    clue,
    title,
    label: labelForKind(attribute),
    correct,
    options,
    explanation: explain(clue, [attribute])
  };
}

function buildCombinedQuestion(clue, title, attributes) {
  const correct = attributes.map((attribute) => labelFor(clue[attribute], attribute)).join(" + ");
  const options = new Set([correct]);

  while (options.size < 4) {
    const candidate = attributes.map((attribute) => {
      const value = attribute === "type"
        ? randomItem(["sound", "noise"])
        : attribute === "pitch"
          ? randomItem(["low", "high"])
          : attribute === "volume"
            ? randomItem(["soft", "loud"])
            : randomItem(["short", "long"]);
      return labelFor(value, attribute);
    }).join(" + ");
    options.add(candidate);
  }

  return {
    clue,
    title,
    label: attributes.map(labelForKind).join(" · "),
    correct,
    options: shuffle([...options]).map((label) => ({ label, correct: label === correct })),
    explanation: explain(clue, attributes)
  };
}

function renderQuestion(question) {
  clueType.textContent = question.label;
  questionText.textContent = question.title;
  feedback.textContent = "";
  feedback.classList.remove("wrong");
  renderWave(question.clue);
  renderAnswers(question.options);
}

function renderAnswers(options) {
  answersEl.innerHTML = "";

  options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "answerButton";
    button.type = "button";
    button.textContent = option.label;
    button.addEventListener("click", () => checkDetectiveAnswer(option, button));
    answersEl.appendChild(button);
  });
}

function checkDetectiveAnswer(option, button) {
  if (answered) return;
  answered = true;

  const buttons = answersEl.querySelectorAll(".answerButton");
  buttons.forEach((item) => {
    item.style.pointerEvents = "none";
    item.classList.remove("correct", "wrong");
  });

  if (option.correct) {
    button.classList.add("correct");
    feedback.textContent = `Indizio corretto! ${currentQuestion.explanation}`;
    correctCount++;
    score += getQuestionScore();
  } else {
    button.classList.add("wrong");
    feedback.classList.add("wrong");
    feedback.textContent = `Quasi. Risposta corretta: ${currentQuestion.correct}. ${currentQuestion.explanation}`;
    wrongCount++;
    buttons.forEach((item) => {
      if (item.textContent === currentQuestion.correct) item.classList.add("correct");
    });
  }

  questionIndex++;

  if (gameMode === "ranked") {
    updateRankedProgressUI({ score, current: questionIndex, total: TOTAL_QUESTIONS });
  }

  setTimeout(nextDetectiveQuestion, 1450);
}

function getQuestionScore() {
  const elapsed = (Date.now() - questionStart) / 1000;
  const multiplier = gameMode === "ranked"
    ? questionIndex < 3 ? 1 : questionIndex < 7 ? 1.5 : 2
    : selectedMode === "easy" ? 1 : selectedMode === "medium" ? 1.5 : 2;

  let points = 100 * multiplier;
  if (elapsed <= 3) points += 25 * multiplier;
  else if (elapsed <= 6) points += 10 * multiplier;
  return Math.round(points);
}

async function finishDetectiveGame() {
  const total = getTotalQuestions();
  const totalTime = gameMode === "ranked" ? Math.round((Date.now() - rankedStart) / 1000) : 0;
  let saved = true;

  if (gameMode === "ranked") {
    saved = await saveRankedScore({
      gameName: DETECTIVE_GAME_NAME,
      totalScore: score,
      correct: correctCount,
      wrong: wrongCount,
      totalQuestions: TOTAL_QUESTIONS,
      totalTime
    });
  }

  game.classList.add("hidden");
  menu.classList.remove("hidden");
  hideRankedUI();
  showLeaderboardButton();
  stopRankedTimer();
  MGH.updateHeaderModeLabel("");
  warning.innerHTML =
    `Partita completata! Punteggio: <strong>${Math.round(score)}</strong> · Corrette: <strong>${correctCount}/${total}</strong>` +
    (gameMode === "ranked" && !saved ? " · salvataggio non riuscito" : "");

  document.querySelectorAll(".selected").forEach((button) => button.classList.remove("selected"));
  selectedMode = null;
  gameMode = "training";
}

function startRankedTimer() {
  stopRankedTimer();
  if (!timerBox || !timerEl) return;

  timerBox.classList.remove("hidden");
  timerEl.textContent = "0";
  rankedTimerInterval = window.setInterval(() => {
    timerEl.textContent = String(Math.round((Date.now() - rankedStart) / 1000));
  }, 250);
}

function stopRankedTimer() {
  if (rankedTimerInterval) {
    window.clearInterval(rankedTimerInterval);
    rankedTimerInterval = null;
  }
  timerBox?.classList.add("hidden");
}

function renderWave(clue) {
  const points = [];
  const amplitude = clue.volume === "loud" ? 58 : 26;
  const cycles = clue.pitch === "high" ? 10 : 4;
  const durationScale = clue.duration === "short" ? 0.58 : 1;
  const width = 650 * durationScale;
  const startX = 35;
  const centerY = 110;
  const steps = 120;

  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    const x = startX + width * progress;
    const noiseOffset = clue.type === "noise"
      ? Math.sin(progress * 90) * amplitude * 0.42 + (Math.random() - 0.5) * amplitude * 0.8
      : 0;
    const y = centerY + Math.sin(progress * Math.PI * 2 * cycles) * amplitude + noiseOffset;
    points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }

  wavePath.setAttribute("d", points.join(" "));
  wavePath.classList.toggle("noise", clue.type === "noise");
}

function playCurrentClue() {
  if (!currentQuestion) return;

  audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
  const clue = currentQuestion.clue;
  const duration = clue.duration === "long" ? 1.15 : 0.38;
  const gainValue = clue.volume === "loud" ? 0.12 : 0.035;
  const now = audioContext.currentTime;
  const gain = audioContext.createGain();

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  gain.connect(audioContext.destination);

  if (clue.type === "noise") {
    const bufferSize = Math.max(1, Math.floor(audioContext.sampleRate * duration));
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = audioContext.createBufferSource();
    const filter = audioContext.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = clue.pitch === "high" ? 1200 : 260;
    filter.Q.value = 0.8;
    source.buffer = buffer;
    source.connect(filter);
    filter.connect(gain);
    source.start(now);
    source.stop(now + duration);
    return;
  }

  const oscillator = audioContext.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.value = clue.pitch === "high" ? 880 : 180;
  oscillator.connect(gain);
  oscillator.start(now);
  oscillator.stop(now + duration);
}

function labelFor(value, attribute) {
  const labels = {
    type: { sound: "Suono", noise: "Rumore" },
    pitch: { low: "Grave", high: "Acuto" },
    volume: { soft: "Debole", loud: "Forte" },
    duration: { short: "Corto", long: "Lungo" }
  };
  return labels[attribute][value];
}

function labelForKind(attribute) {
  return {
    type: "Suono/Rumore",
    pitch: "Altezza",
    volume: "Intensità",
    duration: "Durata"
  }[attribute] || "Indizio";
}

function explain(clue, attributes) {
  const parts = attributes.map((attribute) => {
    if (attribute === "type") {
      return clue.type === "sound" ? "l'onda è regolare" : "l'onda è irregolare";
    }
    if (attribute === "pitch") {
      return clue.pitch === "high" ? "le onde sono più fitte" : "le onde sono più larghe";
    }
    if (attribute === "volume") {
      return clue.volume === "loud" ? "l'ampiezza è grande" : "l'ampiezza è piccola";
    }
    return clue.duration === "long" ? "l'indizio dura di più" : "l'indizio è breve";
  });

  return parts.join(", ") + ".";
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function goBack() {
  game.classList.add("hidden");
  menu.classList.remove("hidden");
  hideRankedUI();
  showLeaderboardButton();
  stopRankedTimer();
  feedback.textContent = "";
  answersEl.innerHTML = "";
  warning.textContent = "";
  MGH.updateHeaderModeLabel("");
  document.querySelectorAll(".selected").forEach((button) => button.classList.remove("selected"));
  selectedMode = null;
  gameMode = "training";
}
