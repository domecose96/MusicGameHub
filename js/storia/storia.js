// ==================== STORIA DELLA MUSICA V2 JS ==================== //

// Detect active section on scroll
window.addEventListener("scroll", () => {
  MGH.detectActiveSection(".siteSection");
}, { passive: true });

// On page load
document.addEventListener("DOMContentLoaded", () => {
  const targetId = window.location.hash.slice(1);
  
  if (targetId && document.getElementById(targetId)) {
    setTimeout(() => {
      MGH.setActiveNav(targetId);
      MGH.scrollToSection(targetId);
    }, 100);
  } else {
    MGH.detectActiveSection(".siteSection");
  }

  // Animazioni iniziali
  const cards = document.querySelectorAll(".storyCard, .periodCard, .protagonistCard, .instrumentCard");
  cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.animation = `fadeInCard 0.4s ease-out ${index * 0.05}s forwards`;
  });
});

// ==================== QUIZ MODAL FUNCTIONS ==================== //

function openQuizModal() {
  const modal = document.getElementById("quizModal");
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeQuizModal() {
  const modal = document.getElementById("quizModal");
  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

// Chiudi modal cliccando fuori
window.addEventListener("click", (e) => {
  const modal = document.getElementById("quizModal");
  if (e.target === modal) {
    closeQuizModal();
  }
});

// Rimuovi overflow quando si apre
function resetQuiz() {
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.checked = false;
  });
  
  document.querySelectorAll(".quizAnswer").forEach(answer => {
    answer.style.display = "none";
  });
  
  const resultDiv = document.getElementById("quizResult");
  resultDiv.style.display = "none";
}

/**
 * Verifica le risposte e mostra i risultati
 */
function checkQuiz() {
  const answers = {
    q1: "a", // Gregorio Magno
    q2: "b", // Notazione musicale
    q3: "c", // Musica sacra e profana
    q4: "b", // Amor cortese
    q5: "c"  // Monodico
  };

  let correct = 0;
  let total = Object.keys(answers).length;

  // Rivela tutte le risposte
  document.querySelectorAll(".quizQuestion").forEach((question) => {
    const answers_divs = question.querySelectorAll(".quizAnswer");
    answers_divs.forEach(div => {
      div.style.display = "block";
    });
  });

  // Controlla ogni risposta
  Object.keys(answers).forEach(question => {
    const selected = document.querySelector(`input[name="${question}"]:checked`);
    if (selected && selected.value === answers[question]) {
      correct++;
      // Evidenzia la risposta corretta
      const option = selected.closest("label");
      if (option) {
        option.style.background = "rgba(102, 204, 102, 0.15)";
        option.style.borderLeft = "4px solid #66cc66";
        option.style.paddingLeft = "8px";
      }
    } else if (selected) {
      // Evidenzia la risposta sbagliata
      const option = selected.closest("label");
      if (option) {
        option.style.background = "rgba(255, 102, 102, 0.1)";
        option.style.borderLeft = "4px solid #ff6666";
        option.style.paddingLeft = "8px";
      }
    }
  });

  // Mostra il risultato
  const resultDiv = document.getElementById("quizResult");
  const percentage = Math.round((correct / total) * 100);
  
  let message = "";
  let className = "";

  if (percentage === 100) {
    message = `🏆 PERFETTO! ${correct}/${total} risposte corrette (${percentage}%). Sei un esperto del Medioevo musicale!`;
    className = "correct";
  } else if (percentage >= 80) {
    message = `✅ OTTIMO! ${correct}/${total} risposte corrette (${percentage}%). Conosci molto bene il periodo medievale!`;
    className = "correct";
  } else if (percentage >= 60) {
    message = `👍 BUONO! ${correct}/${total} risposte corrette (${percentage}%). Continua a studiare per approfondire!`;
    className = "correct";
  } else if (percentage >= 40) {
    message = `📚 ${correct}/${total} risposte corrette (${percentage}%). Torna a rileggerlo per consolidare le conoscenze.`;
    className = "incorrect";
  } else {
    message = `❌ ${correct}/${total} risposte corrette (${percentage}%). Leggi di nuovo il materiale e riprova!`;
    className = "incorrect";
  }

  resultDiv.innerHTML = message;
  resultDiv.className = `quizResult ${className}`;
  resultDiv.style.display = "block";

  // Scorri al risultato
  setTimeout(() => {
    resultDiv.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 300);
}

// Esponi funzioni globali
window.openQuizModal = openQuizModal;
window.closeQuizModal = closeQuizModal;
window.checkQuiz = checkQuiz;
window.resetQuiz = resetQuiz;

// ==================== KEYBOARD SHORTCUT ==================== //

// Premi ESC per chiudere il modal
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeQuizModal();
  }
});
