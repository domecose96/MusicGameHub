const EMOTION_DATA = {
  joy: {
    emoji: "😊",
    label: "Gioia",
    color: "#f6c447",
    text: "Ritmo vivace, strumenti brillanti e sensazione di apertura o energia.",
    frequency: 660,
    wave: { shape: "bounce", amplitude: 34, wavelength: 86, speed: 0.0026 },
    sound: {
      type: "triangle",
      gain: 0.045,
      filter: "highpass",
      filterFrequency: 420,
      delay: 0.11,
      feedback: 0.16,
      motif: [
        { frequency: 660, start: 0, duration: 0.13, accent: 0.9 },
        { frequency: 825, start: 0.15, duration: 0.13, accent: 1 },
        { frequency: 990, start: 0.3, duration: 0.16, accent: 1.05 },
        { frequency: 1320, start: 0.5, duration: 0.18, accent: 0.72 }
      ],
      loop: 1.05
    }
  },
  calm: {
    emoji: "😌",
    label: "Calma",
    color: "#6bb7ff",
    text: "Andamento lento, suoni morbidi, volume contenuto e respiro regolare.",
    frequency: 330,
    wave: { shape: "calm", amplitude: 18, wavelength: 230, speed: 0.00075 },
    sound: {
      type: "sine",
      gain: 0.034,
      filter: "lowpass",
      filterFrequency: 780,
      delay: 0.34,
      feedback: 0.18,
      motif: [
        { frequency: 262, start: 0, duration: 1.1, accent: 0.8 },
        { frequency: 330, start: 0.24, duration: 1.2, accent: 0.66 },
        { frequency: 392, start: 0.62, duration: 1.05, accent: 0.54 }
      ],
      loop: 2.8
    }
  },
  sadness: {
    emoji: "😢",
    label: "Tristezza",
    color: "#243b72",
    text: "Melodia distesa, pause, sonorità scure e senso di riflessione.",
    frequency: 247,
    wave: { shape: "fall", amplitude: 24, wavelength: 210, speed: 0.00085 },
    sound: {
      type: "triangle",
      gain: 0.036,
      filter: "lowpass",
      filterFrequency: 520,
      delay: 0.42,
      feedback: 0.22,
      motif: [
        { frequency: 330, start: 0, duration: 0.5, accent: 0.82 },
        { frequency: 294, start: 0.48, duration: 0.56, accent: 0.8 },
        { frequency: 262, start: 1.02, duration: 0.62, accent: 0.74 },
        { frequency: 220, start: 1.66, duration: 0.9, accent: 0.62 }
      ],
      loop: 3.1
    }
  },
  anger: {
    emoji: "😠",
    label: "Rabbia",
    color: "#ef6a3a",
    text: "Accenti marcati, ritmo pressante, intensità forte e attacchi decisi.",
    frequency: 180,
    wave: { shape: "attack", amplitude: 38, wavelength: 132, speed: 0.0021 },
    sound: {
      type: "sawtooth",
      gain: 0.038,
      filter: "lowpass",
      filterFrequency: 920,
      delay: 0.06,
      feedback: 0.08,
      noise: true,
      motif: [
        { frequency: 165, start: 0, duration: 0.08, accent: 1.12 },
        { frequency: 165, start: 0.12, duration: 0.08, accent: 1 },
        { frequency: 220, start: 0.24, duration: 0.1, accent: 1.16 },
        { frequency: 146, start: 0.4, duration: 0.15, accent: 1.05 }
      ],
      loop: 0.72
    }
  },
  fear: {
    emoji: "😨",
    label: "Paura",
    color: "#6550a8",
    text: "Suoni sospesi, silenzi improvvisi, tensione e andamento irregolare.",
    frequency: 520,
    wave: { shape: "suspense", amplitude: 24, wavelength: 190, speed: 0.00125 },
    sound: {
      type: "square",
      gain: 0.022,
      filter: "bandpass",
      filterFrequency: 760,
      delay: 0.28,
      feedback: 0.2,
      motif: [
        { frequency: 520, start: 0, duration: 0.22, accent: 0.8 },
        { frequency: 575, start: 0.42, duration: 0.12, accent: 1.02 },
        { frequency: 390, start: 0.86, duration: 0.28, accent: 0.74 },
        { frequency: 640, start: 1.34, duration: 0.13, accent: 0.95 }
      ],
      loop: 2.05
    }
  },
  hope: {
    emoji: "🌱",
    label: "Speranza",
    color: "#8bcf7a",
    text: "Crescendo graduale, armonie luminose e movimento che sembra aprirsi.",
    frequency: 440,
    wave: { shape: "rise", amplitude: 26, wavelength: 156, speed: 0.00135 },
    sound: {
      type: "sine",
      gain: 0.038,
      filter: "lowpass",
      filterFrequency: 1200,
      delay: 0.26,
      feedback: 0.2,
      motif: [
        { frequency: 392, start: 0, duration: 0.34, accent: 0.7 },
        { frequency: 440, start: 0.34, duration: 0.36, accent: 0.78 },
        { frequency: 523, start: 0.72, duration: 0.44, accent: 0.88 },
        { frequency: 659, start: 1.18, duration: 0.72, accent: 0.92 },
        { frequency: 784, start: 1.58, duration: 0.46, accent: 0.42 }
      ],
      loop: 2.55
    }
  }
};

let emotionAudioContext = null;
let emotionOscillator = null;
let emotionGain = null;
let emotionSoundNodes = [];
let emotionLoopTimer = null;
let activeSoundSource = null;
let selectedEmotion = "joy";
let wheelRotation = 0;
let guidedPlaying = false;
let guidedAnimation = null;
let guidedSoundTimer = null;

function createWavePath({ shape = "sine", amplitude = 36, wavelength = 140, center = 75, speed = 0.0015 }, width = 560, time = performance.now()) {
  const points = [];
  for (let x = 20; x <= width - 20; x += 8) {
    const normalized = (x - 20) / (width - 40);
    const phase = (x / wavelength) + (time * speed);
    const cycle = ((phase % 1) + 1) % 1;
    const sine = Math.sin(phase * Math.PI * 2);
    const second = Math.sin(phase * Math.PI * 4 + 0.8);
    let y = center + sine * amplitude;

    if (shape === "bounce") {
      y = center + (sine * amplitude) + (second * amplitude * 0.22);
    } else if (shape === "calm") {
      y = center + Math.sin(phase * Math.PI * 2) * amplitude * 0.78;
    } else if (shape === "fall") {
      const softDip = -Math.abs(Math.sin(phase * Math.PI)) * amplitude * 0.28;
      y = center + sine * amplitude * 0.68 + softDip;
    } else if (shape === "attack") {
      const strike = cycle < 0.18 ? -0.95 : cycle < 0.34 ? 0.85 : Math.sin(phase * Math.PI * 2) * 0.2;
      const weight = Math.sin(phase * Math.PI * 2 + 0.5) * amplitude * 0.12;
      y = center + strike * amplitude + weight;
    } else if (shape === "suspense") {
      const softLine = sine * amplitude * 0.18;
      const pulseUp = Math.pow(Math.max(0, Math.sin(phase * Math.PI * 2 + 0.2)), 12) * amplitude * 0.85;
      const pulseDown = Math.pow(Math.max(0, Math.sin(phase * Math.PI * 2 + Math.PI * 0.86)), 14) * amplitude * 0.42;
      y = center + softLine - pulseUp + pulseDown;
    } else if (shape === "rise") {
      y = center + sine * amplitude * (0.42 + normalized * 0.86);
    }

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
    if (activeSoundSource === "wheel") {
      stopEmotionSound();
      startEmotionSound();
      soundButton.textContent = "Ferma suono";
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
    if (activeSoundSource === "wheel") {
      stopEmotionSound();
      soundButton.textContent = "Ascolta colore sonoro";
    } else {
      stopGuidedPlayback();
      startEmotionSound();
      soundButton.textContent = "Ferma suono";
    }
  });

  render("joy");
}

function startEmotionSound() {
  const emotion = EMOTION_DATA[selectedEmotion] || EMOTION_DATA.joy;
  const sound = emotion.sound || {};
  emotionAudioContext = emotionAudioContext || new (window.AudioContext || window.webkitAudioContext)();
  stopGuidedPlayback();
  stopEmotionSound();
  emotionOscillator = { active: true };
  activeSoundSource = "wheel";
  emotionSoundNodes = [];
  playEmotionMotif(selectedEmotion);
  emotionLoopTimer = window.setInterval(() => playEmotionMotif(selectedEmotion), (sound.loop || 1.6) * 1000);
}

function playEmotionMotif(emotionId) {
  if (!emotionAudioContext || !emotionOscillator) return;
  const emotion = EMOTION_DATA[emotionId] || EMOTION_DATA.joy;
  const sound = emotion.sound || {};
  const motif = sound.motif || [{ frequency: emotion.frequency, start: 0, duration: 0.6 }];
  const now = emotionAudioContext.currentTime + 0.02;
  const bus = createEmotionBus(sound);

  motif.forEach((note, index) => {
    const start = now + note.start;
    const duration = note.duration;
    const oscillator = emotionAudioContext.createOscillator();
    const gain = emotionAudioContext.createGain();
    const filter = emotionAudioContext.createBiquadFilter();
    const peak = (note.gain || sound.gain || 0.036) * (note.accent || 1);

    oscillator.type = note.type || sound.type || "sine";
    oscillator.frequency.setValueAtTime(note.frequency, start);
    filter.type = sound.filter || "lowpass";
    filter.frequency.setValueAtTime(sound.filterFrequency || 900, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak, start + 0.035);
    gain.gain.setTargetAtTime(0.0001, start + Math.max(0.06, duration - 0.08), 0.055);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(bus.input);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.12);
    emotionSoundNodes.push(oscillator, filter, gain);

    if ((emotionId === "joy" && index === 2) || (emotionId === "hope" && index >= 2)) {
      const harmony = emotionAudioContext.createOscillator();
      const harmonyGain = emotionAudioContext.createGain();
      harmony.type = "sine";
      harmony.frequency.setValueAtTime(note.frequency * 1.5, start);
      harmonyGain.gain.setValueAtTime(0.0001, start);
      harmonyGain.gain.exponentialRampToValueAtTime(peak * 0.28, start + 0.04);
      harmonyGain.gain.setTargetAtTime(0.0001, start + Math.max(0.06, duration - 0.08), 0.06);
      harmony.connect(harmonyGain);
      harmonyGain.connect(bus.input);
      harmony.start(start);
      harmony.stop(start + duration + 0.12);
      emotionSoundNodes.push(harmony, harmonyGain);
    }
  });

  if (sound.noise) {
    addNoiseAccent(now, bus.input, sound.gain || 0.03);
  }
}

function createEmotionBus(sound) {
  const input = emotionAudioContext.createGain();
  const output = emotionAudioContext.createGain();
  input.gain.value = 0.9;
  output.gain.value = 0.92;
  input.connect(output);

  if (sound.delay) {
    const delay = emotionAudioContext.createDelay(0.8);
    const feedback = emotionAudioContext.createGain();
    delay.delayTime.value = sound.delay;
    feedback.gain.value = sound.feedback || 0.12;
    input.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(output);
    emotionSoundNodes.push(delay, feedback);
  }

  output.connect(emotionAudioContext.destination);
  emotionSoundNodes.push(input, output);
  return { input, output };
}

function addNoiseAccent(start, destination, level) {
  const duration = 0.12;
  const bufferSize = Math.max(1, Math.floor(emotionAudioContext.sampleRate * duration));
  const buffer = emotionAudioContext.createBuffer(1, bufferSize, emotionAudioContext.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const noise = emotionAudioContext.createBufferSource();
  const filter = emotionAudioContext.createBiquadFilter();
  const gain = emotionAudioContext.createGain();
  noise.buffer = buffer;
  filter.type = "highpass";
  filter.frequency.value = 1200;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(level * 0.48, start + 0.018);
  gain.gain.setTargetAtTime(0.0001, start + 0.05, 0.03);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  noise.start(start);
  noise.stop(start + duration + 0.04);
  emotionSoundNodes.push(noise, filter, gain);
}

function stopEmotionSound() {
  if (!emotionOscillator && !emotionLoopTimer) return;
  if (emotionLoopTimer) {
    window.clearInterval(emotionLoopTimer);
    emotionLoopTimer = null;
  }
  const nodes = [...emotionSoundNodes];
  const stopAt = emotionAudioContext ? emotionAudioContext.currentTime + 0.04 : 0;
  nodes.forEach((node) => {
    if (typeof node.stop === "function") {
      try {
        node.stop(stopAt);
      } catch (error) {
        // Oscillators can only be stopped once.
      }
    }
  });
  window.setTimeout(() => {
    nodes.forEach((node) => {
      if (typeof node.disconnect === "function") {
        try {
          node.disconnect();
        } catch (error) {
          // Already disconnected by the browser.
        }
      }
    });
  }, 180);
  emotionOscillator = null;
  emotionGain = null;
  emotionSoundNodes = [];
  activeSoundSource = null;
}

function stopGuidedPlayback() {
  if (guidedSoundTimer) {
    window.clearInterval(guidedSoundTimer);
    guidedSoundTimer = null;
  }
  if (guidedAnimation) {
    cancelAnimationFrame(guidedAnimation);
    guidedAnimation = null;
  }
  if (guidedPlaying) {
    guidedPlaying = false;
  }
  const guidedButton = document.getElementById("guidedPlayButton");
  if (guidedButton) guidedButton.textContent = "Ascolta";
  const path = document.getElementById("guidedWave");
  const color = document.getElementById("guidedColor");
  const emotionSelect = document.getElementById("guidedEmotion");
  if (path && emotionSelect) {
    const emotion = Object.values(EMOTION_DATA).find((item) => item.label === emotionSelect.value) || EMOTION_DATA.joy;
    const wave = emotion.wave || {};
    path.setAttribute("d", createWavePath({
      ...wave,
      amplitude: Math.max(14, (wave.amplitude || 30) * 0.58),
      center: 85,
      speed: (wave.speed || 0.0015) * 0.35
    }, 720, performance.now()));
    if (color) path.style.stroke = color.value;
  }
}

function resetWheelSoundButton() {
  const soundButton = document.getElementById("emotionSoundButton");
  if (soundButton) soundButton.textContent = "Ascolta colore sonoro";
}

function initGuidedPlayer() {
  const button = document.getElementById("guidedPlayButton");
  const path = document.getElementById("guidedWave");
  const color = document.getElementById("guidedColor");
  const customColor = document.getElementById("guidedCustomColor");
  const glow = document.getElementById("albumGlow");
  const emotionSelect = document.getElementById("guidedEmotion");
  const colorChoices = document.querySelectorAll(".guidedColorChoices button[data-color]");
  if (!button || !path || !color || !customColor || !glow || !emotionSelect) return;

  const emotionByLabel = Object.fromEntries(
    Object.entries(EMOTION_DATA).map(([key, data]) => [data.label, key])
  );

  const getGuidedEmotionKey = () => emotionByLabel[emotionSelect.value] || "joy";

  const getGuidedEmotion = () => {
    const key = getGuidedEmotionKey();
    return EMOTION_DATA[key];
  };

  const applyGuidedColor = (value, fromPreset = false) => {
    color.value = value;
    customColor.value = value;
    glow.style.background = `linear-gradient(135deg, ${value}, #ef6a3a)`;
    path.style.stroke = value;
    colorChoices.forEach((choice) => {
      choice.classList.toggle("active", fromPreset && choice.dataset.color === value);
    });
    draw(performance.now());
  };

  const draw = (time) => {
    const emotion = getGuidedEmotion();
    const wave = emotion.wave || {};
    path.setAttribute("d", createWavePath({
      ...wave,
      amplitude: guidedPlaying ? wave.amplitude || 30 : Math.max(14, (wave.amplitude || 30) * 0.58),
      center: 85,
      speed: guidedPlaying ? wave.speed || 0.0015 : (wave.speed || 0.0015) * 0.35
    }, 720, time));
    path.style.stroke = color.value;
    if (guidedPlaying) guidedAnimation = requestAnimationFrame(draw);
  };

  const syncGuidedEmotion = () => {
    const emotion = getGuidedEmotion();
    applyGuidedColor(emotion.color, true);
    if (guidedPlaying) {
      window.clearInterval(guidedSoundTimer);
      playEmotionMotif(getGuidedEmotionKey());
      guidedSoundTimer = window.setInterval(() => playEmotionMotif(getGuidedEmotionKey()), ((emotion.sound || {}).loop || 1.6) * 1000);
    }
  };

  emotionSelect.addEventListener("change", syncGuidedEmotion);

  colorChoices.forEach((choice) => {
    choice.addEventListener("click", () => applyGuidedColor(choice.dataset.color, true));
  });

  customColor.addEventListener("input", () => {
    applyGuidedColor(customColor.value, false);
  });

  button.addEventListener("click", () => {
    guidedPlaying = !guidedPlaying;
    button.textContent = guidedPlaying ? "Ferma" : "Ascolta";
    if (guidedPlaying) {
      emotionAudioContext = emotionAudioContext || new (window.AudioContext || window.webkitAudioContext)();
      resetWheelSoundButton();
      stopEmotionSound();
      emotionOscillator = { active: true };
      activeSoundSource = "guided";
      emotionSoundNodes = [];
      const emotion = getGuidedEmotion();
      playEmotionMotif(getGuidedEmotionKey());
      guidedSoundTimer = window.setInterval(() => playEmotionMotif(getGuidedEmotionKey()), ((emotion.sound || {}).loop || 1.6) * 1000);
      draw(performance.now());
    } else {
      window.clearInterval(guidedSoundTimer);
      guidedSoundTimer = null;
      stopEmotionSound();
      cancelAnimationFrame(guidedAnimation);
      guidedAnimation = null;
      draw(performance.now());
    }
  });

  syncGuidedEmotion();
}

function initPlaylistBuilder() {
  const form = document.getElementById("playlistForm");
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

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      addCard();
    });
  } else {
    addButton.addEventListener("click", addCard);
  }
  addCard();
}

function initEmotionQuiz() {
  MGH.initCivicQuiz({
    bankId: "emotionSoundtrack",
    quizId: "emotionQuiz",
    resultId: "emotionQuizResult",
    checkId: "checkEmotionQuiz",
    resetId: "resetEmotionQuiz",
    questionsPerRound: 3,
    successMessage: "Perfetto: 3/3. Hai riconosciuto emozioni, ascolto ed empatia.",
    retryMessage: "Rileggi la pagina e riprova: il prossimo giro avra nuove domande."
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
