(() => {
  "use strict";

  const STATS_ENDPOINT = "https://musicgamehub-stats-api.vercel.app/api/stats";

  const totalEl = document.getElementById("statsTotal");
  const summaryEl = document.getElementById("rankingSummary");
  const listEl = document.getElementById("rankingList");
  const refreshBtn = document.getElementById("refreshStatsBtn");
  const EXCLUDED_PATHS = new Set([
    "classifiche-risorse.html",
    "legal/privacy.html",
    "legal/cookie.html",
    "legal/termini.html"
  ]);

  function normalizeStatsPath(path = "") {
    return String(path)
      .replace(/^https?:\/\/[^/]+/i, "")
      .replace(/[?#].*$/, "")
      .replace(/^\/?MusicGameHub\/?/i, "")
      .replace(/^\/+/, "")
      .replace(/\/index\.html$/i, "/")
      .replace(/^index\.html$/i, "")
      .replace(/\/$/, "");
  }

  function normalizeResourceUrl(url = "") {
    return normalizeStatsPath(url.split("#")[0]);
  }

  function titleFromSlug(slug = "") {
    return slug
      .replace(/\.html$/i, "")
      .split(/[_-]+/)
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function getSectionLabel(resource) {
    if (!resource) return "";
    const path = normalizeStatsPath(resource.url);

    if (path.startsWith("educazione_civica/")) return "Educazione civica";
    if (path.startsWith("storia/")) return "Storia";
    if (resource.group === "theory") return "Teoria";
    if (resource.group === "games") return "Giochi";
    if (resource.group === "paths") return "Percorsi";

    return "";
  }

  function splitDisplayLabel(label) {
    const parts = String(label || "").split(" > ");
    if (parts.length < 2) return { section: "", title: label || "Pagina" };
    return { section: parts.shift(), title: parts.join(" > ") };
  }

  function formatLabel(section, title) {
    return section ? `${section} > ${title}` : title;
  }

  function getDisplayLabel(item) {
    const path = normalizeStatsPath(item.path || "");
    const rawLabel = String(item.label || "").trim();
    const resources = window.MusicGameHubResources;

    if (!path || path === "index") return "Home";

    const matchingResource = resources?.items?.find(resource => normalizeStatsPath(resource.url) === path);
    if (matchingResource) {
      return formatLabel(getSectionLabel(matchingResource), matchingResource.title);
    }

    const matchingHomeCard = resources?.homeCards?.find(resource => normalizeStatsPath(resource.url) === path);
    if (matchingHomeCard) {
      return formatLabel(getSectionLabel(matchingHomeCard), matchingHomeCard.title);
    }

    const comicMatch = path.match(/^fumetti\/([^/]+)\.html$/i);
    if (comicMatch) return `Vite a fumetti > ${titleFromSlug(comicMatch[1])}`;

    if (path === "fumetti") return "Vite a fumetti";
    if (path === "mappa.html") return "Mappa delle risorse";
    if (path.startsWith("educazione_civica/")) return `Educazione civica > ${titleFromSlug(path.split("/").pop())}`;
    if (path.startsWith("storia/")) return `Storia > ${titleFromSlug(path.split("/").pop())}`;
    if (path.startsWith("giochi/")) return `Giochi > ${titleFromSlug(path.split("/").pop())}`;

    if (rawLabel && !rawLabel.includes("/") && !rawLabel.includes("MusicGameHub")) return rawLabel;

    return titleFromSlug(path.split("/").pop() || "Pagina");
  }

  function getAggregatedPages(topPages = []) {
    const pages = new Map();

    topPages.forEach(item => {
      const path = item.path || "";
      const label = item.label || "";

      const normalizedPath = normalizeStatsPath(item.path || "");

      if (path.includes("insdex") || label.includes("insdex")) return;
      if (path.includes("404")) return;
      if (path.includes("error")) return;
      if (EXCLUDED_PATHS.has(normalizedPath)) return;

      const displayLabel = getDisplayLabel(item);
      const current = pages.get(displayLabel) || { label: displayLabel, path: normalizedPath, count: 0 };
      current.count += Number(item.count || 0);
      if (!current.path && normalizedPath) current.path = normalizedPath;
      pages.set(displayLabel, current);
    });

    addCatalogPages(pages);

    return Array.from(pages.values())
      .sort((a, b) => {
        const countDiff = b.count - a.count;
        if (countDiff !== 0) return countDiff;
        return a.label.localeCompare(b.label, "it");
      });
  }

  function addCatalogPage(pages, label, path) {
    if (!label || path === null || path === undefined) return;
    if (path.includes("404")) return;

    if (!pages.has(label)) {
      pages.set(label, { label, path, count: 0 });
    }
  }

  function addCatalogPages(pages) {
    const resources = window.MusicGameHubResources;
    const seenPaths = new Set();

    addCatalogPage(pages, "Home", "");

    const source = [
      ...(resources?.items || []),
      ...(resources?.homeCards || []),
      ...(resources?.homeEntrypoints || [])
    ];

    source.forEach(resource => {
      if (!resource?.url) return;

      const path = normalizeResourceUrl(resource.url);
      if (!path || seenPaths.has(path) || EXCLUDED_PATHS.has(path)) return;

      seenPaths.add(path);
      addCatalogPage(
        pages,
        formatLabel(getSectionLabel({ ...resource, url: path }), resource.title),
        path
      );
    });

  }

  function setState(message) {
    if (!listEl) return;
    const state = document.createElement("div");
    state.className = "rankingState";
    state.textContent = message;
    listEl.replaceChildren(state);
  }

  function createRankingRow(item, index) {
    const label = splitDisplayLabel(item.label);
    const row = document.createElement("article");
    row.className = "rankingRow";

    const position = document.createElement("span");
    position.className = "rankingPosition";
    position.textContent = index + 1;

    const info = document.createElement("div");
    info.className = "rankingInfo";

    if (label.section) {
      const badge = document.createElement("span");
      badge.className = "rankingBadge";
      badge.textContent = label.section;
      info.appendChild(badge);
    }

    const title = document.createElement("strong");
    title.textContent = label.title;

    const subtitle = document.createElement("small");
    subtitle.textContent = label.section ? `Sezione: ${label.section}` : "Pagina principale";

    const count = document.createElement("span");
    count.className = "rankingCount";
    count.textContent = Number(item.count || 0).toLocaleString("it-IT");

    info.append(title, subtitle);
    row.append(position, info, count);
    return row;
  }

  async function loadStats() {
    if (refreshBtn) refreshBtn.disabled = true;
    setState("Caricamento statistiche...");

    try {
      const response = await fetch(STATS_ENDPOINT);

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      const pages = getAggregatedPages(data.topPages || []);

      if (totalEl) totalEl.textContent = Number(data.total || 0).toLocaleString("it-IT");

      if (!pages.length) {
        if (summaryEl) summaryEl.textContent = "Nessun dato disponibile.";
        setState("Nessuna pagina trovata nelle statistiche.");
        return;
      }

      if (summaryEl) summaryEl.textContent = `${pages.length} pagine del portale ordinate per pageview totali.`;

      listEl.replaceChildren(...pages.map(createRankingRow));
    } catch (error) {
      console.error("Errore caricamento classifica risorse:", error);
      if (totalEl) totalEl.textContent = "—";
      if (summaryEl) summaryEl.textContent = "Statistiche non disponibili.";
      setState("Non riesco a caricare la classifica in questo momento.");
    } finally {
      if (refreshBtn) refreshBtn.disabled = false;
    }
  }

  refreshBtn?.addEventListener("click", loadStats);
  document.addEventListener("DOMContentLoaded", loadStats);
})();
