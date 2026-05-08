// ==================== ADVANCED THEORY JS ==================== //
// Usa MGH da common.js per funzioni comuni

// Detect active section on scroll
window.addEventListener("scroll", () => {
  MGH.detectActiveSection(".siteSection");
}, { passive: true });

// ==================== CHORD VISUALIZATION EFFECTS ==================== //

/**
 * Anima un accordo evidenziando le note sequenzialmente
 */
function playChordVisualization(cardElement) {
  const notes = cardElement.querySelectorAll("ellipse[fill]");
  notes.forEach((note, index) => {
    setTimeout(() => {
      note.style.transition = "all 0.3s ease";
      note.style.filter = "brightness(1.3)";
      setTimeout(() => {
        note.style.filter = "brightness(1)";
      }, 300);
    }, index * 100);
  });
}

// ==================== CIRCLE OF FIFTHS HIGHLIGHT ==================== //

/**
 * Evidenzia una tonalità nel circolo delle quinte
 */
function highlightCircleKey(note) {
  const circles = document.querySelectorAll("#majorKeys circle, #flatKeys circle");
  circles.forEach(c => {
    c.style.opacity = "0.5";
    c.style.filter = "none";
  });
  
  const target = Array.from(circles).find(c => {
    const text = c.nextElementSibling;
    return text && text.textContent.trim() === note;
  });
  
  if (target) {
    target.style.opacity = "1";
    target.style.filter = "drop-shadow(0 0 8px rgba(255, 102, 0, 0.6))";
  }
}

// ==================== SCALE HIGHLIGHTING ==================== //

/**
 * Evidenzia una scala specifica
 */
function highlightScale(scaleType) {
  const boxes = document.querySelectorAll(".scaleBox");
  boxes.forEach(box => {
    box.style.borderColor = "rgba(255, 102, 0, 0.12)";
    box.style.backgroundColor = "var(--surface)";
  });
  
  const selected = Array.from(boxes).find(box => 
    box.textContent.toLowerCase().includes(scaleType.toLowerCase())
  );
  
  if (selected) {
    selected.style.borderColor = "rgba(255, 102, 0, 0.4)";
    selected.style.backgroundColor = "rgba(255, 102, 0, 0.05)";
  }
}

// ==================== EXPOSE CUSTOM FUNCTIONS ==================== //

window.playChordVisualization = playChordVisualization;
window.highlightCircleKey = highlightCircleKey;
window.highlightScale = highlightScale;

// ==================== ON PAGE LOAD ==================== //

document.addEventListener("DOMContentLoaded", () => {
  // Handle hash navigation
  const targetId = window.location.hash.slice(1);
  
  if (targetId && document.getElementById(targetId)) {
    setTimeout(() => {
      MGH.setActiveNav(targetId);
      MGH.scrollToSection(targetId);
    }, 100);
  } else {
    MGH.detectActiveSection(".siteSection");
  }
  
  // Animazione iniziale delle carte
  const cards = document.querySelectorAll(".advancedCard");
  cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.animation = `fadeInCard 0.4s ease-out ${index * 0.05}s forwards`;
  });
});
