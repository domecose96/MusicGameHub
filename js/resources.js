const MusicGameHubResources = (() => {
  const items = [
    {
      id: "elementiMusica",
      icon: "〰",
      type: "Teoria",
      title: "Suono ed elementi della musica",
      desc: "Eventi sonori, onde, frequenza, intensità, timbro, durata, udito e differenza tra suono e rumore.",
      tags: ["suono", "rumore", "ritmo", "melodia", "armonia", "onda sonora", "frequenza", "intensità", "timbro", "durata", "orecchio"],
      url: "elementi_musica.html",
      group: "theory"
    },
    {
      id: "teoriaBase",
      icon: "📚",
      type: "Teoria",
      title: "Teoria musicale",
      desc: "Risorsa principale con pentagramma, chiavi, note, figure, tempi, scale, simboli ed espressione.",
      tags: ["teoria base", "pentagramma", "chiavi", "note", "figure", "tempi", "scale", "simboli", "espressione"],
      url: "teoria.html",
      group: "theory",
      excludeFromStats: true
    },
    {
      id: "pentagramma",
      icon: "🎼",
      type: "Teoria",
      title: "Pentagramma",
      desc: "Spiegazione delle 5 righe, dei 4 spazi e dei tagli addizionali.",
      tags: ["pentagramma", "righe", "spazi", "tagli"],
      url: "teoria.html#pentagramma",
      group: "theory"
    },
    {
      id: "chiavi",
      icon: "𝄞",
      type: "Teoria",
      title: "Chiavi musicali",
      desc: "Famiglie di chiavi: Sol, Fa e Do, con posizionamento sulle righe.",
      tags: ["chiave di sol", "chiave di fa", "chiave di do"],
      url: "teoria.html#chiavi",
      group: "theory"
    },
    {
      id: "note",
      icon: "🎵",
      type: "Teoria",
      title: "Note sul pentagramma",
      desc: "Le 7 note musicali e la loro posizione in chiave di violino.",
      tags: ["do re mi", "note", "lettura"],
      url: "teoria.html#note",
      group: "theory"
    },
    {
      id: "figure",
      icon: "♩",
      type: "Teoria",
      title: "Figure musicali",
      desc: "Figure e pause musicali con i relativi valori ritmici.",
      tags: ["ritmo", "figure", "pause"],
      url: "teoria.html#figure",
      group: "theory"
    },
    {
      id: "tempi",
      icon: "⏱",
      type: "Teoria",
      title: "Tempi e metro",
      desc: "Come leggere l'indicazione di tempo e il raggruppamento delle pulsazioni.",
      tags: ["tempo", "metro", "misura"],
      url: "teoria.html#tempi",
      group: "theory"
    },
    {
      id: "scale",
      icon: "🎹",
      type: "Teoria",
      title: "Scale e tonalità",
      desc: "Schema delle scale, toni, semitoni e armatura di chiave.",
      tags: ["scale", "tonalità", "semitoni"],
      url: "teoria.html#scale",
      group: "theory"
    },
    {
      id: "simboli",
      icon: "♯",
      type: "Teoria",
      title: "Alterazioni e simboli",
      desc: "Diesis, bemolle, bequadro, armatura di chiave, ritornelli, segno, coda, Da Capo e Dal Segno.",
      tags: ["alterazioni", "diesis", "bemolle", "armatura", "ritornello", "segno", "coda", "da capo", "dal segno"],
      url: "teoria.html#simboli",
      group: "theory"
    },
    {
      id: "espressione",
      icon: "🎭",
      type: "Teoria",
      title: "Segni di espressione",
      desc: "Dinamica, articolazione e agogica: come suonare un brano.",
      tags: ["dinamica", "agogica", "articolazione"],
      url: "teoria.html#espressione",
      group: "theory"
    },
    {
      id: "teoriaAvanzata",
      icon: "🧠",
      type: "Teoria",
      title: "Teoria avanzata",
      desc: "Intervalli, accordi, rivolti, cadenze, modulazioni e forme musicali.",
      tags: ["intervalli", "accordi", "rivolti", "cadenze", "modulazioni", "forme"],
      url: "teoria_avanzata.html",
      group: "theory"
    },
    {
      id: "intervalliAvanzati",
      icon: "📏",
      type: "Teoria",
      title: "Intervalli",
      desc: "Distanze tra le note, semitoni, classificazione e qualità degli intervalli.",
      tags: ["intervalli", "semitoni", "distanze"],
      url: "teoria_avanzata.html#intervalli",
      group: "theory",
      excludeFromStats: true
    },
    {
      id: "accordiAvanzati",
      icon: "🎸",
      type: "Teoria",
      title: "Accordi",
      desc: "Triadi, combinazioni di note e costruzione armonica.",
      tags: ["accordi", "triadi", "armonia"],
      url: "teoria_avanzata.html#accordi",
      group: "theory",
      excludeFromStats: true
    },
    {
      id: "rivoltiAvanzati",
      icon: "🔄",
      type: "Teoria",
      title: "Rivolti",
      desc: "Disposizioni diverse dello stesso accordo cambiando la nota al basso.",
      tags: ["rivolti", "basso", "accordi"],
      url: "teoria_avanzata.html#rivolti",
      group: "theory",
      excludeFromStats: true
    },
    {
      id: "scaleMinoriAvanzate",
      icon: "🎹",
      type: "Teoria",
      title: "Scale minori",
      desc: "Scale minori e carattere armonico delle diverse strutture.",
      tags: ["scale minori", "tonalità", "modo minore"],
      url: "teoria_avanzata.html#minori",
      group: "theory",
      excludeFromStats: true
    },
    {
      id: "circoloQuinte",
      icon: "⭕",
      type: "Teoria",
      title: "Circolo delle quinte",
      desc: "Relazioni tra tonalità, diesis, bemolli e armature di chiave.",
      tags: ["circolo delle quinte", "tonalità", "armature"],
      url: "teoria_avanzata.html#circolo",
      group: "theory",
      excludeFromStats: true
    },
    {
      id: "cadenzeAvanzate",
      icon: "🎼",
      type: "Teoria",
      title: "Cadenze",
      desc: "Progressioni armoniche che concludono o sospendono una frase musicale.",
      tags: ["cadenze", "armonia", "frase musicale"],
      url: "teoria_avanzata.html#cadenze",
      group: "theory",
      excludeFromStats: true
    },
    {
      id: "modulazioniAvanzate",
      icon: "🧭",
      type: "Teoria",
      title: "Modulazioni",
      desc: "Cambi di tonalità attraverso accordi comuni, note comuni o dominanti.",
      tags: ["modulazioni", "tonalità", "accordi comuni"],
      url: "teoria_avanzata.html#modulazioni",
      group: "theory",
      excludeFromStats: true
    },
    {
      id: "ritmicaAvanzata",
      icon: "🥁",
      type: "Teoria",
      title: "Ritmica avanzata",
      desc: "Approfondimenti su organizzazione ritmica, accenti e complessità del tempo.",
      tags: ["ritmica", "accenti", "tempo"],
      url: "teoria_avanzata.html#ritmica",
      group: "theory",
      excludeFromStats: true
    },
    {
      id: "abbellimentiAvanzati",
      icon: "✨",
      type: "Teoria",
      title: "Abbellimenti",
      desc: "Ornamenti musicali e piccoli segni che arricchiscono la linea melodica.",
      tags: ["abbellimenti", "ornamenti", "melodia"],
      url: "teoria_avanzata.html#abbellimenti",
      group: "theory",
      excludeFromStats: true
    },
    {
      id: "formaAvanzata",
      icon: "🏗️",
      type: "Teoria",
      title: "Forma musicale",
      desc: "Struttura complessiva del brano, sezioni, ripetizioni e contrasti.",
      tags: ["forma", "struttura", "sezioni"],
      url: "teoria_avanzata.html#forma",
      group: "theory",
      excludeFromStats: true
    },
    {
      id: "detectiveSuono",
      icon: "〰",
      type: "Gioco",
      title: "Detective del suono",
      desc: "Riconosci suono e rumore, grave e acuto, forte e debole, lungo e corto.",
      tags: ["gioco", "suono", "rumore", "altezza", "intensità", "durata", "onda sonora"],
      url: "giochi/detective_suono.html",
      group: "games",
      homeGame: true,
      tag: "Suono"
    },
    {
      id: "pentagrammaGame",
      icon: "🎯",
      type: "Gioco",
      title: "Orientati sul pentagramma",
      desc: "Allenamento su righe, spazi e tagli addizionali.",
      tags: ["gioco", "pentagramma", "posizione"],
      url: "giochi/pentagramma_game.html",
      group: "games",
      homeGame: true,
      tag: "Pentagramma"
    },
    {
      id: "noteGame",
      icon: "𝄞",
      type: "Gioco",
      title: "Impara le Note",
      desc: "Indovina la nota sul pentagramma in chiave di violino o basso.",
      tags: ["gioco", "note", "chiavi"],
      url: "giochi/music_game.html",
      group: "games",
      homeGame: true,
      tag: "Note · Pentagramma"
    },
    {
      id: "figuresGame",
      icon: "♩",
      type: "Gioco",
      title: "Figure Musicali",
      desc: "Riconosci semibreve, minima, croma e valori ritmici.",
      tags: ["gioco", "ritmo", "figure"],
      url: "giochi/music_game_figures.html",
      group: "games",
      homeGame: true,
      tag: "Ritmo · Figure"
    },
    {
      id: "ritmo",
      icon: "♪",
      type: "Gioco",
      title: "Conta le pulsazioni",
      desc: "Calcola il valore ritmico delle sequenze.",
      tags: ["ritmo", "calcolo", "valori"],
      url: "giochi/ritmo_challenge.html",
      group: "games",
      homeGame: true,
      tag: "Ritmo"
    },
    {
      id: "scaleGame",
      icon: "🎹",
      type: "Gioco",
      title: "Ordina la scala",
      desc: "Costruisci scale maggiori e minori. Con Pro alleni tutte le maggiori, minori naturali, armoniche e melodiche.",
      tags: ["gioco", "scale", "tonalità", "toni", "semitoni", "modalità pro"],
      url: "giochi/scale_game.html",
      group: "games",
      homeGame: true,
      tag: "Scale · Pro"
    },
    {
      id: "intervalliGame",
      icon: "↔",
      type: "Gioco",
      title: "Gioco degli intervalli",
      desc: "Allenati a riconoscere e costruire intervalli musicali.",
      tags: ["gioco", "intervalli", "distanze", "teoria avanzata"],
      url: "giochi/intervalli_game.html",
      group: "games",
      homeGame: true,
      tag: "Intervalli"
    },
    {
      id: "ritmoBattuta",
      icon: "▦",
      type: "Gioco",
      title: "Completa la battuta",
      desc: "Inserisci le figure mancanti e completa correttamente il tempo musicale.",
      tags: ["gioco", "ritmo", "battuta", "tempi", "figure"],
      url: "giochi/ritmo_game.html",
      group: "games",
      homeGame: true,
      tag: "Ritmo · Battute"
    },
    {
      id: "battiTempo",
      icon: "♫",
      type: "Gioco",
      title: "Batti il Tempo",
      desc: "Leggi una battuta ritmica in 4/4 e riproducila cliccando a tempo.",
      tags: ["gioco", "ritmo", "tap", "ascolto", "tempi", "notazione"],
      url: "giochi/batti-il-tempo.html",
      group: "games",
      homeGame: true,
      tag: "Ritmo · Tap"
    },
    {
      id: "wordle",
      icon: "W",
      type: "Gioco",
      title: "Music Wordle",
      desc: "Indovina la parola musicale del giorno in 6 tentativi.",
      tags: ["vocabolario", "wordle", "giornaliero"],
      url: "giochi/wordle.html",
      group: "games",
      homeGame: true,
      daily: true,
      tag: "Vocabolario"
    },
    {
      id: "guanto",
      icon: "🏆",
      type: "Gioco",
      title: "Guanto di Sfida",
      desc: "Sfida mista in rifinitura: sarà disponibile dopo il nuovo controllo del gioco.",
      tags: ["quiz", "sfida", "classifica", "in arrivo"],
      url: "giochi/guanto.html",
      group: "games",
      homeGame: true,
      comingSoon: true,
      tag: "In arrivo"
    },
    {
      id: "strumentiGame",
      icon: "🎺",
      type: "Gioco",
      title: "Gioco degli strumenti",
      desc: "Riconosci strumenti, famiglie e timbri musicali.",
      tags: ["gioco", "strumenti", "famiglie", "timbro", "orchestra"],
      url: "giochi/strumenti_game.html",
      group: "games",
      homeGame: true,
      tag: "Strumenti"
    },
    {
      id: "storiaMusica",
      icon: "🕰️",
      type: "Percorso",
      title: "Storia della musica",
      desc: "Timeline didattica dalle origini alla musica contemporanea.",
      tags: ["storia", "timeline", "epoche", "autori"],
      url: "storia/storia_musica.html",
      group: "paths"
    },
    {
      id: "strumentiMusicali",
      icon: "🎺",
      type: "Percorso",
      title: "Strumenti musicali",
      desc: "Famiglie strumentali, imboccature, immagini e gioco di riconoscimento.",
      tags: ["strumenti", "famiglie", "imboccature", "orchestra"],
      url: "strumenti.html",
      group: "paths"
    },
    {
      id: "formazioniMusicali",
      icon: "🎼",
      type: "Percorso",
      title: "Formazioni musicali",
      desc: "Solista, duo, ensemble, orchestre e band: scopri come cambia l'organico strumentale.",
      tags: ["strumenti", "formazioni", "ensemble", "orchestra", "band", "solista", "duo", "trio"],
      url: "formazioni.html",
      group: "paths"
    },
    {
      id: "costruisciFormazione",
      icon: "🎛️",
      type: "Laboratorio",
      title: "Costruisci la formazione",
      desc: "Scegli gli strumenti, componi il palco e osserva quale formazione hai creato.",
      tags: ["strumenti", "formazioni", "laboratorio", "orchestra", "ensemble", "palco"],
      url: "costruisci-formazione.html",
      group: "paths"
    },
    {
      id: "fumettiMusicali",
      icon: "📖",
      type: "Percorso",
      title: "Vite a fumetti",
      desc: "Collana di fumetti verticali sulle vite dei grandi compositori.",
      tags: ["fumetti", "compositori", "mozart", "storia", "lettura", "biografie"],
      url: "fumetti/index.html",
      group: "paths"
    },
    {
      id: "classiDocente",
      icon: "🏫",
      type: "Percorso",
      title: "Classi e alunni",
      desc: "Area docente per creare classi, invitare alunni, leggere progressi ed esportare gli elenchi.",
      tags: ["classi", "alunni", "docente", "registro", "scuola", "invito", "dashboard", "csv"],
      url: "classi.html",
      group: "paths"
    },
    {
      id: "educazioneCivica",
      icon: "🌍",
      type: "Percorso",
      title: "Educazione civica",
      desc: "Indice dei percorsi musicali su cittadinanza, ascolto, emozioni, memoria, identità, ambiente e media digitali.",
      tags: ["educazione civica", "cittadinanza", "ascolto", "emozioni", "empatia", "memoria", "ambiente", "identità", "copyright", "media"],
      url: "educazione_civica/index.html",
      group: "paths"
    },
    {
      id: "ascoltoRispetto",
      icon: "🎵",
      type: "Percorso",
      title: "Ascolto, regole e rispetto",
      desc: "Percorso di cittadinanza musicale su ascolto, cura dell'udito, collaborazione e rispetto in classe.",
      tags: ["ascolto", "rispetto", "regole", "udito", "decibel", "classe", "collaborazione", "educazione civica"],
      url: "educazione_civica/ascolto_rispetto.html",
      group: "paths"
    },
    {
      id: "colonnaSonoraEmozioni",
      icon: "🎧",
      type: "Percorso",
      title: "La colonna sonora delle emozioni",
      desc: "Percorso su musica, ascolto emotivo, colori, empatia, inclusione e playlist della classe.",
      tags: ["emozioni", "empatia", "ascolto emotivo", "colori", "playlist", "inclusione", "classe", "educazione civica"],
      url: "educazione_civica/colonna_sonora_emozioni.html",
      group: "paths"
    },
    {
      id: "cantiMemoria",
      icon: "🕯️",
      type: "Percorso",
      title: "I canti della Memoria",
      desc: "Lezione sulla Giornata della Memoria attraverso ascolti, rispetto, storia e responsabilità.",
      tags: ["memoria", "shoah", "giornata della memoria", "gam gam", "donna donna", "diritti", "educazione civica"],
      url: "educazione_civica/canti_memoria.html",
      group: "paths"
    },
    {
      id: "innoItalia",
      icon: "🇮🇹",
      type: "Percorso",
      title: "L'Inno d'Italia",
      desc: "Lezione su simboli, autori, strofe, ritornello e identità nazionale.",
      tags: ["inno", "italia", "mameli", "novaro", "simboli"],
      url: "educazione_civica/inno_italia.html",
      group: "paths"
    },
    {
      id: "musicaAmbiente",
      icon: "🌿",
      type: "Percorso",
      title: "Musica e ambiente",
      desc: "Ascolti, suoni della natura, canzoni e riflessioni sulla sostenibilità.",
      tags: ["ambiente", "natura", "sostenibilità", "ascolto"],
      url: "educazione_civica/musica_ambiente.html",
      group: "paths"
    },
    {
      id: "copyrightMedia",
      icon: "🎧",
      type: "Percorso",
      title: "Rispetto, copyright e media",
      desc: "Lezione su copyright, licenze, uso corretto dei media, IA e buone abitudini digitali.",
      tags: ["copyright", "diritto d'autore", "licenze", "plagio", "pirateria", "media", "intelligenza artificiale"],
      url: "educazione_civica/rispetto_copyright_media.html",
      group: "paths"
    }
  ];

  const homeCards = [
    {
      id: "homeSoundElements",
      icon: "〰",
      title: "Suono ed elementi della musica",
      desc: "Eventi sonori, onde, altezza, intensità, timbro, durata e apparato uditivo.",
      tag: "Fondamenti",
      url: "elementi_musica.html",
      homeGroup: "theory"
    },
    {
      id: "homeTheory",
      icon: "📚",
      title: "Teoria musicale",
      desc: "Pentagramma, chiavi, note, figure, tempi, scale, simboli ed espressione.",
      tag: "Base",
      url: "teoria.html",
      homeGroup: "theory"
    },
    {
      id: "homeAdvancedTheory",
      icon: "📚",
      title: "Teoria avanzata",
      desc: "Intervalli, accordi, rivolti, cadenze, modulazioni e forme musicali.",
      tag: "Avanzata",
      url: "teoria_avanzata.html",
      homeGroup: "theory"
    },
    {
      id: "homeHistory",
      icon: "🕰️",
      title: "Storia della musica",
      desc: "Dalle origini alla musica contemporanea: esplora epoche, autori e trasformazioni.",
      tag: "Timeline",
      url: "storia/storia_musica.html",
      homeGroup: "paths"
    },
    {
      id: "homeStrumenti",
      icon: "🎺",
      title: "Strumenti musicali",
      desc: "Scopri famiglie, caratteristiche e curiosità degli strumenti musicali attraverso percorsi interattivi.",
      tag: "Esplora",
      url: "strumenti.html",
      homeGroup: "paths"
    },
    {
      id: "homeFormazioni",
      icon: "🎼",
      title: "Formazioni musicali",
      desc: "Dopo aver scoperto gli strumenti, esplora come si organizzano in solisti, ensemble, orchestre e band.",
      tag: "Strumenti",
      url: "formazioni.html",
      homeGroup: "paths",
      feature: {
        icon: "🎛️",
        title: "Laboratorio",
        text: "costruisci la tua formazione"
      }
    },
    {
      id: "homeFumetti",
      icon: "📖",
      title: "Vite a fumetti",
      desc: "Una collana illustrata per sfogliare le storie dei grandi compositori.",
      tag: "Collana",
      url: "fumetti/index.html",
      homeGroup: "paths"
    },
    {
      id: "homeClasses",
      icon: "🏫",
      title: "Classi e alunni",
      desc: "Crea classi, condividi link invito e controlla attività, studenti, leaderboard e soggetti.",
      tag: "Docente",
      url: "classi.html",
      homeGroup: "paths"
    },
    {
      id: "homeCivic",
      icon: "🌍",
      title: "Musica ed educazione civica",
      desc: "Percorsi didattici su identità, ambiente, cittadinanza, media e responsabilità.",
      tag: "Percorsi",
      url: "educazione_civica/index.html",
      homeGroup: "paths"
    },
    {
      id: "homeMap",
      icon: "🗺️",
      title: "Mappa delle risorse",
      desc: "Visualizza tutto il percorso del sito in modo dinamico.",
      tag: "Navigazione",
      url: "mappa.html"
    }
  ];

  const homeEntrypoints = [
    {
      id: "entryTheory",
      icon: "📚",
      title: "Teoria",
      desc: "Concetti, linguaggio musicale e approfondimenti.",
      tag: "Studia",
      target: "theoryHome"
    },
    {
      id: "entryPaths",
      icon: "🧭",
      title: "Percorsi",
      desc: "Lezioni tematiche per storia, strumenti ed educazione civica.",
      tag: "Esplora",
      target: "pathsHome"
    },
    {
      id: "entryGames",
      icon: "🎮",
      title: "Giochi",
      desc: "Esercizi interattivi per allenarti passo dopo passo.",
      tag: "Allenati",
      target: "games"
    },
    {
      id: "entryMap",
      icon: "🗺️",
      title: "Mappa",
      desc: "Guarda tutte le risorse del sito in una vista unica.",
      tag: "Orientati",
      url: "mappa.html"
    }
  ];

  const upcoming = [
    {
      id: "listening",
      icon: "🎧",
      title: "Ascolto guidato",
      desc: "Scopri e analizza brani musicali con percorsi guidati."
    }
  ].concat(items
    .filter(item => item.comingSoon)
    .map(item => ({
      id: item.id,
      icon: item.icon,
      title: item.title,
      desc: item.desc
    }))
  );

  const byId = Object.fromEntries(items.map(item => [item.id, item]));
  const homeGames = items.filter(item => item.homeGame);
  const playable = homeGames.filter(item => !item.comingSoon);
  const theoryTopics = items.filter(item => item.type === "Teoria" && !item.excludeFromStats);

  return { items, byId, homeCards, homeEntrypoints, upcoming, homeGames, playable, theoryTopics };
})();

window.MusicGameHubResources = MusicGameHubResources;
