const anthemMeanings = {
  fratelli: {
    title: "Gli italiani sono uniti come fratelli.",
    text: "Il testo invita a sentirsi parte di una stessa comunità. Non parla solo di passato: oggi possiamo leggerlo come un invito al rispetto reciproco."
  },
  desta: {
    title: "L'Italia si è svegliata e vuole essere libera.",
    text: "Nel linguaggio del Risorgimento, il risveglio indica la voglia di partecipare, scegliere e costruire insieme il futuro del Paese."
  },
  coorte: {
    title: "Restiamo uniti e collaboriamo.",
    text: "La parola richiama un gruppo compatto. Oggi possiamo collegarla alla collaborazione: una classe, una squadra, una comunità funzionano se ciascuno fa la propria parte."
  }
};

const symbolDetails = {
  bandiera: {
    icon: "🇮🇹",
    image: "img/inno_italia/bandiera.gif",
    label: "Simbolo della Repubblica",
    title: "La Bandiera italiana",
    text: "La bandiera italiana si chiama tricolore perché è formata da tre colori verticali: verde, bianco e rosso. È il segno più immediato dell'identità nazionale e rappresenta la Repubblica nelle scuole, negli edifici pubblici, nelle cerimonie e negli eventi ufficiali.",
    extra: `
      <div class="colorMeaning"><span class="colorDot green"></span><span><strong>Verde:</strong> richiama speranza, vita e paesaggio italiano.</span></div>
      <div class="colorMeaning"><span class="colorDot white"></span><span><strong>Bianco:</strong> richiama pace, lealtà e rispetto delle regole comuni.</span></div>
      <div class="colorMeaning"><span class="colorDot red"></span><span><strong>Rosso:</strong> ricorda il coraggio e l'impegno di chi ha costruito l'unità del Paese.</span></div>
    `
  },
  inno: {
    icon: "🎵",
    image: "img/inno_italia/inno.webp",
    contain: true,
    label: "Simbolo musicale",
    title: "L'Inno nazionale",
    text: "L'inno nazionale non è solo un brano da cantare: è una musica che unisce le persone in un momento comune. Quando viene eseguito, invita a pensare alla storia del Paese, alla cittadinanza e al rispetto verso gli altri.",
    extra: `
      <ul class="symbolInfoList">
        <li><strong>Autori:</strong> testo di Goffredo Mameli e musica di Michele Novaro.</li>
        <li><strong>Periodo:</strong> nasce nel Risorgimento, quando cresceva il desiderio di un'Italia unita.</li>
        <li><strong>Uso:</strong> si canta in cerimonie, feste nazionali, eventi sportivi e momenti ufficiali.</li>
      </ul>
    `
  },
  stemma: {
    icon: "🛡️",
    image: "img/inno_italia/stemma.webp",
    contain: true,
    label: "Emblema dello Stato",
    title: "Lo Stemma della Repubblica",
    text: "Lo stemma della Repubblica Italiana è un emblema ufficiale dello Stato. Non è uno scudo medievale: è un insieme di simboli che parlano di lavoro, pace, dignità e appartenenza alla comunità nazionale.",
    extra: `
      <ul class="symbolInfoList">
        <li><strong>Stella:</strong> è un antico simbolo dell'Italia.</li>
        <li><strong>Ruota dentata:</strong> richiama il lavoro, valore fondamentale della Repubblica.</li>
        <li><strong>Rami di ulivo e quercia:</strong> indicano pace, forza e dignità.</li>
      </ul>
    `
  }
};

const authorDetails = {
  mameli: {
    icon: "✍️",
    image: "img/inno_italia/mameli.webp",
    contain: true,
    label: "Autore del testo",
    title: "Goffredo Mameli",
    text: "Goffredo Mameli nacque a Genova nel 1827. Fu poeta, patriota e figura del Risorgimento: scrisse il testo del Canto degli Italiani nel 1847, in un momento in cui cresceva il desiderio di libertà e unità nazionale.",
    extra: `
      <ul class="symbolInfoList">
        <li><strong>Età:</strong> era giovanissimo, circa vent'anni, quando scrisse il testo.</li>
        <li><strong>Contesto:</strong> partecipò al clima politico e ideale del Risorgimento.</li>
        <li><strong>Importanza:</strong> le sue parole diventarono un simbolo collettivo per generazioni di italiani.</li>
      </ul>
    `
  },
  novaro: {
    icon: "🎼",
    image: "img/inno_italia/novaro.webp",
    contain: true,
    label: "Compositore della musica",
    title: "Michele Novaro",
    text: "Michele Novaro, musicista genovese, compose la musica del Canto degli Italiani nel 1847. La melodia ha un carattere energico e solenne, pensato per essere cantato insieme e facilmente riconosciuto.",
    extra: `
      <ul class="symbolInfoList">
        <li><strong>Ruolo:</strong> trasformò il testo in un canto dal forte impatto collettivo.</li>
        <li><strong>Stile:</strong> melodia chiara, slancio ritmico e andamento adatto al canto corale.</li>
        <li><strong>Valore:</strong> la musica aiuta il testo a diventare memoria condivisa.</li>
      </ul>
    `
  }
};

function initSymbolCards() {
  const modal = document.getElementById("symbolModal");
  const modalImage = document.getElementById("symbolModalImage");
  const modalIcon = document.getElementById("symbolModalIcon");
  const modalLabel = document.getElementById("symbolModalLabel");
  const modalTitle = document.getElementById("symbolModalTitle");
  const modalText = document.getElementById("symbolModalText");
  const modalExtra = document.getElementById("symbolModalExtra");
  const cards = document.querySelectorAll(".symbolCard[data-symbol], .authorCard[data-author]");
  if (!modal || !modalImage || !modalIcon || !modalLabel || !modalTitle || !modalText || !modalExtra) return;

  const openModal = (detail) => {
    if (!detail) return;

    modalIcon.textContent = detail.icon || "";
    modalImage.onload = null;
    modalImage.onerror = null;

    modalImage.hidden = true;
    modalIcon.hidden = true;
    modalImage.removeAttribute("src");

    modalImage.classList.toggle("containImage", detail.contain);

    if (detail.image) {
      modalImage.onload = () => {
        modalIcon.hidden = true;
        modalImage.hidden = false;
      };

      modalImage.onerror = () => {
        modalImage.hidden = true;
        modalIcon.hidden = false;
      };

      modalImage.src = detail.image;
    } else {
      modalIcon.hidden = false;
    }
    modalImage.alt = detail.title;
    modalLabel.textContent = detail.label;
    modalTitle.textContent = detail.title;
    modalText.textContent = detail.text;
    modalExtra.innerHTML = detail.extra;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  cards.forEach((card) => {
    const getDetail = () => symbolDetails[card.dataset.symbol] || authorDetails[card.dataset.author];

    card.addEventListener("click", () => openModal(getDetail()));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(getDetail());
      }
    });
  });

  modal.querySelectorAll("[data-close-symbol]").forEach((element) => {
    element.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
  });
}

function initMeaningCards() {
  const output = document.getElementById("meaningOutput");
  const cards = document.querySelectorAll(".meaningCard");
  if (!output || !cards.length) return;

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const key = card.dataset.meaning;
      const item = anthemMeanings[key];
      if (!item) return;

      cards.forEach((button) => button.classList.remove("active"));
      card.classList.add("active");
      output.innerHTML = `<h3>${item.title}</h3><p>${item.text}</p>`;
    });
  });
}

function initStanzaTabs() {
  const tabs = document.querySelectorAll(".stanzaTab");
  const panels = document.querySelectorAll("[data-stanza-panel]");
  if (!tabs.length || !panels.length) return;

  const selectStanza = (stanzaId) => {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.stanza === stanzaId;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.stanzaPanel === stanzaId;
      panel.hidden = !isActive;
      panel.classList.toggle("active", isActive);
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectStanza(tab.dataset.stanza));
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;

      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (index + direction + tabs.length) % tabs.length;
      tabs[nextIndex].focus();
      selectStanza(tabs[nextIndex].dataset.stanza);
    });
  });
}

function initAnthemQuiz() {
  const questions = document.querySelectorAll(".quizQuestion");
  const result = document.getElementById("anthemQuizResult");
  const checkButton = document.getElementById("checkAnthemQuiz");
  const resetButton = document.getElementById("resetAnthemQuiz");
  if (!questions.length || !result || !checkButton || !resetButton) return;

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
        ? `Perfetto: ${score}/${questions.length}. Hai riconosciuto bene storia, autori e uso dell'inno.`
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

function initPulseButton() {
  const button = document.getElementById("pulseBeatBtn");
  if (!button) return;

  button.addEventListener("click", () => {
    button.classList.toggle("pulseActive");
    button.textContent = button.classList.contains("pulseActive")
      ? "Ferma il battito"
      : "Senti il battito";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initSymbolCards();
  initMeaningCards();
  initStanzaTabs();
  initAnthemQuiz();
  initPulseButton();
});

window.addEventListener("scroll", () => MGH.detectActiveSection(), { passive: true });
