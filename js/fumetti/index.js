const COMIC_ROOT = "../img/fumetti";
const comics = MGH_COMICS.items;

const shelf = document.getElementById("bookShelf");
const comicAvailability = document.getElementById("comicAvailability");
const seriesFilterButtons = document.querySelectorAll(".seriesFilterBtn[data-series-filter]");
const prevCatalog = document.querySelector(".catalogArrowPrev");
const nextCatalog = document.querySelector(".catalogArrowNext");
let catalogPage = 0;
let activeSeriesFilter = "all";

function getVisibleComics() {
  if (activeSeriesFilter === "all") return comics;
  return comics.filter(comic => comic.series === activeSeriesFilter);
}

function updateSeriesFilterButtons() {
  seriesFilterButtons.forEach(button => {
    button.classList.toggle("selected", button.dataset.seriesFilter === activeSeriesFilter);
  });
}

function updateAvailability(readyCount, totalCount, userLoggedIn) {
  if (!comicAvailability) return;

  if (activeSeriesFilter === MGH_COMICS.upcomingSeries.key) {
    comicAvailability.innerHTML = `
      <span aria-hidden="true">📚</span>
      <strong>0</strong>
      <em>volumi disponibili</em>
      <small>${MGH_COMICS.upcomingSeries.status}</small>
    `;
    comicAvailability.style.setProperty("--available-progress", "0%");
    return;
  }

  comicAvailability.innerHTML = userLoggedIn
    ? `
      <span aria-hidden="true">📚</span>
      <strong>${readyCount}</strong>
      <em>volumi disponibili</em>
      <small>/ ${totalCount}</small>
    `
    : `
      <span aria-hidden="true">📚</span>
      <strong>1</strong>
      <em>anteprima libera</em>
      <small>${readyCount} pronti</small>
    `;
  comicAvailability.style.setProperty("--available-progress", `${Math.round((readyCount / totalCount) * 100)}%`);
}

function renderUpcomingSeriesCard() {
  const series = MGH_COMICS.upcomingSeries;
  if (!shelf || !series) return;

  shelf.innerHTML = `
    <article class="upcomingSeriesCard">
      <span>${series.title}</span>
      <strong>${series.status}</strong>
      <em>${series.detail}</em>
    </article>
  `;
}

function getCoverSrc(comic) {
  return `${COMIC_ROOT}/${comic.slug}/${comic.cover}`;
}

function getBackCoverSrc(comic) {
  return `${COMIC_ROOT}/${comic.slug}/${comic.slug}_back.webp`;
}

function getBooksPerCatalogPage() {
  return window.matchMedia("(max-width: 620px)").matches ? 1 : 4;
}

function updateComicCardState(card, comic, isReady, backCoverSrc, userLoggedIn) {
  const canOpen = MGH_COMICS.canOpen({ ready: isReady, userLoggedIn, slug: comic.slug });
  const isLocked = isReady && !canOpen;
  const actionText = !isReady
    ? "In arrivo"
    : isLocked
      ? "Accedi"
      : userLoggedIn
        ? "Sfoglia"
        : "Anteprima";

  card.className = `libraryBook ${comic.slug}Book ${canOpen ? "availableBook" : "futureBook"}${isLocked ? " lockedBook" : ""}`;
  card.dataset.ready = isReady ? "true" : "false";
  card.dataset.canOpen = canOpen ? "true" : "false";

  if (canOpen) {
    card.href = `${comic.slug}.html`;
    card.removeAttribute("aria-disabled");
    card.removeAttribute("title");
    card.tabIndex = 0;
  } else {
    card.removeAttribute("href");
    card.setAttribute("aria-disabled", "true");
    card.tabIndex = 0;
  }

  if (isLocked) {
    card.title = "Accedi per leggere questo volume";
  }

  const action = card.querySelector(".bookAction");
  if (action) action.textContent = actionText;

  const backFace = card.querySelector(".bookFaceBack");
  if (backFace && backCoverSrc) {
    backFace.innerHTML = `<img src="${backCoverSrc}" alt="Retro copertina del fumetto su ${comic.shortTitle}" loading="lazy" decoding="async">`;
  }
}

function createComicCard(comic, userLoggedIn) {
  const card = document.createElement("a");

  card.innerHTML = `
    <div class="bookCover">
      <span class="bookNumber">${comic.volume}</span>
      <div class="bookCoverInner">
        <div class="bookFace bookFaceFront">
          <img src="${getCoverSrc(comic)}" alt="Copertina del fumetto su ${comic.shortTitle}" loading="eager" decoding="async">
        </div>
        <div class="bookFace bookFaceBack">
          <div class="bookBackPlaceholder">
            <span>Vite a fumetti</span>
            <strong>${comic.shortTitle}</strong>
            <em>Volume ${comic.volume}</em>
          </div>
        </div>
      </div>
    </div>
    <span class="bookTitle">${comic.title}</span>
    <span class="bookAction">Caricamento</span>
  `;

  updateComicCardState(card, comic, false, null, userLoggedIn);
  return card;
}

async function renderShelf() {
  if (!shelf) return;

  shelf.innerHTML = "";
  catalogPage = 0;
  const userLoggedIn = MGH.isLoggedIn();

  updateSeriesFilterButtons();

  if (activeSeriesFilter === MGH_COMICS.upcomingSeries.key) {
    renderUpcomingSeriesCard();
    updateAvailability(0, 1, userLoggedIn);
    updateCatalogArrows();
    return;
  }

  const visibleComics = getVisibleComics();
  let readyCount = 0;

  for (const comic of visibleComics) {
    const isReady = Boolean(comic.ready);
    const card = createComicCard(comic, userLoggedIn);
    updateComicCardState(card, comic, isReady, getBackCoverSrc(comic), userLoggedIn);
    shelf.appendChild(card);
    if (isReady) readyCount += 1;
  }

  updateAvailability(readyCount, visibleComics.length, userLoggedIn);
  updateCatalogArrows();
}

function getCatalogStep() {
  if (!shelf) return 0;
  const firstBook = shelf.children[0];
  const nextPageBook = shelf.children[getBooksPerCatalogPage()];

  if (!firstBook || !nextPageBook) return shelf.clientWidth || 0;
  return nextPageBook.offsetLeft - firstBook.offsetLeft;
}

function getCatalogPageCount() {
  if (!shelf) return 1;
  return Math.max(1, Math.ceil(shelf.children.length / getBooksPerCatalogPage()));
}

function goToCatalogPage(page) {
  if (!shelf) return;
  const maxPage = getCatalogPageCount() - 1;
  const booksPerPage = getBooksPerCatalogPage();
  catalogPage = Math.max(0, Math.min(maxPage, page));
  const firstBook = shelf.children[0];
  const targetBook = shelf.children[catalogPage * booksPerPage];
  const left = targetBook && firstBook
    ? targetBook.offsetLeft - firstBook.offsetLeft
    : catalogPage * getCatalogStep();

  shelf.scrollTo({ left, behavior: "smooth" });
  updateCatalogArrows();
}

function updateCatalogArrows() {
  if (!shelf || !prevCatalog || !nextCatalog) return;

  const step = getCatalogStep();
  if (step) {
    catalogPage = Math.round(shelf.scrollLeft / step);
  }

  const canScroll = activeSeriesFilter !== MGH_COMICS.upcomingSeries.key;
  prevCatalog.disabled = !canScroll || catalogPage <= 0;
  nextCatalog.disabled = !canScroll || catalogPage >= getCatalogPageCount() - 1;
}

seriesFilterButtons.forEach(button => {
  button.addEventListener("click", () => {
    activeSeriesFilter = button.dataset.seriesFilter;
    renderShelf();
  });
});

prevCatalog?.addEventListener("click", () => {
  goToCatalogPage(catalogPage - 1);
});

nextCatalog?.addEventListener("click", () => {
  goToCatalogPage(catalogPage + 1);
});

shelf?.addEventListener("scroll", updateCatalogArrows, { passive: true });
window.addEventListener("resize", updateCatalogArrows);

renderShelf();
