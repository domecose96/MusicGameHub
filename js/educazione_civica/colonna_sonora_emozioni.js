const EMOTION_DATA = {
  joy: {
    emoji: "😊",
    label: "Gioia",
    color: "#f6c447",
    text: "Ritmo veloce, strumenti brillanti e sensazione di energia.",
    frequency: 660,
    wave: { amplitude: 34, wavelength: 86, speed: 0.0026 }
  },
  calm: {
    emoji: "😌",
    label: "Calma",
    color: "#6bb7ff",
    text: "Pianoforte lento, suoni morbidi e volume basso.",
    frequency: 330,
    wave: { amplitude: 22, wavelength: 190, speed: 0.001 }
  },
  sadness: {
    emoji: "😢",
    label: "Tristezza",
    color: "#243b72",
    text: "Melodia lenta, colore scuro e senso di riflessione.",
    frequency: 247,
    wave: { amplitude: 28, wavelength: 230, speed: 0.0009 }
  },
  anger: {
    emoji: "😠",
    label: "Rabbia",
    color: "#ef6a3a",
    text: "Ritmo forte, energia intensa e attacchi decisi.",
    frequency: 180,
    wave: { amplitude: 48, wavelength: 92, speed: 0.0024 }
  },
  fear: {
    emoji: "😨",
    label: "Paura",
    color: "#6550a8",
    text: "Suoni sospesi, tensione e andamento irregolare.",
    frequency: 520,
    wave: { amplitude: 38, wavelength: 120, speed: 0.0018 }
  },
  hope: {
    emoji: "🌱",
    label: "Speranza",
    color: "#8bcf7a",
    text: "Crescendo positivo, armonie luminose e ritmo moderato.",
    frequency: 440,
    wave: { amplitude: 30, wavelength: 150, speed: 0.0014 }
  }
};

let emotionAudioContext = null;
let emotionOscillator = null;
let emotionGain = null;
let selectedEmotion = "joy";
let wheelRotation = 0;
let guidedPlaying = false;
let guidedAnimation = null;

function createWavePath({ amplitude = 36, wavelength = 140, center = 75, speed = 0.0015 }, width = 560, time = performance.now()) {
  const points = [];
  for (let x = 20; x <= width - 20; x += 8) {
    const phase = (x / wavelength) + (time * speed);
    const y = center + Math.sin(phase * Math.PI * 2) * amplitude;
    points.push(`${x === 20 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return points.join(" ");
}

function animateHeroWave() {
  const waves = document.querySelectorAll(".emotionWave");
  const render = (time) => {
    waves.forEach((wave) => {
      wave.setAttribute("d", createWavePath({ amplitude: 54, wavelength: 210, center: 130, speed: 0.001 }, 620, time));
    });
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
}

function animateEmotionWave() {
  const path = document.getElementById("emotionWavePath");
  if (!path) return;

  const render = (time) => {
    const emotion = EMOTION_DATA[selectedEmotion] || EMOTION_DATA.joy;
    path.setAttribute("d", createWavePath(emotion.wave, 560, time));
    path.style.stroke = emotion.color;
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
}

function initEmotionWheel() {
  const buttons = document.querySelectorAll(".emotionChoice[data-emotion]");
  const wheelFace = document.getElementById("emotionWheelFace");
  const spinButton = document.getElementById("spinEmotionWheel");
  const detail = document.getElementById("emotionDetail");
  const emoji = document.getElementById("emotionEmoji");
  const title = document.getElementById("emotionTitle");
  const text = document.getElementById("emotionText");
  const soundButton = document.getElementById("emotionSoundButton");
  if (!buttons.length || !detail || !emoji || !title || !text || !soundButton) return;

  const render = (emotionId) => {
    const emotion = EMOTION_DATA[emotionId] || EMOTION_DATA.joy;
    selectedEmotion = emotionId;
    buttons.forEach((button) => button.classList.toggle("active", button.dataset.emotion === emotionId));
    detail.className = `emotionDetail ${emotionId}`;
    emoji.textContent = emotion.emoji;
    title.textContent = emotion.label;
    text.textContent = emotion.text;
    document.body.style.setProperty("--current-emotion", emotion.color);
    if (emotionOscillator) {
      emotionOscillator.frequency.setTargetAtTime(emotion.frequency, emotionAudioContext.currentTime, 0.04);
    }
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => render(button.dataset.emotion));
  });

  spinButton?.addEventListener("click", () => {
    if (!wheelFace || spinButton.disabled) return;
    const emotionIds = Object.keys(EMOTION_DATA);
    const targetIndex = Math.floor(Math.random() * emotionIds.length);
    const targetEmotion = emotionIds[targetIndex];
    const sector = 360 / emotionIds.length;
    const targetAngle = targetIndex * sector;
    const extraTurns = 4 + Math.floor(Math.random() * 3);
    const currentAngle = ((wheelRotation % 360) + 360) % 360;
    const correction = (360 - ((currentAngle + targetAngle) % 360)) % 360;
    wheelRotation += extraTurns * 360 + correction;
    spinButton.disabled = true;
    spinButton.textContent = "Gira...";
    wheelFace.style.transform = `rotate(${wheelRotation}deg)`;

    window.setTimeout(() => {
      render(targetEmotion);
      spinButton.disabled = false;
      spinButton.textContent = "Gira";
    }, 3250);
  });

  soundButton.addEventListener("click", () => {
    if (emotionOscillator) {
      stopEmotionSound();
      soundButton.textContent = "Ascolta colore sonoro";
    } else {
      startEmotionSound();
      soundButton.textContent = "Ferma suono";
    }
  });

  render("joy");
}

function startEmotionSound() {
  const emotion = EMOTION_DATA[selectedEmotion] || EMOTION_DATA.joy;
  emotionAudioContext = emotionAudioContext || new (window.AudioContext || window.webkitAudioContext)();
  emotionOscillator = emotionAudioContext.createOscillator();
  emotionGain = emotionAudioContext.createGain();
  emotionOscillator.type = selectedEmotion === "anger" ? "sawtooth" : "sine";
  emotionOscillator.frequency.value = emotion.frequency;
  emotionGain.gain.setValueAtTime(0.0001, emotionAudioContext.currentTime);
  emotionGain.gain.exponentialRampToValueAtTime(0.055, emotionAudioContext.currentTime + 0.08);
  emotionOscillator.connect(emotionGain);
  emotionGain.connect(emotionAudioContext.destination);
  emotionOscillator.start();
}

function stopEmotionSound() {
  if (!emotionOscillator || !emotionGain || !emotionAudioContext) return;
  const osc = emotionOscillator;
  const gain = emotionGain;
  gain.gain.setTargetAtTime(0.0001, emotionAudioContext.currentTime, 0.03);
  osc.stop(emotionAudioContext.currentTime + 0.12);
  osc.addEventListener("ended", () => {
    osc.disconnect();
    gain.disconnect();
  });
  emotionOscillator = null;
  emotionGain = null;
}

function initGuidedPlayer() {
  const button = document.getElementById("guidedPlayButton");
  const path = document.getElementById("guidedWave");
  const color = document.getElementById("guidedColor");
  const glow = document.getElementById("albumGlow");
  if (!button || !path || !color || !glow) return;

  const draw = (time) => {
    path.setAttribute("d", createWavePath({ amplitude: guidedPlaying ? 42 : 20, wavelength: 128, center: 85, speed: guidedPlaying ? 0.002 : 0.0005 }, 720, time));
    path.style.stroke = color.value;
    if (guidedPlaying) guidedAnimation = requestAnimationFrame(draw);
  };

  color.addEventListener("input", () => {
    glow.style.background = `linear-gradient(135deg, ${color.value}, #ef6a3a)`;
    path.style.stroke = color.value;
  });

  button.addEventListener("click", () => {
    guidedPlaying = !guidedPlaying;
    button.textContent = guidedPlaying ? "Stop" : "Play";
    if (guidedPlaying) {
      draw(performance.now());
    } else {
      cancelAnimationFrame(guidedAnimation);
      draw(performance.now());
    }
  });

  draw(performance.now());
}

function initPlaylistBuilder() {
  const titleInput = document.getElementById("songTitle");
  const emotionSelect = document.getElementById("songEmotion");
  const reasonInput = document.getElementById("songReason");
  const addButton = document.getElementById("addSongCard");
  const cards = document.getElementById("playlistCards");
  if (!titleInput || !emotionSelect || !reasonInput || !addButton || !cards) return;

  const addCard = () => {
    const title = titleInput.value.trim() || "Brano della classe";
    const reason = reasonInput.value.trim() || "Emozione da raccontare insieme.";
    const emotion = EMOTION_DATA[emotionSelect.value] || EMOTION_DATA.joy;
    const card = document.createElement("article");
    card.className = "playlistCard";
    card.style.background = `linear-gradient(135deg, ${emotion.color}, #17283a)`;
    card.innerHTML = `
      <span>${emotion.emoji}</span>
      <h3>${title}</h3>
      <p><strong>${emotion.label}</strong> · ${reason}</p>
    `;
    cards.prepend(card);
    titleInput.value = "";
    reasonInput.value = "";
  };

  addButton.addEventListener("click", addCard);
  addCard();
}

function initEmotionQuiz() {
  const quiz = document.getElementById("emotionQuiz");
  const result = document.getElementById("emotionQuizResult");
  if (!quiz || !result) return;

  quiz.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-correct]");
    if (!button) return;
    const card = button.closest("article");
    card.querySelectorAll("button").forEach((item) => {
      item.classList.remove("correct", "wrong");
      item.disabled = true;
    });
    const isCorrect = button.dataset.correct === "true";
    card.dataset.answerCorrect = isCorrect ? "true" : "false";
    button.classList.add(isCorrect ? "correct" : "wrong");
    const correct = card.querySelector('button[data-correct="true"]');
    correct?.classList.add("correct");

    const cards = [...quiz.querySelectorAll("article")];
    const answeredCards = cards.filter((item) => item.querySelector("button.correct, button.wrong")).length;
    const correctAnswers = cards.filter((item) => item.dataset.answerCorrect === "true").length;
    result.textContent = answeredCards >= cards.length ? `Risultato: ${correctAnswers}/${cards.length}` : "";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  animateHeroWave();
  animateEmotionWave();
  initEmotionWheel();
  initGuidedPlayer();
  initPlaylistBuilder();
  initEmotionQuiz();
  MGH.detectActiveSection();
  window.addEventListener("scroll", () => MGH.detectActiveSection(), { passive: true });
});
