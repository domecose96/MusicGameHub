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

function resetQuiz() {
  MGH.learningQuiz?.reset("quizModal");
}

function checkQuiz() {
  MGH.learningQuiz?.check("quizModal");
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
