function buildSmoothPath(points) {
  if (points.length < 3) return "";

  const commands = [`M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`];

  for (let i = 1; i < points.length - 1; i += 1) {
    const current = points[i];
    const next = points[i + 1];
    const midX = (current.x + next.x) / 2;
    const midY = (current.y + next.y) / 2;
    commands.push(`Q ${current.x.toFixed(1)} ${current.y.toFixed(1)} ${midX.toFixed(1)} ${midY.toFixed(1)}`);
  }

  const last = points[points.length - 1];
  commands.push(`T ${last.x.toFixed(1)} ${last.y.toFixed(1)}`);

  return commands.join(" ");
}

function buildTravellingWavePath({ width, startX, centerY, amplitude, wavelength, phase, step = 4, brassy = false, noise = false }) {
  const points = [];

  for (let x = startX - wavelength; x <= startX + width + wavelength; x += step) {
    const angle = ((x / wavelength) * Math.PI * 2) + phase;
    const harmonic = brassy ? Math.sin(angle * 2 + 0.65) * amplitude * 0.2 : 0;
    const rough = noise
      ? Math.sin(angle * 1.7 + 0.4) * amplitude * 0.42 + Math.cos(angle * 2.8 + 1.2) * amplitude * 0.28
      : 0;
    const y = centerY + Math.sin(angle) * amplitude + harmonic + rough;
    points.push({ x, y });
  }

  return buildSmoothPath(points);
}

function initInteractiveWave() {
  const path = document.getElementById("interactiveWavePath");
  const frequencyRange = document.getElementById("frequencyRange");
  const amplitudeRange = document.getElementById("amplitudeRange");
  const caption = document.getElementById("waveCaption");
  const modeButtons = document.querySelectorAll("[data-wave-mode]");
  const soundToggle = document.getElementById("soundToggle");
  if (!path || !frequencyRange || !amplitudeRange || !caption || !modeButtons.length) return;

  let mode = "sound";
  let audioContext = null;
  let oscillator = null;
  let oscillatorGain = null;
  let noiseSource = null;
  let noiseFilter = null;
  let noiseGain = null;
  let isAudioOn = false;

  const frequencyToHz = (value) => 140 + ((Number(value) - 2) / 6) * 740;
  const amplitudeToGain = (value) => 0.025 + ((Number(value) - 18) / 40) * 0.18;

  const createNoiseBuffer = (context) => {
    const bufferSize = context.sampleRate * 2;
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i += 1) {
      output[i] = Math.random() * 2 - 1;
    }

    return buffer;
  };

  const setSoundToggleState = () => {
    if (!soundToggle) return;

    soundToggle.classList.toggle("active", isAudioOn);
    soundToggle.setAttribute("aria-pressed", String(isAudioOn));
    soundToggle.textContent = isAudioOn ? "Ferma suono" : "Ascolta onda";
  };

  const updateAudio = () => {
    if (!isAudioOn || !audioContext || !oscillatorGain || !noiseGain) return;

    const frequency = Number(frequencyRange.value);
    const amplitude = Number(amplitudeRange.value);
    const now = audioContext.currentTime;
    const targetFrequency = frequencyToHz(frequency);
    const targetGain = amplitudeToGain(amplitude);

    if (oscillator) {
      oscillator.frequency.setTargetAtTime(targetFrequency, now, 0.03);
    }

    if (noiseFilter) {
      noiseFilter.frequency.setTargetAtTime(Math.min(1800, targetFrequency * 1.55), now, 0.04);
    }

    oscillatorGain.gain.setTargetAtTime(mode === "sound" ? targetGain : 0, now, 0.03);
    noiseGain.gain.setTargetAtTime(mode === "noise" ? targetGain * 0.75 : 0, now, 0.03);
  };

  const stopAudio = () => {
    isAudioOn = false;

    try {
      oscillator?.stop();
    } catch (error) {
      // Il nodo potrebbe essere gia' stato fermato dal browser.
    }

    try {
      noiseSource?.stop();
    } catch (error) {
      // Il nodo potrebbe essere gia' stato fermato dal browser.
    }

    oscillator = null;
    oscillatorGain = null;
    noiseSource = null;
    noiseFilter = null;
    noiseGain = null;
    setSoundToggleState();
  };

  const startAudio = async () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    if (!audioContext) {
      audioContext = new AudioContext();
    }

    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    oscillator = audioContext.createOscillator();
    oscillator.type = "sine";
    oscillatorGain = audioContext.createGain();
    oscillatorGain.gain.value = 0;
    oscillator.connect(oscillatorGain).connect(audioContext.destination);

    noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = createNoiseBuffer(audioContext);
    noiseSource.loop = true;
    noiseFilter = audioContext.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.Q.value = 0.9;
    noiseGain = audioContext.createGain();
    noiseGain.gain.value = 0;
    noiseSource.connect(noiseFilter).connect(noiseGain).connect(audioContext.destination);

    oscillator.start();
    noiseSource.start();
    isAudioOn = true;
    setSoundToggleState();
    updateAudio();
  };

  const buildSoundPath = (frequency, amplitude, time) => {
    const width = 664;
    const startX = 28;
    const centerY = 120;

    return buildTravellingWavePath({
      width,
      startX,
      centerY,
      amplitude,
      wavelength: Math.max(56, 260 / frequency),
      phase: time * 0.002,
      step: 4
    });
  };

  const buildNoisePath = (frequency, amplitude, time) => {
    const points = [];
    const width = 664;
    const startX = 28;
    const centerY = 120;
    const steps = 36 + frequency * 4;

    for (let i = 0; i <= steps; i += 1) {
      const progress = i / steps;
      const x = startX + progress * width;
      const phase = time * 0.006;
      const jagged = Math.sin(i * 1.7 + phase) * 0.55 + Math.sin(i * 3.9 + phase * 0.7) * 0.35 + Math.cos(i * 0.8 + phase * 1.2) * 0.25;
      const y = centerY + jagged * amplitude;
      points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }

    return points.join(" ");
  };

  const renderWave = (time = 0) => {
    const frequency = Number(frequencyRange.value);
    const amplitude = Number(amplitudeRange.value);
    const isNoise = mode === "noise";

    path.setAttribute(
      "d",
      isNoise ? buildNoisePath(frequency, amplitude, time) : buildSoundPath(frequency, amplitude, time)
    );
    path.style.stroke = isNoise ? "#7d858d" : "#ff7a1a";
    caption.textContent = isNoise
      ? "Onda irregolare: il rumore non ha un'altezza precisa."
      : "Onda regolare: il suono ha un'altezza riconoscibile.";
  };

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      mode = button.dataset.waveMode;
      modeButtons.forEach((item) => item.classList.toggle("active", item === button));
      renderWave();
      updateAudio();
    });
  });

  frequencyRange.addEventListener("input", () => {
    renderWave(performance.now());
    updateAudio();
  });

  amplitudeRange.addEventListener("input", () => {
    renderWave(performance.now());
    updateAudio();
  });

  if (soundToggle) {
    soundToggle.addEventListener("click", async () => {
      if (isAudioOn) {
        stopAudio();
        return;
      }

      await startAudio();
    });
  }

  window.addEventListener("pagehide", stopAudio);

  const animateLabWave = (time) => {
    renderWave(time);
    requestAnimationFrame(animateLabWave);
  };

  requestAnimationFrame(animateLabWave);
}

function initTravellingWaves() {
  const waves = [...document.querySelectorAll(".travellingWave")];
  if (!waves.length) return;

  const buildWavePath = (wave, time) => {
    const svg = wave.closest("svg");
    const viewBox = svg?.viewBox?.baseVal;
    const width = viewBox?.width || 520;
    const amplitude = Number(wave.dataset.amplitude || 32);
    const wavelength = Number(wave.dataset.wavelength || 160);
    const speed = Number(wave.dataset.speed || 0.002);
    const center = Number(wave.dataset.center || 65);
    const brassy = wave.dataset.shape === "brassy";
    const noise = wave.dataset.shape === "noise";
    const fine = wave.closest(".timbreInstrument") ? 2 : 4;
    const phase = time * speed;

    return buildTravellingWavePath({
      width,
      startX: 0,
      centerY: center,
      amplitude,
      wavelength,
      phase,
      step: fine,
      brassy,
      noise
    });
  };

  const animate = (time) => {
    waves.forEach((wave) => {
      wave.setAttribute("d", buildWavePath(wave, time));
    });
    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
}

function initEarInteractive() {
  const parts = {
    padiglione: {
      step: "1",
      title: "Padiglione auricolare",
      text: "Raccoglie le onde sonore dall'ambiente e le indirizza verso il condotto uditivo esterno."
    },
    condotto: {
      step: "2",
      title: "Condotto uditivo esterno",
      text: "Trasporta le onde sonore fino alla membrana timpanica, cioè il timpano."
    },
    timpano: {
      step: "3",
      title: "Membrana timpanica",
      text: "Vibra quando viene colpita dalle onde sonore e trasmette il movimento agli ossicini."
    },
    ossicini: {
      step: "4",
      title: "Martello, incudine e staffa",
      text: "Sono tre piccoli ossi che amplificano le vibrazioni e le inviano verso l'orecchio interno."
    },
    canali: {
      step: "5",
      title: "Canali semicircolari",
      text: "Non servono principalmente per l'udito, ma aiutano a percepire equilibrio e movimento della testa."
    },
    coclea: {
      step: "6",
      title: "Coclea",
      text: "Trasforma le vibrazioni meccaniche in impulsi nervosi interpretabili dal cervello."
    },
    nervo: {
      step: "7",
      title: "Nervo acustico",
      text: "Trasporta gli impulsi elettrici dalla coclea al cervello, dove il suono viene riconosciuto."
    }
  };

  const buttons = document.querySelectorAll(".earHotspot");
  const step = document.getElementById("earInfoStep");
  const title = document.getElementById("earInfoTitle");
  const text = document.getElementById("earInfoText");
  const stage = document.querySelector(".earPlainFigure");
  const playBtn = document.getElementById("playEarSound");
  const resetBtn = document.getElementById("resetEarSound");
  const caption = document.getElementById("earLabCaption");

  if (!buttons.length || !step || !title || !text || !stage) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const data = parts[button.dataset.earPart];
      if (!data) return;

      buttons.forEach((item) => item.classList.toggle("active", item === button));
      step.classList.remove("earOuter", "earMiddle", "earInner");
      ["earOuter", "earMiddle", "earInner"].forEach((regionClass) => {
        if (button.classList.contains(regionClass)) {
          step.classList.add(regionClass);
        }
      });
      step.textContent = data.step;
      title.textContent = data.title;
      text.textContent = data.text;
    });
  });

  const resetSound = () => {
    stage.classList.remove("playing");
    if (caption) {
      caption.textContent = "Premi play per seguire il viaggio del suono: dall'orecchio esterno fino al cervello.";
    }
  };

  const playSound = () => {
    stage.classList.remove("playing");
    
    // Force reflow per riavviare l'animazione
    void stage.offsetWidth;
    
    stage.classList.add("playing");
    if (caption) {
      caption.textContent = "Il suono entra dal padiglione, attraversa il condotto, fa vibrare il timpano, passa dagli ossicini e arriva alla coclea.";
    }
  };

  if (playBtn) playBtn.addEventListener("click", playSound);
  if (resetBtn) resetBtn.addEventListener("click", resetSound);

  resetSound();
}

function initElementsActiveNav() {
  const sectionIds = [...document.querySelectorAll(".elementsNav .navBtn")]
    .map((button) => {
      const onclick = button.getAttribute("onclick") || "";
      const match = onclick.match(/scrollToSection\(['"]([^'"]+)['"]\)/);
      return match?.[1];
    })
    .filter(Boolean);

  const detectActiveSection = () => {
    let currentSection = null;

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section && section.getBoundingClientRect().top < window.innerHeight / 3) {
        currentSection = id;
      }
    });

    if (currentSection) MGH.setActiveNav(currentSection);
  };

  window.addEventListener("scroll", detectActiveSection, { passive: true });
  detectActiveSection();
}

document.addEventListener("DOMContentLoaded", () => {
  initInteractiveWave();
  initTravellingWaves();
  initEarInteractive();
  initElementsActiveNav();
});
