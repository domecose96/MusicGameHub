// ==================== INTRO MUSICALE PRO ====================
const MELODY = [
  { name: "Do", freq: 261.63, y: 150 },
  { name: "Sol", freq: 392.00, y: 110 },
  { name: "La", freq: 440.00, y: 100 },
  { name: "Mi alto", freq: 659.25, y: 70 },
  { name: "Re alto", freq: 587.33, y: 80 },
  { name: "Sol", freq: 392.00, y: 110 },
  { name: "Mi", freq: 329.63, y: 130 },
  { name: "Do", freq: 261.63, y: 150 }
];

const X_START = 148;
const X_END = 820;
const X_STEP = 44;
const NOTE_MS = 520;
const FADE_MS = 900;
const INTRO_SEEN_KEY = "musicGameHubIntroSeen";

let currentX = X_START;
let melodyIndex = 0;
let noteInterval = null;
let audioCtx = null;
let audioEnabled = false;

const noteGroup = document.getElementById("notesGroup");
const shouldSkipIntro = sessionStorage.getItem(INTRO_SEEN_KEY) === "true";
const resourceData = window.MusicGameHubResources;

function unlockIntroAudio() {
  if (audioEnabled) return;

  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  audioCtx.resume();
  audioEnabled = true;
}

["click", "touchstart", "keydown", "pointerdown"].forEach(eventName => {
  document.addEventListener(eventName, unlockIntroAudio, { once: true });
});

function playTone(freq) {
  if (!audioEnabled || !audioCtx) return;

  const now = audioCtx.currentTime;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, now);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(900, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 0.7);
}

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

  const step = MELODY[melodyIndex];
  const x = currentX;
  const y = step.y;

  playTone(step.freq);

  const g = createNoteSVG(x, y);
  noteGroup.appendChild(g);

  requestAnimationFrame(() => {
    g.style.opacity = "1";
  });

  setTimeout(() => {
    g.style.transition = "opacity 0.5s ease";
    g.style.opacity = "0";

    setTimeout(() => {
      if (g.parentNode) g.parentNode.removeChild(g);
    }, 500);
  }, FADE_MS);

  melodyIndex = (melodyIndex + 1) % MELODY.length;

  currentX += X_STEP;
  if (currentX > X_END) currentX = X_START;
}

if (!shouldSkipIntro) {
  setTimeout(() => {
    if (noteGroup) noteInterval = setInterval(spawnNote, NOTE_MS);
  }, 950);
}

// ==================== ENTRA NEL SITO ====================
function revealSiteImmediately() {
  const intro = document.getElementById("intro");
  const header = document.getElementById("mainHeader");
  const main = document.getElementById("mainContent");

  clearInterval(noteInterval);
  noteInterval = null;

  if (intro) intro.style.display = "none";

  if (header) {
    header.style.opacity = "1";
    header.style.pointerEvents = "auto";
  }

  if (main) main.style.opacity = "1";
}

function enterSite() {
  sessionStorage.setItem(INTRO_SEEN_KEY, "true");
  unlockIntroAudio();

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
  setTimeout(() => {
    isScrollingFromClick = false;
  }, 1400);
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
  MGH.goTo(page);
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

// ==================== RISORSE HOME ====================
function createCardElement(item, options = {}) {
  const isDisabled = Boolean(options.disabled);
  const card = document.createElement(isDisabled ? "article" : "a");
  card.className = ["hubCard", options.className, isDisabled ? "disabled" : ""]
    .filter(Boolean)
    .join(" ");

  if (isDisabled) {
    card.setAttribute("aria-disabled", "true");
  } else if (item.target) {
    card.href = `#${item.target}`;
    card.addEventListener("click", event => {
      event.preventDefault();
      scrollToSection(item.target);
    });
  } else {
    card.href = item.url;
  }

  const icon = document.createElement("div");
  icon.className = "hubIcon";
  icon.textContent = item.icon;

  const title = document.createElement("h3");
  title.textContent = item.title;

  const desc = document.createElement("p");
  desc.textContent = item.desc;

  card.append(icon, title, desc);

  const badge = document.createElement("span");
  badge.className = isDisabled ? "hubBadge" : "hubTag";
  badge.textContent = isDisabled ? "In arrivo" : item.tag;
  card.appendChild(badge);

  return card;
}

function renderHomeResources() {
  if (!resourceData) return;

  const portalGrid = document.getElementById("portalHubGrid");
  const gamesGrid = document.getElementById("gamesHubGrid");

  if (portalGrid) {
    portalGrid.replaceChildren(
      ...resourceData.homeCards.map(item => createCardElement(item)),
      ...resourceData.upcoming.map(item => createCardElement(item, { disabled: true }))
    );
  }

  if (gamesGrid) {
    gamesGrid.replaceChildren(
      ...resourceData.playable.map(item => createCardElement(item, { className: "gameHubCard" }))
    );
  }
}

function renderResourceStats() {
  if (!resourceData) return;

  const stats = document.querySelectorAll(".portalStats .portalStat");
  const values = [
    { count: resourceData.playable.length, label: "Giochi" },
    { count: resourceData.theoryTopics.length, label: "Argomenti" },
    { count: resourceData.upcoming.length, label: "In arrivo" }
  ];

  values.forEach((value, index) => {
    const stat = stats[index];
    if (!stat) return;

    stat.querySelector("strong").textContent = value.count;
    stat.querySelector("span").textContent = value.label;
  });
}

// ==================== GOATCOUNTER STATS ====================
function createStatsRow(label, count = "—") {
  const row = document.createElement("div");
  row.className = "gcTopItem";

  const labelEl = document.createElement("span");
  labelEl.className = "gcTopLabel";
  labelEl.textContent = label;

  const countEl = document.createElement("span");
  countEl.className = "gcTopCount";
  countEl.textContent = count;

  row.append(labelEl, countEl);
  return row;
}

function renderFallbackStats(message = "Statistiche in caricamento") {
  const total = document.getElementById("gc-total");
  const top = document.getElementById("gc-top");

  if (total) total.textContent = "—";

  if (top) {
    top.replaceChildren(createStatsRow(message));
  }
}

async function loadGoatStats() {
  const totalEl = document.getElementById("gc-total");
  const topEl = document.getElementById("gc-top");

  try {
    const response = await fetch("https://musicgamehub-stats-api.vercel.app/api/stats");

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();

    if (totalEl) {
      totalEl.textContent = Number(data.total || 0).toLocaleString("it-IT");
    }

    if (topEl) {
      topEl.replaceChildren();

      const validPages = (data.topPages || []).filter(item => {
        const path = item.path || "";
        const label = item.label || "";

        if (path.includes("insdex") || label.includes("insdex")) return false;
        if (path.includes("404")) return false;
        if (path.includes("error")) return false;

        return true;
      });

      if (validPages.length === 0) {
        topEl.replaceChildren(createStatsRow("Nessun dato disponibile"));
        return;
      }

      validPages.slice(0, 5).forEach(item => {
        topEl.appendChild(
          createStatsRow(item.label, Number(item.count || 0).toLocaleString("it-IT"))
        );
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
  if (shouldSkipIntro) revealSiteImmediately();
  renderHomeResources();
  renderResourceStats();

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
