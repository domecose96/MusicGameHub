const MGH = (() => {
  const AUTH_USER_KEY = "mgh_auth_user";

  function readStoredJson(key, fallback = null) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function writeStoredJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function removeStoredKeys(...keys) {
    keys.forEach(key => localStorage.removeItem(key));
  }

  function getStoredAuthUser() {
    return readStoredJson(AUTH_USER_KEY);
  }

  function isLoggedIn() {
    return Boolean(getStoredAuthUser()?.id);
  }

  function padNumber(number, size = 2) {
    return String(number).padStart(size, "0");
  }

  function getRelativeAssetPath(assetPath) {
    const normalizedPath = window.location.pathname.endsWith("/")
      ? `${window.location.pathname}index.html`
      : window.location.pathname;
    const segments = normalizedPath.split("/").filter(Boolean);
    const currentFile = segments[segments.length - 1] || "";
    const folders = currentFile.includes(".")
      ? segments.slice(0, -1)
      : segments;
    const projectIndex = folders.lastIndexOf("MusicGameHub");
    const pageFolders = projectIndex >= 0
      ? folders.slice(projectIndex + 1)
      : folders;

    return `${"../".repeat(pageFolders.length)}${assetPath}`;
  }

  function setSiteFavicon() {
    const faviconHref = getRelativeAssetPath("img/mgh-logo.png");
    const icons = Array.from(document.querySelectorAll('link[rel~="icon"]'));
    const icon = icons[0] || document.createElement("link");

    icon.rel = "icon";
    icon.type = "image/png";
    icon.href = faviconHref;

    if (!icon.parentNode) {
      document.head.appendChild(icon);
    }

    icons.slice(1).forEach(extraIcon => extraIcon.remove());
  }

  function imageExists(src) {
    return new Promise(resolve => {
      const probe = new Image();
      probe.onload = () => resolve(true);
      probe.onerror = () => resolve(false);
      probe.src = src;
    });
  }

  async function resolveFirstExistingImage(candidates) {
    for (const candidate of candidates) {
      if (await imageExists(candidate)) return candidate;
    }

    return "";
  }

  function goHome(delay = 150) {

    document.getElementById("homeBtn")
      ?.classList.add("selected");

    sessionStorage.setItem(
      "musicGameHubIntroSeen",
      "true"
    );

    const path = window.location.pathname;

    const target =
      path.includes("/storia/") ||
      path.includes("/giochi/") ||
      path.includes("/strumenti/") ||
      path.includes("/educazione_civica/") ||
      path.includes("/fumetti/") ||
      path.includes("/legal/")
        ? "../"
        : "./";

    setTimeout(() => {
      window.location.href = target;
    }, delay);
  }

  function goTo(page) {
    window.location.href = page;
  }

  function getHeaderOffset(extra = 10) {
    const headerH = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue("--header-height"),
      10
    ) || 112;
    const navH = document.getElementById("siteNav")?.offsetHeight || 0;

    return headerH + navH + extra;
  }

  function setActiveNav(id) {
  document.querySelectorAll(".navBtn").forEach(btn => {

    const onclick = btn.getAttribute("onclick") || "";

    const matchesOnclick =
      onclick.includes(`scrollToSection('${id}')`) ||
      onclick.includes(`scrollToSection("${id}")`) ||
      onclick.includes(`MGH.scrollToSection('${id}')`) ||
      onclick.includes(`MGH.scrollToSection("${id}")`);

    const matchesTarget = btn.dataset.target === id;

    btn.classList.toggle("active", matchesOnclick || matchesTarget);
  });
}

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;

    const top = el.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
    setActiveNav(id);
    window.scrollTo({ top, behavior: "smooth" });
  }

  function detectActiveSection(selector = ".siteSection") {
    const sections = document.querySelectorAll(selector);
    let currentSection = null;

    sections.forEach(section => {
      if (section.getBoundingClientRect().top < window.innerHeight / 3) {
        currentSection = section.id;
      }
    });

    if (currentSection) setActiveNav(currentSection);
  }

  function selectExclusive(selector, element) {
    document.querySelectorAll(selector).forEach(btn => btn.classList.remove("selected"));
    element?.classList.add("selected");
  }

  function updateHeaderModeLabel(label = "", elementId = "headerModeLabel") {
    const labelEl = document.getElementById(elementId);
    if (!labelEl) return;

    labelEl.textContent = label;
    labelEl.classList.toggle("hidden", !label);
  }

  function setWarning(message = "", selector = ".warningText") {
    const warning = document.querySelector(selector);
    if (!warning) return;

    warning.textContent = message;
    warning.classList.toggle("introSpacer", !message);
  }

  function setGameFeedback(target, message = "", state = "neutral") {
    const feedback = typeof target === "string"
      ? document.querySelector(target)
      : target;

    if (!feedback) return;

    feedback.textContent = message;
    feedback.classList.remove("feedbackCorrect", "feedbackWrong", "feedbackNeutral", "wrong");
    feedback.classList.add(
      state === "correct"
        ? "feedbackCorrect"
        : state === "wrong"
          ? "feedbackWrong"
          : "feedbackNeutral"
    );
  }

  function getAnswerFeedback(isCorrect, detail = "") {
    return isCorrect
      ? `Corretto!${detail ? ` ${detail}` : ""}`
      : `Sbagliato.${detail ? ` ${detail}` : ""}`;
  }

  return {
    AUTH_USER_KEY,
    readStoredJson,
    writeStoredJson,
    removeStoredKeys,
    getStoredAuthUser,
    isLoggedIn,
    padNumber,
    getRelativeAssetPath,
    setSiteFavicon,
    imageExists,
    resolveFirstExistingImage,
    goHome,
    goTo,
    scrollToSection,
    detectActiveSection,
    setActiveNav,
    selectExclusive,
    updateHeaderModeLabel,
    setWarning,
    setGameFeedback,
    getAnswerFeedback
  };
})();

MGH.setSiteFavicon();

window.MGH = MGH;
window.goHome = MGH.goHome;
window.goTo = MGH.goTo;
window.scrollToSection = MGH.scrollToSection;

/* ==================== SCROLL TO TOP ==================== */

document.addEventListener("DOMContentLoaded", () => {

  const scrollBtn = document.getElementById("scrollTopBtn");

  if (!scrollBtn) return;

  const toggleScrollButton = () => {

    if (window.scrollY > 350) {
      scrollBtn.classList.add("show");
    } else {
      scrollBtn.classList.remove("show");
    }
  };

  window.addEventListener("scroll", toggleScrollButton, { passive: true });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  toggleScrollButton();
});
