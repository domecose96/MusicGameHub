/* ==================== TIMELINE STORIA MUSICA ==================== */

document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("timelineTrack");
  const slides = document.querySelectorAll(".timelineSlide");
  const prevBtn = document.getElementById("prevEraBtn");
  const nextBtn = document.getElementById("nextEraBtn");
  const dots = document.querySelectorAll(".dotBtn");

  let currentSlide = 0;
  const maxSlide = slides.length - 1;

  function updateTimeline() {
    if (!track) return;

    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    slides.forEach((slide, index) => {
      slide.classList.toggle("activeSlide", index === currentSlide);
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("activeDot", index === currentSlide);
    });

    if (prevBtn) prevBtn.disabled = currentSlide === 0;
    if (nextBtn) nextBtn.disabled = currentSlide === maxSlide;
  }

  function goNext() {
    if (currentSlide < maxSlide) {
      currentSlide += 1;
      updateTimeline();
    }
  }

  function goPrev() {
    if (currentSlide > 0) {
      currentSlide -= 1;
      updateTimeline();
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", goNext);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", goPrev);
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      currentSlide = Number(dot.dataset.slide);
      updateTimeline();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") goNext();
    if (event.key === "ArrowLeft") goPrev();
  });

  let startX = 0;

  if (track) {
    track.addEventListener("touchstart", (event) => {
      startX = event.touches[0].clientX;
    }, { passive: true });

    track.addEventListener("touchend", (event) => {
      const endX = event.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) goNext();
        else goPrev();
      }
    }, { passive: true });
  }

  updateTimeline();
});