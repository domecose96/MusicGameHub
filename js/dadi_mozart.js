const MOZART_ROLL_TABLE = {
  2: [96, 22, 141, 41, 105, 122, 11, 30, 70, 121, 26, 9, 112, 49, 109, 14],
  3: [32, 6, 128, 63, 146, 46, 134, 81, 117, 39, 126, 56, 174, 18, 116, 83],
  4: [69, 95, 158, 13, 153, 55, 110, 24, 66, 139, 15, 132, 73, 58, 145, 79],
  5: [40, 17, 113, 85, 161, 2, 159, 100, 90, 176, 7, 34, 67, 160, 52, 170],
  6: [148, 74, 163, 45, 80, 97, 36, 107, 25, 143, 64, 125, 76, 136, 1, 93],
  7: [104, 157, 27, 167, 154, 68, 118, 91, 138, 71, 150, 29, 101, 162, 23, 151],
  8: [152, 60, 171, 53, 99, 133, 21, 127, 16, 155, 57, 175, 43, 168, 89, 172],
  9: [119, 84, 114, 50, 140, 86, 169, 94, 120, 88, 48, 166, 51, 115, 72, 111],
  10: [98, 142, 42, 156, 75, 129, 62, 123, 65, 77, 19, 82, 137, 38, 149, 8],
  11: [3, 87, 165, 61, 135, 47, 147, 33, 102, 4, 31, 164, 144, 59, 173, 78],
  12: [54, 130, 10, 103, 28, 37, 106, 5, 35, 20, 108, 92, 12, 124, 44, 131]
};

const MOZART_MEASURE_COUNT = 16;
const MOZART_SCORE_SCALE = 32;
const MOZART_SOURCE_URL = "data/mozart/mozart-kanhc30-01.krn";

const selections = Array(MOZART_MEASURE_COUNT).fill(null);
let currentMeasureIndex = 0;
let humdrumSource = "";
let filteredHumdrum = "";
let verovioToolkit = null;
let verovioReady = false;
let scoreRenderTimer = null;
let lastScoreWidth = 0;
let midiPerformance = null;
let audioContext = null;
let audioMaster = null;
let scheduledNodes = [];
let playbackFrame = 0;
let playbackEndTimer = 0;
let playbackStartedAt = 0;

const elements = {};

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  buildDiceFaces();
  buildBoard();
  buildMeasureRibbon();
  bindEvents();
  updateInterface();
  initializeNotation();
});

function cacheElements() {
  elements.board = document.getElementById("mozartBoard");
  elements.boardViewport = document.getElementById("boardViewport");
  elements.ribbon = document.getElementById("measureRibbon");
  elements.rollButton = document.getElementById("rollButton");
  elements.randomButton = document.getElementById("randomButton");
  elements.clearButton = document.getElementById("clearButton");
  elements.dieOne = document.getElementById("dieOne");
  elements.dieTwo = document.getElementById("dieTwo");
  elements.diceTotal = document.getElementById("diceTotal");
  elements.currentMeasureLabel = document.getElementById("currentMeasureLabel");
  elements.scoreState = document.getElementById("scoreState");
  elements.scoreCanvas = document.getElementById("scoreCanvas");
  elements.playButton = document.getElementById("playButton");
  elements.playButtonIcon = document.getElementById("playButtonIcon");
  elements.replayButton = document.getElementById("replayButton");
  elements.audioProgress = document.getElementById("audioProgress");
  elements.audioProgressFill = document.getElementById("audioProgressFill");
}

function buildDiceFaces() {
  [elements.dieOne, elements.dieTwo].forEach((die) => {
    die.innerHTML = Array.from({ length: 9 }, (_, index) => (
      `<span class="diePip pip${index + 1}" aria-hidden="true"></span>`
    )).join("");
  });
}

function buildBoard() {
  const header = Array.from({ length: MOZART_MEASURE_COUNT }, (_, index) => (
    `<th class="measureHeader" data-measure-header="${index}" scope="col">M${index + 1}</th>`
  )).join("");

  const rows = Object.entries(MOZART_ROLL_TABLE).map(([roll, measures]) => {
    const cells = measures.map((measureNumber, index) => (
      `<td><button class="mozartCellButton" type="button" data-roll="${roll}" data-measure-index="${index}" ` +
      `aria-label="Battuta ${index + 1}, lancio ${roll}, tessera ${measureNumber}">${measureNumber}</button></td>`
    )).join("");

    return `<tr><th class="rollLabel" scope="row">${roll}</th>${cells}</tr>`;
  }).join("");

  elements.board.innerHTML = `
    <thead><tr><th class="rollHeader" scope="col">Somma</th>${header}</tr></thead>
    <tbody>${rows}</tbody>
  `;
}

function buildMeasureRibbon() {
  elements.ribbon.innerHTML = Array.from({ length: MOZART_MEASURE_COUNT }, (_, index) => (
    `<div class="measureSlot" data-measure-slot="${index}"><span>M${index + 1}</span><strong>—</strong></div>`
  )).join("");
}

function bindEvents() {
  elements.board.addEventListener("click", handleBoardClick);
  elements.rollButton.addEventListener("click", rollNextMeasure);
  elements.randomButton.addEventListener("click", composeAll);
  elements.clearButton.addEventListener("click", clearComposition);
  elements.playButton.addEventListener("click", togglePlayback);
  elements.replayButton.addEventListener("click", replayComposition);

  const resizeObserver = new ResizeObserver((entries) => {
    const width = Math.round(entries[0]?.contentRect.width || 0);
    if (!filteredHumdrum || Math.abs(width - lastScoreWidth) < 36) return;
    window.clearTimeout(scoreRenderTimer);
    scoreRenderTimer = window.setTimeout(() => renderNotation(false), 180);
  });
  resizeObserver.observe(elements.scoreCanvas);
}

function handleBoardClick(event) {
  const button = event.target.closest(".mozartCellButton");
  if (!button) return;

  const measureIndex = Number(button.dataset.measureIndex);
  const roll = Number(button.dataset.roll);
  const isSameSelection = selections[measureIndex] === roll;

  selections[measureIndex] = isSameSelection ? null : roll;
  currentMeasureIndex = isSameSelection ? measureIndex : findNextUnfilled(measureIndex + 1);
  setDice(rollToDicePair(roll));
  stopPlayback();
  updateInterface();
  queueScoreRender();
}

function rollNextMeasure() {
  const firstUnfilled = selections.findIndex((selection) => selection === null);
  const targetIndex = firstUnfilled >= 0 ? firstUnfilled : currentMeasureIndex;
  const dice = [randomDie(), randomDie()];
  const roll = dice[0] + dice[1];

  selections[targetIndex] = roll;
  currentMeasureIndex = findNextUnfilled(targetIndex + 1);
  setDice(dice);
  animateDice();
  stopPlayback();
  updateInterface();
  queueScoreRender();
  scrollSelectedCellIntoView(targetIndex, roll);
}

function composeAll() {
  for (let index = 0; index < MOZART_MEASURE_COUNT; index += 1) {
    selections[index] = randomDie() + randomDie();
  }

  currentMeasureIndex = 0;
  stopPlayback();
  updateInterface();
  queueScoreRender();
}

function clearComposition() {
  selections.fill(null);
  currentMeasureIndex = 0;
  filteredHumdrum = "";
  midiPerformance = null;
  stopPlayback();
  updateInterface();
  showScorePlaceholder("Lo spartito apparirà qui", false);
}

function updateInterface() {
  document.querySelectorAll(".mozartCellButton").forEach((button) => {
    const measureIndex = Number(button.dataset.measureIndex);
    const roll = Number(button.dataset.roll);
    const selected = selections[measureIndex] === roll;
    button.classList.toggle("selectedTile", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  document.querySelectorAll("[data-measure-header]").forEach((header) => {
    header.classList.toggle("currentColumn", Number(header.dataset.measureHeader) === currentMeasureIndex);
  });

  document.querySelectorAll("[data-measure-slot]").forEach((slot) => {
    const index = Number(slot.dataset.measureSlot);
    const roll = selections[index];
    const measureNumber = roll === null ? null : MOZART_ROLL_TABLE[roll][index];
    slot.classList.toggle("filled", measureNumber !== null);
    slot.classList.toggle("current", index === currentMeasureIndex);
    slot.querySelector("strong").textContent = measureNumber ?? "—";
  });

  elements.currentMeasureLabel.textContent = `Battuta M${currentMeasureIndex + 1}`;
}

function queueScoreRender() {
  window.clearTimeout(scoreRenderTimer);
  scoreRenderTimer = window.setTimeout(() => renderSelectedScore(), 90);
}

async function initializeNotation() {
  showScorePlaceholder("Preparo la partitura", true);

  try {
    const [source] = await Promise.all([
      fetch(MOZART_SOURCE_URL).then((response) => {
        if (!response.ok) throw new Error(`Partitura non disponibile (${response.status})`);
        return response.text();
      }),
      waitForVerovio()
    ]);

    humdrumSource = source;
    verovioToolkit = new window.verovio.toolkit();
    verovioReady = true;
    elements.scoreState.textContent = "Pronto";

    if (selections.some((selection) => selection !== null)) {
      renderSelectedScore();
    } else {
      showScorePlaceholder("Lo spartito apparirà qui", false);
    }
  } catch (error) {
    console.error(error);
    elements.scoreState.textContent = "Non disponibile";
    showScorePlaceholder("Impossibile caricare la partitura", false);
  }
}

function waitForVerovio() {
  return new Promise((resolve, reject) => {
    const api = window.verovio;
    if (!api?.module || typeof api.toolkit !== "function") {
      reject(new Error("Verovio non è stato caricato"));
      return;
    }

    if (api.module.calledRun) {
      resolve();
      return;
    }

    const previousHandler = api.module.onRuntimeInitialized;
    let settled = false;

    api.module.onRuntimeInitialized = (...args) => {
      previousHandler?.(...args);
      if (!settled) {
        settled = true;
        resolve();
      }
    };

    window.setTimeout(() => {
      if (settled) return;
      if (api.module.calledRun) {
        settled = true;
        resolve();
      } else {
        settled = true;
        reject(new Error("Tempo di inizializzazione Verovio scaduto"));
      }
    }, 15000);
  });
}

function renderSelectedScore() {
  const chosenMeasures = getChosenMeasures();
  if (chosenMeasures.length === 0) {
    filteredHumdrum = "";
    midiPerformance = null;
    showScorePlaceholder("Lo spartito apparirà qui", false);
    return;
  }

  if (!verovioReady || !verovioToolkit) {
    showScorePlaceholder("Preparo la partitura", true);
    return;
  }

  elements.scoreState.textContent = "Incisione in corso";
  showScorePlaceholder("Aggiorno lo spartito", true);

  try {
    const filter = buildMyankFilter(chosenMeasures);
    const sourceWithFilter = `${humdrumSource}\n!!!filter: myank -m "${filter}"\n`;
    filteredHumdrum = verovioToolkit.convertHumdrumToHumdrum(sourceWithFilter);
    renderNotation(true);
    elements.scoreState.textContent = `${chosenMeasures.length} battute`;
  } catch (error) {
    console.error(error);
    filteredHumdrum = "";
    midiPerformance = null;
    elements.scoreState.textContent = "Errore";
    showScorePlaceholder("Non riesco a generare lo spartito", false);
  }
}

function renderNotation(refreshMidi) {
  if (!filteredHumdrum || !verovioToolkit) return;

  const availableWidth = Math.max(280, Math.round(elements.scoreCanvas.clientWidth || 900));
  const pageWidth = Math.max(900, Math.round((availableWidth * 100) / MOZART_SCORE_SCALE));
  lastScoreWidth = availableWidth;

  const firstPage = verovioToolkit.renderData(filteredHumdrum, {
    inputFrom: "humdrum",
    pageWidth,
    pageHeight: 9000,
    scale: MOZART_SCORE_SCALE,
    adjustPageHeight: true,
    breaks: "auto",
    header: "none",
    footer: "none",
    pageMarginTop: 90,
    pageMarginBottom: 90,
    pageMarginLeft: 70,
    pageMarginRight: 70,
    spacingSystem: 10,
    justifyVertically: false
  });

  const pages = [firstPage];
  const pageCount = verovioToolkit.getPageCount();
  for (let page = 2; page <= pageCount; page += 1) {
    pages.push(verovioToolkit.renderToSVG(page, {}));
  }

  elements.scoreCanvas.innerHTML = pages.join("");
  elements.scoreCanvas.querySelectorAll("svg").forEach((svg) => {
    svg.classList.add("mozartScorePage");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Spartito della composizione selezionata");
  });

  if (refreshMidi) {
    const midiBase64 = verovioToolkit.renderToMIDI();
    const parsedPerformance = parseMidiPerformance(midiBase64);
    const isCompleteMinuet = selections.every((selection) => selection !== null);
    midiPerformance = isCompleteMinuet ? expandMinuetRepeats(parsedPerformance) : parsedPerformance;
    const hasAudio = Boolean(midiPerformance?.notes.length);
    elements.playButton.disabled = !hasAudio;
    elements.replayButton.disabled = !hasAudio;
  }
}

function getChosenMeasures() {
  return selections.flatMap((roll, index) => (
    roll === null ? [] : [{ index, roll, measureNumber: MOZART_ROLL_TABLE[roll][index] }]
  ));
}

function buildMyankFilter(chosenMeasures) {
  return chosenMeasures.map((choice) => choice.measureNumber).join(",");
}

function showScorePlaceholder(message, loading) {
  elements.scoreCanvas.innerHTML = `
    <div class="scorePlaceholder${loading ? " isLoading" : ""}">
      <span class="scorePlaceholderMark" aria-hidden="true">𝄞</span>
      <strong>${message}</strong>
    </div>
  `;
  elements.playButton.disabled = true;
  elements.replayButton.disabled = true;
  if (selections.every((selection) => selection === null)) elements.scoreState.textContent = "In attesa";
}

function setDice([dieOne, dieTwo]) {
  elements.dieOne.dataset.value = String(dieOne);
  elements.dieTwo.dataset.value = String(dieTwo);
  elements.dieOne.setAttribute("aria-label", `Dado uno: ${dieOne}`);
  elements.dieTwo.setAttribute("aria-label", `Dado due: ${dieTwo}`);
  elements.diceTotal.textContent = String(dieOne + dieTwo);
}

function animateDice() {
  [elements.dieOne, elements.dieTwo].forEach((die, index) => {
    die.animate([
      { transform: "translateY(0) rotate(0deg)" },
      { transform: `translateY(-8px) rotate(${index ? -8 : 8}deg)` },
      { transform: "translateY(0) rotate(0deg)" }
    ], { duration: 320, easing: "ease-out" });
  });
}

function rollToDicePair(total) {
  const pairs = [];
  for (let first = 1; first <= 6; first += 1) {
    const second = total - first;
    if (second >= 1 && second <= 6) pairs.push([first, second]);
  }
  return pairs[Math.floor(Math.random() * pairs.length)];
}

function randomDie() {
  return Math.floor(Math.random() * 6) + 1;
}

function findNextUnfilled(startIndex) {
  for (let offset = 0; offset < MOZART_MEASURE_COUNT; offset += 1) {
    const index = (startIndex + offset) % MOZART_MEASURE_COUNT;
    if (selections[index] === null) return index;
  }
  return startIndex % MOZART_MEASURE_COUNT;
}

function scrollSelectedCellIntoView(measureIndex, roll) {
  const button = elements.board.querySelector(
    `[data-measure-index="${measureIndex}"][data-roll="${roll}"]`
  );
  button?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
}

function togglePlayback() {
  if (elements.playButton.classList.contains("playing")) {
    stopPlayback();
    return;
  }
  startPlayback();
}

function replayComposition() {
  stopPlayback();
  startPlayback();
}

async function startPlayback() {
  if (!midiPerformance?.notes.length) return;
  stopPlayback();

  const context = getAudioContext();
  if (!context) return;
  await context.resume();

  const startAt = context.currentTime + 0.08;
  midiPerformance.notes.forEach((note) => schedulePianoNote(note, startAt));

  playbackStartedAt = performance.now() + 80;
  elements.playButton.classList.add("playing");
  elements.playButtonIcon.textContent = "■";
  elements.playButton.setAttribute("aria-label", "Interrompi l'ascolto");
  elements.playButton.title = "Interrompi";
  updatePlaybackProgress();

  playbackEndTimer = window.setTimeout(() => {
    stopPlayback();
  }, midiPerformance.durationMs + 450);
}

function stopPlayback() {
  window.clearTimeout(playbackEndTimer);
  window.cancelAnimationFrame(playbackFrame);
  playbackEndTimer = 0;
  playbackFrame = 0;

  scheduledNodes.forEach((node) => {
    try {
      node.stop();
    } catch (_) {
      // The oscillator may already have finished.
    }
  });
  scheduledNodes = [];

  if (elements.playButton) {
    elements.playButton.classList.remove("playing");
    elements.playButtonIcon.textContent = "▶";
    elements.playButton.setAttribute("aria-label", "Ascolta la composizione");
    elements.playButton.title = "Ascolta";
  }
  setPlaybackProgress(0);
}

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!audioContext) {
    audioContext = new AudioContextClass();
    audioMaster = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    const compressor = audioContext.createDynamicsCompressor();

    audioMaster.gain.value = 0.52;
    filter.type = "lowpass";
    filter.frequency.value = 5200;
    compressor.threshold.value = -18;
    compressor.ratio.value = 4;

    audioMaster.connect(filter);
    filter.connect(compressor);
    compressor.connect(audioContext.destination);
  }

  return audioContext;
}

function schedulePianoNote(note, playbackStart) {
  const start = playbackStart + note.startMs / 1000;
  const duration = Math.max(0.08, note.durationMs / 1000);
  const releaseEnd = start + duration + 0.22;
  const frequency = 440 * (2 ** ((note.pitch - 69) / 12));
  const gain = audioContext.createGain();
  const fundamental = audioContext.createOscillator();
  const harmonic = audioContext.createOscillator();
  const harmonicGain = audioContext.createGain();
  const peak = Math.max(0.018, (note.velocity / 127) * 0.085);

  fundamental.type = "sine";
  fundamental.frequency.setValueAtTime(frequency, start);
  harmonic.type = "triangle";
  harmonic.frequency.setValueAtTime(frequency * 2, start);
  harmonicGain.gain.value = 0.16;

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.004, peak * 0.38), start + Math.min(duration * 0.7, 0.28));
  gain.gain.exponentialRampToValueAtTime(0.0001, releaseEnd);

  fundamental.connect(gain);
  harmonic.connect(harmonicGain);
  harmonicGain.connect(gain);
  gain.connect(audioMaster);

  fundamental.start(start);
  harmonic.start(start);
  fundamental.stop(releaseEnd + 0.03);
  harmonic.stop(releaseEnd + 0.03);
  scheduledNodes.push(fundamental, harmonic);
}

function updatePlaybackProgress() {
  if (!midiPerformance?.durationMs || !elements.playButton.classList.contains("playing")) return;
  const elapsed = Math.max(0, performance.now() - playbackStartedAt);
  const progress = Math.min(100, (elapsed / midiPerformance.durationMs) * 100);
  setPlaybackProgress(progress);
  if (progress < 100) playbackFrame = window.requestAnimationFrame(updatePlaybackProgress);
}

function setPlaybackProgress(value) {
  const rounded = Math.round(value);
  elements.audioProgressFill.style.width = `${value}%`;
  elements.audioProgress.setAttribute("aria-valuenow", String(rounded));
}

function parseMidiPerformance(base64Midi) {
  const bytes = decodeBase64(base64Midi);
  if (readAscii(bytes, 0, 4) !== "MThd") throw new Error("Formato MIDI non valido");

  const headerLength = readUint32(bytes, 4);
  const trackCount = readUint16(bytes, 10);
  const division = readUint16(bytes, 12);
  if (division & 0x8000) throw new Error("Il formato MIDI SMPTE non è supportato");

  const tempoEvents = [{ tick: 0, microseconds: 500000 }];
  const noteMessages = [];
  let offset = 8 + headerLength;
  let sequence = 0;
  let finalTick = 0;

  for (let track = 0; track < trackCount && offset + 8 <= bytes.length; track += 1) {
    if (readAscii(bytes, offset, 4) !== "MTrk") break;
    const trackLength = readUint32(bytes, offset + 4);
    const end = Math.min(bytes.length, offset + 8 + trackLength);
    let position = offset + 8;
    let absoluteTick = 0;
    let runningStatus = 0;

    while (position < end) {
      const delta = readVariableLength(bytes, position);
      absoluteTick += delta.value;
      position = delta.next;

      let status = bytes[position];
      if (status < 0x80) {
        status = runningStatus;
      } else {
        position += 1;
        if (status < 0xf0) runningStatus = status;
      }

      if (status === 0xff) {
        const metaType = bytes[position++];
        const length = readVariableLength(bytes, position);
        position = length.next;
        if (metaType === 0x51 && length.value === 3) {
          const microseconds = (bytes[position] << 16) | (bytes[position + 1] << 8) | bytes[position + 2];
          tempoEvents.push({ tick: absoluteTick, microseconds });
        }
        position += length.value;
        if (metaType === 0x2f) break;
        continue;
      }

      if (status === 0xf0 || status === 0xf7) {
        const length = readVariableLength(bytes, position);
        position = length.next + length.value;
        runningStatus = 0;
        continue;
      }

      if (!status) break;
      const command = status & 0xf0;
      const channel = status & 0x0f;
      const dataLength = command === 0xc0 || command === 0xd0 ? 1 : 2;
      const dataOne = bytes[position++];
      const dataTwo = dataLength === 2 ? bytes[position++] : 0;

      if (command === 0x90 && dataTwo > 0) {
        noteMessages.push({ type: "on", tick: absoluteTick, pitch: dataOne, velocity: dataTwo, channel, sequence: sequence++ });
      } else if (command === 0x80 || (command === 0x90 && dataTwo === 0)) {
        noteMessages.push({ type: "off", tick: absoluteTick, pitch: dataOne, velocity: dataTwo, channel, sequence: sequence++ });
      }
    }

    finalTick = Math.max(finalTick, absoluteTick);

    offset = end;
  }

  const tempoMap = buildTempoMap(tempoEvents, division);
  const activeNotes = new Map();
  const notes = [];

  noteMessages.sort((first, second) => first.tick - second.tick || first.sequence - second.sequence);
  noteMessages.forEach((message) => {
    const key = `${message.channel}:${message.pitch}`;
    if (message.type === "on") {
      const queue = activeNotes.get(key) || [];
      queue.push(message);
      activeNotes.set(key, queue);
      return;
    }

    const queue = activeNotes.get(key);
    const started = queue?.shift();
    if (!started) return;
    const startMs = ticksToMilliseconds(started.tick, tempoMap, division);
    const endMs = ticksToMilliseconds(message.tick, tempoMap, division);
    notes.push({
      pitch: started.pitch,
      velocity: started.velocity,
      startMs,
      durationMs: Math.max(50, endMs - startMs)
    });
  });

  notes.sort((first, second) => first.startMs - second.startMs || first.pitch - second.pitch);
  const noteDurationMs = notes.reduce((maximum, note) => Math.max(maximum, note.startMs + note.durationMs), 0);
  const timelineDurationMs = ticksToMilliseconds(finalTick, tempoMap, division);
  return { notes, durationMs: Math.max(noteDurationMs, timelineDurationMs), timelineDurationMs };
}

function expandMinuetRepeats(performance) {
  if (!performance?.notes.length || !performance.durationMs) return performance;

  const sourceDurationMs = performance.timelineDurationMs || performance.durationMs;
  const sectionDurationMs = sourceDurationMs / 2;
  const notes = performance.notes.flatMap((note) => {
    const offsets = note.startMs < sectionDurationMs
      ? [0, sectionDurationMs]
      : [sectionDurationMs, sourceDurationMs];

    return offsets.map((offset) => ({ ...note, startMs: note.startMs + offset }));
  });

  notes.sort((first, second) => first.startMs - second.startMs || first.pitch - second.pitch);
  const durationMs = Math.max(
    sourceDurationMs * 2,
    notes.reduce((maximum, note) => Math.max(maximum, note.startMs + note.durationMs), 0)
  );

  return { notes, durationMs, timelineDurationMs: sourceDurationMs * 2 };
}

function buildTempoMap(events, division) {
  const sorted = [...events].sort((first, second) => first.tick - second.tick);
  const map = [{ tick: 0, microseconds: 500000, milliseconds: 0 }];

  sorted.forEach((event) => {
    const previous = map[map.length - 1];
    if (event.tick === previous.tick) {
      previous.microseconds = event.microseconds;
      return;
    }
    const elapsed = ((event.tick - previous.tick) * previous.microseconds) / division / 1000;
    map.push({ tick: event.tick, microseconds: event.microseconds, milliseconds: previous.milliseconds + elapsed });
  });

  return map;
}

function ticksToMilliseconds(tick, tempoMap, division) {
  let segment = tempoMap[0];
  for (let index = 1; index < tempoMap.length; index += 1) {
    if (tempoMap[index].tick > tick) break;
    segment = tempoMap[index];
  }
  return segment.milliseconds + ((tick - segment.tick) * segment.microseconds) / division / 1000;
}

function decodeBase64(value) {
  const binary = window.atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function readAscii(bytes, offset, length) {
  return String.fromCharCode(...bytes.slice(offset, offset + length));
}

function readUint16(bytes, offset) {
  return (bytes[offset] << 8) | bytes[offset + 1];
}

function readUint32(bytes, offset) {
  return ((bytes[offset] << 24) >>> 0) + (bytes[offset + 1] << 16) + (bytes[offset + 2] << 8) + bytes[offset + 3];
}

function readVariableLength(bytes, offset) {
  let value = 0;
  let position = offset;
  let byte = 0;
  do {
    byte = bytes[position++];
    value = (value << 7) | (byte & 0x7f);
  } while (byte & 0x80);
  return { value, next: position };
}

window.addEventListener("beforeunload", stopPlayback);
