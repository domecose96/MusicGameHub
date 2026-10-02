(() => {
  "use strict";

  const STORAGE_KEY = "mgh_musigramma_project_v6";
  const GUIDE_STORAGE_KEY = "mgh_musigramma_guide_seen_v1";
  const MAX_HISTORY = 40;
  const MAX_ITEMS = 120;
  const MAX_ROWS = 10;
  const COLORS = ["#24a843", "#258fcf", "#087f8c", "#e1333b", "#ee8a32", "#7866a9"];
  const SHAPES = {
    dot: { label: "Punto", beats: 1, tone: 523, width: 40 },
    zigzag: { label: "Zig zag", beats: 2, tone: 659, width: 88 },
    wave: { label: "Onda", beats: 2, tone: 587, width: 88 },
    arc: { label: "Arco", beats: 2, tone: 440, width: 76 },
    line: { label: "Linea", beats: 4, tone: 392, width: 104 },
    slash: { label: "Diagonale", beats: 1, tone: 784, width: 68 }
  };

  const elements = {};
  let idCounter = 0;
  let activeShape = "dot";
  let activeColor = COLORS[0];
  let project = createSampleProject();
  let selectedId = project.items[0]?.id || null;
  let activeRow = 0;
  let history = [];
  let draggedId = null;
  let audioObjectUrl = "";
  let loadedAudioBuffer = null;
  let loadedAudioFileName = "";
  let isAnalyzingAudio = false;
  let audioAnalysisVersion = 0;
  let audioContext = null;
  let animationFrame = 0;
  let isPlaying = false;
  let elapsedMs = 0;
  let playbackStartedAt = 0;
  let currentItemIndex = -1;
  let toastTimer = 0;

  function createId() {
    idCounter += 1;
    return `musi-${Date.now().toString(36)}-${idCounter}`;
  }

  function clampNumber(value, min, max) {
    return Math.min(max, Math.max(min, Number(value) || min));
  }

  function createItem(shapeName, overrides = {}) {
    const shape = SHAPES[shapeName] || SHAPES.dot;
    return {
      id: createId(),
      shape: SHAPES[shapeName] ? shapeName : "dot",
      color: activeColor || COLORS[0],
      row: 0,
      order: 0,
      repeat: 1,
      beats: shape.beats,
      tone: shape.tone,
      ...overrides
    };
  }

  function createSampleProject() {
    const green = COLORS[0];
    const blue = COLORS[1];
    return {
      version: 3,
      title: "Il mio musigramma",
      composer: "",
      tempo: 96,
      rows: 6,
      items: [
        createItem("dot", { row: 0, order: 0, color: green }),
        createItem("zigzag", { row: 0, order: 1, color: green }),
        createItem("wave", { row: 0, order: 2, color: green }),
        createItem("slash", { row: 0, order: 3, color: green }),
        createItem("zigzag", { row: 0, order: 4, color: green }),
        createItem("wave", { row: 0, order: 5, color: green }),
        createItem("arc", { row: 1, order: 0, color: green, repeat: 2 }),
        createItem("dot", { row: 1, order: 1, color: green, repeat: 4 }),
        createItem("line", { row: 1, order: 2, color: green }),
        createItem("dot", { row: 2, order: 0, color: blue, repeat: 2 }),
        createItem("zigzag", { row: 2, order: 1, color: blue }),
        createItem("dot", { row: 2, order: 2, color: blue, repeat: 2 }),
        createItem("line", { row: 2, order: 3, color: blue }),
        createItem("dot", { row: 3, order: 0, color: blue, repeat: 2 }),
        createItem("line", { row: 3, order: 1, color: blue }),
        createItem("dot", { row: 3, order: 2, color: blue, repeat: 2 }),
        createItem("wave", { row: 3, order: 3, color: blue }),
        createItem("line", { row: 3, order: 4, color: blue }),
        createItem("arc", { row: 4, order: 0, color: COLORS[3], repeat: 14 }),
        createItem("arc", { row: 5, order: 0, color: COLORS[4], repeat: 2 })
      ]
    };
  }

  function createEmptyProject() {
    return { version: 3, title: "Il mio musigramma", composer: "", tempo: 96, rows: 1, items: [] };
  }

  function createTemplateProject(templateId) {
    const item = (shape, row, order, color, overrides = {}) => createItem(shape, {
      row, order, color, ...overrides
    });
    const green = COLORS[0];
    const blue = COLORS[1];
    const teal = COLORS[2];
    const red = COLORS[3];
    const orange = COLORS[4];

    if (templateId === "aba") {
      return {
        version: 3,
        title: "Forma ABA",
        composer: "",
        tempo: 96,
        rows: 3,
        items: [
          item("dot", 0, 0, green, { repeat: 2 }), item("zigzag", 0, 1, green),
          item("wave", 0, 2, green), item("line", 0, 3, green),
          item("dot", 1, 0, blue, { repeat: 2 }), item("slash", 1, 1, blue),
          item("arc", 1, 2, blue), item("slash", 1, 3, blue), item("line", 1, 4, blue),
          item("dot", 2, 0, green, { repeat: 2 }), item("zigzag", 2, 1, green),
          item("wave", 2, 2, green), item("line", 2, 3, green)
        ]
      };
    }

    if (templateId === "refrain") {
      const refrain = row => [
        item("dot", row, 0, orange, { repeat: 2 }), item("zigzag", row, 1, orange),
        item("wave", row, 2, orange), item("line", row, 3, orange)
      ];
      return {
        version: 3,
        title: "Ritornello e strofe",
        composer: "",
        tempo: 104,
        rows: 5,
        items: [
          ...refrain(0),
          item("dot", 1, 0, blue), item("slash", 1, 1, blue, { repeat: 2 }), item("arc", 1, 2, blue), item("line", 1, 3, blue),
          ...refrain(2),
          item("wave", 3, 0, teal), item("dot", 3, 1, teal, { repeat: 3 }), item("zigzag", 3, 2, teal), item("line", 3, 3, teal),
          ...refrain(4)
        ]
      };
    }

    if (templateId === "crescendo") {
      return {
        version: 3,
        title: "Dal piano al forte",
        composer: "",
        tempo: 80,
        rows: 4,
        items: [
          item("dot", 0, 0, green, { repeat: 2 }), item("line", 0, 1, green),
          item("dot", 1, 0, teal, { repeat: 3 }), item("zigzag", 1, 1, teal), item("line", 1, 2, teal),
          item("dot", 2, 0, orange, { repeat: 4 }), item("zigzag", 2, 1, orange, { repeat: 2 }), item("line", 2, 2, orange),
          item("slash", 3, 0, red, { repeat: 2 }), item("zigzag", 3, 1, red, { repeat: 3 }), item("line", 3, 2, red, { beats: 6 })
        ]
      };
    }

    if (templateId === "pulse") {
      return {
        version: 3,
        title: "Pulsazione e accenti",
        composer: "",
        tempo: 112,
        rows: 4,
        items: [
          item("slash", 0, 0, red), item("dot", 0, 1, blue, { repeat: 3 }),
          item("slash", 1, 0, red), item("dot", 1, 1, blue, { repeat: 3 }),
          item("slash", 2, 0, red), item("dot", 2, 1, blue, { repeat: 3 }),
          item("slash", 3, 0, red), item("dot", 3, 1, blue, { repeat: 3 }), item("line", 3, 2, teal)
        ]
      };
    }

    return null;
  }

  function cloneProject(value = project) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeProject(candidate) {
    if (!candidate || typeof candidate !== "object") return null;
    if (Array.isArray(candidate.items)) {
      const items = candidate.items
        .filter(item => item && typeof item === "object")
        .slice(0, MAX_ITEMS)
        .map((item, index) => {
          const shapeName = SHAPES[item.shape] ? item.shape : "dot";
          const shape = SHAPES[shapeName];
          return {
            id: typeof item.id === "string" ? item.id : createId(),
            shape: shapeName,
            color: COLORS.includes(item.color) ? item.color : COLORS[0],
            row: Math.floor(clampNumber(item.row, 0, MAX_ROWS - 1)),
            order: Math.floor(clampNumber(item.order ?? index, 0, MAX_ITEMS)),
            repeat: Math.floor(clampNumber(item.repeat, 1, 32)),
            beats: clampNumber(item.beats ?? shape.beats, 1, 8),
            tone: Number.isFinite(Number(item.tone)) ? Number(item.tone) : shape.tone
          };
        });
      const highestRow = items.reduce((max, item) => Math.max(max, item.row), 0);
      return normalizeOrders({
        version: 3,
        title: typeof candidate.title === "string" ? candidate.title.slice(0, 60) : "Il mio musigramma",
        composer: typeof candidate.composer === "string" ? candidate.composer.slice(0, 50) : "",
        tempo: clampNumber(candidate.tempo, 30, 240),
        rows: Math.floor(clampNumber(candidate.rows ?? highestRow + 1, highestRow + 1, MAX_ROWS)),
        items
      });
    }

    if (Array.isArray(candidate.events)) return migrateLegacyProject(candidate);
    return null;
  }

  function migrateLegacyProject(candidate) {
    const templateToShape = {
      pulse: "dot",
      note: "zigzag",
      long: "line",
      accent: "slash",
      silence: "arc",
      rise: "wave"
    };
    const laneOrder = { form: 0, instruments: 1, dynamics: 2, rhythm: 3 };
    const events = candidate.events
      .filter(event => event && typeof event === "object")
      .slice(0, MAX_ITEMS)
      .sort((a, b) => (Number(a.startBeat) || 0) - (Number(b.startBeat) || 0)
        || (laneOrder[a.lane] ?? 0) - (laneOrder[b.lane] ?? 0));
    const items = events.map((event, index) => {
      const shapeName = templateToShape[event.template] || "dot";
      const shape = SHAPES[shapeName];
      return createItem(shapeName, {
        color: COLORS.includes(event.color) ? event.color : COLORS[index % COLORS.length],
        row: Math.min(MAX_ROWS - 1, Math.floor(index / 6)),
        order: index % 6,
        repeat: 1,
        beats: clampNumber(event.beats ?? shape.beats, 1, 8),
        tone: Number.isFinite(Number(event.tone)) ? Number(event.tone) : shape.tone
      });
    });
    return normalizeProject({
      version: 3,
      title: candidate.title,
      composer: "",
      tempo: candidate.tempo,
      rows: Math.max(1, Math.ceil(items.length / 6)),
      items
    });
  }

  function normalizeOrders(value = project) {
    for (let row = 0; row < value.rows; row += 1) {
      value.items
        .filter(item => item.row === row)
        .sort((a, b) => a.order - b.order)
        .forEach((item, index) => { item.order = index; });
    }
    return value;
  }

  function loadProject() {
    try {
      const current = localStorage.getItem(STORAGE_KEY);
      const normalized = current ? normalizeProject(JSON.parse(current)) : null;
      if (normalized) project = normalized;
    } catch (_) {
      project = createSampleProject();
    }
    selectedId = project.items[0]?.id || null;
    activeRow = project.items[0]?.row || 0;
    saveProject();
  }

  function saveProject() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    } catch (_) {
      // Il foglio resta utilizzabile anche quando il salvataggio locale non è disponibile.
    }
  }

  function cacheElements() {
    [
      "projectTitleInput", "projectComposerInput", "tempoInput", "audioFileInput", "audioFileName",
      "fitAudioButton", "generateAudioButton", "undoButton", "newProjectButton", "templatesButton", "guideButton", "previewTitle", "projectSummary",
      "sheetTitle", "sheetComposer", "musigrammaRows", "emptySheet", "paletteColors",
      "addSignButton", "addRowButton", "presentationButton", "restartButton", "playButton",
      "playButtonIcon", "musigrammaProgressFill", "itemInspector", "itemColors",
      "itemRepeatOutput", "itemBeatsOutput", "decreaseRepeatButton", "increaseRepeatButton",
      "decreaseBeatsButton", "increaseBeatsButton", "moveLeftButton", "moveRightButton",
      "moveUpButton", "moveDownButton", "duplicateButton", "deleteButton", "printButton",
      "downloadButton", "projectAudio", "presentationOverlay", "presentationTitle",
      "presentationSheetTitle", "presentationComposer", "presentationRows",
      "presentationRestartButton", "presentationPlayButton", "presentationPlayIcon",
      "presentationCloseButton", "templatesDialog", "templatesCloseButton", "guideDialog",
      "guideCloseButton", "guideTemplatesButton", "guideStartButton"
    ].forEach(id => { elements[id] = document.getElementById(id); });
    elements.progressBar = document.querySelector(".musigrammaProgress");
  }

  function pushHistory() {
    history.push(cloneProject());
    if (history.length > MAX_HISTORY) history.shift();
    elements.undoButton.disabled = history.length === 0;
  }

  function mutateProject(mutator, options = {}) {
    stopPlayback(true);
    pushHistory();
    mutator();
    normalizeOrders();
    saveProject();
    render(options);
  }

  function getSelectedItem() {
    return project.items.find(item => item.id === selectedId) || null;
  }

  function getOrderedItems() {
    return [...project.items].sort((a, b) => a.row - b.row || a.order - b.order);
  }

  function getTotalBeats() {
    return project.items.reduce((total, item) => total + item.beats * item.repeat, 0);
  }

  function getTotalDurationMs() {
    return getTotalBeats() * (60000 / project.tempo);
  }

  function formatTime(milliseconds) {
    const seconds = Math.max(0, Math.round(milliseconds / 1000));
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  }

  function render(options = {}) {
    renderProjectMeta();
    renderPalette();
    renderRows(elements.musigrammaRows, true, options.scrollSelected);
    renderInspector();
    if (!elements.presentationOverlay.hidden) renderPresentation();
    updateTransportState();
  }

  function renderProjectMeta() {
    const title = project.title.trim() || "Musigramma senza titolo";
    const signLabel = project.items.length === 1 ? "segno" : "segni";
    const rowLabel = project.rows === 1 ? "riga" : "righe";
    elements.projectTitleInput.value = project.title;
    elements.projectComposerInput.value = project.composer;
    elements.tempoInput.value = Number(project.tempo.toFixed(2));
    elements.previewTitle.textContent = title;
    elements.projectSummary.textContent = `${project.items.length} ${signLabel} · ${project.rows} ${rowLabel} · ${formatTime(getTotalDurationMs())}`;
    elements.sheetTitle.textContent = title;
    elements.sheetComposer.textContent = project.composer;
    elements.sheetComposer.hidden = !project.composer.trim();
    elements.presentationTitle.textContent = title;
  }

  function renderPalette() {
    document.querySelectorAll(".musigrammaPaletteButton").forEach(button => {
      const active = button.dataset.shape === activeShape;
      button.classList.toggle("isActive", active);
      button.setAttribute("aria-pressed", String(active));
    });
    renderSwatches(elements.paletteColors, activeColor, color => {
      activeColor = color;
      renderPalette();
    });
  }

  function renderSwatches(container, selectedColor, onSelect) {
    container.replaceChildren();
    COLORS.forEach((color, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "musigrammaSwatch";
      button.style.setProperty("--swatch-color", color);
      button.classList.toggle("isActive", color === selectedColor);
      button.setAttribute("aria-label", `Colore ${index + 1}`);
      button.setAttribute("aria-pressed", String(color === selectedColor));
      button.addEventListener("click", () => onSelect(color));
      container.appendChild(button);
    });
  }

  function renderRows(container, interactive, scrollSelected = false) {
    container.replaceChildren();
    for (let rowIndex = 0; rowIndex < project.rows; rowIndex += 1) {
      const row = document.createElement("div");
      row.className = "musigrammaSheetRow";
      row.dataset.row = String(rowIndex);
      row.classList.toggle("isActiveRow", interactive && rowIndex === activeRow);
      if (interactive) {
        row.setAttribute("role", "group");
        row.setAttribute("aria-label", `Riga ${rowIndex + 1}`);
      }

      const items = project.items
        .filter(item => item.row === rowIndex)
        .sort((a, b) => a.order - b.order);
      items.forEach(item => row.appendChild(createItemNode(item, interactive)));

      if (!items.length && interactive) {
        const placeholder = document.createElement("span");
        placeholder.className = "musigrammaRowPlaceholder";
        placeholder.textContent = rowIndex === activeRow ? "Clicca per aggiungere il segno scelto" : `Riga ${rowIndex + 1}`;
        row.appendChild(placeholder);
      }
      container.appendChild(row);
    }
    elements.emptySheet.hidden = project.items.length > 0;

    if (scrollSelected && selectedId) {
      requestAnimationFrame(() => {
        container.querySelector(`[data-item-id="${selectedId}"]`)
          ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      });
    }
  }

  function createItemNode(item, interactive) {
    const node = document.createElement(interactive ? "button" : "div");
    if (interactive) node.type = "button";
    node.className = "musigrammaVisualItem";
    node.dataset.itemId = item.id;
    node.style.setProperty("--item-color", item.color);
    node.style.setProperty("--item-width", `${getItemWidth(item)}px`);
    node.classList.toggle("isSelected", interactive && item.id === selectedId);
    const shape = SHAPES[item.shape];
    const repeatText = item.repeat > 1 ? `, ripetuto ${item.repeat} volte` : "";
    node.title = `${shape.label}${repeatText}`;
    if (interactive) {
      node.draggable = true;
      node.setAttribute("aria-label", node.title);
      node.setAttribute("aria-pressed", String(item.id === selectedId));
    }

    const run = document.createElement("span");
    run.className = "musigrammaSymbolRun";
    run.appendChild(createGlyph(item.shape));
    node.appendChild(run);

    if (item.repeat > 1) {
      const badge = document.createElement("b");
      badge.className = "musigrammaRepeatBadge";
      badge.textContent = `×${item.repeat}`;
      node.appendChild(badge);
    }
    return node;
  }

  function getItemWidth(item) {
    const base = SHAPES[item.shape].width;
    return base + (item.repeat > 1 ? 38 : 10);
  }

  function createGlyph(shapeName) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 100 60");
    svg.setAttribute("aria-hidden", "true");
    svg.classList.add("musigrammaGlyph");
    svg.style.setProperty("--glyph-width", `${SHAPES[shapeName].width}px`);
    const namespace = "http://www.w3.org/2000/svg";

    if (shapeName === "dot") {
      const circle = document.createElementNS(namespace, "circle");
      circle.setAttribute("cx", "50");
      circle.setAttribute("cy", "30");
      circle.setAttribute("r", "12");
      circle.setAttribute("fill", "currentColor");
      svg.appendChild(circle);
      return svg;
    }

    const path = document.createElementNS(namespace, "path");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "4");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    const pathData = {
      zigzag: "M8 45 L35 14 L63 45 L92 14",
      wave: "M7 39 C23 14 45 15 55 34 C66 55 42 57 37 42 C32 25 56 10 76 18 C92 24 94 41 84 50",
      arc: "M9 13 C9 67 91 67 91 13",
      line: "M8 30 L92 30",
      slash: "M17 45 L83 15"
    };
    path.setAttribute("d", pathData[shapeName]);
    svg.appendChild(path);

    if (shapeName === "slash") {
      [
        [17, 45],
        [83, 15]
      ].forEach(([cx, cy]) => {
        const circle = document.createElementNS(namespace, "circle");
        circle.setAttribute("cx", String(cx));
        circle.setAttribute("cy", String(cy));
        circle.setAttribute("r", "7");
        circle.setAttribute("fill", "currentColor");
        svg.appendChild(circle);
      });
    }
    return svg;
  }

  function renderInspector() {
    const item = getSelectedItem();
    const controls = elements.itemInspector.querySelectorAll("button");
    elements.itemInspector.classList.toggle("isDisabled", !item);
    controls.forEach(control => { control.disabled = !item; });
    if (!item) {
      elements.itemColors.replaceChildren();
      elements.itemRepeatOutput.value = "-";
      elements.itemBeatsOutput.value = "-";
      return;
    }

    const rowItems = project.items.filter(candidate => candidate.row === item.row).sort((a, b) => a.order - b.order);
    const rowPosition = rowItems.findIndex(candidate => candidate.id === item.id);
    elements.moveLeftButton.disabled = rowPosition <= 0;
    elements.moveRightButton.disabled = rowPosition >= rowItems.length - 1;
    elements.moveUpButton.disabled = item.row <= 0;
    elements.moveDownButton.disabled = item.row >= project.rows - 1;
    elements.decreaseRepeatButton.disabled = item.repeat <= 1;
    elements.increaseRepeatButton.disabled = item.repeat >= 32;
    elements.decreaseBeatsButton.disabled = item.beats <= 1;
    elements.increaseBeatsButton.disabled = item.beats >= 8;
    elements.itemRepeatOutput.value = String(item.repeat);
    elements.itemBeatsOutput.value = item.beats === 1 ? "1 battito" : `${item.beats} battiti`;
    renderSwatches(elements.itemColors, item.color, setSelectedColor);
  }

  function updateTransportState() {
    const canPlay = project.items.length > 0 || Boolean(audioObjectUrl);
    const hasItems = project.items.length > 0;
    const hasReadableAudio = audioObjectUrl && Number.isFinite(elements.projectAudio.duration);
    elements.playButton.disabled = !canPlay;
    elements.restartButton.disabled = !canPlay;
    elements.presentationButton.disabled = !hasItems;
    elements.downloadButton.disabled = !hasItems;
    elements.printButton.disabled = !hasItems;
    elements.fitAudioButton.disabled = !hasItems || !hasReadableAudio;
    elements.generateAudioButton.disabled = !loadedAudioBuffer || isAnalyzingAudio;
    elements.playButtonIcon.textContent = isPlaying ? "Ⅱ" : "▶";
    elements.presentationPlayIcon.textContent = isPlaying ? "Ⅱ" : "▶";
    elements.playButton.setAttribute("aria-label", isPlaying ? "Metti in pausa" : "Avvia anteprima");
    elements.presentationPlayButton.setAttribute("aria-label", isPlaying ? "Metti in pausa" : "Avvia");
    elements.playButton.title = isPlaying ? "Pausa" : "Avvia";
    elements.presentationPlayButton.title = isPlaying ? "Pausa" : "Avvia";
  }

  function selectShape(shapeName) {
    if (!SHAPES[shapeName]) return;
    activeShape = shapeName;
    renderPalette();
  }

  function addSign(rowIndex = activeRow) {
    if (project.items.length >= MAX_ITEMS) {
      showToast("Hai raggiunto il numero massimo di segni");
      return;
    }
    const row = Math.floor(clampNumber(rowIndex, 0, project.rows - 1));
    const order = project.items.filter(item => item.row === row).length;
    const item = createItem(activeShape, { row, order, color: activeColor });
    mutateProject(() => {
      project.items.push(item);
      selectedId = item.id;
      activeRow = row;
    }, { scrollSelected: true });
  }

  function addRow() {
    if (project.rows >= MAX_ROWS) {
      showToast("Il foglio può contenere al massimo dieci righe");
      return;
    }
    mutateProject(() => {
      project.rows += 1;
      activeRow = project.rows - 1;
    });
    showToast(`Riga ${project.rows} aggiunta`);
  }

  function setSelectedColor(color) {
    const item = getSelectedItem();
    if (!item || item.color === color) return;
    mutateProject(() => { item.color = color; });
  }

  function adjustRepeat(delta) {
    const item = getSelectedItem();
    if (!item) return;
    const next = Math.floor(clampNumber(item.repeat + delta, 1, 32));
    if (next === item.repeat) return;
    mutateProject(() => { item.repeat = next; }, { scrollSelected: true });
  }

  function adjustBeats(delta) {
    const item = getSelectedItem();
    if (!item) return;
    const next = Math.floor(clampNumber(item.beats + delta, 1, 8));
    if (next === item.beats) return;
    mutateProject(() => { item.beats = next; }, { scrollSelected: true });
  }

  function moveHorizontal(direction) {
    const item = getSelectedItem();
    if (!item) return;
    const rowItems = project.items.filter(candidate => candidate.row === item.row).sort((a, b) => a.order - b.order);
    const index = rowItems.findIndex(candidate => candidate.id === item.id);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= rowItems.length) return;
    mutateProject(() => {
      const target = rowItems[targetIndex];
      const oldOrder = item.order;
      item.order = target.order;
      target.order = oldOrder;
    }, { scrollSelected: true });
  }

  function moveVertical(direction) {
    const item = getSelectedItem();
    if (!item) return;
    const targetRow = item.row + direction;
    if (targetRow < 0 || targetRow >= project.rows) return;
    mutateProject(() => {
      item.row = targetRow;
      item.order = project.items.filter(candidate => candidate.row === targetRow && candidate.id !== item.id).length;
      activeRow = targetRow;
    }, { scrollSelected: true });
  }

  function duplicateSelected() {
    const item = getSelectedItem();
    if (!item) return;
    const duplicate = { ...item, id: createId(), order: item.order + 1 };
    mutateProject(() => {
      project.items.filter(candidate => candidate.row === item.row && candidate.order > item.order)
        .forEach(candidate => { candidate.order += 1; });
      project.items.push(duplicate);
      selectedId = duplicate.id;
      activeRow = duplicate.row;
    }, { scrollSelected: true });
  }

  function deleteSelected() {
    const item = getSelectedItem();
    if (!item) return;
    mutateProject(() => {
      const ordered = getOrderedItems();
      const index = ordered.findIndex(candidate => candidate.id === item.id);
      project.items = project.items.filter(candidate => candidate.id !== item.id);
      const nextOrdered = getOrderedItems();
      selectedId = nextOrdered[Math.min(index, nextOrdered.length - 1)]?.id || null;
      activeRow = getSelectedItem()?.row ?? Math.min(activeRow, project.rows - 1);
    });
  }

  function moveDragged(targetRow, targetId, placeAfter) {
    const item = project.items.find(candidate => candidate.id === draggedId);
    if (!item) return;
    const row = Math.floor(clampNumber(targetRow, 0, project.rows - 1));
    mutateProject(() => {
      const targetItems = project.items
        .filter(candidate => candidate.row === row && candidate.id !== item.id)
        .sort((a, b) => a.order - b.order);
      let targetIndex = targetId ? targetItems.findIndex(candidate => candidate.id === targetId) : targetItems.length;
      if (targetIndex < 0) targetIndex = targetItems.length;
      if (targetId && placeAfter) targetIndex += 1;
      item.row = row;
      targetItems.splice(targetIndex, 0, item);
      targetItems.forEach((candidate, index) => { candidate.order = index; });
      selectedId = item.id;
      activeRow = row;
    }, { scrollSelected: true });
  }

  function mergeDragged(targetId) {
    const item = project.items.find(candidate => candidate.id === draggedId);
    const target = project.items.find(candidate => candidate.id === targetId);
    if (!item || !target || item.id === target.id || item.shape !== target.shape || item.color !== target.color) return false;
    if (item.repeat + target.repeat > 32) {
      showToast("Una pila può contenere al massimo 32 ripetizioni");
      return true;
    }
    mutateProject(() => {
      target.repeat += item.repeat;
      project.items = project.items.filter(candidate => candidate.id !== item.id);
      selectedId = target.id;
      activeRow = target.row;
    }, { scrollSelected: true });
    showToast(`Segni sovrapposti: ×${target.repeat}`);
    return true;
  }

  function clearStackTargets() {
    elements.musigrammaRows.querySelectorAll(".isStackTarget")
      .forEach(node => node.classList.remove("isStackTarget"));
  }

  function undo() {
    if (!history.length) return;
    stopPlayback(true);
    project = normalizeProject(history.pop()) || createEmptyProject();
    if (!project.items.some(item => item.id === selectedId)) selectedId = project.items[0]?.id || null;
    activeRow = getSelectedItem()?.row ?? 0;
    elements.undoButton.disabled = history.length === 0;
    saveProject();
    render({ scrollSelected: true });
  }

  function newProject() {
    const shouldReset = project.items.length === 0 || window.confirm("Vuoi iniziare un nuovo musigramma?");
    if (!shouldReset) return;
    stopPlayback(true);
    pushHistory();
    project = createEmptyProject();
    selectedId = null;
    activeRow = 0;
    clearLoadedAudio();
    saveProject();
    render();
    showToast("Nuovo foglio pronto");
  }

  function openDialog(dialog) {
    if (!dialog || dialog.open) return;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function closeDialog(dialog) {
    if (!dialog?.open) return;
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  function markGuideAsSeen() {
    try {
      localStorage.setItem(GUIDE_STORAGE_KEY, "1");
    } catch (_) {
      // La guida resta utilizzabile anche senza memorizzare la preferenza.
    }
  }

  function openGuide() {
    openDialog(elements.guideDialog);
  }

  function closeGuide() {
    markGuideAsSeen();
    closeDialog(elements.guideDialog);
  }

  function openTemplates() {
    closeDialog(elements.guideDialog);
    markGuideAsSeen();
    openDialog(elements.templatesDialog);
  }

  function applyTemplate(templateId) {
    const template = createTemplateProject(templateId);
    if (!template) return;
    const shouldReplace = project.items.length === 0 || window.confirm("Vuoi sostituire il foglio attuale con questo modello?");
    if (!shouldReplace) return;
    stopPlayback(true);
    pushHistory();
    project = normalizeProject(template) || createEmptyProject();
    selectedId = project.items[0]?.id || null;
    activeRow = selectedId ? project.items[0].row : 0;
    clearLoadedAudio();
    saveProject();
    render({ scrollSelected: true });
    closeDialog(elements.templatesDialog);
    showToast(`Modello “${project.title}” caricato`);
    document.getElementById("musigrammaLab")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function maybeShowInitialGuide() {
    try {
      if (localStorage.getItem(GUIDE_STORAGE_KEY)) return;
    } catch (_) {
      // In assenza di salvataggio locale la guida viene comunque mostrata.
    }
    window.setTimeout(openGuide, 450);
  }

  async function handleAudioFile(file) {
    if (!file) return;
    if (!file.type.startsWith("audio/")) {
      showToast("Seleziona un file audio valido");
      return;
    }
    clearLoadedAudio();
    const currentAnalysisVersion = audioAnalysisVersion;
    loadedAudioFileName = file.name;
    audioObjectUrl = URL.createObjectURL(file);
    elements.projectAudio.src = audioObjectUrl;
    elements.audioFileName.textContent = `${file.name} · analisi in corso`;
    elements.audioFileName.title = file.name;
    elements.projectAudio.load();
    isAnalyzingAudio = true;
    elements.generateAudioButton.textContent = "Analisi…";
    updateTransportState();
    showToast("Analizzo il brano e preparo il musigramma");
    try {
      ensureAudioContext();
      if (!audioContext) throw new Error("AudioContext non disponibile");
      const encodedAudio = await file.arrayBuffer();
      const decodedBuffer = await audioContext.decodeAudioData(encodedAudio.slice(0));
      if (currentAnalysisVersion !== audioAnalysisVersion) return;
      loadedAudioBuffer = decodedBuffer;
      isAnalyzingAudio = false;
      elements.generateAudioButton.textContent = "Rigenera";
      generateMusigramFromAudio();
    } catch (_) {
      if (currentAnalysisVersion !== audioAnalysisVersion) return;
      isAnalyzingAudio = false;
      loadedAudioBuffer = null;
      elements.generateAudioButton.textContent = "Genera dal brano";
      elements.audioFileName.textContent = `${file.name} · analisi non disponibile`;
      updateTransportState();
      showToast("Il brano può essere riprodotto, ma non analizzato automaticamente");
    }
  }

  function clearLoadedAudio() {
    stopPlayback(true);
    audioAnalysisVersion += 1;
    if (audioObjectUrl) URL.revokeObjectURL(audioObjectUrl);
    audioObjectUrl = "";
    loadedAudioBuffer = null;
    loadedAudioFileName = "";
    isAnalyzingAudio = false;
    elements.projectAudio.removeAttribute("src");
    elements.projectAudio.load();
    elements.audioFileInput.value = "";
    elements.audioFileName.textContent = "Nessun audio";
    elements.audioFileName.removeAttribute("title");
    if (elements.generateAudioButton) elements.generateAudioButton.textContent = "Genera dal brano";
  }

  function getAudioFeatures(buffer, segmentCount) {
    const channelCount = Math.min(buffer.numberOfChannels, 2);
    const channels = Array.from({ length: channelCount }, (_, index) => buffer.getChannelData(index));
    const samplesPerSegment = buffer.length / segmentCount;
    const features = [];

    for (let segmentIndex = 0; segmentIndex < segmentCount; segmentIndex += 1) {
      const start = Math.floor(segmentIndex * samplesPerSegment);
      const end = Math.min(buffer.length, Math.floor((segmentIndex + 1) * samplesPerSegment));
      const step = Math.max(1, Math.floor((end - start) / 3200));
      let squareSum = 0;
      let peak = 0;
      let crossings = 0;
      let sampleCount = 0;
      let previous = 0;

      for (let sampleIndex = start; sampleIndex < end; sampleIndex += step) {
        let sample = 0;
        for (let channelIndex = 0; channelIndex < channelCount; channelIndex += 1) {
          sample += channels[channelIndex][sampleIndex] || 0;
        }
        sample /= channelCount || 1;
        squareSum += sample * sample;
        peak = Math.max(peak, Math.abs(sample));
        if (sampleCount > 0 && (sample >= 0) !== (previous >= 0)) crossings += 1;
        previous = sample;
        sampleCount += 1;
      }

      const rms = Math.sqrt(squareSum / Math.max(1, sampleCount));
      features.push({ rms, peak, zcr: crossings / Math.max(1, sampleCount - 1) });
    }
    return features;
  }

  function quantile(values, position) {
    const sorted = [...values].sort((a, b) => a - b);
    if (!sorted.length) return 0;
    return sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor((sorted.length - 1) * position)))];
  }

  function generateMusigramFromAudio() {
    const buffer = loadedAudioBuffer;
    if (!buffer || !Number.isFinite(buffer.duration) || buffer.duration <= 0) {
      showToast("Carica prima un brano da analizzare");
      return;
    }

    isAnalyzingAudio = true;
    elements.generateAudioButton.textContent = "Analisi…";
    updateTransportState();
    window.setTimeout(() => {
      const duration = buffer.duration;
      const segmentCount = Math.floor(clampNumber(Math.round(duration / 3.5), 4, 100));
      const features = getAudioFeatures(buffer, segmentCount);
      const energies = features.map(feature => feature.rms);
      const lowEnergy = quantile(energies, 0.12);
      const highEnergy = Math.max(lowEnergy + 0.0001, quantile(energies, 0.9));
      const zcrHigh = Math.max(0.02, quantile(features.map(feature => feature.zcr), 0.72));
      const desiredBeats = Math.round(duration * 1.6);
      const totalBeats = Math.floor(clampNumber(desiredBeats, segmentCount, segmentCount * 8));
      const baseBeats = Math.floor(totalBeats / segmentCount);
      const extraBeats = totalBeats - baseBeats * segmentCount;
      const generatedItems = [];
      let previousEnergy = 0;

      features.forEach((feature, index) => {
        const energy = clampNumber((feature.rms - lowEnergy) / (highEnergy - lowEnergy), 0, 1);
        const change = energy - previousEnergy;
        const transient = feature.peak / Math.max(0.012, feature.rms);
        let shape = "line";
        if (energy < 0.09) shape = "arc";
        else if (change > 0.26 || transient > 7.2) shape = "slash";
        else if (feature.zcr > zcrHigh) shape = "zigzag";
        else if (Math.abs(change) > 0.14) shape = "wave";
        else if (energy > 0.72) shape = "dot";

        let color = COLORS[0];
        if (shape === "slash") color = COLORS[3];
        else if (feature.zcr > zcrHigh) color = COLORS[2];
        else if (energy > 0.68) color = COLORS[4];
        else if (energy > 0.35) color = COLORS[1];
        const beats = baseBeats + (index < extraBeats ? 1 : 0);
        const previousItem = generatedItems[generatedItems.length - 1];

        if (previousItem && previousItem.shape === shape && previousItem.color === color
          && previousItem.beats === beats && previousItem.repeat < 32) {
          previousItem.repeat += 1;
        } else {
          generatedItems.push(createItem(shape, { color, beats, repeat: 1 }));
        }
        previousEnergy = energy;
      });

      const itemsPerRow = Math.max(6, Math.ceil(generatedItems.length / MAX_ROWS));
      generatedItems.forEach((item, index) => {
        item.row = Math.floor(index / itemsPerRow);
        item.order = index % itemsPerRow;
      });
      const rows = Math.max(1, Math.ceil(generatedItems.length / itemsPerRow));
      const exactTempo = clampNumber((totalBeats * 60) / duration, 30, 240);
      const fileTitle = loadedAudioFileName.replace(/\.[^.]+$/, "").trim();

      stopPlayback(true);
      pushHistory();
      project = normalizeProject({
        version: 3,
        title: fileTitle.slice(0, 60) || "Musigramma dal brano",
        composer: "",
        tempo: Number(exactTempo.toFixed(3)),
        rows,
        items: generatedItems
      }) || createEmptyProject();
      selectedId = project.items[0]?.id || null;
      activeRow = 0;
      isAnalyzingAudio = false;
      elements.generateAudioButton.textContent = "Rigenera";
      elements.audioFileName.textContent = `${loadedAudioFileName} · ${formatTime(duration * 1000)} · allineato`;
      saveProject();
      render();
      showToast(`Musigramma creato: ${project.items.length} segni in ${project.rows} righe`);
    }, 40);
  }

  function fitProjectToAudio() {
    const duration = elements.projectAudio.duration;
    const totalBeats = getTotalBeats();
    if (!Number.isFinite(duration) || duration <= 0 || totalBeats === 0) {
      showToast("Carica un brano e aggiungi almeno un segno");
      return;
    }
    const idealTempo = (totalBeats * 60) / duration;
    const nextTempo = Number(clampNumber(idealTempo, 30, 240).toFixed(3));
    mutateProject(() => { project.tempo = nextTempo; });
    const isExact = idealTempo >= 30 && idealTempo <= 240;
    showToast(isExact ? "Musigramma allineato con precisione al brano" : "Allineamento adattato al limite disponibile");
  }

  function getCurrentIndexAt(milliseconds) {
    const beatDuration = 60000 / project.tempo;
    const items = getOrderedItems();
    let boundary = 0;
    for (let index = 0; index < items.length; index += 1) {
      boundary += items[index].beats * items[index].repeat * beatDuration;
      if (milliseconds < boundary) return index;
    }
    return -1;
  }

  function togglePlayback() {
    if (!project.items.length && !audioObjectUrl) return;
    if (isPlaying) pausePlayback();
    else startPlayback();
  }

  function startPlayback() {
    const totalDuration = getTotalDurationMs();
    if (elapsedMs >= totalDuration) elapsedMs = 0;
    isPlaying = true;
    currentItemIndex = -1;
    playbackStartedAt = performance.now() - elapsedMs;
    updateTransportState();
    if (audioObjectUrl) {
      elements.projectAudio.currentTime = Math.min(elapsedMs / 1000, elements.projectAudio.duration || 0);
      elements.projectAudio.play().catch(() => showToast("Il browser non ha avviato il file audio"));
    } else {
      ensureAudioContext();
    }
    animationFrame = requestAnimationFrame(playbackTick);
  }

  function pausePlayback() {
    if (!isPlaying) return;
    isPlaying = false;
    cancelAnimationFrame(animationFrame);
    elements.projectAudio.pause();
    updateTransportState();
  }

  function stopPlayback(reset = true) {
    isPlaying = false;
    cancelAnimationFrame(animationFrame);
    elements.projectAudio?.pause();
    if (reset) {
      elapsedMs = 0;
      currentItemIndex = -1;
      if (audioObjectUrl) elements.projectAudio.currentTime = 0;
      updateProgress(0);
      setCurrentItem(-1);
    }
    if (elements.playButton) updateTransportState();
  }

  function playbackTick(timestamp) {
    if (!isPlaying) return;
    elapsedMs = timestamp - playbackStartedAt;
    const totalDuration = getTotalDurationMs();
    if (elapsedMs >= totalDuration) {
      elapsedMs = totalDuration;
      updateProgress(100);
      setCurrentItem(-1);
      isPlaying = false;
      elements.projectAudio.pause();
      updateTransportState();
      return;
    }
    const nextIndex = getCurrentIndexAt(elapsedMs);
    if (nextIndex !== currentItemIndex) {
      setCurrentItem(nextIndex);
      if (!audioObjectUrl && nextIndex >= 0) playItemTone(getOrderedItems()[nextIndex]);
    }
    updateProgress((elapsedMs / totalDuration) * 100);
    animationFrame = requestAnimationFrame(playbackTick);
  }

  function setCurrentItem(index) {
    currentItemIndex = index;
    const currentId = index >= 0 ? getOrderedItems()[index]?.id : "";
    document.querySelectorAll(".musigrammaVisualItem").forEach(node => {
      node.classList.toggle("isCurrent", Boolean(currentId) && node.dataset.itemId === currentId);
    });
    if (currentId) {
      elements.musigrammaRows.querySelector(`[data-item-id="${currentId}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }

  function updateProgress(percent) {
    const value = Math.max(0, Math.min(100, percent));
    elements.musigrammaProgressFill.style.width = `${value}%`;
    elements.progressBar.setAttribute("aria-valuenow", String(Math.round(value)));
  }

  function ensureAudioContext() {
    if (!audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioContext = new AudioContextClass();
    }
    if (audioContext?.state === "suspended") audioContext.resume();
  }

  function playItemTone(item) {
    if (!item?.tone) return;
    ensureAudioContext();
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    const duration = Math.min(0.42, (60 / project.tempo) * 0.55);
    oscillator.type = item.shape === "line" || item.shape === "arc" ? "sine" : "triangle";
    oscillator.frequency.setValueAtTime(item.tone, now);
    if (item.shape === "wave") oscillator.frequency.linearRampToValueAtTime(item.tone * 1.25, now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.1, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }

  function openPresentation() {
    if (!project.items.length) return;
    elements.presentationOverlay.hidden = false;
    document.body.classList.add("musigrammaPresentationOpen");
    renderPresentation();
    setCurrentItem(currentItemIndex);
    elements.presentationCloseButton.focus();
  }

  function renderPresentation() {
    const title = project.title.trim() || "Musigramma senza titolo";
    elements.presentationTitle.textContent = title;
    elements.presentationSheetTitle.textContent = title;
    elements.presentationComposer.textContent = project.composer;
    elements.presentationComposer.hidden = !project.composer.trim();
    renderRows(elements.presentationRows, false);
  }

  function closePresentation() {
    elements.presentationOverlay.hidden = true;
    document.body.classList.remove("musigrammaPresentationOpen");
    elements.presentationButton.focus();
  }

  function downloadPng() {
    if (!project.items.length) return;
    const width = 1400;
    const margin = 105;
    const availableWidth = width - margin * 2;
    const rowLayouts = layoutCanvasRows(availableWidth);
    const height = 225 + rowLayouts.reduce((sum, row) => sum + row.height, 0) + 75;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#151b1d";
    context.font = "500 48px Arial, sans-serif";
    context.textAlign = "center";
    context.fillText((project.title.trim() || "Musigramma senza titolo").toUpperCase(), width / 2, 90, 880);
    const titleWidth = Math.min(880, context.measureText((project.title.trim() || "Musigramma senza titolo").toUpperCase()).width);
    context.fillRect(width / 2 - titleWidth / 2, 101, titleWidth, 2);
    if (project.composer.trim()) {
      context.font = "700 20px Arial, sans-serif";
      context.textAlign = "right";
      context.fillText(project.composer.toUpperCase(), width - margin, 42, 260);
      const composerWidth = Math.min(260, context.measureText(project.composer.toUpperCase()).width);
      context.fillRect(width - margin - composerWidth, 49, composerWidth, 1);
    }

    let rowY = 150;
    rowLayouts.forEach(rowLayout => {
      rowLayout.items.forEach(positioned => drawCanvasItem(context, positioned.item, margin + positioned.x, rowY + positioned.y));
      rowY += rowLayout.height;
    });
    context.fillStyle = "#7a898c";
    context.font = "600 17px Arial, sans-serif";
    context.textAlign = "right";
    context.fillText("Creato con Music Game Hub", width - margin, height - 28);
    const link = document.createElement("a");
    link.download = `${slugify(project.title) || "musigramma"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    showToast("Foglio esportato come PNG");
  }

  function layoutCanvasRows(availableWidth) {
    return Array.from({ length: project.rows }, (_, rowIndex) => {
      const items = project.items.filter(item => item.row === rowIndex).sort((a, b) => a.order - b.order);
      const positioned = [];
      let x = 0;
      let line = 0;
      items.forEach(item => {
        const itemWidth = getItemWidth(item) * 1.45;
        if (x > 0 && x + itemWidth > availableWidth) {
          x = 0;
          line += 1;
        }
        positioned.push({ item, x, y: line * 105 });
        x += itemWidth + 18;
      });
      return { items: positioned, height: Math.max(112, (line + 1) * 105 + 8) };
    });
  }

  function drawCanvasItem(context, item, x, y) {
    const baseWidth = SHAPES[item.shape].width * 1.35;
    drawCanvasGlyph(context, item.shape, item.color, x, y + 46, baseWidth);
    if (item.repeat > 1) {
      context.fillStyle = item.color;
      context.font = "900 27px Arial, sans-serif";
      context.textAlign = "left";
      context.fillText(`×${item.repeat}`, x + baseWidth + 8, y + 66);
    }
  }

  function drawCanvasGlyph(context, shapeName, color, x, centerY, width) {
    const left = x;
    const right = x + width;
    const top = centerY - 32;
    const bottom = centerY + 32;
    context.strokeStyle = color;
    context.fillStyle = color;
    context.lineWidth = 5;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    if (shapeName === "dot") {
      context.arc(x + width / 2, centerY, 13, 0, Math.PI * 2);
      context.fill();
      return;
    }
    if (shapeName === "zigzag") {
      context.moveTo(left, bottom - 7);
      context.lineTo(left + width * 0.31, top + 5);
      context.lineTo(left + width * 0.62, bottom - 7);
      context.lineTo(right, top + 5);
    } else if (shapeName === "wave") {
      context.moveTo(left, centerY + 10);
      context.bezierCurveTo(left + width * 0.18, top, left + width * 0.42, top + 2, left + width * 0.52, centerY + 5);
      context.bezierCurveTo(left + width * 0.66, bottom, left + width * 0.42, bottom + 2, left + width * 0.36, centerY + 13);
      context.bezierCurveTo(left + width * 0.31, top + 8, left + width * 0.67, top - 5, left + width * 0.84, top + 12);
      context.bezierCurveTo(right, centerY, right - 3, bottom - 4, right - 14, bottom);
    } else if (shapeName === "arc") {
      context.moveTo(left, top + 4);
      context.bezierCurveTo(left, bottom + 15, right, bottom + 15, right, top + 4);
    } else if (shapeName === "line") {
      context.moveTo(left, centerY);
      context.lineTo(right, centerY);
    } else if (shapeName === "slash") {
      context.moveTo(left + 7, bottom - 4);
      context.lineTo(right - 7, top + 4);
    }
    context.stroke();
    if (shapeName === "slash") {
      context.beginPath();
      context.arc(left + 7, bottom - 4, 7, 0, Math.PI * 2);
      context.arc(right - 7, top + 4, 7, 0, Math.PI * 2);
      context.fill();
    }
  }

  function slugify(value) {
    return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
  }

  function showToast(message) {
    let toast = document.querySelector(".musigrammaToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "musigrammaToast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("isVisible");
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("isVisible"), 2200);
  }

  function bindRowEvents() {
    elements.musigrammaRows.addEventListener("click", event => {
      const itemNode = event.target.closest(".musigrammaVisualItem");
      if (itemNode) {
        selectedId = itemNode.dataset.itemId;
        activeRow = getSelectedItem()?.row ?? activeRow;
        renderRows(elements.musigrammaRows, true);
        renderInspector();
        return;
      }
      const row = event.target.closest(".musigrammaSheetRow");
      if (row) addSign(Number(row.dataset.row));
    });
    elements.musigrammaRows.addEventListener("dragstart", event => {
      const itemNode = event.target.closest(".musigrammaVisualItem");
      if (!itemNode) return;
      draggedId = itemNode.dataset.itemId;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", draggedId);
    });
    elements.musigrammaRows.addEventListener("dragover", event => {
      if (!draggedId || !event.target.closest(".musigrammaSheetRow")) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      clearStackTargets();
      const targetNode = event.target.closest(".musigrammaVisualItem");
      const source = project.items.find(candidate => candidate.id === draggedId);
      const target = project.items.find(candidate => candidate.id === targetNode?.dataset.itemId);
      if (source && target && source.id !== target.id && source.shape === target.shape && source.color === target.color) {
        targetNode.classList.add("isStackTarget");
      }
    });
    elements.musigrammaRows.addEventListener("drop", event => {
      const row = event.target.closest(".musigrammaSheetRow");
      if (!row || !draggedId) return;
      event.preventDefault();
      const targetNode = event.target.closest(".musigrammaVisualItem");
      clearStackTargets();
      if (targetNode && mergeDragged(targetNode.dataset.itemId)) {
        draggedId = null;
        return;
      }
      let placeAfter = false;
      if (targetNode) {
        const bounds = targetNode.getBoundingClientRect();
        placeAfter = event.clientX > bounds.left + bounds.width / 2;
      }
      moveDragged(Number(row.dataset.row), targetNode?.dataset.itemId || "", placeAfter);
      draggedId = null;
    });
    elements.musigrammaRows.addEventListener("dragend", () => {
      clearStackTargets();
      draggedId = null;
    });
  }

  function bindEvents() {
    document.querySelectorAll(".musigrammaPaletteButton").forEach(button => {
      button.addEventListener("click", () => selectShape(button.dataset.shape));
    });
    bindRowEvents();
    elements.addSignButton.addEventListener("click", () => addSign());
    elements.addRowButton.addEventListener("click", addRow);
    elements.projectTitleInput.addEventListener("input", () => {
      project.title = elements.projectTitleInput.value.slice(0, 60);
      saveProject();
      renderProjectMeta();
    });
    elements.projectComposerInput.addEventListener("input", () => {
      project.composer = elements.projectComposerInput.value.slice(0, 50);
      saveProject();
      renderProjectMeta();
    });
    elements.tempoInput.addEventListener("change", () => {
      const next = clampNumber(elements.tempoInput.value, 30, 240);
      if (next === project.tempo) return;
      mutateProject(() => { project.tempo = next; });
    });
    elements.audioFileInput.addEventListener("change", () => handleAudioFile(elements.audioFileInput.files?.[0]));
    elements.projectAudio.addEventListener("loadedmetadata", () => {
      const alignmentLabel = loadedAudioBuffer && !isAnalyzingAudio ? " · allineato" : "";
      elements.audioFileName.textContent = `${elements.audioFileName.textContent.split(" · ")[0]} · ${formatTime(elements.projectAudio.duration * 1000)}${alignmentLabel}`;
      updateTransportState();
    });
    elements.projectAudio.addEventListener("error", () => {
      showToast("Non riesco a leggere questo file audio");
      clearLoadedAudio();
    });
    elements.fitAudioButton.addEventListener("click", fitProjectToAudio);
    elements.generateAudioButton.addEventListener("click", generateMusigramFromAudio);
    elements.undoButton.addEventListener("click", undo);
    elements.newProjectButton.addEventListener("click", newProject);
    elements.templatesButton.addEventListener("click", openTemplates);
    elements.guideButton.addEventListener("click", openGuide);
    elements.templatesCloseButton.addEventListener("click", () => closeDialog(elements.templatesDialog));
    elements.guideCloseButton.addEventListener("click", closeGuide);
    elements.guideStartButton.addEventListener("click", closeGuide);
    elements.guideTemplatesButton.addEventListener("click", openTemplates);
    document.querySelectorAll(".musigrammaTemplateCard").forEach(button => {
      button.addEventListener("click", () => applyTemplate(button.dataset.templateId));
    });
    [elements.templatesDialog, elements.guideDialog].forEach(dialog => {
      dialog.addEventListener("click", event => {
        if (event.target === dialog) {
          if (dialog === elements.guideDialog) markGuideAsSeen();
          closeDialog(dialog);
        }
      });
    });
    elements.guideDialog.addEventListener("close", markGuideAsSeen);
    elements.decreaseRepeatButton.addEventListener("click", () => adjustRepeat(-1));
    elements.increaseRepeatButton.addEventListener("click", () => adjustRepeat(1));
    elements.decreaseBeatsButton.addEventListener("click", () => adjustBeats(-1));
    elements.increaseBeatsButton.addEventListener("click", () => adjustBeats(1));
    elements.moveLeftButton.addEventListener("click", () => moveHorizontal(-1));
    elements.moveRightButton.addEventListener("click", () => moveHorizontal(1));
    elements.moveUpButton.addEventListener("click", () => moveVertical(-1));
    elements.moveDownButton.addEventListener("click", () => moveVertical(1));
    elements.duplicateButton.addEventListener("click", duplicateSelected);
    elements.deleteButton.addEventListener("click", deleteSelected);
    elements.playButton.addEventListener("click", togglePlayback);
    elements.restartButton.addEventListener("click", () => {
      stopPlayback(true);
      startPlayback();
    });
    elements.presentationButton.addEventListener("click", openPresentation);
    elements.presentationCloseButton.addEventListener("click", closePresentation);
    elements.presentationPlayButton.addEventListener("click", togglePlayback);
    elements.presentationRestartButton.addEventListener("click", () => {
      stopPlayback(true);
      startPlayback();
    });
    elements.printButton.addEventListener("click", () => window.print());
    elements.downloadButton.addEventListener("click", downloadPng);
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !elements.presentationOverlay.hidden) {
        closePresentation();
      } else if (event.code === "Space" && !elements.presentationOverlay.hidden) {
        event.preventDefault();
        togglePlayback();
      }
    });
    window.addEventListener("beforeunload", () => {
      if (audioObjectUrl) URL.revokeObjectURL(audioObjectUrl);
    });
  }

  function init() {
    cacheElements();
    loadProject();
    bindEvents();
    render();
    maybeShowInitialGuide();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
