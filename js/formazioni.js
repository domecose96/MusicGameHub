/* ==================== FORMAZIONI MUSICALI - DATI ==================== */

const formazioniDB = {
  solista: {
    name: "Solista",
    image: "img/formazioni/solista.webp",
    scale: 0.78,
    x: -2,
    y: -3,
    musicians: "1 persona",
    instruments: "Pianoforte, violino, flauto, voce, chitarra, cello...",
    context: "Concerti da camera, recital, esibizioni da solista",
    description: `Il solista è un musicista che si esibisce da solo, senza accompagnamento. Può suonare uno strumento 
      o cantare, e il suo talento e la sua interpretazione sono il fulcro dello spettacolo. È una delle formazioni 
      più antiche e nobili della musica classica.`,
    curiosita: `Molti solisti famosi, come Niccolò Paganini, erano virtuosi del loro strumento e stupivano il pubblico 
      con esibizioni incredibili. Oggi, i solisti continuano ad essere protagonisti dei concerti più importanti e 
      delle trasmissioni musicali.`
  },

  duo: {
    name: "Duo",
    image: "img/formazioni/duo.webp",
    scale: 0.78,
    x: 0,
    y: -1,
    musicians: "2 persone",
    instruments: "Pianoforte e violino, due pianoforti, voce e pianoforte...",
    context: "Concerti da camera, duo pianistici, collaborazioni soliste",
    description: `Il duo è una formazione di due musicisti che suonano insieme in armonia. Può essere una voce e pianoforte,
      due violini, oppure due strumenti diversi. È una formazione intima che permette un dialogo musicale profondo tra i performer.`,
    curiosita: `I duo sono molto comuni nella musica classica: basta pensare ai grandi lieder (canzoni) per voce e pianoforte 
      di compositori come Schubert e Schumann. Anche nel jazz il duo è una formazione importante.`
  },

  trio: {
    name: "Trio",
    image: "img/formazioni/trio.webp",
    scale: 0.78,
    x: 0,
    y: -4,
    musicians: "3 persone",
    instruments: "Violino, violoncello e pianoforte (trio d'archi e pianoforte), oppure altri strumenti...",
    context: "Concerti da camera, serate musicali, festival classici",
    description: `Il trio è una formazione di tre musicisti. Il trio d'archi e pianoforte è una delle composizioni più importanti 
      della musica da camera. Permette un equilibrio perfetto tra strumenti a fiato, archi e tastiera.`,
    curiosita: `Mozart, Beethoven e Brahms hanno scritto magnifici concerti per trio. Questa formazione è considerata 
      uno dei pilastri della musica da camera e rappresenta un equilibrio perfetto tra i diversi timbri strumentali.`
  },

  quartetto: {
    name: "Quartetto",
    image: "img/formazioni/quartetto.webp",
    scale: 0.78,
    x: 0,
    y: -5,
    musicians: "4 persone",
    instruments: "Due violini, viola e violoncello (quartetto d'archi) oppure altri strumenti",
    context: "Concerti da camera, rassegne musicali, conservatori",
    description: `Il quartetto d'archi è la formazione più prestigiosa della musica da camera. Composto da due violini, una viola 
      e un violoncello, rappresenta il pinnacolo dell'arte cameristica. Ogni musicista ha un ruolo importante e il dialogo 
      tra gli strumenti è centrale.`,
    curiosita: `Beethoven ha scritto 16 quartetti d'archi che sono considerati tra le opere più profonde della musica occidentale. 
      Un buon quartetto d'archi è formato da musicisti che suonano insieme da molti anni e sviluppano una comprensione musicale quasi telepatiaca.`
  },

  quintetto: {
    name: "Quintetto",
    image: "img/formazioni/quintetto.webp",
    scale: 0.63,
    x: 0,
    y: -6,
    musicians: "5 persone",
    instruments: "Quartetto d'archi + pianoforte, oppure quartetto d'archi + clarinetto o flauto...",
    context: "Concerti da camera, serate musicali classiche, conservatori",
    description: `Il quintetto aggiunge un quinto musicista al quartetto, generalmente un pianoforte o uno strumento a fiato. 
      Questa aggiunta crea nuove possibilità sonore e permette composizioni più complesse e ricche di colore.`,
    curiosita: `Il Quintetto per pianoforte e archi K.515 di Mozart è uno dei capolavori della musica da camera. 
      L'aggiunta del pianoforte dà al quintetto una dimensione sonora completamente diversa rispetto al quartetto d'archi.`
  },

  ensemble: {
    name: "Ensemble",
    image: "img/formazioni/ensemble.webp",
    scale: 0.68,
    x: 0,
    y: -5,
    musicians: "Generalmente 6-12 persone, ma può variare",
    instruments: "Mix di archi, fiati e talvolta percussioni; dipende dal tipo di ensemble",
    context: "Concerti da camera, musica contemporanea, musica barocca, colonne sonore",
    description: `L'ensemble è un gruppo di musicisti di varie grandezze che suonano insieme. A differenza delle formazioni tradizionali,
      l'ensemble può essere molto flessibile nella sua composizione. Può includere archi, fiati, tastiere e persino strumenti percussivi.`,
    curiosita: `Nella musica moderna e contemporanea, gli ensemble sono molto comuni. Anche nella musica barocca gli ensemble erano 
      usati frequentemente. Il termine è molto versatile e indica genericamente un gruppo di musicisti.`
  },

  "orchestra-barocca": {
    name: "Orchestra Barocca",
    image: "img/formazioni/orchestra-barocca.webp",
    scale: 0.68,
    x: 0,
    y: -6,
    musicians: "Di solito 20-30 musicisti",
    instruments: "Archi, oboi, trombe, trombone, corni, continuo (clavicembalo o arciliuto)",
    context: "Musica barocca (XVII-XVIII sec.), concerti concertanti, festival barocchi",
    description: `L'orchestra barocca è la formazione orchestrale della musica barocca. Ha un suono più leggero e articolato rispetto 
      all'orchestra moderna, con meno archi e l'uso del continuo (clavicembalo) che accompagna l'intera orchestra. La direzione 
      spesso veniva data dal primo violino anziché da un direttore d'orchestra.`,
    curiosita: `Vivaldi, Bach e Haendel hanno scritto capolavori per orchestra barocca. Vivaldi ha composto 
      le Quattro Stagioni, uno dei concerti più celebri di tutti i tempi, per questo tipo di orchestra.`
  },

  "orchestra-camera": {
    name: "Orchestra da Camera",
    image: "img/formazioni/orchestra-camera.webp",
    scale: 0.72,
    x: 0,
    y: -7,
    musicians: "Generalmente 30-50 musicisti",
    instruments: "Archi, fiati (oboi, clarinetti, corni, trombe), timpani e talvolta altri strumenti",
    context: "Musica classica e romantica, concerti sinfonici, festival musicali",
    description: `L'orchestra da camera è una formazione intermedia tra la musica da camera e la grande orchestra. 
      Ha una dimensione più intima rispetto alla grande orchestra sinfonica, ma è più grande di un ensemble. 
      Mantiene chiarezza e dettaglio nella composizione orchestrale.`,
    curiosita: `Molti musicisti preferiscono suonare in orchestra da camera perché permette una grande chiarezza 
      e trasparenza del suono. Anche oggi ci sono orchestre da camera molto prestigiose che registrano e si esibiscono 
      nei concerti più importanti.`
  },

  "orchestra-romantica": {
    name: "Orchestra Romantica",
    image: "img/formazioni/orchestra-romantica.webp",
    scale: 0.64,
    x: 0,
    y: -1,
    musicians: "Di solito 80-100 musicisti o più",
    instruments: "Archi numerosi, legni (flauti, oboi, clarinetti), ottoni (corni, trombe, tromboni), percussioni",
    context: "Musica romantica (XIX sec.), sinfonie, poemi sinfonici, balletti",
    description: `L'orchestra romantica è la grande orchestra sinfonica così come la conosciamo oggi. Ha un organico molto più grande 
      rispetto alle orchestre precedenti, con sezioni di archi molto numerose e l'uso esteso di ottoni e percussioni. 
      Questo permette effetti sonori molto più potenti e variegati.`,
    curiosita: `Beethoven, Brahms, Čajkovskij e Wagner hanno scritto per questa orchestra. La Nona Sinfonia di Beethoven 
      è uno dei capolavori scritti per orchestra romantica. Wagner ha introdotto nuovi strumenti come il trombone basso 
      e ha espanso l'orchestra a dimensioni senza precedenti.`
  },

  banda: {
    name: "Banda",
    image: "img/formazioni/banda.webp",
    scale: 0.72,
    x: 0,
    y: -1,
    musicians: "Generalmente 40-80 musicisti",
    instruments: "Ottoni (trombe, corni, tromboni), legni (clarinetti, sassofoni, flauti), percussioni, talvolta archi",
    context: "Musiche di piazza, festival estivi, concerti pubblici, marce militari",
    description: `La banda è una formazione molto diffusa in Italia e nel mondo, composta principalmente da ottoni e legni. 
      A differenza dell'orchestra sinfonica, la banda non ha archi (o li ha molto raramente) e produce un suono brillante e squillante. 
      È una formazione accessibile e democratica che coinvolge molti musicisti amatoriali.`,
    curiosita: `In Italia, quasi ogni paese ha una banda musicale locale. Le bande hanno una lunga tradizione popolare e sono 
      spesso protagoniste di festività e celebrazioni pubbliche. La banda è anche parte importante della tradizione militare e civile.`
  },

  fanfara: {
    name: "Fanfara",
    image: "img/formazioni/fanfara.webp",
    scale: 0.72,
    x: 0,
    y: -3,
    musicians: "Di solito 8-20 musicisti",
    instruments: "Trombe, corni, tromboni, percussioni, talvolta clarinetti",
    context: "Marce, celebrazioni ufficiali, cortei, cerimonie",
    description: `La fanfara è una piccola formazione di ottoni e percussioni, più ridotta di una banda. È nata dall'esigenza di avere 
      gruppi musicali mobili e portabili. Produce un suono brillante e potente nonostante il numero ridotto di musicisti. 
      La fanfara è spesso usata in contesti ufficiali e celebrativi.`,
    curiosita: `Ancora oggi le fanfare sono molto usate in ambito militare e civile. La famosa fanfara dei Carabinieri è una delle 
      più riconoscibili d'Italia. Nel cinema e in televisione, le fanfare vengono spesso usate per accompagnare scene di parata o cerimonia.`
  },

  "jazz-band": {
    name: "Jazz Band",
    image: "img/formazioni/jazz-band.webp",
    scale: 0.78,
    x: 0,
    y: -4,
    musicians: "Generalmente 5-15 musicisti",
    instruments: "Sax, trombe, tromboni, pianoforte, contrabbasso, batteria, talvolta chitarra",
    context: "Jazz, swing, concerti jazz, club musicali, festival jazz",
    description: `La jazz band è una formazione nata negli Stati Uniti all'inizio del XX secolo. Combina archi pizzicati, ottoni e 
      una ritmica moderna (pianoforte, contrabbasso, batteria). È una formazione flessibile dove l'improvvisazione è fondamentale. 
      Ogni musicista ha ampio spazio per esprimere la propria creatività.`,
    curiosita: `Louis Armstrong, Duke Ellington e Miles Davis sono leggende del jazz che hanno definito il suono della jazz band. 
      Il jazz è uno stile dove l'improvvisazione è essenziale: ogni esibizione è diversa dalla precedente, anche della stessa canzone.`
  },

  "rock-band": {
    name: "Rock Band",
    image: "img/formazioni/rock-band.webp",
    scale: 0.78,
    x: 0,
    y: -4,
    musicians: "Di solito 3-5 persone",
    instruments: "Chitarra elettrica, basso elettrico, batteria, tastiere, voce",
    context: "Rock, pop, concerti moderni, festival musicali",
    description: `La rock band è la formazione per eccellenza della musica rock e pop moderna. Composta da chitarra, basso, batteria 
      e voce, ha rivoluzionato la musica nel XX secolo. È una formazione molto democratica dove spesso i musicisti scrivono insieme 
      le loro canzoni e creano il loro stile personale.`,
    curiosita: `I Beatles, i Rolling Stones e Pink Floyd sono tra le rock band più influenti della storia. 
      La formazione classica rock è stata fonte di ispirazione per milioni di giovani musicisti nel mondo.`
  }
};

/* ==================== FUNZIONE PRINCIPALE ==================== */

function showFormazione(key, buttonElement) {
  const formazione = formazioniDB[key];
  if (!formazione) return;

  // Update navbar - add active class
  document.querySelectorAll('#siteNav.formazioniNav .navBtn').forEach(btn => {
    btn.classList.remove('active');
  });

  if (buttonElement) {
    buttonElement.classList.add('active');
  }

  // Get DOM elements
  const imageEl = document.getElementById('formazioneImage');
  const titleEl = document.getElementById('formazioneName');
  const musiciansEl = document.getElementById('detailMusicians');
  const instrumentsEl = document.getElementById('detailInstruments');
  const contextEl = document.getElementById('detailContext');
  const descEl = document.getElementById('detailDescription');
  const curiosEl = document.getElementById('detailCuriosita');

  // Fade out image
  imageEl.style.opacity = '0';

  setTimeout(() => {

    titleEl.textContent = formazione.name;
    musiciansEl.textContent = formazione.musicians;
    instrumentsEl.textContent = formazione.instruments;
    contextEl.textContent = formazione.context;
    descEl.textContent = formazione.description;
    curiosEl.textContent = formazione.curiosita;

    imageEl.src = formazione.image;
    imageEl.alt = formazione.name + " sul palco";

    // POSIZIONE E DIMENSIONE PERSONALIZZATE
    imageEl.style.transform =
      `translate(${formazione.x || 0}%, ${formazione.y || 0}%)
       scale(${formazione.scale || 0.78})`;

    setTimeout(() => {
      imageEl.style.opacity = '1';
    }, 50);

  }, 300);
}

/* ==================== INIT - SET FIRST BUTTON ACTIVE ==================== */

document.addEventListener('DOMContentLoaded', () => {
  // Set first button as active and show solista
  const firstBtn = document.querySelector('#siteNav.formazioniNav .navBtn');
  if (firstBtn) {
    firstBtn.classList.add('active');
    showFormazione('solista', firstBtn);
  }

  // Scroll top button
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (scrollBtn) {
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
});