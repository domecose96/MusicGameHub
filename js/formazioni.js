/* ==================== FORMAZIONI MUSICALI - DATI ==================== */

const formazioniDB = {
  solista: {
    name: "Solista",
    image: "img/formazioni/solista.webp",
    scale: 0.78,
    x: -2,
    y: -3,
    musicians: "1 persona",
    instruments: "Pianoforte, violino, flauto, voce, chitarra, violoncello...",
    context: "Recital, concerti da camera, prove di tecnica e interpretazione",
    description: `Il solista è un musicista che presenta da solo un brano o una parte musicale. Può esibirsi senza accompagnamento
      oppure con orchestra, pianoforte o base strumentale. Questa formazione permette di ascoltare con chiarezza timbro, tecnica, fraseggio
      e scelte interpretative dell'esecutore.`,
    curiosita: `Nel repertorio occidentale il solista ha un ruolo importante sia nei recital sia nei concerti con orchestra. In classe è utile
      per riconoscere il carattere di uno strumento e capire come un singolo musicista costruisce melodia, ritmo e dinamica.`
  },

  duo: {
    name: "Duo",
    image: "img/formazioni/duo.webp",
    scale: 0.78,
    x: 0,
    y: -1,
    musicians: "2 persone",
    instruments: "Pianoforte e violino, due pianoforti, voce e pianoforte...",
    context: "Musica da camera, lieder, prove di ascolto reciproco",
    description: `Il duo è formato da due musicisti che condividono melodia, accompagnamento o dialogo musicale. Può unire due strumenti uguali,
      due strumenti diversi oppure voce e strumento. Richiede grande attenzione reciproca, perché ogni parte è facilmente percepibile
      dall'ascoltatore.`,
    curiosita: `Il duo voce e pianoforte è molto presente nel Lied tedesco dell'Ottocento, mentre i duo strumentali sono frequenti nella musica
      da camera. È una formazione efficace per studiare domanda e risposta tra due linee musicali.`
  },

  trio: {
    name: "Trio",
    image: "img/formazioni/trio.webp",
    scale: 0.78,
    x: 0,
    y: -4,
    musicians: "3 persone",
    instruments: "Violino, violoncello e pianoforte; trio d'archi; trio di fiati...",
    context: "Musica da camera, saggi, piccoli concerti",
    description: `Il trio riunisce tre musicisti e può assumere organici diversi. Nel repertorio classico è frequente il trio con pianoforte,
      formato da violino, violoncello e pianoforte. La presenza di tre parti permette contrasti, imitazioni e un dialogo più articolato
      rispetto al duo.`,
    curiosita: `Molti compositori, tra cui Haydn, Mozart, Beethoven, Schubert e Brahms, hanno scritto trii da camera. Con tre strumenti
      è possibile distinguere facilmente melodia principale, accompagnamento e controcanto.`
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
    description: `Il quartetto indica una formazione di quattro musicisti. Il quartetto d'archi, con due violini, viola e violoncello,
      è uno degli organici più studiati nella musica da camera. Ogni strumento può avere funzione melodica, armonica o ritmica,
      creando un dialogo molto equilibrato.`,
    curiosita: `Haydn contribuì in modo decisivo allo sviluppo del quartetto d'archi nel Settecento. Mozart, Beethoven, Schubert e molti altri
      compositori usarono questa formazione per lavorare con grande chiarezza su temi, imitazioni e contrasti.`
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
    description: `Il quintetto è formato da cinque musicisti e può avere combinazioni diverse. Sono comuni il quintetto con pianoforte,
      il quintetto d'archi e il quintetto di fiati. L'aggiunta di una quinta parte amplia il colore sonoro e rende più ricca
      la distribuzione delle voci.`,
    curiosita: `Nel repertorio classico esistono quintetti per archi, per pianoforte e archi e per strumenti a fiato. Mozart scrisse quintetti
      d'archi e anche il celebre Quintetto per clarinetto K. 581, esempio utile per ascoltare il dialogo tra timbri diversi.`
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
    description: `Il termine ensemble indica un gruppo di musicisti con organico variabile. Può essere formato da archi, fiati, tastiere,
      percussioni o strumenti elettronici, a seconda del repertorio. È una formazione flessibile, spesso usata quando il brano richiede
      colori particolari.`,
    curiosita: `Nel Novecento e nella musica contemporanea molti compositori hanno scritto per ensemble misti. Il termine è utile perché
      non indica un numero fisso di strumenti, ma un gruppo organizzato per realizzare una precisa idea musicale.`
  },

  "orchestra-barocca": {
    name: "Orchestra Barocca",
    image: "img/formazioni/orchestra-barocca.webp",
    scale: 0.68,
    x: 0,
    y: -6,
    musicians: "Di solito 20-30 musicisti",
    instruments: "Archi, oboi, fagotti, trombe, corni e basso continuo",
    context: "Musica barocca (XVII-XVIII sec.), concerti concertanti, festival barocchi",
    description: `L'orchestra barocca si sviluppò tra Seicento e prima metà del Settecento. Di solito aveva un organico più ridotto
      dell'orchestra moderna e usava il basso continuo, spesso realizzato da clavicembalo, organo o strumenti gravi. Il suono risulta
      chiaro, articolato e molto legato alla danza.`,
    curiosita: `Vivaldi, Bach e Handel scrissero molta musica per organici barocchi. In quel periodo la direzione non era sempre affidata
      a un direttore separato: spesso il primo violino o il tastierista guidava l'esecuzione.`
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
    description: `L'orchestra da camera è più piccola di una grande orchestra sinfonica, ma più ampia delle formazioni da camera
      tradizionali. Può eseguire repertori dal periodo classico alla musica contemporanea. Le dimensioni ridotte permettono maggiore
      trasparenza tra le parti e un ascolto più dettagliato.`,
    curiosita: `Molte orchestre da camera lavorano senza sezioni troppo numerose, così il pubblico può distinguere meglio archi, fiati
      e interventi solistici. È una formazione adatta a sale non troppo grandi e a repertori che richiedono equilibrio.`
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
    description: `Nel XIX secolo l'orchestra si ampliò progressivamente rispetto ai modelli classici. Aumentarono le sezioni degli archi,
      crebbe il ruolo di ottoni e percussioni e si cercarono colori sonori più intensi. Questa formazione è legata a sinfonie, poemi
      sinfonici, opere e balletti romantici.`,
    curiosita: `Compositori come Berlioz, Wagner, Brahms, Verdi e Čajkovskij sfruttarono le possibilità della grande orchestra ottocentesca.
      Lo studio dell'orchestrazione divenne sempre più importante per combinare timbri, dinamiche e masse sonore.`
  },

  banda: {
    name: "Banda",
    image: "img/formazioni/banda.webp",
    scale: 0.72,
    x: 0,
    y: -1,
    musicians: "Generalmente 40-80 musicisti",
    instruments: "Legni, ottoni e percussioni; in alcuni casi strumenti aggiunti",
    context: "Musiche di piazza, festival estivi, concerti pubblici, marce militari",
    description: `La banda musicale è una formazione composta soprattutto da strumenti a fiato e percussioni. È adatta a suonare all'aperto,
      in cortei, feste civili e concerti pubblici. Rispetto all'orchestra sinfonica usa raramente gli archi e privilegia un suono diretto,
      brillante e ben proiettato.`,
    curiosita: `In Italia le bande hanno avuto un forte ruolo educativo e sociale, soprattutto nei paesi e nelle città. Hanno contribuito
      alla diffusione della musica, permettendo a molti studenti e appassionati di imparare uno strumento.`
  },

  fanfara: {
    name: "Fanfara",
    image: "img/formazioni/fanfara.webp",
    scale: 0.72,
    x: 0,
    y: -3,
    musicians: "Di solito 8-20 musicisti",
    instruments: "Ottoni, percussioni e talvolta altri fiati",
    context: "Marce, celebrazioni ufficiali, cortei, cerimonie",
    description: `La fanfara è una formazione di fiati, soprattutto ottoni, e percussioni. È pensata per esecuzioni mobili, cerimonie,
      segnali musicali e marce. Rispetto alla banda ha spesso un organico più ridotto e un carattere più compatto, con forte presenza
      ritmica.`,
    curiosita: `Storicamente le fanfare sono legate anche all'ambito militare e cerimoniale, dove il suono degli ottoni era utile per
      richiamare l'attenzione. Oggi possono essere presenti in parate, celebrazioni e contesti civili.`
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
    description: `La jazz band si sviluppò negli Stati Uniti tra la fine dell'Ottocento e l'inizio del Novecento. Può includere una sezione
      ritmica, strumenti a fiato e talvolta chitarra o voce. L'improvvisazione, il ritmo sincopato e il dialogo tra solisti e gruppo sono
      elementi centrali.`,
    curiosita: `Nel jazz lo stesso tema può essere riproposto in modi diversi a ogni esecuzione. Le formazioni possono andare dal piccolo
      combo alla big band, con sezioni organizzate di sassofoni, trombe, tromboni e ritmica.`
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
    description: `La rock band è una formazione tipica della musica popular del secondo Novecento. Di solito comprende voce, chitarra
      elettrica, basso elettrico e batteria, con eventuali tastiere. L'amplificazione permette un suono energico e adatto a sale, club
      e grandi spazi.`,
    curiosita: `Nella rock band ogni strumento ha una funzione riconoscibile: la batteria sostiene il ritmo, il basso collega ritmo e armonia,
      la chitarra può accompagnare o suonare assoli, mentre la voce guida spesso il testo e la melodia.`
  }
};

/* ==================== FUNZIONE PRINCIPALE ==================== */

function showFormazione(key, buttonElement, shouldScroll = true) {
  const formazione = formazioniDB[key];
  if (!formazione) return;

  // Update navbar - add active class
  document.querySelectorAll('#siteNav.formazioniNav .navBtn').forEach(btn => {
    btn.classList.remove('active');
  });

  if (buttonElement) {
    buttonElement.classList.add('active');
  }

  if (shouldScroll) {
    requestAnimationFrame(() => {
      scrollToFormazioneSection();
      buttonElement?.classList.add('active');
    });
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

function scrollToFormazioneSection() {
  const section = document.getElementById('formazioneSection');
  if (!section) return;

  const headerHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--header-height'),
    10
  ) || 112;
  const navHeight = document.getElementById('siteNav')?.offsetHeight || 0;
  const top = section.getBoundingClientRect().top + window.scrollY - headerHeight - navHeight - 10;

  window.scrollTo({ top, behavior: 'smooth' });
}

/* ==================== INIT - SET FIRST BUTTON ACTIVE ==================== */

document.addEventListener('DOMContentLoaded', () => {
  // Set first button as active and show solista
  const firstBtn = document.querySelector('#siteNav.formazioniNav .navBtn');
  if (firstBtn) {
    firstBtn.classList.add('active');
    showFormazione('solista', firstBtn, false);
  }

});
