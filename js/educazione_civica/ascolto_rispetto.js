function initListeningRoles() {
  const buttons = document.querySelectorAll(".roleBubble[data-role]");
  const card = document.getElementById("roleCard");
  if (!buttons.length || !card) return;

  const roles = {
    ascolta: {
      label: "Ascolta",
      title: "Prima capisco, poi intervengo",
      text: "Ascoltare un compagno significa lasciargli il tempo di finire e provare a capire il suo punto di vista."
    },
    rispetta: {
      label: "Rispetta",
      title: "Il turno vale per tutti",
      text: "Rispettare il turno permette a ogni voce e a ogni strumento di avere il proprio spazio."
    },
    collabora: {
      label: "Collabora",
      title: "Il risultato nasce dal gruppo",
      text: "Collaborare significa mettere la propria parte al servizio del brano e della classe."
    },
    aiuta: {
      label: "Aiuta",
      title: "Correggere non vuol dire giudicare",
      text: "Aiutare un compagno vuol dire dare un consiglio utile, con parole gentili e precise."
    }
  };

  const renderRole = (roleId) => {
    const role = roles[roleId] || roles.ascolta;
    card.innerHTML = `
      <span>${role.label}</span>
      <h3>${role.title}</h3>
      <p>${role.text}</p>
    `;
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.toggle("active", item === button));
      renderRole(button.dataset.role);
    });
  });
}

function initHearingSimulator() {
  const frequencyInput = document.getElementById("hearingFrequency");
  const dbInput = document.getElementById("hearingDb");
  const frequencyValue = document.getElementById("hearingFrequencyValue");
  const dbValue = document.getElementById("hearingDbValue");
  const status = document.getElementById("hearingStatus");
  const toggleButton = document.getElementById("toggleHearingTone");
  if (!frequencyInput || !dbInput || !frequencyValue || !dbValue || !status || !toggleButton) return;

  let audioContext = null;
  let oscillator = null;
  let gain = null;

  const getMessage = (frequency, db) => {
    if (frequency < 20) {
      return {
        type: "warning",
        text: "Infrasuono: l'orecchio umano di solito non lo sente, anche se può essere percepito come vibrazione."
      };
    }

    if (frequency > 20000) {
      return {
        type: "warning",
        text: "Ultrasuono: è oltre il limite medio dell'udito umano, quindi normalmente non lo percepiamo."
      };
    }

    if (db >= 85) {
      return {
        type: "danger",
        text: "Frequenza udibile, ma intensità alta: ascolti lunghi possono affaticare l'orecchio."
      };
    }

    if (frequency > 16000) {
      return {
        type: "warning",
        text: "Frequenza molto acuta: è teoricamente udibile, ma non tutti riescono a percepirla bene."
      };
    }

    return {
      type: "normal",
      text: "Frequenza udibile: suono percepibile in condizioni normali."
    };
  };

  const render = () => {
    const frequency = Number(frequencyInput.value);
    const db = Number(dbInput.value);
    const message = getMessage(frequency, db);

    frequencyValue.textContent = `${frequency.toLocaleString("it-IT")} Hz`;
    dbValue.textContent = `${db} dB`;
    status.textContent = message.text;
    status.classList.toggle("warning", message.type === "warning");
    status.classList.toggle("danger", message.type === "danger");

    if (oscillator && gain) {
      oscillator.frequency.setTargetAtTime(frequency, audioContext.currentTime, 0.02);
      gain.gain.setTargetAtTime(getSafeGain(frequency, db), audioContext.currentTime, 0.03);
    }
  };

  const getSafeGain = (frequency, db) => {
    if (frequency < 20 || frequency > 20000) return 0.0001;
    return Math.min(0.12, Math.max(0.015, db / 1100));
  };

  const startTone = () => {
    audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    if (oscillator) return;

    const frequency = Number(frequencyInput.value);
    const db = Number(dbInput.value);

    oscillator = audioContext.createOscillator();
    gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(getSafeGain(frequency, db), audioContext.currentTime + 0.05);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    toggleButton.textContent = "Stop";
    toggleButton.classList.add("is-playing");
    toggleButton.setAttribute("aria-pressed", "true");
  };

  const stopTone = () => {
    if (!oscillator || !gain || !audioContext) return;

    const endingOscillator = oscillator;
    const endingGain = gain;
    endingGain.gain.setTargetAtTime(0.0001, audioContext.currentTime, 0.03);
    endingOscillator.stop(audioContext.currentTime + 0.12);
    endingOscillator.addEventListener("ended", () => {
      endingOscillator.disconnect();
      endingGain.disconnect();
    });
    oscillator = null;
    gain = null;
    toggleButton.textContent = "Play";
    toggleButton.classList.remove("is-playing");
    toggleButton.setAttribute("aria-pressed", "false");
  };

  frequencyInput.addEventListener("input", render);
  dbInput.addEventListener("input", render);
  toggleButton.addEventListener("click", () => {
    if (oscillator) {
      stopTone();
    } else {
      startTone();
    }
  });
  render();
}

function initListeningPact() {
  const buttons = document.querySelectorAll("[data-pact]");
  const list = document.getElementById("listeningPactList");
  const classInput = document.getElementById("listeningPactClassName");
  const schoolInput = document.getElementById("listeningPactSchoolName");
  const heading = document.getElementById("listeningPactHeading");
  const signatureClass = document.getElementById("listeningPactSignatureClass");
  const stampSchool = document.getElementById("listeningPactStampSchool");
  const exportButton = document.getElementById("exportListeningPactPdf");
  if (!buttons.length || !list) return;

  const renderPact = () => {
    const selected = [...buttons].filter((button) => button.classList.contains("active"));
    const className = classInput?.value.trim();
    const schoolName = schoolInput?.value.trim();

    if (heading) {
      if (className && schoolName) {
        heading.textContent = `${className} · ${schoolName}`;
      } else if (className) {
        heading.textContent = `Classe ${className}`;
      } else if (schoolName) {
        heading.textContent = schoolName;
      } else {
        heading.textContent = "Classe e istituto non indicati";
      }
    }

    if (signatureClass) {
      signatureClass.textContent = className ? className : "...";
    }

    if (stampSchool) {
      stampSchool.textContent = schoolName ? schoolName.toUpperCase() : "NOME ISTITUTO";
    }

    list.replaceChildren();

    if (!selected.length) {
      const item = document.createElement("li");
      item.textContent = "Seleziona almeno una regola per iniziare.";
      list.appendChild(item);
      return;
    }

    selected.forEach((button) => {
      const item = document.createElement("li");
      item.textContent = button.dataset.pact;
      list.appendChild(item);
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("active");
      renderPact();
    });
  });

  [classInput, schoolInput].forEach((input) => {
    if (input) input.addEventListener("input", renderPact);
  });

  if (exportButton) {
    exportButton.addEventListener("click", () => {
      document.body.classList.add("printListeningPactOnly");
      window.print();
      window.setTimeout(() => document.body.classList.remove("printListeningPactOnly"), 400);
    });
  }

  renderPact();
}

function initListeningQuiz() {
  const quiz = document.getElementById("listeningQuiz");
  const questions = quiz ? quiz.querySelectorAll(".quizQuestion") : [];
  const result = document.getElementById("listeningQuizResult");
  const checkButton = document.getElementById("checkListeningQuiz");
  const resetButton = document.getElementById("resetListeningQuiz");
  if (!quiz || !questions.length || !result || !checkButton || !resetButton) return;

  questions.forEach((question) => {
    question.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        question.querySelectorAll("button").forEach((option) => {
          option.classList.remove("selected", "correct", "wrong");
        });
        button.classList.add("selected");
        result.textContent = "";
      });
    });
  });

  checkButton.addEventListener("click", () => {
    let score = 0;

    questions.forEach((question) => {
      const answer = question.dataset.answer;
      const selected = question.querySelector("button.selected");

      question.querySelectorAll("button").forEach((button) => {
        button.classList.remove("correct", "wrong");
        if (button.dataset.value === answer) button.classList.add("correct");
      });

      if (selected?.dataset.value === answer) {
        score += 1;
      } else if (selected) {
        selected.classList.add("wrong");
      }
    });

    result.textContent =
      score === questions.length
        ? `Perfetto: ${score}/${questions.length}. Hai riconosciuto ascolto, rispetto e collaborazione.`
        : `Hai totalizzato ${score}/${questions.length}. Rileggi le card e riprova.`;
  });

  resetButton.addEventListener("click", () => {
    questions.forEach((question) => {
      question.querySelectorAll("button").forEach((button) => {
        button.classList.remove("selected", "correct", "wrong");
      });
    });
    result.textContent = "";
  });
}

function initListeningActiveNav() {
  const sectionIds = [...document.querySelectorAll(".listeningRespectNav .navBtn")]
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
  initListeningRoles();
  initHearingSimulator();
  initListeningPact();
  initListeningQuiz();
  initListeningActiveNav();
});
