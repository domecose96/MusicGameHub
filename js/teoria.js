// Detecta quale sezione è visibile durante lo scroll
let isHashScrollPending = false;

function detectActiveSection() {
  if (isHashScrollPending) return;
  MGH.detectActiveSection(".siteSection");
}

// Listener per lo scroll
window.addEventListener('scroll', detectActiveSection);

document.addEventListener("DOMContentLoaded", () => {
  const targetId = window.location.hash.slice(1);

  if (targetId && document.getElementById(targetId)) {
    isHashScrollPending = true;
    MGH.setActiveNav(targetId);

    setTimeout(() => scrollToSection(targetId), 80);
    setTimeout(() => {
      isHashScrollPending = false;
      MGH.setActiveNav(targetId);
    }, 700);
  } else {
    detectActiveSection();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const hintNote = document.getElementById("hintNote");
  const hintLabel = document.getElementById("hintLabel");
  const message = document.getElementById("noteHintMessage");
  const detail = document.getElementById("noteHintDetail");

  document.querySelectorAll(".noteHit").forEach(hit => {
    hit.addEventListener("click", () => {
      const nota = hit.dataset.nota;
      const y = hit.dataset.y;
      const desc = hit.dataset.desc;
      const x = Number(hit.getAttribute("x")) + Number(hit.getAttribute("width")) / 2;

      if (hintNote) {
        hintNote.setAttribute("cx", x);
        hintNote.setAttribute("cy", y);
        hintNote.setAttribute("opacity", "1");
      }

      if (hintLabel) {
        hintLabel.setAttribute("x", x);
        hintLabel.setAttribute("y", Number(y) - 18);
        hintLabel.textContent = nota;
        hintLabel.setAttribute("opacity", "1");
      }

      if (message) message.textContent = `Hai cliccato ${nota}.`;
      if (detail) {
        detail.style.display = "block";
        detail.textContent = `${nota} si trova in questa posizione: ${desc}.`;
      }
    });
  });
});

const timeRhythms = {
  "4-4": {
    beatMs: 520,
    accents: ["strong", "soft", "medium", "soft"]
  },
  "3-4": {
    beatMs: 560,
    accents: ["strong", "soft", "soft"]
  },
  "2-4": {
    beatMs: 520,
    accents: ["strong", "soft"]
  },
  "6-8": {
    beatMs: 280,
    accents: ["strong", "soft", "soft", "medium", "soft", "soft"]
  }
};

let rhythmAudioContext;
let activeRhythmButton;
let rhythmTimeouts = [];

function getRhythmAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  rhythmAudioContext ||= new AudioContextClass();
  return rhythmAudioContext;
}

function clearRhythmPlayback() {
  rhythmTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
  rhythmTimeouts = [];
  document.querySelectorAll(".timeAudioBtn.playing").forEach(button => button.classList.remove("playing"));
  document.querySelectorAll(".beat.playing").forEach(beat => beat.classList.remove("playing"));
  activeRhythmButton = null;
}

function playMetronomeClick(accent) {
  const audioContext = getRhythmAudioContext();
  if (!audioContext) return;

  const settings = {
    strong: { gain: 0.42, frequency: 920, duration: 0.09 },
    medium: { gain: 0.26, frequency: 740, duration: 0.075 },
    soft: { gain: 0.14, frequency: 560, duration: 0.06 }
  }[accent] || { gain: 0.14, frequency: 560, duration: 0.06 };

  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(settings.frequency, now);
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(settings.gain, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + settings.duration);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + settings.duration + 0.02);
}

function playTimeRhythm(button) {
  const rhythm = timeRhythms[button.dataset.rhythm];
  if (!rhythm) return;

  if (activeRhythmButton === button) {
    clearRhythmPlayback();
    return;
  }

  clearRhythmPlayback();
  activeRhythmButton = button;
  button.classList.add("playing");

  const beats = [...button.closest(".timeCard").querySelectorAll(".beat")];
  const playbackAccents = [...rhythm.accents, ...rhythm.accents];

  playbackAccents.forEach((accent, index) => {
    const timeoutId = setTimeout(() => {
      document.querySelectorAll(".beat.playing").forEach(beat => beat.classList.remove("playing"));
      beats[index % rhythm.accents.length]?.classList.add("playing");
      playMetronomeClick(accent);
    }, rhythm.beatMs * index);

    rhythmTimeouts.push(timeoutId);
  });

  rhythmTimeouts.push(setTimeout(clearRhythmPlayback, rhythm.beatMs * playbackAccents.length + 180));
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".timeAudioBtn").forEach(button => {
    button.addEventListener("click", () => {
      const audioContext = getRhythmAudioContext();
      if (audioContext?.state === "suspended") {
        audioContext.resume().then(() => playTimeRhythm(button));
        return;
      }

      playTimeRhythm(button);
    });
  });
});
