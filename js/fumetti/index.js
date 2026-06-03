const MIN_READY_PAGES = 10;
const AUTH_USER_KEY = "mgh_auth_user";
const PUBLIC_PREVIEW_SLUG = "mozart";

const comics = [
  {
    volume: "01",
    slug: "mozart",
    title: "Wolfgang Amadeus Mozart",
    shortTitle: "Mozart",
    cover: "mozart.webp"
  },
  {
    volume: "02",
    slug: "beethoven",
    title: "Ludwig van Beethoven",
    shortTitle: "Beethoven",
    cover: "beethoven.webp"
  },
  {
    volume: "03",
    slug: "chopin",
    title: "Fryderyk Chopin",
    shortTitle: "Chopin",
    cover: "chopin.webp"
  },
  {
    volume: "04",
    slug: "vivaldi",
    title: "Antonio Vivaldi",
    shortTitle: "Vivaldi",
    cover: "vivaldi.webp"
  },
  {
    volume: "05",
    slug: "bach",
    title: "Johann Sebastian Bach",
    shortTitle: "Bach",
    cover: "bach.webp"
  },
  {
    volume: "06",
    slug: "verdi",
    title: "Giuseppe Verdi",
    shortTitle: "Verdi",
    cover: "verdi.webp"
  },
  {
    volume: "07",
    slug: "puccini",
    title: "Giacomo Puccini",
    shortTitle: "Puccini",
    cover: "puccini.webp"
  },
  {
    volume: "08",
    slug: "rossini",
    title: "Gioachino Rossini",
    shortTitle: "Rossini",
    cover: "rossini.webp"
  },
  {
    volume: "09",
    slug: "paganini",
    title: "Niccolo Paganini",
    shortTitle: "Paganini",
    cover: "paganini.webp"
  },
  {
    volume: "10",
    slug: "tchaikovsky",
    title: "Petr Ilic Tchaikovsky",
    shortTitle: "Tchaikovsky",
    cover: "tchaikovsky.webp"
  }
];

const shelf = document.getElementById("bookShelf");
const comicAvailability = document.getElementById("comicAvailability");
const prevCatalog = document.querySelector(".catalogArrowPrev");
const nextCatalog = document.querySelector(".catalogArrowNext");
let catalogPage = 0;

function getStoredAuthUser() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_USER_KEY) || "null");
  } catch (_) {
    return null;
  }
}

function isLoggedIn() {
  return Boolean(getStoredAuthUser()?.id);
}

function imageExists(src) {
  return new Promise(resolve => {
    const probe = new Image();
    probe.onload = () => resolve(true);
    probe.onerror = () => resolve(false);
    probe.src = src;
  });
}

async function hasEnoughPages(comic) {
  for (let index = 1; index <= MIN_READY_PAGES; index++) {
    const number = String(index).padStart(2, "0");
    const base = `../img/fumetti/${comic.slug}/${number}`;
    const exists = await imageExists(`${base}.webp`) || await imageExists(`${base}.WEBP`);

    if (!exists) return false;
  }

  return true;
}

async function resolveBackCover(comic) {
  const base = `../img/fumetti/${comic.slug}/${comic.slug}_back`;
  const candidates = [`${base}.webp`, `${base}.WEBP`, `${base}.svg`, `${base}.png`, `${base}.jpg`];

  for (const candidate of candidates) {
    if (await imageExists(candidate)) return candidate;
  }

  return "";
}

function createComicCard(comic, isReady, backCoverSrc, userLoggedIn) {
  const canOpen = isReady && (userLoggedIn || comic.slug === PUBLIC_PREVIEW_SLUG);
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
  let readyCount = 0;
  const userLoggedIn = isLoggedIn();

  for (const comic of comics) {
    const isReady = await hasEnoughPages(comic);
    const backCoverSrc = await resolveBackCover(comic);
    if (isReady) readyCount += 1;
    shelf.appendChild(createComicCard(comic, isReady, backCoverSrc, userLoggedIn));
  }

  if (comicAvailability) {
    comicAvailability.innerHTML = userLoggedIn
      ? `
        <span aria-hidden="true">📚</span>
        <strong>${readyCount}</strong>
        <em>volumi disponibili</em>
        <small>/ ${comics.length}</small>
      `
      : `
        <span aria-hidden="true">📚</span>
        <strong>1</strong>
        <em>anteprima libera</em>
        <small>${readyCount} pronti</small>
      `;
    comicAvailability.style.setProperty("--available-progress", `${Math.round((readyCount / comics.length) * 100)}%`);
  }

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

  prevCatalog.disabled = catalogPage <= 0;
  nextCatalog.disabled = catalogPage >= getCatalogPageCount() - 1;
}

prevCatalog?.addEventListener("click", () => {
  goToCatalogPage(catalogPage - 1);
});

nextCatalog?.addEventListener("click", () => {
  goToCatalogPage(catalogPage + 1);
});

shelf?.addEventListener("scroll", updateCatalogArrows, { passive: true });
window.addEventListener("resize", updateCatalogArrows);

renderShelf();
