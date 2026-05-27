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
  const quiz = document.getElementById("memoryQuiz");
  const questions = quiz ? quiz.querySelectorAll(".quizQuestion") : [];
  const result = document.getElementById("memoryQuizResult");
  const checkButton = document.getElementById("checkMemoryQuiz");
  const resetButton = document.getElementById("resetMemoryQuiz");
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
        ? `Perfetto: ${score}/${questions.length}. Hai collegato memoria, musica e responsabilità.`
        : `Hai totalizzato ${score}/${questions.length}. Rileggi le sezioni e riprova.`;
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
