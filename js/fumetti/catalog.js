const MGH_COMICS = (() => {
  const REQUIRED_INTERIOR_PAGES = 30;
  const REQUIRED_TOTAL_IMAGES = REQUIRED_INTERIOR_PAGES + 2;
  const PUBLIC_PREVIEW_SLUG = "mozart";
  const PUBLIC_PREVIEW_PAGES = 3;
  const PUBLIC_LOCKED_PREVIEW_PAGES = PUBLIC_PREVIEW_PAGES + 1;
  const PAGE_EXTENSIONS = [".webp", ".WEBP", ".png", ".jpg", ".jpeg"];
  const COVER_EXTENSIONS = [".webp", ".WEBP", ".svg", ".png", ".jpg", ".jpeg"];

  const upcomingSeries = {
    key: "seconda",
    title: "Seconda serie",
    status: "In arrivo",
    detail: "Volumi 11-20"
  };

  const items = [
    {
      series: "prima",
      volume: "01",
      slug: "mozart",
      title: "Wolfgang Amadeus Mozart",
      shortTitle: "Mozart",
      cover: "mozart.webp"
    },
    {
      series: "prima",
      volume: "02",
      slug: "beethoven",
      title: "Ludwig van Beethoven",
      shortTitle: "Beethoven",
      cover: "beethoven.webp"
    },
    {
      series: "prima",
      volume: "03",
      slug: "chopin",
      title: "Fryderyk Chopin",
      shortTitle: "Chopin",
      cover: "chopin.webp"
    },
    {
      series: "prima",
      volume: "04",
      slug: "vivaldi",
      title: "Antonio Vivaldi",
      shortTitle: "Vivaldi",
      cover: "vivaldi.webp"
    },
    {
      series: "prima",
      volume: "05",
      slug: "bach",
      title: "Johann Sebastian Bach",
      shortTitle: "Bach",
      cover: "bach.webp"
    },
    {
      series: "prima",
      volume: "06",
      slug: "verdi",
      title: "Giuseppe Verdi",
      shortTitle: "Verdi",
      cover: "verdi.webp"
    },
    {
      series: "prima",
      volume: "07",
      slug: "puccini",
      title: "Giacomo Puccini",
      shortTitle: "Puccini",
      cover: "puccini.webp"
    },
    {
      series: "prima",
      volume: "08",
      slug: "rossini",
      title: "Gioachino Rossini",
      shortTitle: "Rossini",
      cover: "rossini.webp"
    },
    {
      series: "prima",
      volume: "09",
      slug: "paganini",
      title: "Niccolo Paganini",
      shortTitle: "Paganini",
      cover: "paganini.webp"
    },
    {
      series: "prima",
      volume: "10",
      slug: "tchaikovsky",
      title: "Petr Ilic Tchaikovsky",
      shortTitle: "Tchaikovsky",
      cover: "tchaikovsky.webp"
    }
  ];

  function pageCandidates(rootPath, slug, pageNumber) {
    const base = `${rootPath}/${slug}/${MGH.padNumber(pageNumber)}`;
    return PAGE_EXTENSIONS.map(extension => `${base}${extension}`);
  }

  function coverCandidates(rootPath, comic) {
    const configuredCover = comic.cover
      ? [`${rootPath}/${comic.slug}/${comic.cover}`]
      : [];
    const base = `${rootPath}/${comic.slug}/${comic.slug}`;
    return [...configuredCover, ...COVER_EXTENSIONS.map(extension => `${base}${extension}`)];
  }

  function backCoverCandidates(rootPath, comic) {
    const base = `${rootPath}/${comic.slug}/${comic.slug}_back`;
    return COVER_EXTENSIONS.map(extension => `${base}${extension}`);
  }

  async function isReady(rootPath, slug) {
    const comic = items.find(item => item.slug === slug);
    if (!comic) return false;

    const coverExists = await MGH.resolveFirstExistingImage(coverCandidates(rootPath, comic));
    if (!coverExists) return false;

    for (let index = 1; index <= REQUIRED_INTERIOR_PAGES; index++) {
      const exists = await MGH.resolveFirstExistingImage(pageCandidates(rootPath, slug, index));
      if (!exists) return false;
    }

    return Boolean(await MGH.resolveFirstExistingImage(backCoverCandidates(rootPath, comic)));
  }

  async function resolveBackCover(rootPath, comic) {
    return MGH.resolveFirstExistingImage(backCoverCandidates(rootPath, comic));
  }

  function canOpen({ ready, userLoggedIn, slug }) {
    return ready && (userLoggedIn || slug === PUBLIC_PREVIEW_SLUG);
  }

  return {
    REQUIRED_INTERIOR_PAGES,
    REQUIRED_TOTAL_IMAGES,
    PUBLIC_PREVIEW_SLUG,
    PUBLIC_PREVIEW_PAGES,
    PUBLIC_LOCKED_PREVIEW_PAGES,
    PAGE_EXTENSIONS,
    COVER_EXTENSIONS,
    upcomingSeries,
    items,
    coverCandidates,
    pageCandidates,
    backCoverCandidates,
    isReady,
    resolveBackCover,
    canOpen
  };
})();

window.MGH_COMICS = MGH_COMICS;
