function initMemorySongCards() {
  const buttons = document.querySelectorAll("[data-song]");
  const focus = document.getElementById("songFocus");
  if (!buttons.length || !focus) return;

  const cards = {
    gam: {
      title: "Scheda ascolto: Gam Gam",
      intro: "Durante l'ascolto concentrati sul rapporto tra melodia, ripetizione e senso di fiducia.",
      points: [
        "Che atmosfera crea l'inizio del brano?",
        "La ripetizione rende il canto più semplice, più intenso o più collettivo?",
        "Quale idea di speranza emerge dal brano?"
      ]
    },
    donna: {
      title: "Scheda ascolto: Donna Donna",
      intro: "Durante l'ascolto osserva come musica e parole costruiscono una riflessione sulla libertà.",
      points: [
        "Il carattere del brano ti sembra triste, dolce, narrativo o combattivo?",
        "Quale immagine di libertà o fragilità ti rimane più impressa?",
        "Che collegamento puoi fare con il rispetto della dignità umana?"
      ]
    }
  };

  const renderCard = (id) => {
    const card = cards[id] || cards.gam;
    focus.innerHTML = `
      <strong>${card.title}</strong>
      <p>${card.intro}</p>
      <ul>
        ${card.points.map((point) => `<li>${point}</li>`).join("")}
      </ul>
    `;
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.toggle("active", item === button));
      renderCard(button.dataset.song);
    });
  });
}

function initMemoryQuiz() {
  MGH.initCivicQuiz({
    bankId: "memorySongs",
    quizId: "memoryQuiz",
    resultId: "memoryQuizResult",
    checkId: "checkMemoryQuiz",
    resetId: "resetMemoryQuiz",
    questionsPerRound: 3,
    successMessage: "Perfetto: 3/3. Hai collegato memoria, musica e responsabilita.",
    retryMessage: "Rileggi le sezioni e riprova: il prossimo giro avra nuove domande."
  });
}

function initMemoryActiveNav() {
  const sectionIds = [...document.querySelectorAll(".memorySongsNav .navBtn")]
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
  initMemorySongCards();
  initMemoryQuiz();
  initMemoryActiveNav();
});
