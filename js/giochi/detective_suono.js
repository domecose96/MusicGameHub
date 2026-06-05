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

const ATTRIBUTE_VALUES = {
  type: ["sound", "noise"],
  pitch: ["low", "high"],
  volume: ["soft", "loud"],
  duration: ["short", "long"]
};

const CLUE_AUDIO = {
  duration: {
    short: 0.26,
    long: 1.9
  },
  frequency: {
    low: 130,
    high: 1320
  },
  noiseFrequency: {
    low: 170,
    high: 3100
  },
  gain: {
    soft: 0.018,
    loud: 0.22
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

MGHGameUI.ensureRankedHUD();

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
  const rankedSession = startRankedMode(DETECTIVE_GAME_NAME);
  rankedStart = rankedSession.startTime;
  beginGame();
}

function beginGame() {
  questionIndex = 0;
  score = 0;
  correctCount = 0;
  wrongCount = 0;
  warning.textContent = "";

  if (gameMode === "ranked") {
    detectiveHud?.classList.add("hidden");
    startRankedTimer();
    MGHGameUI.enterRanked({ menu, game, score, current: questionIndex, total: TOTAL_QUESTIONS, feedbackEl: feedback });
  } else {
    detectiveHud?.classList.add("hidden");
    stopRankedTimer();
    MGHGameUI.enterTraining({ menu, game, modeLabel: getModeLabel(), feedbackEl: feedback });
  }

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
  const questionKind = pickRandomNoRepeat(config.pool, { namespace: "detective-question-kind" });
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
    ? pickRandomNoRepeat(["sound", "noise"], { namespace: `detective-type-${questionKind}` })
    : questionKind === "full"
      ? pickRandomNoRepeat(["sound", "noise"], { namespace: `detective-type-${questionKind}` })
      : "sound";

  return {
    type,
    pitch: pickRandomNoRepeat(["low", "high"], { namespace: `detective-pitch-${questionKind}` }),
    volume: pickRandomNoRepeat(["soft", "loud"], { namespace: `detective-volume-${questionKind}` }),
    duration: pickRandomNoRepeat(["short", "long"], { namespace: `detective-duration-${questionKind}` })
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
  const allOptions = buildOptionCombinations(attributes)
    .map((values) => attributes.map((attribute, index) => labelFor(values[index], attribute)).join(" + "));
  const wrongOptions = shuffle(allOptions.filter((label) => label !== correct));
  const options = shuffle([correct, ...wrongOptions.slice(0, 3)]);

  return {
    clue,
    title,
    label: attributes.map(labelForKind).join(" · "),
    correct,
    options: options.map((label) => ({ label, correct: label === correct })),
    explanation: explain(clue, attributes)
  };
}

function buildOptionCombinations(attributes, index = 0, current = []) {
  if (index >= attributes.length) return [current];

  const attribute = attributes[index];
  const values = ATTRIBUTE_VALUES[attribute] || [];
  return values.flatMap((value) => buildOptionCombinations(attributes, index + 1, [...current, value]));
}

function renderQuestion(question) {
  clueType.textContent = question.label;
  questionText.textContent = question.title;
  MGH.setGameFeedback(feedback, "");
  renderWave(question.clue);
  renderAnswers(question.options);
}

function renderAnswers(options) {
  answersEl.innerHTML = "";
  answersEl.dataset.optionCount = String(options.length);

  options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "answerButton gameAnswerButton";
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
  button.blur();

  if (option.correct) {
    button.classList.add("correct");
    MGH.setGameFeedback(feedback, MGH.getAnswerFeedback(true, "Nuovo indizio in arrivo."), "correct");
  } else {
    button.classList.add("wrong");
    MGH.setGameFeedback(feedback, MGH.getAnswerFeedback(false, `La risposta corretta era ${currentQuestion.correct}. ${currentQuestion.explanation}`), "wrong");
    buttons.forEach((item) => {
      if (item.textContent === currentQuestion.correct) item.classList.add("correct");
    });
  }

  if (gameMode === "ranked") {
    const rankedSession = answerRankedQuestion(option.correct);
    if (rankedSession) {
      correctCount = rankedSession.correct;
      wrongCount = rankedSession.wrong;
      score = rankedSession.totalScore;
      questionIndex = rankedSession.currentQuestion;
    }
  } else {
    if (option.correct) {
      correctCount++;
      score += getQuestionScore();
    } else {
      wrongCount++;
    }
    questionIndex++;
  }

  if (gameMode === "ranked") {
    updateRankedProgressUI({ score, current: questionIndex, total: TOTAL_QUESTIONS });
  }

  setTimeout(nextDetectiveQuestion, 1450);
}

function getQuestionScore() {
  const elapsed = (Date.now() - questionStart) / 1000;
  const difficulty = gameMode === "ranked"
    ? getRankedDifficultyForIndex(questionIndex)
    : selectedMode;

  return getRankedAnswerScore({ isCorrect: true, elapsed, difficulty });
}

async function finishDetectiveGame() {
  const totalTime = gameMode === "ranked" ? Math.round((Date.now() - rankedStart) / 1000) : 0;
  let finalData = null;

  if (gameMode === "ranked") {
    finalData = await finishRankedMode();
  }

  stopRankedTimer();
  warning.textContent = "";
  MGHGameUI.returnToMenu({ menu, game, feedbackEl: feedback });
  if (gameMode === "ranked") {
    await showRankedCompletionModal({
      gameName: DETECTIVE_GAME_NAME,
      session: finalData?.session,
      saveResult: finalData?.result,
      totalScore: score,
      correct: correctCount,
      totalQuestions: TOTAL_QUESTIONS,
      totalTime,
      saved: Boolean(finalData?.saved)
    });
  }

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
  const amplitude = clue.volume === "loud" ? 56 : 22;
  const cycles = clue.pitch === "high" ? 11 : 3.4;
  const durationScale = clue.duration === "short" ? 0.5 : 1;
  const width = 650 * durationScale;
  const startX = 35;
  const centerY = 110;
  const steps = 150;

  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    const x = startX + width * progress;
    const noiseOffset = clue.type === "noise"
      ? getNoiseWaveOffset(progress, amplitude)
      : 0;
    const y = centerY + Math.sin(progress * Math.PI * 2 * cycles) * amplitude + noiseOffset;
    points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }

  wavePath.setAttribute("d", points.join(" "));
  wavePath.classList.toggle("noise", clue.type === "noise");
}

function getNoiseWaveOffset(progress, amplitude) {
  return (
    Math.sin(progress * 76) * amplitude * 0.28 +
    Math.sin(progress * 143 + 0.7) * amplitude * 0.18 +
    Math.sin(progress * 227 + 1.4) * amplitude * 0.12
  );
}

function playCurrentClue() {
  if (!currentQuestion) return;

  audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
  const clue = currentQuestion.clue;
  const duration = CLUE_AUDIO.duration[clue.duration];
  const gainValue = CLUE_AUDIO.gain[clue.volume];
  const attack = clue.duration === "short" ? 0.01 : 0.035;
  const release = clue.duration === "short" ? 0.045 : 0.18;
  const now = audioContext.currentTime;
  const gain = audioContext.createGain();
  const output = audioContext.createGain();

  output.gain.value = 0.9;
  output.connect(audioContext.destination);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(gainValue, now + attack);
  gain.gain.setValueAtTime(gainValue, now + Math.max(attack, duration - release));
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  gain.connect(output);

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
    filter.frequency.value = CLUE_AUDIO.noiseFrequency[clue.pitch];
    filter.Q.value = clue.pitch === "high" ? 2.1 : 1.2;
    source.buffer = buffer;
    source.connect(filter);
    filter.connect(gain);
    source.start(now);
    source.stop(now + duration);
    return;
  }

  const oscillator = audioContext.createOscillator();
  const harmonic = audioContext.createOscillator();
  const harmonicGain = audioContext.createGain();

  oscillator.type = clue.volume === "loud" ? "triangle" : "sine";
  oscillator.frequency.value = CLUE_AUDIO.frequency[clue.pitch];
  harmonic.type = "sine";
  harmonic.frequency.value = CLUE_AUDIO.frequency[clue.pitch] * 2;
  harmonicGain.gain.value = clue.volume === "loud" ? 0.18 : 0.035;

  oscillator.connect(gain);
  harmonic.connect(harmonicGain);
  harmonicGain.connect(gain);
  oscillator.start(now);
  harmonic.start(now);
  oscillator.stop(now + duration);
  harmonic.stop(now + duration);
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
  stopRankedTimer();
  answersEl.innerHTML = "";
  warning.textContent = "";
  MGHGameUI.returnToMenu({ menu, game, feedbackEl: feedback });
  selectedMode = null;
  gameMode = "training";
}
