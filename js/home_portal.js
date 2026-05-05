// ==================== NOTE RANDOM SUL PENTAGRAMMA ====================
const NOTE_POSITIONS = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];
const X_START = 148;
const X_END = 820;
const X_STEP = 44;
const NOTE_MS = 500;
const FADE_MS = 900;

let currentX = X_START;
let noteInterval = null;
const noteGroup = document.getElementById("notesGroup");

function createNoteSVG(x, y) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.style.opacity = "0";
  g.style.transition = "opacity 0.25s ease";

  if (y >= 150) {
    const lr = document.createElementNS("http://www.w3.org/2000/svg", "line");
    lr.setAttribute("x1", x - 16);
    lr.setAttribute("x2", x + 16);
    lr.setAttribute("y1", 140);
    lr.setAttribute("y2", 140);
    lr.setAttribute("stroke", "#ff6600");
    lr.setAttribute("stroke-width", "1.5");
    g.appendChild(lr);
  }

  if (y <= 50) {
    const lr = document.createElementNS("http://www.w3.org/2000/svg", "line");
    lr.setAttribute("x1", x - 16);
    lr.setAttribute("x2", x + 16);
    lr.setAttribute("y1", 60);
    lr.setAttribute("y2", 60);
    lr.setAttribute("stroke", "#ff6600");
    lr.setAttribute("stroke-width", "1.5");
    g.appendChild(lr);
  }

  const el = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
  el.setAttribute("cx", x);
  el.setAttribute("cy", y);
  el.setAttribute("rx", "11");
  el.setAttribute("ry", "7.5");
  el.setAttribute("fill", "#ff6600");
  el.setAttribute("stroke", "#ff6600");
  el.setAttribute("stroke-width", "1.5");
  g.appendChild(el);

  const stemUp = y >= 100;
  const stemX = stemUp ? x + 11 : x - 11;
  const stemY2 = stemUp ? y - 36 : y + 36;

  const st = document.createElementNS("http://www.w3.org/2000/svg", "line");
  st.setAttribute("x1", stemX);
  st.setAttribute("y1", y);
  st.setAttribute("x2", stemX);
  st.setAttribute("y2", stemY2);
  st.setAttribute("stroke", "#ff6600");
  st.setAttribute("stroke-width", "2");
  g.appendChild(st);

  return g;
}

function spawnNote() {
  if (!noteGroup) return;
  const y = NOTE_POSITIONS[Math.floor(Math.random() * NOTE_POSITIONS.length)];
  const x = currentX;
  const g = createNoteSVG(x, y);
  noteGroup.appendChild(g);
  requestAnimationFrame(() => { g.style.opacity = "1"; });

  setTimeout(() => {
    g.style.transition = "opacity 0.5s ease";
    g.style.opacity = "0";
    setTimeout(() => {
      if (g.parentNode) g.parentNode.removeChild(g);
    }, 500);
  }, FADE_MS);

  currentX += X_STEP;
  if (currentX > X_END) currentX = X_START;
}

setTimeout(() => {
  if (noteGroup) noteInterval = setInterval(spawnNote, NOTE_MS);
}, 950);

// ==================== ENTRA NEL SITO ====================
function enterSite() {
  clearInterval(noteInterval);
  noteInterval = null;

  const intro = document.getElementById("intro");
  const header = document.getElementById("mainHeader");
  const main = document.getElementById("mainContent");

  if (!intro || !header || !main) return;
  intro.classList.add("fadeOut");

  setTimeout(() => {
    intro.style.display = "none";
    header.style.opacity = "1";
    header.style.pointerEvents = "auto";
    main.style.opacity = "1";
    window.scrollTo(0, 0);
  }, 800);
}

// ==================== NAVIGAZIONE ====================
let isScrollingFromClick = false;
const sections = ["portal", "games"];

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;

  const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 112;
  const navH = document.getElementById("siteNav")?.offsetHeight || 48;
  const top = el.getBoundingClientRect().top + window.scrollY - headerH - navH - 8;

  document.querySelectorAll(".navBtn").forEach(btn => btn.classList.remove("active"));
  document.querySelector(`.navBtn[onclick="scrollToSection('${id}')"]`)?.classList.add("active");

  isScrollingFromClick = true;
  window.scrollTo({ top, behavior: "smooth" });
  setTimeout(() => { isScrollingFromClick = false; }, 1400);
}

window.addEventListener("scroll", () => {
  if (isScrollingFromClick) return;

  const intro = document.getElementById("intro");
  if (!intro || (!intro.classList.contains("fadeOut") && intro.style.display !== "none")) return;

  const offset = (parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 112) + 56;
  let current = sections[0];

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top - offset < 0) current = id;
  });

  document.querySelectorAll(".navBtn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("onclick") === `scrollToSection('${current}')`);
  });
}, { passive: true });

function goTo(page) {
  window.location.href = page;
}

// ==================== RICERCA PORTALE ====================
function searchPortal() {
  const input = document.getElementById("portalSearch");
  const noResults = document.getElementById("noSearchResults");
  const cards = document.querySelectorAll(".hubCard, .gameHubCard");

  if (!input || cards.length === 0) return;

  const query = input.value.trim().toLowerCase();
  let visibleCount = 0;

  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    const match = query === "" || text.includes(query);
    card.classList.toggle("searchHidden", !match);
    if (match) visibleCount++;
  });

  if (noResults) {
    noResults.classList.toggle("hidden", query === "" || visibleCount > 0);
  }
}

// ==================== GOATCOUNTER STATS ====================
function formatPageName(path) {
  if (!path || path === "/" || path.includes("index")) return "Home";
  if (path.includes("teoria")) return "Teoria musicale";
  if (path.includes("mappa")) return "Mappa risorse";
  if (path.includes("pentagramma_game")) return "Orientati sul pentagramma";
  if (path.includes("music_game_figures")) return "Figure musicali";
  if (path.includes("music_game")) return "Impara le Note";
  if (path.includes("ritmo")) return "Ritmo Challenge";
  if (path.includes("wordle")) return "Music Wordle";
  if (path.includes("guanto")) return "Guanto di Sfida";

  return path.replace(/^\//, "").replace(".html", "").replaceAll("_", " ").replaceAll("-", " ");
}

function renderFallbackStats(message = "Statistiche in caricamento") {
  const total = document.getElementById("gc-total");
  const top = document.getElementById("gc-top");
  if (total) total.textContent = "—";
  if (top) {
    top.innerHTML = `<div class="gcTopItem"><span class="gcTopLabel">${message}</span><span class="gcTopCount">—</span></div>`;
  }
}

async function loadGoatStats() {
  const totalEl = document.getElementById("gc-total");
  const topEl = document.getElementById("gc-top");

  try {
    // Chiama l'API Vercel che ha il token GoatCounter nel backend
    const response = await fetch("https://musicgamehub-stats-api.vercel.app/api/stats");
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();

    // Aggiorna il totale delle pageviews
    if (totalEl) {
      totalEl.textContent = Number(data.total || 0).toLocaleString("it-IT");
    }

    // Aggiorna le pagine più visitate
    if (topEl) {
      topEl.innerHTML = "";

      if (!data.topPages || data.topPages.length === 0) {
        topEl.innerHTML = `
          <div class="gcTopItem">
            <span class="gcTopLabel">Nessun dato disponibile</span>
            <span class="gcTopCount">—</span>
          </div>
        `;
        return;
      }

      // Renderizza le top 5 pagine
      // Filtra e pulisci i label (rimuove path con typo e prefissi)
      data.topPages.slice(0, 5).forEach(item => {
        const row = document.createElement("div");
        row.className = "gcTopItem";
        
        // Usa il label se disponibile, altrimenti estrae il nome dal path
        let displayLabel = item.label;
        if (!displayLabel || displayLabel.includes("insdex")) {
          // Se il label è malformato, estrailo dal path
          displayLabel = item.path
            .replace(/^.*\//, "")        // Rimuove il percorso
            .replace(".html", "")         // Rimuove estensione
            .replace(/([A-Z])/g, " $1")   // Aggiunge spazi prima di maiuscole
            .trim();
        }
        
        row.innerHTML = `
          <span class="gcTopLabel">${displayLabel}</span>
          <span class="gcTopCount">${Number(item.count || 0).toLocaleString("it-IT")}</span>
        `;
        topEl.appendChild(row);
      });
    }
  } catch (error) {
    console.error("Errore caricamento statistiche:", error);
    renderFallbackStats("Statistiche non disponibili");
  }
}

window.enterSite = enterSite;
window.scrollToSection = scrollToSection;
window.goTo = goTo;
window.searchPortal = searchPortal;

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("portalSearch");
  const searchBtn = document.querySelector(".portalSearchBtn");

  if (input) {
    input.addEventListener("input", searchPortal);
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        searchPortal();
      }
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", e => {
      e.preventDefault();
      searchPortal();
      searchBtn.blur();
    });
  }

  loadGoatStats();
});
