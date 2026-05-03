// ==================== NOTE RANDOM SUL PENTAGRAMMA ====================
// viewBox 0 0 900 210 — righe a y: 60,80,100,120,140 (spaziatura 20px)
// Posizioni y valide (righe e spazi):
const NOTE_POSITIONS = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];
// 50=sopra 5ª, 60=5ª riga, 70=4°spazio, 80=4ªriga, 90=3°spazio,
// 100=3ªriga, 110=2°spazio, 120=2ªriga, 130=1°spazio, 140=1ªriga, 150=sotto 1ª

const X_START  = 148; // x prima nota (subito dopo la chiave)
const X_END    = 820; // x massima prima del reset
const X_STEP   = 44;  // px fissi tra una nota e la prossima
const NOTE_MS  = 500; // intervallo tra una nota e la prossima (ms)
const FADE_MS  = 900; // dopo quanti ms inizia il fade out

let currentX    = X_START;
let noteInterval = null;
const noteGroup  = document.getElementById("notesGroup");

// ==================== CREA NOTA SVG ====================
function createNoteSVG(x, y) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.style.opacity = "0";
  g.style.transition = "opacity 0.25s ease";

  // Riga aggiuntiva sotto la 1ª riga (y=150)
  if (y >= 150) {
    const lr = document.createElementNS("http://www.w3.org/2000/svg", "line");
    lr.setAttribute("x1", x - 16); lr.setAttribute("x2", x + 16);
    lr.setAttribute("y1", 140);    lr.setAttribute("y2", 140);
    lr.setAttribute("stroke", "#ff6600"); lr.setAttribute("stroke-width", "1.5");
    g.appendChild(lr);
  }
  // Riga aggiuntiva sopra la 5ª riga (y=50)
  if (y <= 50) {
    const lr = document.createElementNS("http://www.w3.org/2000/svg", "line");
    lr.setAttribute("x1", x - 16); lr.setAttribute("x2", x + 16);
    lr.setAttribute("y1", 60);     lr.setAttribute("y2", 60);
    lr.setAttribute("stroke", "#ff6600"); lr.setAttribute("stroke-width", "1.5");
    g.appendChild(lr);
  }

  // Ellisse (testa piena = semiminima)
  const el = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
  el.setAttribute("cx", x); el.setAttribute("cy", y);
  el.setAttribute("rx", "11"); el.setAttribute("ry", "7.5");
  el.setAttribute("fill", "#ff6600");
  el.setAttribute("stroke", "#ff6600"); el.setAttribute("stroke-width", "1.5");
  g.appendChild(el);

  // Gambo: verso l'alto se nota è sul 3° spazio o più in basso (y>=90), verso il basso se più in alto
  const stemUp = y >= 100;
  const stemX  = stemUp ? x + 11 : x - 11;
  const stemY2 = stemUp ? y - 36 : y + 36;
  const st = document.createElementNS("http://www.w3.org/2000/svg", "line");
  st.setAttribute("x1", stemX); st.setAttribute("y1", y);
  st.setAttribute("x2", stemX); st.setAttribute("y2", stemY2);
  st.setAttribute("stroke", "#ff6600"); st.setAttribute("stroke-width", "2");
  g.appendChild(st);

  return g;
}

// ==================== STEP: spawn nota e avanza x ====================
function spawnNote() {
  const y = NOTE_POSITIONS[Math.floor(Math.random() * NOTE_POSITIONS.length)];
  const x = currentX;

  const g = createNoteSVG(x, y);
  noteGroup.appendChild(g);
  requestAnimationFrame(() => { g.style.opacity = "1"; });

  // Fade out
  setTimeout(() => {
    g.style.transition = "opacity 0.5s ease";
    g.style.opacity = "0";
    setTimeout(() => { if (g.parentNode) g.parentNode.removeChild(g); }, 500);
  }, FADE_MS);

  // Avanza x; se arriva al bordo riparte dall'inizio
  currentX += X_STEP;
  if (currentX > X_END) {
    currentX = X_START;
  }
}

// Avvia dopo che le righe sono animate
setTimeout(() => {
  noteInterval = setInterval(spawnNote, NOTE_MS);
}, 950);

// ==================== ENTRA NEL SITO ====================
function enterSite() {
  clearInterval(noteInterval);
  noteInterval = null;

  document.getElementById("intro").classList.add("fadeOut");
  setTimeout(() => {
    document.getElementById("intro").style.display = "none";
    const header = document.getElementById("mainHeader");
    const main   = document.getElementById("mainContent");
    header.style.opacity = "1";
    header.style.pointerEvents = "auto";
    main.style.opacity = "1";
    window.scrollTo(0, 0);
  }, 800);
}

// ==================== NAVIGAZIONE SEZIONI ====================
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 112;
  const navH    = document.getElementById("siteNav")?.offsetHeight || 48;
  const top     = el.getBoundingClientRect().top + window.scrollY - headerH - navH - 8;
  window.scrollTo({ top, behavior: "smooth" });
  document.querySelectorAll(".navBtn").forEach(b => b.classList.remove("active"));
  Array.from(document.querySelectorAll(".navBtn"))
    .find(b => b.getAttribute("onclick")?.includes(id))
    ?.classList.add("active");
}

const sections = ["games","chiavi","note","figure","espressione","scale","tempi"];
window.addEventListener("scroll", () => {
  const intro = document.getElementById("intro");
  if (!intro || (!intro.classList.contains("fadeOut") && intro.style.display !== "none")) return;
  const offset = (parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 112) + 56;
  let current = sections[0];
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top - offset < 0) current = id;
  });
  document.querySelectorAll(".navBtn").forEach(b => {
    b.classList.toggle("active",
      b.getAttribute("onclick")?.includes(`'${current}'`) ||
      b.getAttribute("onclick")?.includes(`"${current}"`)
    );
  });
}, { passive: true });

// ==================== PENTAGRAMMA INTERATTIVO (sezione note) ====================
document.querySelectorAll(".noteHit").forEach(rect => {
  rect.addEventListener("click", function () {
    const nota = this.dataset.nota;
    const y    = parseFloat(this.dataset.y);
    const desc = this.dataset.desc || "";
    const cx   = parseFloat(this.getAttribute("x")) + parseFloat(this.getAttribute("width")) / 2;

    const noteEl  = document.getElementById("hintNote");
    const labelEl = document.getElementById("hintLabel");
    const msgEl   = document.getElementById("noteHintMessage");
    const detEl   = document.getElementById("noteHintDetail");
    if (!noteEl) return;

    noteEl.setAttribute("cx", cx); noteEl.setAttribute("cy", y); noteEl.setAttribute("opacity", "1");
    if (labelEl) { labelEl.setAttribute("x", cx); labelEl.setAttribute("y", y - 16); labelEl.setAttribute("opacity", "1"); labelEl.textContent = nota; }
    if (msgEl)   { msgEl.textContent = `Nota: ${nota} — ${desc}`; msgEl.style.color = "var(--accent)"; msgEl.style.fontWeight = "700"; }
    if (detEl)   { detEl.style.display = "block"; detEl.textContent = `${nota} si trova nel ${desc} in chiave di violino`; }

    document.querySelectorAll(".noteHit").forEach(r => r.setAttribute("fill", "rgba(255,102,0,0.06)"));
    this.setAttribute("fill", "rgba(255,102,0,0.22)");
  });
});

// ==================== NAVIGAZIONE PAGINE ====================
function goTo(page) { window.location.href = page; }
