/* ==================== STRUMENTI MUSICALI GAME ==================== */

/* ==================== STRUMENTI DATABASE ==================== */

const STRUMENTI = [
  {
    id: "gong",
    name: "Gong",
    family: "Percussioni",
    mouthpiece: "Idiofono metallico",
    image: "../img/strumenti/gong.webp",
    audio: null
  },
  {
    id: "tam-tam",
    name: "Tam-tam",
    family: "Percussioni",
    mouthpiece: "Idiofono metallico",
    image: "../img/strumenti/tam_tam.webp",
    audio: null
  },
  {
    id: "piatti",
    name: "Piatti",
    family: "Percussioni",
    mouthpiece: "Idiofono metallico",
    image: "../img/strumenti/piatti.webp",
    audio: null
  },
  {
    id: "piatto-sospeso",
    name: "Piatto sospeso",
    family: "Percussioni",
    mouthpiece: "Idiofono metallico",
    image: "../img/strumenti/piatti.webp",
    audio: null
  },
  {
    id: "triangolo",
    name: "Triangolo",
    family: "Percussioni",
    mouthpiece: "Idiofono metallico",
    image: "../img/strumenti/triangolo.webp",
    audio: null
  },
  {
    id: "campane-tubolari",
    name: "Campane tubolari",
    family: "Percussioni",
    mouthpiece: "Idiofono intonato",
    image: "../img/strumenti/vibrafono.webp",
    audio: null
  },
  {
    id: "castagnette",
    name: "Castagnette",
    family: "Percussioni",
    mouthpiece: "Idiofono in legno",
    image: "../img/strumenti/castagnette.webp",
    audio: null
  },
  {
    id: "woodblock",
    name: "Woodblock",
    family: "Percussioni",
    mouthpiece: "Idiofono in legno",
    image: "../img/strumenti/castagnette.webp",
    audio: null
  },
  {
    id: "temple-block",
    name: "Temple block",
    family: "Percussioni",
    mouthpiece: "Idiofono in legno",
    image: "../img/strumenti/castagnette.webp",
    audio: null
  },
  {
    id: "raganella",
    name: "Raganella",
    family: "Percussioni",
    mouthpiece: "Idiofono raschiato",
    image: "../img/strumenti/castagnette.webp",
    audio: null
  },
  {
    id: "frusta",
    name: "Frusta",
    family: "Percussioni",
    mouthpiece: "Idiofono in legno",
    image: "../img/strumenti/castagnette.webp",
    audio: null
  },
  {
    id: "maracas",
    name: "Maracas",
    family: "Percussioni",
    mouthpiece: "Idiofono scosso",
    image: "../img/strumenti/castagnette.webp",
    audio: null
  },
  {
    id: "xilofono",
    name: "Xilofono",
    family: "Percussioni",
    mouthpiece: "Idiofono intonato",
    image: "../img/strumenti/xilofono.webp",
    audio: null
  },
  {
    id: "vibrafono",
    name: "Vibrafono",
    family: "Percussioni",
    mouthpiece: "Idiofono intonato",
    image: "../img/strumenti/vibrafono.webp",
    audio: null
  },
  {
    id: "glockenspiel",
    name: "Glockenspiel",
    family: "Percussioni",
    mouthpiece: "Idiofono intonato",
    image: "../img/strumenti/vibrafono.webp",
    audio: null
  },
  {
    id: "marimba",
    name: "Marimba",
    family: "Percussioni",
    mouthpiece: "Idiofono intonato",
    image: "../img/strumenti/xilofono.webp",
    audio: null
  },
  {
    id: "grancassa",
    name: "Grancassa",
    family: "Percussioni",
    mouthpiece: "Membranofono",
    image: "../img/strumenti/tamburo.webp",
    audio: null
  },
  {
    id: "tamburo-a-sonagli",
    name: "Tamburo a sonagli",
    family: "Percussioni",
    mouthpiece: "Membranofono",
    image: "../img/strumenti/tamburo.webp",
    audio: null
  },
  {
    id: "timpani",
    name: "Timpani",
    family: "Percussioni",
    mouthpiece: "Membranofono",
    image: "../img/strumenti/timpani.webp",
    audio: null
  },
  {
    id: "tamburo",
    name: "Tamburo",
    family: "Percussioni",
    mouthpiece: "Membranofono",
    image: "../img/strumenti/tamburo.webp",
    audio: null
  },
  {
    id: "batteria",
    name: "Batteria",
    family: "Percussioni",
    mouthpiece: "Membranofono",
    image: "../img/strumenti/batteria.webp",
    audio: null
  },
  {
    id: "flauto-dolce",
    name: "Flauto dolce",
    family: "Fiato",
    mouthpiece: "Imboccatura a becco",
    image: "../img/strumenti/flauto.webp",
    audio: null
  },
  {
    id: "flauto",
    name: "Flauto",
    family: "Fiato",
    mouthpiece: "Imboccatura a labbro",
    image: "../img/strumenti/flauto.webp",
    audio: null
  },
  {
    id: "ottavino",
    name: "Ottavino",
    family: "Fiato",
    mouthpiece: "Imboccatura a labbro",
    image: "../img/strumenti/flauto.webp",
    audio: null
  },
  {
    id: "oboe",
    name: "Oboe",
    family: "Fiato",
    mouthpiece: "Ancia doppia",
    image: "../img/strumenti/oboe.webp",
    audio: null
  },
  {
    id: "corno-inglese",
    name: "Corno inglese",
    family: "Fiato",
    mouthpiece: "Ancia doppia",
    image: "../img/strumenti/oboe.webp",
    audio: null
  },
  {
    id: "clarinetto",
    name: "Clarinetto",
    family: "Fiato",
    mouthpiece: "Ancia semplice",
    image: "../img/strumenti/clarinetto.webp",
    audio: null
  },
  {
    id: "sassofono",
    name: "Sassofono",
    family: "Fiato",
    mouthpiece: "Ancia semplice",
    image: "../img/strumenti/sassofono.webp",
    audio: null
  },
  {
    id: "fagotto",
    name: "Fagotto",
    family: "Fiato",
    mouthpiece: "Ancia doppia",
    image: "../img/strumenti/fagotto.webp",
    audio: null
  },
  {
    id: "controfagotto",
    name: "Controfagotto",
    family: "Fiato",
    mouthpiece: "Ancia doppia",
    image: "../img/strumenti/fagotto.webp",
    audio: null
  },
  {
    id: "tromba",
    name: "Tromba",
    family: "Fiato",
    mouthpiece: "Bocchino",
    image: "../img/strumenti/tromba.webp",
    audio: null
  },
  {
    id: "trombone",
    name: "Trombone",
    family: "Fiato",
    mouthpiece: "Bocchino",
    image: "../img/strumenti/trombone.webp",
    audio: null
  },
  {
    id: "corno",
    name: "Corno",
    family: "Fiato",
    mouthpiece: "Bocchino",
    image: "../img/strumenti/corno.webp",
    audio: null
  },
  {
    id: "bassotuba",
    name: "Bassotuba",
    family: "Fiato",
    mouthpiece: "Bocchino",
    image: "../img/strumenti/bassotuba.webp",
    audio: null
  },
  {
    id: "cornamusa",
    name: "Cornamusa",
    family: "Fiato",
    mouthpiece: "Sacca d'aria",
    image: "../img/strumenti/cornamusa.webp",
    audio: null
  },
  {
    id: "violino",
    name: "Violino",
    family: "Corde",
    mouthpiece: "Arco",
    image: "../img/strumenti/violino.webp",
    audio: null
  },
  {
    id: "viola",
    name: "Viola",
    family: "Corde",
    mouthpiece: "Arco",
    image: "../img/strumenti/viola.webp",
    audio: null
  },
  {
    id: "violoncello",
    name: "Violoncello",
    family: "Corde",
    mouthpiece: "Arco",
    image: "../img/strumenti/violoncello.webp",
    audio: null
  },
  {
    id: "arpa",
    name: "Arpa",
    family: "Corde",
    mouthpiece: "Pizzico",
    image: "../img/strumenti/arpa.webp",
    audio: null
  },
  {
    id: "chitarra",
    name: "Chitarra",
    family: "Corde",
    mouthpiece: "Pizzico/Plettro",
    image: "../img/strumenti/chitarra.webp",
    audio: null
  },
  {
    id: "liuto",
    name: "Liuto",
    family: "Corde",
    mouthpiece: "Pizzico",
    image: "../img/strumenti/liuto.webp",
    audio: null
  },
  {
    id: "mandolino",
    name: "Mandolino",
    family: "Corde",
    mouthpiece: "Pizzico",
    image: "../img/strumenti/mandolino.webp",
    audio: null
  },
  {
    id: "lira",
    name: "Lira",
    family: "Corde",
    mouthpiece: "Pizzico",
    image: "../img/strumenti/lira.webp",
    audio: null
  },
  {
    id: "viella",
    name: "Viella",
    family: "Corde",
    mouthpiece: "Arco",
    image: "../img/strumenti/viella.webp",
    audio: null
  },
  {
    id: "contrabbasso",
    name: "Contrabbasso",
    family: "Corde",
    mouthpiece: "Arco",
    image: "../img/strumenti/contrabbasso.webp",
    audio: null
  },
  {
    id: "clavicembalo",
    name: "Clavicembalo",
    family: "Tastiere",
    mouthpiece: "Tasti",
    image: "../img/strumenti/clavicembalo.webp",
    audio: null
  },
  {
    id: "pianoforte",
    name: "Pianoforte",
    family: "Tastiere",
    mouthpiece: "Tasti",
    image: "../img/strumenti/pianoforte.webp",
    audio: null
  },
  {
    id: "organo",
    name: "Organo",
    family: "Tastiere",
    mouthpiece: "Tasti",
    image: "../img/strumenti/organo.webp",
    audio: null
  },
  {
    id: "fisarmonica",
    name: "Fisarmonica",
    family: "Tastiere",
    mouthpiece: "Mantice",
    image: "../img/strumenti/fisarmonica.webp",
    audio: null
  },
  {
    id: "chitarra-elettrica",
    name: "Chitarra elettrica",
    family: "Elettrofoni",
    mouthpiece: "Corde amplificate",
    image: "../img/strumenti/chitarra_elettrica.webp",
    audio: null
  },
  {
    id: "basso-elettrico",
    name: "Basso elettrico",
    family: "Elettrofoni",
    mouthpiece: "Corde amplificate",
    image: "../img/strumenti/basso_elettrico.webp",
    audio: null
  },
  {
    id: "organo-hammond",
    name: "Organo Hammond",
    family: "Elettrofoni",
    mouthpiece: "Tasti elettrici",
    image: "../img/strumenti/organo_hammond.webp",
    audio: null
  },
  {
    id: "theremin",
    name: "Theremin",
    family: "Elettrofoni",
    mouthpiece: "Senza contatto",
    image: "../img/strumenti/theremin.webp",
    audio: null
  },
  {
    id: "onde-martenot",
    name: "Onde Martenot",
    family: "Elettrofoni",
    mouthpiece: "Tastiera e anello",
    image: "../img/strumenti/onde_martenot.webp",
    audio: null
  },
  {
    id: "sintetizzatore",
    name: "Sintetizzatore",
    family: "Elettrofoni",
    mouthpiece: "Tasti elettrici",
    image: "../img/strumenti/sintetizzatore.webp",
    audio: null
  },
  {
    id: "campionatore",
    name: "Campionatore",
    family: "Elettrofoni",
    mouthpiece: "Pad e tasti",
    image: "../img/strumenti/campionatore.webp",
    audio: null
  }
];

const AUDIO_EXTENSIONS = ["mp3", "ogg", "wav", "m4a"];
const KNOWN_AUDIO_INSTRUMENT_IDS = new Set([
  "batteria",
  "castagnette",
  "gong",
  "piatti",
  "tamburo",
  "timpani",
  "triangolo",
  "vibrafono",
  "xilofono"
]);

let listenInstrumentPool = [];

function getInstrumentAssetSlug(id) {
  return String(id || "").replace(/-/g, "_");
}

function getInstrumentImagePath(instrument) {
  return `../img/strumenti/${getInstrumentAssetSlug(instrument.id)}.webp`;
}

function getInstrumentAudioPath(instrument, extension = "mp3") {
  return `../audio/strumenti/${getInstrumentAssetSlug(instrument.id)}.${extension}`;
}

function getFamilyImagePath(family) {
  const familySlug = {
    Corde: "corde",
    Fiato: "fiati",
    Percussioni: "percussioni",
    Tastiere: "tastiere",
    Elettrofoni: "elettrofoni"
  }[family];
  return familySlug ? `../img/strumenti/famiglie/${familySlug}.webp` : "";
}

function normalizeInstrumentCatalog() {
  STRUMENTI.forEach(instrument => {
    instrument.image = getInstrumentImagePath(instrument);
    instrument.audio = KNOWN_AUDIO_INSTRUMENT_IDS.has(instrument.id)
      ? getInstrumentAudioPath(instrument)
      : null;
  });
  listenInstrumentPool = STRUMENTI.filter(instrument => instrument.audio);
}

async function detectInstrumentAudioCatalog() {
  if (typeof fetch !== "function") return;

  const detected = [];
  await Promise.all(STRUMENTI.map(async instrument => {
    for (const extension of AUDIO_EXTENSIONS) {
      const audioPath = getInstrumentAudioPath(instrument, extension);
      try {
        const response = await fetch(audioPath, { method: "HEAD", cache: "no-store" });
        if (response.ok || (response.status >= 200 && response.status < 400)) {
          instrument.audio = audioPath;
          detected.push(instrument);
          return;
        }
        if (response.status === 405) {
          const fallbackResponse = await fetch(audioPath, { cache: "no-store" });
          if (fallbackResponse.ok) {
            instrument.audio = audioPath;
            detected.push(instrument);
            return;
          }
        }
      } catch {
        return;
      }
    }
  }));

  if (detected.length) {
    listenInstrumentPool = detected.sort((a, b) => a.name.localeCompare(b.name, "it"));
  }
}

normalizeInstrumentCatalog();
const instrumentCatalogReady = detectInstrumentAudioCatalog();

const RECOGNIZE_SIMILAR_OPTIONS = {
  gong: ["tam-tam", "piatti"],
  "tam-tam": ["gong", "piatti"],
  piatti: ["piatto-sospeso", "gong"],
  "piatto-sospeso": ["piatti", "tam-tam"],
  triangolo: ["campane-tubolari", "piatti"],
  "campane-tubolari": ["vibrafono", "glockenspiel"],
  castagnette: ["woodblock", "temple-block"],
  woodblock: ["temple-block", "castagnette"],
  "temple-block": ["woodblock", "castagnette"],
  raganella: ["frusta", "woodblock"],
  frusta: ["raganella", "castagnette"],
  maracas: ["castagnette", "temple-block"],
  xilofono: ["marimba", "vibrafono"],
  vibrafono: ["glockenspiel", "xilofono"],
  glockenspiel: ["vibrafono", "campane-tubolari"],
  marimba: ["xilofono", "vibrafono"],
  grancassa: ["tamburo", "timpani"],
  "tamburo-a-sonagli": ["tamburo", "batteria"],
  tamburo: ["timpani", "grancassa"],
  timpani: ["tamburo", "grancassa"],
  batteria: ["tamburo", "tamburo-a-sonagli"],
  "flauto-dolce": ["flauto", "ottavino"],
  flauto: ["ottavino", "flauto-dolce"],
  ottavino: ["flauto", "flauto-dolce"],
  clarinetto: ["oboe", "sassofono"],
  oboe: ["corno-inglese", "fagotto"],
  "corno-inglese": ["oboe", "fagotto"],
  fagotto: ["controfagotto", "oboe"],
  controfagotto: ["fagotto", "bassotuba"],
  sassofono: ["clarinetto", "oboe"],
  tromba: ["trombone", "corno"],
  trombone: ["tromba", "corno"],
  corno: ["tromba", "trombone"],
  bassotuba: ["trombone", "corno"],
  cornamusa: ["fisarmonica", "organo"],
  violino: ["viola", "violoncello"],
  viola: ["violino", "violoncello"],
  violoncello: ["violino", "contrabbasso"],
  contrabbasso: ["violoncello", "violino"],
  arpa: ["lira", "chitarra"],
  chitarra: ["liuto", "mandolino"],
  liuto: ["mandolino", "chitarra"],
  mandolino: ["liuto", "chitarra"],
  lira: ["arpa", "liuto"],
  viella: ["violino", "viola"],
  clavicembalo: ["pianoforte", "organo"],
  pianoforte: ["clavicembalo", "organo"],
  organo: ["pianoforte", "organo-hammond"],
  fisarmonica: ["organo", "cornamusa"],
  "chitarra-elettrica": ["basso-elettrico", "chitarra"],
  "basso-elettrico": ["chitarra-elettrica", "chitarra"],
  "organo-hammond": ["organo", "sintetizzatore"],
  theremin: ["onde-martenot", "sintetizzatore"],
  "onde-martenot": ["theremin", "sintetizzatore"],
  sintetizzatore: ["campionatore", "organo-hammond"],
  campionatore: ["sintetizzatore", "organo-hammond"]
};

const STRUMENTI_RANKED_SPEED_BONUS = {
  recognize: [
    { maxTime: 2.2, bonus: 25 },
    { maxTime: 4.5, bonus: 10 }
  ],
  listen: [
    { maxTime: 6, bonus: 25 },
    { maxTime: 9, bonus: 10 }
  ],
  memory: [
    { maxTime: 18, bonus: 25 },
    { maxTime: 30, bonus: 10 }
  ]
};

/* ==================== VARIABILI GLOBALI ==================== */

let gameMode = "training";
let selectedGameMode = null;
let currentQuestion = null;
let questionStartTime = null;
let currentAudio = null;
let currentAudioButton = null;
let listenAudioPlayed = false;

const menu = document.getElementById("menu");
const game = document.getElementById("game");
const questionEl = document.getElementById("question");
const feedbackEl = document.getElementById("feedback");
const gameArea = document.getElementById("gameArea");
const timerBox = document.getElementById("timerBox");
const timerEl = document.getElementById("timer");
const warning = document.getElementById("warning");

if (typeof MGHGameUI !== "undefined") MGHGameUI.ensureRankedHUD(game);

// Memory mode state
let memoryCards = [];
let memoryPairs = [];
let flippedCards = [];
let matchedCount = 0;
let selectedInstruments = [];
let memoryRoundType = "family";
let nextMemoryRoundType = "sameFamily";

/* ==================== GAME MODE SELECTION ==================== */

function selectGameMode(mode, el) {
  selectedGameMode = mode;
  gameMode = "training";
  MGH.selectExclusive(".menuButton", el);
  warning.textContent = "";
}

function selectMode(el, mode) {
  if (mode === "ranked") {
    gameMode = "ranked";
    selectedGameMode = null;
    MGH.selectExclusive(".menuButton", el);
  }
}

/* ==================== START GAME ==================== */

async function startGame() {
  await instrumentCatalogReady;

  if (gameMode === "ranked") {
    showRankedIntro({
      gameName: "strumenti",
      title: "Modalità Classificata",
      text: "Una sfida mista di 10 domande con riconoscimento visivo, family/imboccatura e audio. Il punteggio premia velocità e precisione.",
      onStart: startRankedGame
    });
    return;
  }

  if (!selectedGameMode) {
    warning.textContent = "Seleziona una modalità di gioco";
    return;
  }

  warning.textContent = "";

  MGHGameUI.enterTraining({
    menu,
    game,
    modeLabel: getGameModeLabel(selectedGameMode),
    feedbackEl
  });
  showBackButton();
  newRound();
}

async function startRankedGame(nickname = "") {
  await instrumentCatalogReady;
  warning.textContent = "";

  if (typeof startRankedMode !== "function") {
    warning.textContent = "Errore: ranked.js non è stato caricato.";
    return;
  }

  const rankedSession = startRankedMode("strumenti");
  rankedSession.setUsername(nickname);

  MGHGameUI.enterRanked({
    menu,
    game,
    score: rankedSession.totalScore,
    current: rankedSession.currentQuestion,
    total: rankedSession.maxQuestions,
    feedbackEl
  });
  updateRankedUI();
  hideBackButton();
  if (typeof startRankedElapsedTimer === "function") {
    startRankedElapsedTimer(rankedSession.startTime);
  }

  newRound();
}

function getGameModeLabel(mode) {
  const labels = {
    recognize: "Riconosci lo Strumento",
    memory: "Memory Strumenti",
    listen: "Ascolta e Riconosci"
  };
  return labels[mode] || "";
}

/* ==================== GO BACK ==================== */

function goBack() {
  if (gameMode === "ranked") return;

  if (typeof stopRankedElapsedTimer === "function") {
    stopRankedElapsedTimer();
  }
  stopAudio();

  MGHGameUI.returnToMenu({ menu, game, feedbackEl });
  showBackButton();

  selectedGameMode = null;
  gameMode = "training";
  currentQuestion = null;
  questionStartTime = null;

  if (typeof resetRankedMode === "function") {
    resetRankedMode();
  }

  document.querySelectorAll(".selected").forEach(btn => {
    btn.classList.remove("selected");
  });

  gameArea.innerHTML = "";
}

/* ==================== NEW ROUND ==================== */

function newRound() {
  stopAudio();
  setFeedback("");

  const currentMode = gameMode === "ranked" ? getRankedGameMode() : selectedGameMode;

  if (gameMode === "ranked") {
    startRankedQuestionTimer();
    updateRankedUI();
  }

  questionStartTime = Date.now();

  if (currentMode === "recognize") {
    createRecognizeRound();
  } else if (currentMode === "memory") {
    createMemoryRound();
  } else if (currentMode === "listen") {
    createListenRound();
  }
}

/* ==================== RECOGNIZE MODE ==================== */

function createRecognizeRound() {
  const target = pickRandomNoRepeat(STRUMENTI, {
    namespace: "strumenti-recognize-target",
    key: instrument => instrument.id
  });
  currentQuestion = {
    type: "recognize",
    target: target,
    options: generateRecognizeOptions(target, 3)
  };

  questionEl.textContent = `Quale è il ${target.name}?`;

  gameArea.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "instrumentOptionGrid";

  currentQuestion.options.forEach(instrument => {
    const tile = document.createElement("div");
    tile.className = "instrumentOptionTile";
    tile.dataset.instrumentId = instrument.id;
    tile.onclick = () => handleRecognizeAnswer(instrument, tile);

    const img = document.createElement("img");
    img.src = instrument.image;
    img.alt = instrument.name;
    img.onerror = function() {
      this.style.display = "none";
    };

    tile.appendChild(img);
    grid.appendChild(tile);
  });

  gameArea.appendChild(grid);
}

function generateRecognizeOptions(target, count) {
  return generateCoherentInstrumentOptions(target, count, STRUMENTI, "strumenti-recognize-option");
}

function generateCoherentInstrumentOptions(target, count, pool = STRUMENTI, namespace = "strumenti-option") {
  const options = [target];
  const usedIds = new Set([target.id]);
  const poolById = new Map(pool.map(instrument => [instrument.id, instrument]));
  const addOption = instrument => {
    if (!instrument || usedIds.has(instrument.id) || options.length >= count) return;
    options.push(instrument);
    usedIds.add(instrument.id);
  };

  (RECOGNIZE_SIMILAR_OPTIONS[target.id] || [])
    .map(id => poolById.get(id))
    .forEach(addOption);

  addOptionFromPool(
    pool.filter(instrument => instrument.mouthpiece && instrument.mouthpiece === target.mouthpiece && !usedIds.has(instrument.id)),
    `${namespace}-mouthpiece`,
    addOption
  );

  addOptionFromPool(
    pool.filter(instrument => instrument.family === target.family && !usedIds.has(instrument.id)),
    `${namespace}-family`,
    addOption
  );

  const available = pool.filter(instrument => !usedIds.has(instrument.id));
  while (options.length < count && available.length > 0) {
    const picked = pickRandomNoRepeat(available, {
      namespace: `${namespace}-fallback`,
      key: instrument => instrument.id
    });
    addOption(picked);
    available.splice(available.findIndex(instrument => instrument.id === picked.id), 1);
  }

  return shuffleOptions(options);
}

function addOptionFromPool(candidates, namespace, addOption) {
  const available = [...candidates];
  while (available.length > 0) {
    const picked = pickRandomNoRepeat(available, {
      namespace,
      key: instrument => instrument.id
    });
    if (!picked) return;
    addOption(picked);
    available.splice(available.findIndex(instrument => instrument.id === picked.id), 1);
  }
}

function shuffleOptions(options) {
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}

function handleRecognizeAnswer(selected, selectedTile) {
  if (!currentQuestion || currentQuestion.type !== "recognize") return;

  const isCorrect = selected.id === currentQuestion.target.id;
  const tiles = document.querySelectorAll(".instrumentOptionTile");
  tiles.forEach(tile => {
    tile.style.pointerEvents = "none";
    tile.classList.remove("correct", "wrong");
    if (tile.dataset.instrumentId === currentQuestion.target.id) {
      tile.classList.add("correct");
    }
  });

  if (!isCorrect) {
    selectedTile?.classList.add("wrong");
  }
  showInstrumentAnswerFeedback(isCorrect, currentQuestion.target.name);

  if (gameMode === "ranked") {
    handleRankedAnswer(isCorrect);
  } else {
    setTimeout(newRound, 1200);
  }
}

/* ==================== MEMORY MODE ==================== */

function createMemoryRound() {
  memoryRoundType = nextMemoryRoundType;
  nextMemoryRoundType = memoryRoundType === "sameFamily" ? "family" : "sameFamily";
  currentQuestion = {
    type: "memory",
    memoryRoundType
  };
  selectedInstruments = [];
  memoryPairs = memoryRoundType === "sameFamily"
    ? createSameFamilyMemoryPairs()
    : createFamilyMemoryPairs();

  memoryPairs.sort(() => Math.random() - 0.5);

  memoryCards = memoryPairs.map(p => ({
    ...p,
    flipped: false,
    matched: false
  }));

  flippedCards = [];
  matchedCount = 0;

  questionEl.textContent = memoryRoundType === "sameFamily"
    ? "Abbina due strumenti della stessa famiglia!"
    : "Abbina gli strumenti alle loro famiglie!";

  renderMemoryGrid();
}

function createFamilyMemoryPairs() {
  selectedInstruments = pickMemoryInstrumentsByFamily();
  const pairs = [];
  selectedInstruments.forEach(instr => {
    pairs.push({
      id: instr.id + "_instr",
      type: "instrument",
      instrument: instr,
      matchKey: instr.family
    });
    pairs.push({
      id: instr.id + "_attr",
      type: "attribute",
      instrument: instr,
      attribute: instr.family,
      matchKey: instr.family
    });
  });
  return pairs;
}

function createSameFamilyMemoryPairs() {
  const pairs = [];
  const grouped = getInstrumentsGroupedByFamily();
  const families = [...grouped.keys()].sort(() => Math.random() - 0.5);

  families.forEach(family => {
    const instruments = grouped.get(family) || [];
    if (instruments.length < 2) return;
    const first = pickRandomNoRepeat(instruments, {
      namespace: `strumenti-memory-same-family-${family}-first`,
      key: instrument => instrument.id
    });
    if (!first) return;
    const second = pickRandomNoRepeat(
      instruments.filter(instrument => instrument.id !== first.id),
      {
        namespace: `strumenti-memory-same-family-${family}-second`,
        key: instrument => instrument.id
      }
    );
    if (!first || !second) return;
    selectedInstruments.push(first);
    pairs.push({
      id: first.id + "_same_a",
      type: "instrument",
      instrument: first,
      matchKey: family
    });
    pairs.push({
      id: second.id + "_same_b",
      type: "instrument",
      instrument: second,
      matchKey: family
    });
  });

  return pairs;
}

function pickMemoryInstrumentsByFamily() {
  const grouped = getInstrumentsGroupedByFamily();

  return [...grouped.entries()]
    .sort(() => Math.random() - 0.5)
    .map(([family, instruments]) => pickRandomNoRepeat(instruments, {
      namespace: `strumenti-memory-family-${family}`,
      key: instrument => instrument.id
    }))
    .filter(Boolean);
}

function getInstrumentsGroupedByFamily() {
  return STRUMENTI.reduce((groups, instrument) => {
    if (!instrument.family) return groups;
    if (!groups.has(instrument.family)) groups.set(instrument.family, []);
    groups.get(instrument.family).push(instrument);
    return groups;
  }, new Map());
}

function renderMemoryGrid() {
  gameArea.innerHTML = "";

  const grid = document.createElement("div");
  grid.className = "memoryCardGrid";

  memoryCards.forEach((card, idx) => {
    const cardEl = document.createElement("div");
    cardEl.className = "memoryCard" + (card.flipped ? " flipped" : "") + (card.matched ? " matched" : "");
    cardEl.onclick = () => flipMemoryCard(idx);

    const inner = document.createElement("div");
    inner.className = "memoryCardInner";

    if (card.flipped || card.matched) {
      if (card.type === "instrument") {
        const img = document.createElement("img");
        img.src = card.instrument.image;
        img.alt = card.instrument.name;
        img.className = "memoryInstrumentImage";
        inner.appendChild(img);
      } else {
        const img = document.createElement("img");
        img.src = getFamilyImagePath(card.attribute);
        img.alt = card.attribute;
        img.className = "memoryFamilyImage";
        inner.appendChild(img);
      }

      const label = document.createElement("div");
      label.className = "memoryCardLabel";
      label.textContent = card.type === "instrument" ? card.instrument.name : card.attribute;
      cardEl.appendChild(label);
    } else {
      inner.textContent = "?";
    }

    cardEl.appendChild(inner);
    grid.appendChild(cardEl);
  });

  gameArea.appendChild(grid);
}

function flipMemoryCard(idx) {
  if (flippedCards.length >= 2) return;
  if (memoryCards[idx].flipped || memoryCards[idx].matched) return;

  memoryCards[idx].flipped = true;
  flippedCards.push(idx);

  renderMemoryGrid();

  if (flippedCards.length === 2) {
    setTimeout(() => checkMemoryMatch(), 800);
  }
}

function checkMemoryMatch() {
  const [idx1, idx2] = flippedCards;
  const card1 = memoryCards[idx1];
  const card2 = memoryCards[idx2];

  const match = card1.matchKey && card1.matchKey === card2.matchKey;

  if (match) {
    card1.matched = true;
    card2.matched = true;
    matchedCount++;

    if (matchedCount === selectedInstruments.length) {
      setTimeout(() => handleMemoryGameComplete(), 600);
    }
  } else {
    card1.flipped = false;
    card2.flipped = false;
  }

  flippedCards = [];
  renderMemoryGrid();
}

function handleMemoryGameComplete() {
  showInstrumentAnswerFeedback(true, "", "Hai abbinato tutti gli strumenti.");

  if (gameMode === "ranked") {
    handleRankedAnswer(true);
  } else {
    setTimeout(newRound, 1500);
  }
}

/* ==================== LISTEN MODE ==================== */

function createListenRound() {
  listenAudioPlayed = false;
  const listenPool = getListenInstrumentPool();
  const target = pickRandomNoRepeat(listenPool, {
    namespace: "strumenti-listen-target",
    key: instrument => instrument.id
  });
  const hasAudio = Boolean(target?.audio);

  currentQuestion = {
    type: "listen",
    target: target,
    hasAudio: hasAudio,
    options: generateListenOptions(target, 3, listenPool)
  };

  questionEl.textContent = hasAudio ? "Quale strumento senti?" : `Ascoltare non disponibile. Quale è ${target.name}?`;

  gameArea.innerHTML = "";

  const container = document.createElement("div");
  container.className = "listenModeContainer";

  if (hasAudio) {
    const audioArea = document.createElement("div");
    audioArea.className = "audioPlaybackArea";

    const label = document.createElement("span");
    label.className = "audioPlayLabel";
    label.textContent = "Premi Play per ascoltare";

    const btn = document.createElement("button");
    btn.className = "audioButton";
    btn.textContent = "▶ Riproduci Audio";
    btn.onclick = () => playAudio(target.audio, btn);

    audioArea.appendChild(label);
    audioArea.appendChild(btn);
    container.appendChild(audioArea);
  } else {
    const notAvail = document.createElement("div");
    notAvail.className = "audioNotAvailable";
    notAvail.textContent = "Nessun audio disponibile in audio/strumenti.";
    container.appendChild(notAvail);
  }

  const buttonGroup = document.createElement("div");
  buttonGroup.className = "listenOptionButtons";

  currentQuestion.options.forEach(instrument => {
    const btn = document.createElement("button");
    btn.className = "listenOptionButton";
    btn.dataset.instrumentId = instrument.id;
    btn.disabled = hasAudio;
    btn.textContent = instrument.name;
    btn.onclick = () => handleListenAnswer(instrument, btn);
    buttonGroup.appendChild(btn);
  });

  container.appendChild(buttonGroup);
  gameArea.appendChild(container);
}

function getListenInstrumentPool() {
  return listenInstrumentPool.length ? listenInstrumentPool : STRUMENTI.filter(instrument => instrument.audio);
}

function generateListenOptions(target, count, pool = STRUMENTI) {
  return generateCoherentInstrumentOptions(target, count, pool, "strumenti-listen-option");
}

function playAudio(audioPath, buttonEl) {
  if (!audioPath || audioPath.trim() === "") return;

  stopAudio();

  currentAudioButton = buttonEl;
  currentAudio = new Audio(audioPath);
  currentAudio.onplay = () => {
    listenAudioPlayed = true;
    setAudioButtonPlaying(buttonEl, true);
    setListenAnswerButtonsEnabled(true);
  };
  currentAudio.onended = () => {
    setAudioButtonPlaying(buttonEl, false);
    currentAudio = null;
    currentAudioButton = null;
  };
  currentAudio.onerror = () => {
    setAudioButtonPlaying(buttonEl, false);
    currentAudio = null;
    currentAudioButton = null;
  };

  currentAudio.play().catch(() => {
    setAudioButtonPlaying(buttonEl, false);
    currentAudio = null;
    currentAudioButton = null;
  });
}

function stopAudio() {
  if (currentAudioButton) setAudioButtonPlaying(currentAudioButton, false);
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  currentAudioButton = null;
}

function setAudioButtonPlaying(buttonEl, isPlaying) {
  if (!buttonEl) return;
  buttonEl.classList.toggle("playing", isPlaying);
  buttonEl.setAttribute("aria-pressed", isPlaying ? "true" : "false");
  buttonEl.blur();
  buttonEl.innerHTML = isPlaying
    ? '<span class="audioPauseIcon" aria-hidden="true"><span></span><span></span></span><span>In ascolto...</span>'
    : '<span class="audioPlayIcon" aria-hidden="true">▶</span><span>Riproduci Audio</span>';
}

function setListenAnswerButtonsEnabled(enabled) {
  document.querySelectorAll(".listenOptionButton").forEach(button => {
    button.disabled = !enabled;
  });
}

function handleListenAnswer(selected, selectedButton) {
  if (!currentQuestion || currentQuestion.type !== "listen") return;
  if (currentQuestion.hasAudio && !listenAudioPlayed) return;

  stopAudio();

  const isCorrect = selected.id === currentQuestion.target.id;
  const buttons = document.querySelectorAll(".listenOptionButton");
  buttons.forEach(button => {
    button.blur();
    button.style.pointerEvents = "none";
    button.classList.remove("correct", "wrong");
    if (button.dataset.instrumentId === currentQuestion.target.id) {
      button.classList.add("correct");
    }
  });

  if (!isCorrect) {
    selectedButton?.classList.add("wrong");
  }
  showInstrumentAnswerFeedback(isCorrect, currentQuestion.target.name);

  if (gameMode === "ranked") {
    handleRankedAnswer(isCorrect);
  } else {
    setTimeout(newRound, 1200);
  }
}

/* ==================== RANKED MODE ==================== */

function getRankedGameMode() {
  // Mix di modalità nella classificata
  const modes = ["recognize", "memory", "listen"];
  const questionNum = currentRankedSession ? currentRankedSession.currentQuestion : 0;
  return modes[questionNum % 3];
}

function handleRankedAnswer(isCorrect) {
  const session = answerRankedQuestion(getInstrumentRankedAnswer(isCorrect));
  updateRankedUI();

  if (session && session.isComplete()) {
    setTimeout(showRankedResults, 1200);
  } else {
    setTimeout(newRound, 1200);
  }
}

function getInstrumentRankedAnswer(isCorrect) {
  const questionType = currentQuestion?.type || getRankedGameMode();
  return {
    isCorrect,
    difficultyOverride: "neutral",
    speedBonusThresholds: STRUMENTI_RANKED_SPEED_BONUS[questionType],
    applyDifficultyMultiplierToSpeed: false,
    details: {
      questionType,
      target: currentQuestion?.target?.name || "",
      speedProfile: questionType
    }
  };
}

function hideBackButton() {
  document.getElementById("backButton")?.classList.add("hidden");
}

function showBackButton() {
  document.getElementById("backButton")?.classList.remove("hidden");
}

function updateRankedUI() {
  if (!currentRankedSession) return;
  updateRankedProgressUI({
    score: currentRankedSession.totalScore,
    current: currentRankedSession.currentQuestion,
    total: currentRankedSession.maxQuestions
  });
}

async function showRankedResults() {
  if (typeof stopRankedElapsedTimer === "function") {
    stopRankedElapsedTimer();
  }
  stopAudio();

  const finalData = await finishRankedMode();

  if (!finalData || !finalData.session) {
    setFeedback("Errore nel salvataggio della classificata.");
    return;
  }

  const session = finalData.session;

  MGHGameUI.returnToMenu({ menu, game, feedbackEl });
  showBackButton();

  warning.textContent = "";
  await showRankedCompletionModal({
    gameName: "strumenti",
    session,
    saveResult: finalData.result,
    saved: finalData.saved
  });

  document.querySelectorAll(".selected").forEach(btn => {
    btn.classList.remove("selected");
  });

  gameMode = "training";
  selectedGameMode = null;
  currentQuestion = null;
}

/* ==================== FEEDBACK ==================== */

function showInstrumentAnswerFeedback(isCorrect, correctName = "", successMessage = "") {
  if (isCorrect) {
    setFeedback(MGH.getAnswerFeedback(true, successMessage), "correct");
    return;
  }
  const detail = correctName ? `La risposta corretta era ${correctName}.` : "";
  setFeedback(MGH.getAnswerFeedback(false, detail), "wrong");
}

function setFeedback(msg, state = "neutral") {
  MGH.setGameFeedback(feedbackEl, msg, state);
}
