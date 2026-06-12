/* ==================== COSTRUISCI FORMAZIONE - DRAG & DROP ==================== */

const INSTRUMENTS_LIST = [
  { id: 'pianoforte', name: 'Pianoforte', category: 'tastiera' },
  { id: 'violino', name: 'Violino', category: 'archi' },
  { id: 'viola', name: 'Viola', category: 'archi' },
  { id: 'violoncello', name: 'Violoncello', category: 'archi' },
  { id: 'contrabbasso', name: 'Contrabbasso', category: 'archi' },
  { id: 'flauto', name: 'Flauto', category: 'fiati' },
  { id: 'oboe', name: 'Oboe', category: 'fiati' },
  { id: 'clarinetto', name: 'Clarinetto', category: 'fiati' },
  { id: 'fagotto', name: 'Fagotto', category: 'fiati' },
  { id: 'sassofono', name: 'Sassofono', category: 'fiati' },
  { id: 'tromba', name: 'Tromba', category: 'ottoni' },
  { id: 'trombone', name: 'Trombone', category: 'ottoni' },
  { id: 'corno', name: 'Corno', category: 'ottoni' },
  { id: 'bassotuba', name: 'Bassotuba', category: 'ottoni' },
  { id: 'tamburo', name: 'Tamburo', category: 'percussioni' },
  { id: 'timpani', name: 'Timpani', category: 'percussioni' },
  { id: 'chitarra', name: 'Chitarra', category: 'corde' },
  { id: 'chitarra-elettrica', name: 'Chitarra elettrica', category: 'elettrofoni', image: 'chitarra_elettrica.webp' },
  { id: 'basso-elettrico', name: 'Basso elettrico', category: 'elettrofoni', image: 'basso_elettrico.webp' },
  { id: 'batteria', name: 'Batteria', category: 'percussioni' },
];

const ARCHI_ORCHESTRALI = ['violino', 'viola', 'violoncello', 'contrabbasso'];
const FIATI_E_OTTONI = ['flauto', 'oboe', 'clarinetto', 'fagotto', 'sassofono', 'tromba', 'trombone', 'corno', 'bassotuba'];
const PERCUSSIONI = ['tamburo', 'timpani', 'batteria'];

const FORMAZIONI_RULES = [
  // Formazioni specifiche: prima delle regole generiche.
  {
    name: 'Quartetto d\'archi',
    check: (instr) => {
      return countId(instr, 'violino') === 2 &&
             countId(instr, 'viola') === 1 &&
             countId(instr, 'violoncello') === 1 &&
             instr.length === 4;
    },
    description: 'Due violini, viola e violoncello: una formazione centrale nella musica da camera.',
    note: 'È una combinazione precisa: ogni strumento ha un ruolo diverso nel dialogo musicale.'
  },
  {
    name: 'Quintetto di fiati',
    check: (instr) => {
      return countId(instr, 'flauto') === 1 &&
             countId(instr, 'oboe') === 1 &&
             countId(instr, 'clarinetto') === 1 &&
             countId(instr, 'corno') === 1 &&
             countId(instr, 'fagotto') === 1 &&
             instr.length === 5;
    },
    description: 'Flauto, oboe, clarinetto, corno e fagotto: un organico tradizionale del quintetto di fiati.',
    note: 'Qui conta la varietà dei timbri: ogni strumento porta un colore sonoro diverso.'
  },
  {
    name: 'Quintetto d\'ottoni',
    check: (instr) => {
      return countId(instr, 'tromba') === 2 &&
             countId(instr, 'trombone') === 1 &&
             countId(instr, 'bassotuba') === 1 &&
             countId(instr, 'corno') === 1 &&
             instr.length === 5;
    },
    description: '2 trombe, trombone, bassotuba e corno: una combinazione tipica del quintetto di ottoni.',
    note: 'Il risultato è compatto e brillante, con strumenti della stessa area timbrica.'
  },
  {
    name: 'Rock Band',
    check: (instr) => {
      const hasGuitar = instr.some(i => ['chitarra', 'chitarra-elettrica'].includes(i.id));
      return hasGuitar &&
             countId(instr, 'basso-elettrico') >= 1 &&
             countId(instr, 'batteria') >= 1 &&
             instr.length >= 3 &&
             instr.length <= 6;
    },
    description: 'Chitarra, basso elettrico e batteria: la base più riconoscibile di una rock band.',
    note: 'La chitarra dà il profilo armonico, basso e batteria costruiscono la sezione ritmica.'
  },
  {
    name: 'Jazz Band',
    check: (instr) => {
      const hasSoloWind = instr.some(i => ['sassofono', 'tromba', 'trombone', 'clarinetto'].includes(i.id));
      const hasRhythm = instr.some(i => ['batteria', 'pianoforte', 'contrabbasso', 'basso-elettrico'].includes(i.id));
      return hasSoloWind && hasRhythm && instr.length >= 4 && instr.length <= 8;
    },
    description: 'Fiati solistici e sezione ritmica: una combinazione adatta al dialogo e all\'improvvisazione jazz.',
    note: 'Funziona bene quando un timbro melodico dialoga con strumenti di accompagnamento.'
  },

  // Regole per famiglia: riconoscono gruppi coerenti anche se non sono organici esatti.
  {
    name: 'Sezione strumentale',
    check: (instr) => instr.length >= 4 && getUniqueIds(instr).length === 1,
    description: 'Hai creato una sezione con più strumenti dello stesso tipo.',
    note: 'È utile per rinforzare un timbro, ma non è ancora una formazione completa e varia.'
  },
  {
    name: 'Ensemble d\'archi',
    check: (instr) => hasOnlyIds(instr, ARCHI_ORCHESTRALI) && instr.length >= 4 && instr.length <= 12,
    description: 'Un gruppo di soli archi con più parti distribuite tra strumenti gravi e acuti.',
    note: 'È più convincente quando alterna strumenti acuti, medi e gravi.'
  },
  {
    name: 'Ensemble di fiati',
    check: (instr) => hasOnlyIds(instr, FIATI_E_OTTONI) && instr.length >= 4 && instr.length <= 12,
    description: 'Un gruppo di fiati e ottoni, con timbri chiari, brillanti e molto riconoscibili.',
    note: 'Può avvicinarsi a una piccola banda se aumentano varietà e numero degli strumenti.'
  },
  {
    name: 'Gruppo di percussioni',
    check: (instr) => hasOnlyIds(instr, PERCUSSIONI) && instr.length >= 2,
    description: 'Una formazione centrata sul ritmo, sugli accenti e sui diversi modi di produrre il suono.',
    note: 'Funziona come laboratorio ritmico; per diventare ensemble misto servono anche strumenti melodici.'
  },

  // Regole per numero: usate quando non c'e una formazione piu specifica.
  {
    name: 'Solista',
    check: (instr) => instr.length === 1,
    description: 'Un musicista che si esibisce da solo.',
    note: 'Tutta l\'attenzione ricade sul timbro e sull\'espressività dello strumento scelto.'
  },
  {
    name: 'Duo',
    check: (instr) => instr.length === 2,
    description: 'Due musicisti: ideale per ascoltare dialogo, accompagnamento e risposta.',
    note: 'Nel duo è importante che i due strumenti abbiano ruoli distinguibili.'
  },
  {
    name: 'Trio',
    check: (instr) => instr.length === 3,
    description: 'Tre musicisti: una piccola formazione con più possibilità di contrasto e intreccio.',
    note: 'Il trio permette già una distribuzione tra melodia, accompagnamento e sostegno ritmico.'
  },
  {
    name: 'Quartetto',
    check: (instr) => instr.length === 4,
    description: 'Quattro musicisti: una formazione equilibrata, adatta a dialoghi musicali più ricchi.',
    note: 'Non è un quartetto storico preciso, ma può funzionare come quartetto libero.'
  },
  {
    name: 'Quintetto',
    check: (instr) => instr.length === 5,
    description: 'Cinque musicisti: una formazione abbastanza ampia per alternare timbri e ruoli.',
    note: 'Se gli strumenti appartengono alla stessa famiglia può diventare un quintetto più caratterizzato.'
  },
  {
    name: 'Ensemble',
    check: (instr) => instr.length >= 6 && instr.length <= 12,
    description: 'Un gruppo flessibile di musicisti con strumenti diversi e colori sonori misti.',
    note: 'È una formazione libera: osserva se c\'è equilibrio tra timbri acuti, gravi e ritmici.'
  },
  {
    name: 'Orchestra',
    check: (instr) => instr.length > 12 && getUniqueIds(instr).length >= 4 && getFamilyCount(instr) >= 3,
    description: 'Una grande formazione con molte parti: archi, fiati, ottoni, percussioni o strumenti misti.',
    note: 'Per sembrare davvero orchestrale servono famiglie diverse e una distribuzione ampia dei ruoli.'
  },
];

let selectedInstruments = [];
const STAGE_CENTER_X = 52;

document.addEventListener('DOMContentLoaded', () => {
  renderCarousel();
  setupDragZone();
  document.getElementById('instrumentsCarousel')?.addEventListener('scroll', updateArrowStates, { passive: true });
});

/* ==================== CAROUSEL ==================== */

function renderCarousel() {
  const carousel = document.getElementById('instrumentsCarousel');
  carousel.innerHTML = '';

  INSTRUMENTS_LIST.forEach(instr => {
    const item = document.createElement('div');
    item.className = 'carouselItem';
    item.draggable = true;
    item.tabIndex = 0;
    item.role = 'button';
    item.setAttribute('aria-label', `Aggiungi ${instr.name} al palco`);
    item.dataset.instrumentId = instr.id;
    
    const img = document.createElement('img');
    img.src = getInstrumentImageSrc(instr);
    img.alt = instr.name;
    img.className = 'carouselItemImage';
    
    const label = document.createElement('span');
    label.className = 'carouselItemLabel';
    label.textContent = instr.name;
    
    item.appendChild(img);
    item.appendChild(label);
    
    item.addEventListener('dragstart', (e) => {
      e.dataTransfer.effectAllowed = 'copy';
      e.dataTransfer.setData('instrumentId', instr.id);
    });

    item.addEventListener('click', () => addInstrumentToStage(instr.id));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        addInstrumentToStage(instr.id);
      }
    });
    
    carousel.appendChild(item);
  });

  updateArrowStates();
}

function getInstrumentImageSrc(instr) {
  return `img/strumenti/${instr.image || `${instr.id}.webp`}`;
}

function scrollCarousel(direction) {
  const carousel = document.getElementById('instrumentsCarousel');
  if (!carousel) return;

  const isVertical = getComputedStyle(carousel).flexDirection === 'column';
  const step = isVertical
    ? Math.max(160, Math.round(carousel.clientHeight * 0.72))
    : Math.max(220, Math.round(carousel.clientWidth * 0.82));

  carousel.scrollBy({
    top: isVertical ? direction * step : 0,
    left: isVertical ? 0 : direction * step,
    behavior: 'smooth'
  });

  setTimeout(updateArrowStates, 300);
}

function updateArrowStates() {
  const carousel = document.getElementById('instrumentsCarousel');
  const arrowLeft = document.getElementById('arrowLeft');
  const arrowRight = document.getElementById('arrowRight');
  if (!carousel || !arrowLeft || !arrowRight) return;

  const isVertical = getComputedStyle(carousel).flexDirection === 'column';
  if (isVertical) {
    arrowLeft.disabled = carousel.scrollTop <= 0;
    arrowRight.disabled = carousel.scrollTop >= carousel.scrollHeight - carousel.clientHeight - 10;
    return;
  }

  arrowLeft.disabled = carousel.scrollLeft <= 0;
  arrowRight.disabled = carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 10;
}

/* ==================== STAGE DROP ZONE ==================== */

function setupDragZone() {
  const dropZone = document.getElementById('stageDropZone');
  
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    dropZone.classList.add('drag-over');
  });
  
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
  });
  
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    
    const instrumentId = e.dataTransfer.getData('instrumentId');
    addInstrumentToStage(instrumentId);
  });
}

function addInstrumentToStage(instrumentId) {
  const instr = INSTRUMENTS_LIST.find(i => i.id === instrumentId);
  if (!instr) return;
  
  selectedInstruments.push({ ...instr, uid: Math.random() });
  renderStage();
  checkFormazione();
  markInstrumentAdded(instrumentId);
}

function renderStage() {
  const container = document.getElementById('instrumentsOnStage');
  const stage = document.getElementById('stageDropZone');
  container.innerHTML = '';
  stage?.classList.toggle('has-instruments', selectedInstruments.length > 0);

  selectedInstruments.forEach((instr, index) => {
    const position = getStagePosition(index, selectedInstruments.length);
    const el = document.createElement('div');
    el.className = 'instrumentOnStage';
    el.dataset.uid = instr.uid;
    el.style.setProperty('--x', `${position.x}%`);
    el.style.setProperty('--y', `${position.y}%`);
    el.style.setProperty('--scale', position.scale);
    el.style.setProperty('--delay', `${Math.min(index, 12) * 35}ms`);
    el.style.zIndex = String(Math.round(position.y));

    const pad = document.createElement('span');
    pad.className = 'instrumentStagePad';

    const img = document.createElement('img');
    img.src = getInstrumentImageSrc(instr);
    img.alt = instr.name;
    img.className = 'stageInstrumentImage';

    const label = document.createElement('span');
    label.className = 'stageInstrumentLabel';
    label.textContent = instr.name;
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'removeBtn';
    removeBtn.innerHTML = '✕';
    removeBtn.onclick = () => removeInstrument(instr.uid);
    removeBtn.title = `Rimuovi ${instr.name}`;

    el.appendChild(pad);
    el.appendChild(img);
    el.appendChild(label);
    el.appendChild(removeBtn);
    container.appendChild(el);
  });
}

function getStagePosition(index, total) {
  const rowPlans = total <= 5
    ? [{ count: total, y: 73, scale: 0.98, span: Math.min(54, 18 + total * 8), curve: 3 }]
    : total <= 11
      ? [
          { count: Math.ceil(total * 0.45), y: 63, scale: 0.78, span: 40, curve: 2 },
          { count: total - Math.ceil(total * 0.45), y: 75, scale: 0.98, span: 56, curve: 4 },
        ]
      : [
          { count: Math.ceil(total * 0.28), y: 56, scale: 0.68, span: 34, curve: 1.5 },
          { count: Math.ceil(total * 0.34), y: 68, scale: 0.82, span: 48, curve: 3 },
          { count: total - Math.ceil(total * 0.28) - Math.ceil(total * 0.34), y: 77, scale: 0.98, span: 66, curve: 4.5 },
        ];

  let offset = 0;
  for (const row of rowPlans) {
    if (index < offset + row.count) {
      const rowIndex = index - offset;
      const x = getRowX(rowIndex, row.count, row.span);
      const centerDistance = Math.abs(x - STAGE_CENTER_X) / Math.max(1, row.span / 2);
      const y = row.y + row.curve * (1 - Math.min(centerDistance, 1));
      return { x, y, scale: row.scale };
    }
    offset += row.count;
  }

  return { x: STAGE_CENTER_X, y: 74, scale: 1 };
}

function getRowX(index, count, rowSpan) {
  if (count <= 1) return STAGE_CENTER_X;

  const span = rowSpan || Math.min(68, 18 + count * 7.5);
  const start = STAGE_CENTER_X - span / 2;
  return start + (span / (count - 1)) * index;
}

function removeInstrument(uid) {
  selectedInstruments = selectedInstruments.filter(i => i.uid !== uid);
  renderStage();
  checkFormazione();
}

function resetStage() {
  selectedInstruments = [];
  renderStage();
  document.getElementById('resultName').textContent = 'Scegli gli strumenti';
  document.getElementById('resultDescription').textContent = '';
  document.querySelectorAll('.carouselItem.is-added').forEach(item => {
    item.classList.remove('is-added');
  });
}

function markInstrumentAdded(instrumentId) {
  const item = document.querySelector(`.carouselItem[data-instrument-id="${instrumentId}"]`);
  if (!item) return;

  item.classList.add('is-added');
  window.setTimeout(() => item.classList.remove('is-added'), 650);
}

/* ==================== RICONOSCIMENTO FORMAZIONE ==================== */

function countId(instruments, id) {
  return instruments.filter(instr => instr.id === id).length;
}

function hasOnlyIds(instruments, allowedIds) {
  return instruments.length > 0 && instruments.every(instr => allowedIds.includes(instr.id));
}

function getUniqueIds(instruments) {
  return [...new Set(instruments.map(instr => instr.id))];
}

function getFamilyCount(instruments) {
  return new Set(instruments.map(instr => instr.category)).size;
}

function formatInstrumentSummary(instruments) {
  const counts = new Map();
  instruments.forEach((instr) => {
    const current = counts.get(instr.name) || 0;
    counts.set(instr.name, current + 1);
  });

  return [...counts.entries()]
    .map(([name, count]) => count === 1 ? name : `${name} x${count}`)
    .join(', ');
}

function getFreeCombinationNote(instruments) {
  if (getUniqueIds(instruments).length === 1) {
    return 'Hai usato molti strumenti uguali: il risultato rinforza un solo timbro, ma manca varietà di ruoli.';
  }

  if (getFamilyCount(instruments) === 1) {
    return 'Gli strumenti appartengono alla stessa famiglia: il colore sonoro è coerente, ma può risultare poco contrastato.';
  }

  return 'La combinazione è interessante, ma non corrisponde ancora a una formazione riconoscibile tra quelle principali.';
}

function buildFormationMessage(formation, instruments) {
  return `${formation.description} Composizione: ${formatInstrumentSummary(instruments)}. Osservazione: ${formation.note}`;
}

function updateFormationOutput(name, message) {
  document.getElementById('resultName').textContent = name;
  document.getElementById('resultDescription').textContent = message;
}

function checkFormazione() {
  if (selectedInstruments.length === 0) {
    updateFormationOutput('Scegli gli strumenti', '');
    return;
  }
  
  for (const formazione of FORMAZIONI_RULES) {
    if (formazione.check(selectedInstruments)) {
      updateFormationOutput(formazione.name, buildFormationMessage(formazione, selectedInstruments));
      return;
    }
  }
  
  updateFormationOutput(
    'Combinazione libera',
    `Composizione: ${formatInstrumentSummary(selectedInstruments)}. Osservazione: ${getFreeCombinationNote(selectedInstruments)}`
  );
}
