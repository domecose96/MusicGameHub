function initCivicClassFilters() {
  const buttons = document.querySelectorAll("[data-class-filter]");
  const cards = document.querySelectorAll(".civicPathCard[data-classes]");
  if (!buttons.length || !cards.length) return;

  const applyFilter = (filter) => {
    cards.forEach((card) => {
      const classes = (card.dataset.classes || "").split(/\s+/);
      const isVisible = filter === "all" || classes.includes(filter);
      card.classList.toggle("is-hidden", !isVisible);
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.toggle("active", item === button));
      applyFilter(button.dataset.classFilter);
    });
  });
}

document.addEventListener("DOMContentLoaded", initCivicClassFilters);
