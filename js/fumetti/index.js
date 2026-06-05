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

function createComicCard(comic, isReady, backCoverSrc, userLoggedIn) {
  const canOpen = MGH_COMICS.canOpen({ ready: isReady, userLoggedIn, slug: comic.slug });
  const isLocked = isReady && !canOpen;
  const tag = canOpen ? "a" : "article";
  const card = document.createElement(tag);

  card.className = `libraryBook ${comic.slug}Book ${canOpen ? "availableBook" : "futureBook"}${isLocked ? " lockedBook" : ""}`;
  if (canOpen) {
    card.href = `${comic.slug}.html`;
  }
  if (isLocked) {
    card.title = "Accedi per leggere questo volume";
  }

  const actionText = !isReady
    ? "In arrivo"
    : isLocked
      ? "Accedi"
      : userLoggedIn
        ? "Sfoglia"
        : "Anteprima";

  card.innerHTML = `
    <div class="bookCover">
      <span class="bookNumber">${comic.volume}</span>
      <div class="bookCoverInner">
        <div class="bookFace bookFaceFront">
          <img src="../img/fumetti/${comic.slug}/${comic.cover}" alt="Copertina del fumetto su ${comic.shortTitle}">
        </div>
        <div class="bookFace bookFaceBack">
          ${backCoverSrc
            ? `<img src="${backCoverSrc}" alt="Retro copertina del fumetto su ${comic.shortTitle}">`
            : `<div class="bookBackPlaceholder">
                <span>Vite a fumetti</span>
                <strong>${comic.shortTitle}</strong>
                <em>Volume ${comic.volume}</em>
              </div>`}
        </div>
      </div>
    </div>
    <span class="bookTitle">${comic.title}</span>
    <span class="bookAction">${actionText}</span>
  `;

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
    const isReady = await MGH_COMICS.isReady(COMIC_ROOT, comic.slug);
    const backCoverSrc = await MGH_COMICS.resolveBackCover(COMIC_ROOT, comic);
    if (isReady) readyCount += 1;
    shelf.appendChild(createComicCard(comic, isReady, backCoverSrc, userLoggedIn));
  }

  updateAvailability(readyCount, visibleComics.length, userLoggedIn);
  updateCatalogArrows();
}

function getCatalogStep() {
  if (!shelf) return 0;
  const firstBook = shelf.children[0];
  const nextPageBook = shelf.children[4];

  if (!firstBook || !nextPageBook) return shelf.clientWidth || 0;
  return nextPageBook.offsetLeft - firstBook.offsetLeft;
}

function getCatalogPageCount() {
  if (!shelf) return 1;
  return Math.max(1, Math.ceil(shelf.children.length / 4));
}

function goToCatalogPage(page) {
  if (!shelf) return;
  const maxPage = getCatalogPageCount() - 1;
  catalogPage = Math.max(0, Math.min(maxPage, page));
  const firstBook = shelf.children[0];
  const targetBook = shelf.children[catalogPage * 4];
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
