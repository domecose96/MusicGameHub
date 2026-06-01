const shelf = document.getElementById("bookShelf");
const prevCatalog = document.querySelector(".catalogArrowPrev");
const nextCatalog = document.querySelector(".catalogArrowNext");

function getCatalogStep() {
  const book = shelf?.querySelector(".libraryBook");
  if (!book) return 260;

  const styles = getComputedStyle(shelf);
  const gap = parseFloat(styles.columnGap || styles.gap) || 0;
  return book.getBoundingClientRect().width + gap;
}

function updateCatalogArrows() {
  if (!shelf || !prevCatalog || !nextCatalog) return;

  const maxScroll = shelf.scrollWidth - shelf.clientWidth;
  prevCatalog.disabled = shelf.scrollLeft <= 2;
  nextCatalog.disabled = shelf.scrollLeft >= maxScroll - 2;
}

prevCatalog?.addEventListener("click", () => {
  shelf?.scrollBy({ left: -getCatalogStep(), behavior: "smooth" });
});

nextCatalog?.addEventListener("click", () => {
  shelf?.scrollBy({ left: getCatalogStep(), behavior: "smooth" });
});

shelf?.addEventListener("scroll", updateCatalogArrows, { passive: true });
window.addEventListener("resize", updateCatalogArrows);
updateCatalogArrows();
