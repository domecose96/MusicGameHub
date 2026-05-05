// Detecta quale sezione è visibile durante lo scroll
function detectActiveSection() {
  MGH.detectActiveSection(".siteSection");
}

// Listener per lo scroll
window.addEventListener('scroll', detectActiveSection);
document.addEventListener('DOMContentLoaded', detectActiveSection);

document.addEventListener("DOMContentLoaded", () => {
  const targetId = window.location.hash.slice(1);
  if (targetId && document.getElementById(targetId)) {
    setTimeout(() => scrollToSection(targetId), 80);
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
