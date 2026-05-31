const MGH = (() => {

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

  return {
    goHome,
    goTo,
    scrollToSection,
    detectActiveSection,
    setActiveNav,
    selectExclusive,
    updateHeaderModeLabel,
    setWarning
  };
})();

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
