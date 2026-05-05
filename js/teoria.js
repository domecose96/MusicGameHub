function goHome() {
  const btn = document.getElementById("homeBtn");
  if (btn) btn.classList.add("selected");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 150);
}

function goTo(page) {
  window.location.href = page;
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 112;
  const navH = document.getElementById("siteNav")?.offsetHeight || 48;
  const top = el.getBoundingClientRect().top + window.scrollY - headerH - navH - 10;

  document.querySelectorAll(".navBtn").forEach(btn => btn.classList.remove("active"));
  document.querySelector(`.navBtn[onclick="scrollToSection('${id}')"]`)?.classList.add("active");
  window.scrollTo({ top, behavior: "smooth" });
}

window.goHome = goHome;
window.goTo = goTo;
window.scrollToSection = scrollToSection;

// Detecta quale sezione è visibile durante lo scroll
function detectActiveSection() {
  const sections = document.querySelectorAll('.siteSection');
  let currentSection = null;
  
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    // Se la sezione è nel viewport superiore, è quella attiva
    if (rect.top < window.innerHeight / 3) {
      currentSection = section.id;
    }
  });
  
  if (currentSection) {
    const btn = document.querySelector(`.navBtn[onclick="scrollToSection('${currentSection}')"]`);
    if (btn) {
      document.querySelectorAll(".navBtn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    }
  }
}

// Listener per lo scroll
window.addEventListener('scroll', detectActiveSection);
document.addEventListener('DOMContentLoaded', detectActiveSection);

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
