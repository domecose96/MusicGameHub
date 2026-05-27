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
  const classInput = document.getElementById("pactClassName");
  const schoolInput = document.getElementById("pactSchoolName");
  const heading = document.getElementById("pactHeading");
  const signatureClass = document.getElementById("pactSignatureClass");
  const stampSchool = document.getElementById("pactStampSchool");
  const exportButton = document.getElementById("exportPactPdf");
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
      document.body.classList.add("printPactOnly");
      window.print();
      window.setTimeout(() => document.body.classList.remove("printPactOnly"), 400);
    });
  }

  renderPact();
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
  const questions = quiz ? quiz.querySelectorAll(".quizQuestion") : [];
  const result = document.getElementById("mediaQuizResult");
  const checkButton = document.getElementById("checkMediaQuiz");
  const resetButton = document.getElementById("resetMediaQuiz");
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
        ? `Perfetto: ${score}/${questions.length}. Hai riconosciuto uso corretto, fonti e permessi.`
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
