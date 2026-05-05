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
