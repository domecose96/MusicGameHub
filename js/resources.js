const MusicGameHubResources = (() => {
  const items = [
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
      id: "pentagrammaGame",
      icon: "🎯",
      type: "Gioco",
      title: "Orientati sul pentagramma",
      desc: "Allenamento su righe, spazi e tagli addizionali.",
      tags: ["gioco", "pentagramma", "posizione"],
      url: "pentagramma_game.html",
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
      url: "music_game.html",
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
      url: "music_game_figures.html",
      group: "games",
      homeGame: true,
      tag: "Ritmo · Figure"
    },
    {
      id: "wordle",
      icon: "W",
      type: "Gioco",
      title: "Music Wordle",
      desc: "Indovina la parola musicale del giorno in 6 tentativi.",
      tags: ["vocabolario", "wordle", "giornaliero"],
      url: "wordle.html",
      group: "games",
      homeGame: true,
      tag: "Vocabolario"
    },
    {
      id: "guanto",
      icon: "🏆",
      type: "Gioco",
      title: "Guanto di Sfida",
      desc: "Quiz misto su note, figure e teoria con classifica.",
      tags: ["quiz", "sfida", "classifica"],
      url: "guanto.html",
      group: "games",
      homeGame: true,
      tag: "Quiz · Sfida"
    },
    {
      id: "ritmo",
      icon: "♪",
      type: "Allenamento",
      title: "Ritmo Challenge",
      desc: "Calcola il valore ritmico delle sequenze.",
      tags: ["ritmo", "calcolo", "valori"],
      url: "ritmo_challenge.html",
      group: "practice",
      homeGame: true,
      tag: "Ritmo"
    },
    {
      id: "tempi",
      icon: "⏱",
      type: "Teoria",
      title: "Tempi e metro",
      desc: "Come leggere l'indicazione di tempo e il raggruppamento delle pulsazioni.",
      tags: ["tempo", "metro", "misura"],
      url: "teoria.html#tempi",
      group: "practice"
    },
    {
      id: "espressione",
      icon: "🎭",
      type: "Teoria",
      title: "Segni di espressione",
      desc: "Dinamica, articolazione e agogica: come suonare un brano.",
      tags: ["dinamica", "agogica", "articolazione"],
      url: "teoria.html#espressione",
      group: "practice"
    }
  ];

  const homeCards = [
    {
      id: "homeTheory",
      icon: "📚",
      title: "Teoria musicale",
      desc: "Pentagramma, chiavi, note, figure, scale, tempi ed espressione.",
      tag: "Base",
      url: "teoria.html"
    },
    {
      id: "homeGames",
      icon: "🎮",
      title: "Giochi interattivi",
      desc: "Allenati con sfide, quiz e giochi musicali già pronti.",
      tag: "Interattivo",
      target: "games"
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

  const upcoming = [
    {
      id: "history",
      icon: "🕰️",
      title: "Storia della musica",
      desc: "Dalle origini alla musica contemporanea."
    },
    {
      id: "civic",
      icon: "🌍",
      title: "Musica ed educazione civica",
      desc: "Musica, società, diritti, identità e cittadinanza."
    },
    {
      id: "listening",
      icon: "🎧",
      title: "Ascolto guidato",
      desc: "Scopri e analizza brani musicali con percorsi guidati."
    }
  ];

  const byId = Object.fromEntries(items.map(item => [item.id, item]));
  const playable = items.filter(item => item.homeGame);
  const theoryTopics = items.filter(item => item.type === "Teoria");

  return { items, byId, homeCards, upcoming, playable, theoryTopics };
})();

window.MusicGameHubResources = MusicGameHubResources;
