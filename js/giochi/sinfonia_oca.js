const BOARD_SIZE = 31;
const FINAL_CELL = BOARD_SIZE - 1;
const CHALLENGE_TYPES = ["visual", "audio", "memory", "knowledge"];
const LANDING_EVENT_WEIGHTS = Object.freeze([
  { type: "visual", weight: 20 },
  { type: "audio", weight: 20 },
  { type: "memory", weight: 20 },
  { type: "knowledge", weight: 25 },
  { type: "stop", weight: 15 }
]);
const STOP_TURN_EVENT = {
  title: "Tromba in avaria",
  lead: "Pericolo di suonare!",
  message: "La tromba ha inghiottito una nota. L'orchestra si ferma per un turno.",
  turnMessage: "La tromba è ancora in riparazione: turno di pausa.",
  instrument: "Tromba fuori servizio",
  image: "../img/strumenti/tromba.webp"
};

const boardPath = [
  [1, 1],
  [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1], [9, 1],
  [9, 2],
  [9, 3], [8, 3], [7, 3], [6, 3], [5, 3], [4, 3], [3, 3], [2, 3],
  [2, 4], [2, 5],
  [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [9, 5], [10, 5],
  [11, 5], [11, 4], [11, 3]
];

const PLAYER_DEFAULTS = [
  { name: "Player 1", token: "🎻", color: "#e85d04", isComputer: false, position: 0, skip: 0 },
  { name: "Player 2", token: "🎺", color: "#00a6bd", isComputer: true, position: 0, skip: 0 },
  { name: "Player 3", token: "🥁", color: "#7c5cff", isComputer: true, position: 0, skip: 0 },
  { name: "Player 4", token: "🎵", color: "#2e9f68", isComputer: true, position: 0, skip: 0 }
];
const players = PLAYER_DEFAULTS.map((player) => ({ ...player }));

const tokenChoices = ["🎻", "🎺", "🥁", "🎵", "🎹", "🎷", "🪈", "🎸", "🪘", "🪕", "🎧", "⭐"];
const colorChoices = [
  { value: "#e85d04", label: "Arancio" },
  { value: "#00a6bd", label: "Turchese" },
  { value: "#7c5cff", label: "Viola" },
  { value: "#2e9f68", label: "Verde" },
  { value: "#d94f70", label: "Rosa" },
  { value: "#2468d8", label: "Blu" },
  { value: "#e0a31a", label: "Oro" }
];

let currentPlayerIndex = 0;
let selectedPlayerCount = 4;
let gameActive = false;
let pendingPlayerIndex = null;
let pendingPreviousPosition = null;
let pendingLandingCell = null;
let pendingStopTurn = false;
let computerTimer = null;
let computerAnswerTimer = null;
let memoryRevealTimer = null;
let challengeTimerInterval = null;
let challengeResolutionTimer = null;
let challengeResolved = false;
const usedChallengeKeysByCell = new Map();
let usedChallengeKeysByPlayer = players.map(() => new Set());

function startGooseGame() {
  clearComputerTimer();
  clearComputerAnswerTimer();
  clearMemoryRevealTimer();
  clearChallengeResolutionTimer();
  applyPlayerSetup();

  players.forEach((player) => {
    player.position = 0;
    player.skip = 0;
    player.skipEvent = null;
  });

  currentPlayerIndex = 0;
  gameActive = true;
  resetChallengeHistory();

  document.getElementById("menu")?.classList.add("hidden");
  document.getElementById("game")?.classList.remove("hidden");
  MGH.updateHeaderModeLabel("Partita libera");

  buildBoard();
  renderPlayers();
  updateTurn("Lancia il dado per iniziare.");
  const button = document.getElementById("rollDiceButton");
  if (button) button.disabled = players[currentPlayerIndex].isComputer;
  scheduleComputerTurn();
}

function returnToGooseMenu() {
  gameActive = false;
  clearComputerTimer();
  clearComputerAnswerTimer();
  clearMemoryRevealTimer();
  closeChallenge();
  document.getElementById("game")?.classList.add("hidden");
  document.getElementById("menu")?.classList.remove("hidden");
  MGH.updateHeaderModeLabel("");
}

function buildBoard() {
  const board = document.getElementById("gooseBoard");
  if (!board) return;

  board.replaceChildren();
  board.appendChild(createBoardRoute());
  board.appendChild(createFinishMarker());
  board.appendChild(createDiceControl());

  for (let index = 0; index < BOARD_SIZE; index += 1) {
    const cell = document.createElement("div");
    const [column, row] = boardPath[index];
    cell.className = [
      "boardCell",
      index === 0 ? "startCell" : "",
      index === FINAL_CELL ? "finishCell" : "",
      index > 0 ? `tileTone${((index - 1) % 3) + 1}` : ""
    ].filter(Boolean).join(" ");
    cell.dataset.cell = String(index);
    cell.style.setProperty("--cell-column", String(column));
    cell.style.setProperty("--cell-row", String(row));

    const number = document.createElement("span");
    number.className = "cellNumber";
    number.textContent = index === 0 ? "Inizio" : String(index);

    const tokens = document.createElement("div");
    tokens.className = "cellTokens";

    cell.append(number, tokens);
    board.appendChild(cell);
  }

  renderTokens();
}

function createDiceControl() {
  const button = document.createElement("button");
  button.id = "rollDiceButton";
  button.className = "boardDiceButton";
  button.type = "button";
  button.setAttribute("aria-label", "Lancia il dado");
  button.addEventListener("click", () => rollGooseDice());

  const die = document.createElement("span");
  die.id = "diceFace";
  die.className = "realDice";
  die.dataset.value = "5";
  die.setAttribute("aria-hidden", "true");

  for (let index = 1; index <= 9; index += 1) {
    const pip = document.createElement("i");
    pip.className = `diePip diePip${index}`;
    die.appendChild(pip);
  }

  const label = document.createElement("strong");
  label.textContent = "Lancia";
  button.append(die, label);
  return button;
}

function createFinishMarker() {
  const marker = document.createElement("div");
  marker.className = "boardFinishMarker";
  marker.setAttribute("aria-hidden", "true");
  marker.innerHTML = "<span>🏆</span><strong>Concerto finale</strong>";
  return marker;
}

function createBoardRoute() {
  const layers = document.createElement("div");
  layers.className = "boardRouteLayers";
  layers.setAttribute("aria-hidden", "true");

  ["routeGridUnderlay", "routeGridMain"].forEach((layerClass) => {
    const layer = document.createElement("div");
    layer.className = `boardRouteGrid ${layerClass}`;

    ["Top", "Right", "Middle", "Left", "Bottom", "Finish"].forEach((segmentName) => {
      const segment = document.createElement("span");
      segment.className = `routeSegment route${segmentName}`;
      layer.appendChild(segment);
    });

    layers.appendChild(layer);
  });

  return layers;
}

function renderTokens() {
  document.querySelectorAll(".cellTokens").forEach((box) => box.replaceChildren());

  players.forEach((player) => {
    const cell = document.querySelector(`.boardCell[data-cell="${player.position}"] .cellTokens`);
    if (!cell) return;

    const token = document.createElement("span");
    token.className = "boardToken";
    token.style.setProperty("--player-color", player.color);
    token.textContent = player.token;
    token.title = player.name;
    cell.appendChild(token);
  });
}

function renderPlayers() {
  const panel = document.getElementById("playersPanel");
  if (!panel) return;

  panel.replaceChildren();
  panel.style.setProperty("--player-count", String(players.length));

  players.forEach((player, index) => {
    const card = document.createElement("div");
    const isSkipping = player.skip > 0;
    card.className = `playerCard ${index === currentPlayerIndex ? "active" : ""} ${isSkipping ? "isSkipping" : ""}`;
    if (isSkipping) {
      card.setAttribute("aria-disabled", "true");
      card.title = player.skipEvent?.message || "Questo giocatore salterà il prossimo turno";
    }

    const token = document.createElement("span");
    token.className = "playerTokenPreview";
    token.style.setProperty("--player-color", player.color);
    token.textContent = player.token;

    const text = document.createElement("div");
    const label = document.createElement("span");
    label.textContent = player.isComputer ? "pc" : "umano";
    const name = document.createElement("strong");
    name.textContent = player.name;
    text.append(label, name);

    const position = document.createElement("em");
    position.textContent = `${player.position}/${FINAL_CELL}`;

    card.append(token, text, position);
    if (isSkipping) {
      const pause = document.createElement("span");
      pause.className = "playerSkipIndicator";
      pause.textContent = "Ⅱ";
      pause.setAttribute("aria-hidden", "true");
      card.appendChild(pause);
    }
    panel.appendChild(card);
  });
}

function rollGooseDice(isAutomatic = false) {
  if (!gameActive) return;

  const player = players[currentPlayerIndex];
  const button = document.getElementById("rollDiceButton");
  const diceFace = document.getElementById("diceFace");

  if (player.isComputer && !isAutomatic) return;

  const roll = randomInt(1, 6);
  if (diceFace) {
    diceFace.dataset.value = String(roll);
    diceFace.classList.remove("isRolling");
    window.requestAnimationFrame(() => diceFace.classList.add("isRolling"));
    window.setTimeout(() => diceFace.classList.remove("isRolling"), 520);
  }
  if (button) button.disabled = true;

  const previousPosition = player.position;
  movePlayer(player, roll);
  renderTokens();
  renderPlayers();
  handleLanding(player, previousPosition);
}

function movePlayer(player, steps) {
  const target = player.position + steps;
  player.position = target > FINAL_CELL ? FINAL_CELL - (target - FINAL_CELL) : target;
  updateTurn(`${player.name} avanza di ${steps}: casella ${player.position}.`);
}

function handleLanding(player, previousPosition) {
  pendingPlayerIndex = currentPlayerIndex;
  pendingPreviousPosition = previousPosition;
  pendingLandingCell = player.position;
  const landingEvent = pickWeightedLandingEvent(player.position < FINAL_CELL);
  pendingStopTurn = landingEvent === "stop";

  if (pendingStopTurn) {
    triggerStopTurnPenalty(player);
    return;
  }

  updateTurn(`${player.name} è sulla casella ${player.position}: supera la sfida.`);
  try {
    openChallenge(buildLandingChallenge(currentPlayerIndex, player.position, landingEvent));
  } catch (error) {
    recoverFromChallengeError(player, previousPosition, error);
  }
}

function pickWeightedLandingEvent(allowStopTurn = true) {
  const availableEvents = LANDING_EVENT_WEIGHTS.filter(({ type }) => allowStopTurn || type !== "stop");
  const totalWeight = availableEvents.reduce((total, { weight }) => total + weight, 0);
  let draw = Math.random() * totalWeight;

  for (const event of availableEvents) {
    if (draw < event.weight) return event.type;
    draw -= event.weight;
  }

  return availableEvents[availableEvents.length - 1].type;
}

function triggerStopTurnPenalty(player) {
  clearComputerAnswerTimer();
  clearMemoryRevealTimer();
  clearChallengeTimer(true);
  challengeResolved = true;

  player.skip = 1;
  player.skipEvent = getNextStopTurnEvent();
  renderTokens();
  renderPlayers();
  updateTurn(`${player.name} ha messo la tromba fuori servizio: salterà un turno.`);
  showStopTurnPenalty(player, player.skipEvent);
  startPassiveChallengeTimer(4);

  scheduleChallengeResolution(() => {
    closeChallenge();
    nextTurn();
  }, 4000);
}

function recoverFromChallengeError(player, previousPosition, error) {
  console.error("Impossibile aprire la sfida del tabellone:", error);
  clearChallengeTimer(true);
  player.position = previousPosition;
  pendingPlayerIndex = null;
  pendingPreviousPosition = null;
  pendingLandingCell = null;
  pendingStopTurn = false;
  renderTokens();
  renderPlayers();
  updateTurn("La sfida non si è caricata. Riprova a lanciare il dado.");

  const button = document.getElementById("rollDiceButton");
  if (button) button.disabled = player.isComputer;
  if (player.isComputer) scheduleComputerTurn();
}

function openChallenge(question) {
  const modal = document.getElementById("challengeModal");
  const badge = document.getElementById("challengeBadge");
  const title = document.getElementById("challengeTitle");
  const media = document.getElementById("challengeMedia");
  const text = document.getElementById("challengeQuestion");
  const options = document.getElementById("challengeOptions");
  const feedback = document.getElementById("challengeFeedback");

  if (!modal || !badge || !title || !media || !text || !options || !feedback) {
    throw new Error("Finestra della sfida non disponibile");
  }

  badge.textContent = question.badge;
  title.textContent = question.title;
  text.textContent = question.question;
  feedback.textContent = "";
  media.replaceChildren();
  options.replaceChildren();
  media.classList.remove("hasInstrumentMemory");
  options.classList.remove("isMemory", "hasImageOptions");
  modal.querySelector(".challengePanel")?.classList.remove("isStopTurn");

  if (question.image) {
    const image = document.createElement("img");
    image.src = question.image;
    image.alt = "Indizio visivo";
    media.appendChild(image);
  }

  if (question.audio) {
    const audio = document.createElement("audio");
    audio.controls = true;
    audio.preload = "none";
    audio.src = question.audio;
    media.appendChild(audio);
  }

  modal.classList.remove("hidden");
  startChallengeTimer(question);

  const player = players[pendingPlayerIndex ?? currentPlayerIndex];
  if (question.memoryCards) {
    renderInstrumentMemoryChallenge(question, media, text, options, feedback, player);
    return;
  }

  const optionItems = question.imageOptions || question.options.map(value => ({
    value,
    label: value
  }));
  if (question.imageOptions) options.classList.add("hasImageOptions");

  shuffle(optionItems).forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.answerValue = option.value;
    button.setAttribute("aria-label", option.label);

    if (option.image) {
      const image = document.createElement("img");
      image.src = option.image;
      image.alt = option.label;
      button.appendChild(image);
    } else {
      button.textContent = option.label;
    }

    button.addEventListener("click", () => {
      answerChallenge(option.value, question.answer, question.answerLabel);
    });
    options.appendChild(button);
  });

  scheduleComputerAnswer(player, question, 1100);
}

function renderInstrumentMemoryChallenge(question, media, text, options, feedback, player) {
  const cards = question.memoryCards.map(card => ({
    ...card,
    flipped: false,
    matched: false
  }));
  const flippedIndexes = [];
  let matchedPairs = 0;
  let locked = false;

  media.classList.add("hasInstrumentMemory");
  options.classList.add("isMemory");
  text.textContent = question.question;

  const render = () => {
    media.replaceChildren();
    const grid = document.createElement("div");
    grid.className = "instrumentMemoryGrid";

    cards.forEach((card, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = [
        "instrumentMemoryCard",
        card.flipped ? "flipped" : "",
        card.matched ? "matched" : ""
      ].filter(Boolean).join(" ");
      button.disabled = locked || card.matched || player.isComputer;
      button.setAttribute("aria-label", card.flipped || card.matched ? card.label : "Carta coperta");

      if (card.flipped || card.matched) {
        const image = document.createElement("img");
        image.src = card.image;
        image.alt = card.label;
        const label = document.createElement("span");
        label.textContent = card.label;
        button.append(image, label);
      } else {
        const back = document.createElement("strong");
        back.textContent = "?";
        button.appendChild(back);
      }

      button.addEventListener("click", () => flipCard(index));
      grid.appendChild(button);
    });

    media.appendChild(grid);
  };

  const finishMemory = () => {
    if (feedback) feedback.textContent = "Memory completato: tutte le coppie sono corrette.";
    window.setTimeout(() => answerChallenge(question.answer, question.answer), 450);
  };

  const evaluatePair = () => {
    const [firstIndex, secondIndex] = flippedIndexes;
    const first = cards[firstIndex];
    const second = cards[secondIndex];
    const isMatch = first.matchKey && first.matchKey === second.matchKey;

    clearMemoryRevealTimer();
    memoryRevealTimer = window.setTimeout(() => {
      if (isMatch) {
        first.matched = true;
        second.matched = true;
        matchedPairs += 1;
      } else {
        first.flipped = false;
        second.flipped = false;
      }

      flippedIndexes.length = 0;
      locked = false;
      render();
      if (matchedPairs === question.memoryPairCount) finishMemory();
    }, isMatch ? 380 : 720);
  };

  function flipCard(index) {
    const card = cards[index];
    if (challengeResolved || locked || card.flipped || card.matched || player.isComputer) return;

    card.flipped = true;
    flippedIndexes.push(index);
    if (flippedIndexes.length === 2) locked = true;
    render();
    if (locked) evaluatePair();
  }

  if (player.isComputer) {
    cards.forEach(card => {
      card.flipped = true;
    });
    render();
    clearComputerAnswerTimer();
    computerAnswerTimer = window.setTimeout(finishMemory, 1500);
    return;
  }

  render();
}

function answerChallenge(selected, answer, answerLabel = answer, resultOptions = {}) {
  if (challengeResolved) return;
  challengeResolved = true;
  clearComputerAnswerTimer();
  clearMemoryRevealTimer();
  clearChallengeTimer(true);
  const player = players[pendingPlayerIndex ?? currentPlayerIndex];
  const feedback = document.getElementById("challengeFeedback");
  const isCorrect = selected === answer;
  const previousPosition = pendingPreviousPosition ?? player.position;
  const landedOnFinal = pendingLandingCell === FINAL_CELL;

  document.querySelectorAll(".challengeOptions button").forEach((button) => {
    button.disabled = true;
    const value = button.dataset.answerValue || button.textContent;
    if (value === answer) button.style.borderColor = "#2e9f68";
    if (value === selected && !isCorrect) button.style.borderColor = "#d66a4a";
  });
  document.querySelectorAll(".instrumentMemoryCard").forEach((button) => {
    button.disabled = true;
  });

  if (isCorrect) {
    if (feedback) {
      feedback.textContent = "Risposta corretta: la pedina resta su questa casella.";
    }
  } else {
    player.position = previousPosition;
    const correctAnswerLabel = answerLabel || "completare la prova";
    if (feedback) {
      const timeoutDetail = answer === "memory-complete"
        ? "Dovevi completare tutte le coppie."
        : `La risposta corretta era ${correctAnswerLabel}.`;
      feedback.textContent = resultOptions.timedOut
        ? `Tempo scaduto! ${timeoutDetail} Torni alla casella ${previousPosition}.`
        : `La risposta corretta era ${correctAnswerLabel}. Torni alla casella ${previousPosition}.`;
    }
  }

  renderTokens();
  renderPlayers();

  scheduleChallengeResolution(() => {
    closeChallenge();
    if (isCorrect && landedOnFinal) {
      endGame(player);
      return;
    }
    nextTurn();
  }, 1500);
}

function getNextStopTurnEvent() {
  return STOP_TURN_EVENT;
}

function showStopTurnPenalty(player, event) {
  const modal = document.getElementById("challengeModal");
  const panel = modal?.querySelector(".challengePanel");
  const badge = document.getElementById("challengeBadge");
  const title = document.getElementById("challengeTitle");
  const media = document.getElementById("challengeMedia");
  const question = document.getElementById("challengeQuestion");
  const options = document.getElementById("challengeOptions");
  const feedback = document.getElementById("challengeFeedback");
  if (!modal || !panel || !badge || !title || !media || !question || !options || !feedback) return;

  clearChallengeTimer(true);
  modal.classList.remove("hidden");
  panel.classList.add("isStopTurn");
  media.classList.remove("hasInstrumentMemory");
  badge.textContent = "Pausa tecnica";
  title.textContent = event.title;
  const lead = document.createElement("strong");
  lead.className = "stopTurnLead";
  lead.textContent = event.lead;
  const copy = document.createElement("span");
  copy.className = "stopTurnCopy";
  copy.textContent = event.message;
  question.replaceChildren(lead, copy);
  options.replaceChildren();
  options.classList.remove("isMemory", "hasImageOptions");
  const pauseIcon = document.createElement("span");
  pauseIcon.className = "stopTurnPauseIcon";
  pauseIcon.textContent = "Ⅱ";
  pauseIcon.setAttribute("aria-hidden", "true");
  const feedbackText = document.createElement("span");
  feedbackText.textContent = `${player.name} salta il prossimo turno`;
  feedback.replaceChildren(pauseIcon, feedbackText);

  const scene = document.createElement("div");
  scene.className = "brokenInstrumentScene";
  const image = document.createElement("img");
  image.src = event.image;
  image.alt = event.instrument;
  const warning = document.createElement("span");
  warning.className = "instrumentWarning";
  warning.textContent = "!";
  warning.setAttribute("aria-hidden", "true");
  const notice = document.createElement("strong");
  notice.textContent = "FUORI SERVIZIO";
  scene.append(warning, image, notice);
  media.replaceChildren(scene);
}

function closeChallenge() {
  clearComputerAnswerTimer();
  clearMemoryRevealTimer();
  clearChallengeTimer(true);
  clearChallengeResolutionTimer();
  challengeResolved = true;
  const modal = document.getElementById("challengeModal");
  modal?.classList.add("hidden");
  modal?.querySelector(".challengePanel")?.classList.remove("isStopTurn");
  pendingPlayerIndex = null;
  pendingPreviousPosition = null;
  pendingLandingCell = null;
  pendingStopTurn = false;
}

function buildChallenge(type) {
  if (type === "visual") return buildVisualChallenge();
  if (type === "audio") return buildAudioChallenge();
  if (type === "knowledge") return buildKnowledgeChallenge();
  return buildMemoryChallenge();
}

function buildLandingChallenge(playerIndex, cell, requestedType) {
  const usedKeys = usedChallengeKeysByPlayer[playerIndex];
  const cellKeys = usedChallengeKeysByCell.get(cell) || new Set();
  const challengeType = CHALLENGE_TYPES.includes(requestedType)
    ? requestedType
    : pickWeightedLandingEvent(false);
  let challenge = null;

  for (let attempt = 0; attempt < 18; attempt += 1) {
    const candidate = buildChallenge(challengeType);
    challenge = candidate;
    if (!cellKeys.has(candidate.key) && !usedKeys.has(candidate.key)) break;
  }

  cellKeys.add(challenge.key);
  usedChallengeKeysByCell.set(cell, cellKeys);
  usedKeys.add(challenge.key);
  return challenge;
}

function buildVisualChallenge() {
  const shared = window.MGHInstrumentChallenges.createRecognize();
  return {
    badge: "Vista",
    title: "Riconosci lo strumento",
    ...shared
  };
}

function buildAudioChallenge() {
  const shared = window.MGHInstrumentChallenges.createListen();
  return {
    badge: "Audio",
    title: "Ascolta e riconosci",
    ...shared
  };
}

function buildMemoryChallenge() {
  const shared = window.MGHInstrumentChallenges.createMemory();

  return {
    badge: "Memory",
    title: "Memory degli strumenti",
    question: shared.question,
    answer: shared.answer,
    answerLabel: "completare tutte le coppie",
    options: [],
    memoryCards: shared.cards,
    memoryPairCount: shared.pairCount,
    key: shared.key
  };
}

function buildKnowledgeChallenge() {
  const shared = window.MGHInstrumentChallenges.createKnowledge();
  return {
    badge: "Quiz",
    title: "Domanda sugli strumenti",
    ...shared
  };
}

function startChallengeTimer(question) {
  clearChallengeTimer(false);
  challengeResolved = false;

  const duration = question.memoryCards ? 30 : 15;
  const deadline = Date.now() + duration * 1000;
  updateChallengeTimer(duration, duration);

  challengeTimerInterval = window.setInterval(() => {
    const millisecondsLeft = Math.max(0, deadline - Date.now());
    const secondsLeft = Math.ceil(millisecondsLeft / 1000);
    updateChallengeTimer(secondsLeft, duration);

    if (millisecondsLeft > 0) return;
    clearChallengeTimer(false);
    answerChallenge("__tempo_scaduto__", question.answer, question.answerLabel, { timedOut: true });
  }, 250);
}

function startPassiveChallengeTimer(duration) {
  clearChallengeTimer(false);
  const deadline = Date.now() + duration * 1000;
  updateChallengeTimer(duration, duration);

  challengeTimerInterval = window.setInterval(() => {
    const millisecondsLeft = Math.max(0, deadline - Date.now());
    updateChallengeTimer(Math.ceil(millisecondsLeft / 1000), duration);
    if (millisecondsLeft <= 0) clearChallengeTimer(false);
  }, 250);
}

function updateChallengeTimer(secondsLeft, duration) {
  const timer = document.getElementById("challengeTimer");
  const value = document.getElementById("challengeTimerValue");
  if (!timer || !value) return;

  timer.classList.remove("hidden");
  timer.classList.toggle("isUrgent", secondsLeft <= 5);
  timer.style.setProperty("--timer-progress", `${Math.max(0, secondsLeft / duration) * 360}deg`);
  timer.setAttribute("aria-label", `Tempo restante: ${secondsLeft} secondi`);
  value.textContent = String(secondsLeft);
}

function clearChallengeTimer(hide = false) {
  if (challengeTimerInterval) {
    window.clearInterval(challengeTimerInterval);
    challengeTimerInterval = null;
  }

  if (hide) document.getElementById("challengeTimer")?.classList.add("hidden");
}

function scheduleChallengeResolution(callback, delay) {
  clearChallengeResolutionTimer();
  challengeResolutionTimer = window.setTimeout(() => {
    challengeResolutionTimer = null;
    callback();
  }, delay);
}

function clearChallengeResolutionTimer() {
  if (!challengeResolutionTimer) return;
  window.clearTimeout(challengeResolutionTimer);
  challengeResolutionTimer = null;
}

function nextTurn() {
  clearComputerTimer();
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  beginCurrentTurn();
}

function beginCurrentTurn() {
  const player = players[currentPlayerIndex];
  const button = document.getElementById("rollDiceButton");
  renderPlayers();

  if (player.skip > 0) {
    const skipEvent = player.skipEvent;
    player.skip -= 1;
    if (button) button.disabled = true;
    updateTurn(skipEvent?.turnMessage || `${player.name} resta fermo per questo turno.`);
    player.skipEvent = null;
    computerTimer = window.setTimeout(nextTurn, 1200);
    return;
  }

  if (button) button.disabled = player.isComputer;
  updateTurn("Tocca a te: lancia il dado.");
  scheduleComputerTurn();
}

function endGame(player) {
  gameActive = false;
  clearComputerTimer();
  clearComputerAnswerTimer();
  const button = document.getElementById("rollDiceButton");
  if (button) button.disabled = true;
  renderPlayers();
  updateTurn(`${player.name} dirige il concerto finale e vince la partita!`);
}

function updateTurn(message) {
  const player = players[currentPlayerIndex];
  const name = document.getElementById("currentPlayerName");
  const text = document.getElementById("turnMessage");
  const button = document.getElementById("rollDiceButton");

  if (name) name.textContent = player.name;
  if (text) text.textContent = message;
  if (button) {
    const buttonLabel = button.querySelector("strong");
    if (buttonLabel) buttonLabel.textContent = player.isComputer ? "PC" : "Lancia";
  }
}

function applyPlayerSetup() {
  const configuredPlayers = [...document.querySelectorAll(".goosePlayerSetupCard")]
    .filter((card) => Number(card.dataset.playerIndex) < selectedPlayerCount)
    .map((card, index) => {
      const fallback = PLAYER_DEFAULTS[index];

      const nameInput = card.querySelector(".gooseNameInput");
      const tokenInput = card.querySelector(".gooseTokenInput");
      const typeSelect = card.querySelector(".gooseTypeSelect");

      return {
        name: sanitizePlayerName(nameInput?.value, fallback.name),
        token: sanitizeToken(tokenInput?.value, fallback.token),
        color: sanitizePlayerColor(card.dataset.playerColor, fallback.color),
        isComputer: typeSelect?.value === "computer",
        position: 0,
        skip: 0,
        skipEvent: null
      };
    });

  players.splice(0, players.length, ...configuredPlayers);
}

function setGoosePlayerCount(count) {
  selectedPlayerCount = Math.min(4, Math.max(2, Number(count) || 4));

  document.querySelectorAll(".goosePlayerSetupCard").forEach((card) => {
    const isExcluded = Number(card.dataset.playerIndex) >= selectedPlayerCount;
    card.classList.toggle("isExcluded", isExcluded);
    card.setAttribute("aria-hidden", String(isExcluded));
    card.querySelectorAll("input, select, button").forEach((control) => {
      control.disabled = isExcluded;
    });
  });

  document.querySelectorAll(".goosePlayerCountButton").forEach((button) => {
    const isSelected = Number(button.dataset.playerCount) === selectedPlayerCount;
    button.classList.toggle("selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });

  const summary = document.getElementById("playerCountSummary");
  if (summary) summary.textContent = `Partita per ${selectedPlayerCount}`;
}

function initializeGooseColorPickers() {
  document.querySelectorAll(".goosePlayerSetupCard").forEach((card, index) => {
    if (card.querySelector(".gooseColorPicker")) return;

    const player = PLAYER_DEFAULTS[index];
    if (!player) return;

    const picker = document.createElement("div");
    picker.className = "gooseColorPicker";
    picker.setAttribute("role", "radiogroup");
    picker.setAttribute("aria-label", `Colore della pedina di ${player.name}`);

    colorChoices.forEach((choice) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "gooseColorSwatch";
      button.dataset.color = choice.value;
      button.style.setProperty("--swatch-color", choice.value);
      button.title = choice.label;
      button.setAttribute("role", "radio");
      button.setAttribute("aria-label", choice.label);
      button.addEventListener("click", () => selectGooseColor(card, button));
      picker.appendChild(button);
    });

    const nameLabel = card.querySelector(".setupNameLabel");
    card.insertBefore(picker, nameLabel);
    const initialButton = picker.querySelector(`[data-color="${player.color}"]`) || picker.firstElementChild;
    selectGooseColor(card, initialButton);
  });
}

function selectGooseColor(card, selectedButton) {
  if (!card || !selectedButton) return;

  card.querySelectorAll(".gooseColorSwatch").forEach((button) => {
    const isSelected = button === selectedButton;
    button.classList.toggle("selected", isSelected);
    button.setAttribute("aria-checked", String(isSelected));
  });

  const color = selectedButton.dataset.color;
  card.dataset.playerColor = color;
  card.querySelector(".gooseTokenPreview")?.style.setProperty("--player-color", color);
}

function cycleGooseToken(button, direction) {
  const card = button.closest(".goosePlayerSetupCard");
  const input = card?.querySelector(".gooseTokenInput");
  const preview = card?.querySelector(".gooseTokenPreview");
  if (!input || !preview) return;

  const currentIndex = tokenChoices.indexOf(input.value);
  const startIndex = currentIndex >= 0 ? currentIndex : 0;
  const nextIndex = (startIndex + direction + tokenChoices.length) % tokenChoices.length;
  const nextToken = tokenChoices[nextIndex];

  input.value = nextToken;
  preview.textContent = nextToken;
}

function scheduleComputerTurn() {
  const player = players[currentPlayerIndex];
  if (!gameActive || !player?.isComputer) return;

  const button = document.getElementById("rollDiceButton");
  if (button) button.disabled = true;
  updateTurn(`${player.name} sta pensando...`);
  computerTimer = window.setTimeout(() => rollGooseDice(true), 900);
}

function clearComputerTimer() {
  if (!computerTimer) return;
  window.clearTimeout(computerTimer);
  computerTimer = null;
}

function clearComputerAnswerTimer() {
  if (!computerAnswerTimer) return;
  window.clearTimeout(computerAnswerTimer);
  computerAnswerTimer = null;
}

function clearMemoryRevealTimer() {
  if (!memoryRevealTimer) return;
  window.clearTimeout(memoryRevealTimer);
  memoryRevealTimer = null;
}

function scheduleComputerAnswer(player, question, delay) {
  if (!player?.isComputer) return;
  const computerAnswer = chooseComputerAnswer(question);
  clearComputerAnswerTimer();
  computerAnswerTimer = window.setTimeout(() => {
    answerChallenge(computerAnswer, question.answer, question.answerLabel);
  }, delay);
}

function resetChallengeHistory() {
  usedChallengeKeysByCell.clear();
  usedChallengeKeysByPlayer = players.map(() => new Set());
}

function chooseComputerAnswer(question) {
  const shouldKnow = Math.random() < 0.68;
  if (shouldKnow) return question.answer;
  const wrongOptions = question.options.filter((option) => option !== question.answer);
  return pick(wrongOptions.length ? wrongOptions : question.options);
}

function sanitizePlayerName(value, fallback) {
  const clean = String(value || "").trim().replace(/\s+/g, " ").slice(0, 18);
  return clean || fallback;
}

function sanitizeToken(value, fallback) {
  const clean = String(value || "").trim().slice(0, 2);
  return clean || fallback;
}

function sanitizePlayerColor(value, fallback) {
  return /^#[0-9a-f]{6}$/i.test(String(value || "")) ? value : fallback;
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

initializeGooseColorPickers();
setGoosePlayerCount(4);

window.startGooseGame = startGooseGame;
window.returnToGooseMenu = returnToGooseMenu;
window.rollGooseDice = rollGooseDice;
window.cycleGooseToken = cycleGooseToken;
window.setGoosePlayerCount = setGoosePlayerCount;
