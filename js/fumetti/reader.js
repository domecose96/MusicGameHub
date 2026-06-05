const MAX_SCAN_PAGES = 80;

const readerConfig = {
  slug: document.body.dataset.comicSlug || "",
  title: document.body.dataset.comicTitle || "Fumetto",
  volume: document.body.dataset.comicVolume || "",
  cover: document.body.dataset.comicCover || "",
  back: document.body.dataset.comicBack || "",
  alt: document.body.dataset.comicAlt || document.body.dataset.comicTitle || "fumetto"
};

const COMIC_DIR = `../img/fumetti/${readerConfig.slug}`;

let comicPages = [];
let currentPage = 0;
let spreadMode = false;

const image = document.getElementById("comicImage");
const secondImage = document.getElementById("secondComicImage");
const comicStage = document.querySelector(".comicStage");
const pageSpread = document.getElementById("pageSpread");
const secondPageFrame = document.getElementById("secondPageFrame");
const placeholder = document.getElementById("comicPlaceholder");
const placeholderNumber = document.getElementById("placeholderNumber");
const placeholderTitle = document.getElementById("placeholderTitle");
const placeholderText = document.getElementById("placeholderText");
const pageTitle = document.getElementById("pageTitle");
const pageCounter = document.getElementById("pageCounter");
const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");
const firstPage = document.getElementById("firstPage");
const lastPage = document.getElementById("lastPage");
const fullscreenPage = document.getElementById("fullscreenPage");
const spreadModeButton = document.getElementById("spreadMode");

function isPublicPreview() {
  return !MGH.isLoggedIn() && readerConfig.slug === MGH_COMICS.PUBLIC_PREVIEW_SLUG;
}

function isLockedComic() {
  return !MGH.isLoggedIn() && readerConfig.slug !== MGH_COMICS.PUBLIC_PREVIEW_SLUG;
}

function setReaderControlsDisabled(disabled) {
  [prevPage, nextPage, firstPage, lastPage, fullscreenPage, spreadModeButton].forEach(button => {
    if (button) button.disabled = disabled;
  });
}

function updateReaderProgress(lastVisibleIndex = 0) {
  const counterBox = pageCounter?.closest(".readerCounter");
  const total = comicPages.length || 0;
  const progress = total ? Math.round((Math.min(lastVisibleIndex, total) / total) * 100) : 0;

  counterBox?.style.setProperty("--reader-progress", `${progress}%`);
  counterBox?.setAttribute("aria-label", `Avanzamento lettura ${progress}%`);
}

async function resolvePageSource(number) {
  return MGH.resolveFirstExistingImage(
    MGH_COMICS.PAGE_EXTENSIONS.map(extension => `${COMIC_DIR}/${number}${extension}`)
  );
}

async function discoverPages() {
  const pages = [];
  const coverSrc = `${COMIC_DIR}/${readerConfig.cover || `${readerConfig.slug}.webp`}`;

  if (await MGH.imageExists(coverSrc)) {
    pages.push({
      src: coverSrc,
      title: "Copertina",
      label: "Copertina",
      kind: "cover"
    });
  }

  for (let index = 1; index <= MAX_SCAN_PAGES; index++) {
    const number = MGH.padNumber(index);
    const src = await resolvePageSource(number);

    if (!src) break;

    pages.push({
      src,
      title: `Pagina ${index}`,
      label: number,
      kind: "page"
    });
  }

  const backCoverSrc = `${COMIC_DIR}/${readerConfig.back || `${readerConfig.slug}_back.webp`}`;
  if (await MGH.imageExists(backCoverSrc)) {
    pages.push({
      src: backCoverSrc,
      title: "Retro copertina",
      label: "Retro",
      kind: "back"
    });
  }

  return pages;
}

function renderPage() {
  const page = comicPages[currentPage];
  const nextComicPage = comicPages[currentPage + 1];
  const showSpread = spreadMode && currentPage > 0 && nextComicPage && nextComicPage.kind !== "back" && !page.locked && !nextComicPage.locked;
  const secondPage = showSpread ? comicPages[currentPage + 1] : null;

  if (!page) {
    showPlaceholder("...", "Nessuna pagina trovata", `Inserisci le immagini nella cartella img/fumetti/${readerConfig.slug}.`);
    return;
  }

  pageTitle.textContent = page.title;
  pageCounter.textContent = secondPage
    ? `${currentPage + 1}-${currentPage + 2} / ${comicPages.length}`
    : `${currentPage + 1} / ${comicPages.length}`;
  updateReaderProgress(secondPage ? currentPage + 2 : currentPage + 1);

  placeholder.hidden = true;
  image.hidden = false;
  image.alt = `${page.title} del fumetto su ${readerConfig.alt}`;
  image.src = page.src;

  pageSpread.classList.toggle("spreadMode", Boolean(secondPage));
  pageSpread.classList.toggle("lockedPreview", Boolean(page.locked));
  pageSpread.classList.remove("pageChanging");
  comicStage?.classList.toggle("hasSpread", Boolean(secondPage));
  secondPageFrame.hidden = !secondPage;
  if (secondPage) {
    secondImage.alt = `${secondPage.title} del fumetto su ${readerConfig.alt}`;
    secondImage.src = secondPage.src;
  }

  prevPage.disabled = currentPage === 0;
  nextPage.disabled = currentPage >= comicPages.length - 1;
}

function showPlaceholder(number = "...", title = "Pagina non disponibile", text = "Aggiungi la tavola in formato `.webp`.") {
  image.hidden = true;
  if (secondPageFrame) secondPageFrame.hidden = true;
  pageSpread?.classList.remove("spreadMode");
  comicStage?.classList.remove("hasSpread");
  placeholder.hidden = false;
  placeholderNumber.textContent = number;
  placeholderTitle.textContent = title;
  placeholderText.textContent = text;
  updateReaderProgress(0);
}

function goToPage(index) {
  if (!comicPages.length) return;
  currentPage = Math.max(0, Math.min(comicPages.length - 1, index));
  pageSpread.classList.add("pageChanging");
  window.setTimeout(renderPage, 90);
}

async function initReader() {
  showPlaceholder("...", "Caricamento", "Sto cercando le pagine del volume.");

  if (isLockedComic()) {
    comicPages = [];
    pageTitle.textContent = "Accesso riservato";
    pageCounter.textContent = "Solo registrati";
    showPlaceholder("🔒", "Accesso riservato", "Accedi o registrati per leggere questo volume della collana.");
    setReaderControlsDisabled(true);
    return;
  }

  const discoveredPages = await discoverPages();
  if (isPublicPreview()) {
    comicPages = discoveredPages.slice(0, MGH_COMICS.PUBLIC_LOCKED_PREVIEW_PAGES).map((page, index) => ({
      ...page,
      locked: index >= MGH_COMICS.PUBLIC_PREVIEW_PAGES
    }));
  } else {
    comicPages = discoveredPages;
  }

  currentPage = 0;
  renderPage();
}

image.addEventListener("error", () => {
  const page = comicPages[currentPage];
  showPlaceholder(page?.label || "...", page?.title || "Pagina non disponibile");
});

nextPage.addEventListener("click", () => goToPage(currentPage + (spreadMode && currentPage > 0 ? 2 : 1)));
prevPage.addEventListener("click", () => goToPage(currentPage - (spreadMode && currentPage > 1 ? 2 : 1)));
firstPage.addEventListener("click", () => goToPage(0));
lastPage.addEventListener("click", () => {
  goToPage(comicPages.length - 1);
});

spreadModeButton.addEventListener("click", () => {
  spreadMode = !spreadMode;
  spreadModeButton.setAttribute("aria-pressed", String(spreadMode));
  spreadModeButton.textContent = spreadMode ? "Pagina singola" : "Due pagine";
  if (spreadMode && currentPage > 0 && currentPage % 2 === 0) {
    currentPage -= 1;
  }
  renderPage();
});

fullscreenPage.addEventListener("click", async () => {
  const page = document.querySelector(".comicReaderPage");
  if (!page) return;

  const isReading = document.body.classList.toggle("readingMode");
  page.classList.toggle("readingMode", isReading);
  fullscreenPage.textContent = isReading ? "Esci dalla lettura" : "Lettura grande";
  fullscreenPage.setAttribute("aria-pressed", String(isReading));

  if (isReading && document.fullscreenEnabled) {
    await document.documentElement.requestFullscreen().catch(() => {});
  } else if (document.fullscreenElement) {
    await document.exitFullscreen().catch(() => {});
  }
});

document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    document.body.classList.remove("readingMode");
    document.querySelector(".comicReaderPage")?.classList.remove("readingMode");
    fullscreenPage.textContent = "Lettura grande";
    fullscreenPage.setAttribute("aria-pressed", "false");
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") prevPage.click();
  if (event.key === "ArrowRight") nextPage.click();
});

initReader();
