function initMediaChoices() {
  const choices = document.querySelectorAll(".mediaChoice");
  const feedback = document.getElementById("decisionFeedback");

  choices.forEach((choice) => {
    choice.addEventListener("click", () => {
      choices.forEach((item) => item.classList.toggle("active", item === choice));
      if (feedback) feedback.textContent = choice.dataset.feedback || "";
    });
  });
}

function initScenarioCards() {
  const cards = document.querySelectorAll(".mediaScenarioCard");

  cards.forEach((card) => {
    const selectCard = () => {
      cards.forEach((item) => item.classList.toggle("active", item === card));
    };

    card.addEventListener("click", selectCard);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectCard();
      }
    });
  });
}

function initPactBuilder() {
  const buttons = document.querySelectorAll("[data-pact]");
  const list = document.getElementById("pactList");
  if (!buttons.length || !list) return;

  const renderPact = () => {
    const selected = [...buttons].filter((button) => button.classList.contains("active"));
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
}

function initUseSimulator() {
  const options = document.querySelectorAll(".simulatorOption");
  const result = document.getElementById("simulatorResult");
  if (!options.length || !result) return;

  const cases = {
    presentation: {
      state: "caution",
      label: "Attenzione",
      title: "Usa una fonte affidabile e cita autore, titolo e piattaforma.",
      text: "Per un lavoro di classe puoi usare brevi riferimenti se sono funzionali alla spiegazione, ma non caricare file copiati o senza fonte.",
      steps: ["Controlla da dove arriva il brano.", "Scrivi i crediti nella slide finale.", "Preferisci link ufficiali quando devi condividere."]
    },
    video: {
      state: "stop",
      label: "Non basta",
      title: "Un sottofondo musicale protetto non si può caricare liberamente.",
      text: "Se pubblichi il video online, la musica deve essere autorizzata dalla piattaforma, originale o con licenza compatibile.",
      steps: ["Cerca musica royalty free o Creative Commons.", "Leggi le condizioni della licenza.", "Conserva il link della fonte."]
    },
    remix: {
      state: "caution",
      label: "Da verificare",
      title: "Trasformare non significa automaticamente avere il permesso.",
      text: "Un remix può essere creativo, ma se parte da una base protetta serve controllare se il riuso e la modifica sono consentiti.",
      steps: ["Verifica se la licenza permette opere derivate.", "Dichiara la fonte di partenza.", "Aggiungi un contributo personale riconoscibile."]
    },
    social: {
      state: "safe",
      label: "Meglio così",
      title: "Usa gli audio disponibili dentro la piattaforma o link ufficiali.",
      text: "Quando una piattaforma mette a disposizione un catalogo audio, l'uso è regolato da quelle condizioni. Evita di caricare file presi altrove.",
      steps: ["Usa strumenti e cataloghi ufficiali.", "Non ricaricare brani scaricati.", "Controlla se l'account è personale, scolastico o commerciale."]
    }
  };

  const renderCase = (caseId) => {
    const data = cases[caseId] || cases.presentation;
    result.classList.remove("safe", "stop");
    if (data.state !== "caution") result.classList.add(data.state);

    result.innerHTML = `
      <span class="resultBadge ${data.state}">${data.label}</span>
      <h3>${data.title}</h3>
      <p>${data.text}</p>
      <ul>${data.steps.map((step) => `<li>${step}</li>`).join("")}</ul>
    `;
  };

  options.forEach((option) => {
    option.addEventListener("click", () => {
      options.forEach((item) => item.classList.toggle("active", item === option));
      renderCase(option.dataset.case);
    });
  });
}

function initContentPassport() {
  const fields = {
    title: document.getElementById("passportTitle"),
    author: document.getElementById("passportAuthor"),
    source: document.getElementById("passportSource"),
    license: document.getElementById("passportLicense")
  };
  const preview = {
    title: document.getElementById("passportPreviewTitle"),
    author: document.getElementById("passportPreviewAuthor"),
    source: document.getElementById("passportPreviewSource"),
    license: document.getElementById("passportPreviewLicense"),
    citation: document.getElementById("passportCitation"),
    status: document.getElementById("passportStatus")
  };

  if (!fields.title || !preview.title) return;

  const valueOf = (field, fallback) => field.value.trim() || fallback;

  const renderPassport = () => {
    const title = valueOf(fields.title, "Titolo non indicato");
    const author = valueOf(fields.author, "Autore non indicato");
    const source = valueOf(fields.source, "Fonte non indicata");
    const license = valueOf(fields.license, "Permesso non indicato");
    const missing = Object.entries(fields)
      .filter(([, field]) => !field.value.trim())
      .map(([key]) => key);

    preview.title.textContent = title;
    preview.author.textContent = author;
    preview.source.textContent = source;
    preview.license.textContent = license;
    preview.citation.textContent = `Citazione: ${title} · ${author} · ${source} · ${license}`;

    if (preview.status) {
      preview.status.classList.toggle("complete", missing.length === 0);
      preview.status.textContent = missing.length === 0
        ? "Hai le informazioni minime: ora controlla se la licenza permette davvero l'uso che vuoi fare."
        : "Mancano ancora informazioni: senza fonte e licenza non puoi decidere con sicurezza.";
    }
  };

  Object.values(fields).forEach((field) => {
    field.addEventListener("input", renderPassport);
  });
  renderPassport();
}

function initMediaQuiz() {
  const quiz = document.getElementById("mediaQuiz");
  const result = document.getElementById("quizResult");
  if (!quiz || !result) return;

  const updateResult = () => {
    const cards = [...quiz.querySelectorAll(".quizCard")];
    const answered = cards.filter((card) => card.querySelector(".correct, .wrong"));
    const correct = cards.filter((card) => card.querySelector(".correct")).length;

    if (!answered.length) {
      result.textContent = "Rispondi alle domande per vedere il risultato.";
      return;
    }

    result.textContent = `${correct}/${cards.length} risposte corrette.`;
  };

  quiz.querySelectorAll(".quizCard").forEach((card) => {
    const buttons = card.querySelectorAll("button[data-correct]");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((item) => item.classList.remove("correct", "wrong"));
        button.classList.add(button.dataset.correct === "true" ? "correct" : "wrong");
        updateResult();
      });
    });
  });
}

function initMediaRightsActiveNav() {
  const sectionIds = [...document.querySelectorAll(".mediaRightsNav .navBtn")]
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
  initMediaChoices();
  initScenarioCards();
  initPactBuilder();
  initUseSimulator();
  initContentPassport();
  initMediaQuiz();
  initMediaRightsActiveNav();
});
