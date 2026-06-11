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
  { id: 'tuba', name: 'Tuba', category: 'ottoni' },
  { id: 'percussioni', name: 'Percussioni', category: 'percussioni' },
  { id: 'voce', name: 'Voce', category: 'voce' },
  { id: 'chitarra', name: 'Chitarra', category: 'corde' },
  { id: 'basso-elettrico', name: 'Basso Elettrico', category: 'corde' },
  { id: 'batteria', name: 'Batteria', category: 'percussioni' },
];

const FORMAZIONI_RULES = [
  // ── FORMAZIONI SPECIFICHE ──
  {
    name: 'Quartetto d\'archi',
    check: (instr) => {
      const violini = instr.filter(i => i.id === 'violino').length;
      const viole = instr.filter(i => i.id === 'viola').length;
      const violoncelli = instr.filter(i => i.id === 'violoncello').length;
      return violini === 2 && viole === 1 && violoncelli === 1 && instr.length === 4;
    },
    description: 'La formazione più prestigiosa della musica da camera.'
  },
  {
    name: 'Rock Band',
    check: (instr) => {
      // Deve avere: (Chitarra O Basso Elettrico) E Batteria - minimo 3 con questi
      const hasGuitar = instr.some(i => i.id === 'chitarra');
      const hasBassElettrico = instr.some(i => i.id === 'basso-elettrico');
      const hasDrums = instr.some(i => i.id === 'batteria');
      const validStringInstr = instr.filter(i => ['chitarra', 'basso-elettrico', 'voce'].includes(i.id));
      
      return (hasGuitar || hasBassElettrico) && hasDrums && instr.length >= 3 && instr.length <= 6;
    },
    description: 'Chitarra/basso elettrico + batteria. La vera formazione rock.'
  },
  {
    name: 'Jazz Band',
    check: (instr) => {
      // Deve avere: almeno 1 fiato (sax/tromba/trombone) E ritmo (batteria/pianoforte) - minimo 4
      const hasWinds = instr.some(i => ['sassofono', 'tromba', 'trombone'].includes(i.id));
      const hasRhythm = instr.some(i => ['batteria', 'pianoforte', 'contrabbasso'].includes(i.id));
      const hasRealJazzCombo = instr.some(i => ['sassofono', 'tromba', 'trombone'].includes(i.id)) &&
                               instr.some(i => ['batteria', 'pianoforte'].includes(i.id));
      
      return hasRealJazzCombo && instr.length >= 4 && instr.length <= 8;
    },
    description: 'Fiati + ritmo. La formazione dove l\'improvvisazione è fondamentale.'
  },
  
  // ── FORMAZIONI GENERICHE (verifica dopo le specifiche) ──
  {
    name: 'Solista',
    check: (instr) => instr.length === 1,
    description: 'Un musicista che si esibisce da solo.'
  },
  {
    name: 'Duo',
    check: (instr) => instr.length === 2,
    description: 'Due musicisti che suonano insieme in armonia.'
  },
  {
    name: 'Trio',
    check: (instr) => instr.length === 3,
    description: 'Tre musicisti che creano un dialogo musicale.'
  },
  {
    name: 'Quintetto di fiati',
    check: (instr) => {
      // Esattamente: Flauto + Oboe + Clarinetto + Corno + Fagotto (uno per tipo)
      const count = (id) => instr.filter(i => i.id === id).length;
      
      return count('flauto') === 1 &&
             count('oboe') === 1 &&
             count('clarinetto') === 1 &&
             count('corno') === 1 &&
             count('fagotto') === 1 &&
             instr.length === 5;
    },
    description: 'La formazione classica di fiati: Flauto, Oboe, Clarinetto, Corno e Fagotto.'
  },
  {
    name: 'Quintetto d\'ottoni',
    check: (instr) => {
      // Esattamente: 2 Trombe + 1 Trombone + 1 Tuba + 1 Corno
      const count = (id) => instr.filter(i => i.id === id).length;
      
      return count('tromba') === 2 &&
             count('trombone') === 1 &&
             count('tuba') === 1 &&
             count('corno') === 1 &&
             instr.length === 5;
    },
    description: '2 Trombe + 1 Trombone + 1 Tuba + 1 Corno. La formazione classica di ottoni.'
  },
  {
    name: 'String Ensemble',
    check: (instr) => {
      // Solo archi: Violino, Viola, Violoncello, Contrabbasso
      const archi = ['violino', 'viola', 'violoncello', 'contrabbasso'];
      const allArchi = instr.every(i => archi.includes(i.id));
      return allArchi && instr.length >= 6 && instr.length <= 12;
    },
    description: 'Un ensemble di soli archi con diverse combinazioni.'
  },
  {
    name: 'Wind Ensemble',
    check: (instr) => {
      // Solo fiati e ottoni: tutti gli strumenti a fiato
      const fiati = ['flauto', 'oboe', 'clarinetto', 'fagotto', 'sassofono', 'tromba', 'trombone', 'corno'];
      const allFiati = instr.every(i => fiati.includes(i.id));
      return allFiati && instr.length >= 6 && instr.length <= 12;
    },
    description: 'Un ensemble di fiati e ottoni per suoni brillanti e potenti.'
  },
  {
    name: 'Ensemble',
    check: (instr) => instr.length >= 6 && instr.length <= 12,
    description: 'Un gruppo flessibile di musicisti variato.'
  },
  {
    name: 'Orchestra',
    check: (instr) => instr.length > 12,
    description: 'Una grande formazione orchestrale.'
  },
];

let selectedInstruments = [];

document.addEventListener('DOMContentLoaded', () => {
  renderCarousel();
  setupScrollButton();
  setupDragZone();
});

/* ==================== CAROUSEL ==================== */

function renderCarousel() {
  const carousel = document.getElementById('instrumentsCarousel');
  carousel.innerHTML = '';

  INSTRUMENTS_LIST.forEach(instr => {
    const item = document.createElement('div');
    item.className = 'carouselItem';
    item.draggable = true;
    item.dataset.instrumentId = instr.id;
    
    const img = document.createElement('img');
    img.src = `img/strumenti/${instr.id}.webp`;
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
    
    carousel.appendChild(item);
  });

  updateArrowStates();
}

function scrollCarousel(direction) {
  const carousel = document.getElementById('instrumentsCarousel');
  const itemWidth = 90 + 12; // width + gap
  carousel.scrollBy({ left: direction * itemWidth * 3, behavior: 'smooth' });
  
  setTimeout(updateArrowStates, 300);
}

function updateArrowStates() {
  const carousel = document.getElementById('instrumentsCarousel');
  const arrowLeft = document.getElementById('arrowLeft');
  const arrowRight = document.getElementById('arrowRight');
  
  arrowLeft.disabled = carousel.scrollLeft <= 0;
  arrowRight.disabled = carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 10;
}

// Update arrow states on scroll
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('instrumentsCarousel');
  carousel.addEventListener('scroll', updateArrowStates);
});

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
}

function renderStage() {
  const container = document.getElementById('instrumentsOnStage');
  container.innerHTML = '';
  
  selectedInstruments.forEach((instr) => {
    const el = document.createElement('div');
    el.className = 'instrumentOnStage';
    el.dataset.uid = instr.uid;
    
    const img = document.createElement('img');
    img.src = `img/strumenti/${instr.id}.webp`;
    img.alt = instr.name;
    img.className = 'stageInstrumentImage';
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'removeBtn';
    removeBtn.innerHTML = '✕';
    removeBtn.onclick = () => removeInstrument(instr.uid);
    removeBtn.title = `Rimuovi ${instr.name}`;
    
    el.appendChild(img);
    el.appendChild(removeBtn);
    container.appendChild(el);
  });
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
}

/* ==================== RICONOSCIMENTO FORMAZIONE ==================== */

function checkFormazione() {
  if (selectedInstruments.length === 0) {
    document.getElementById('resultName').textContent = 'Scegli gli strumenti';
    document.getElementById('resultDescription').textContent = '';
    return;
  }
  
  for (const formazione of FORMAZIONI_RULES) {
    if (formazione.check(selectedInstruments)) {
      document.getElementById('resultName').textContent = '✨ ' + formazione.name;
      document.getElementById('resultDescription').textContent = formazione.description;
      return;
    }
  }
  
  const instrNames = selectedInstruments.map(i => i.name).join(', ');
  document.getElementById('resultName').textContent = '🎵 Combinazione libera';
  document.getElementById('resultDescription').textContent = 
    `Interessante! Hai creato: ${instrNames}. Questa combinazione non corrisponde a una formazione musicale tradizionale tra quelle studiate.`;
}

/* ==================== SCROLL TOP ==================== */

function setupScrollButton() {
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (!scrollBtn) return;

  const toggleScrollButton = () => {
    if (window.scrollY > 350) {
      scrollBtn.classList.add('show');
    } else {
      scrollBtn.classList.remove('show');
    }
  };

  window.addEventListener('scroll', toggleScrollButton, { passive: true });
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  toggleScrollButton();
}