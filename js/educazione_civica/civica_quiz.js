(() => {
  const banks = {
    listeningRespect: [
      q("Che cosa significa ascoltare in modo rispettoso?", "Lasciare parlare e provare a capire", ["Interrompere subito", "Ridicolizzare l'errore"]),
      q("Per proteggere l'udito è importante...", "Evitare volumi troppo alti per molto tempo", ["Alzare sempre il volume", "Usare cuffie al massimo"]),
      q("Quando un compagno sbaglia durante un'attività musicale...", "lo aiuto con parole gentili", ["lo prendo in giro", "lo ignoro sempre"]),
      q("Il turno di parola serve a...", "dare spazio a tutti", ["far parlare solo chi sa già tutto", "rallentare la classe"]),
      q("Una regola utile durante l'ascolto è...", "restare in silenzio mentre il brano suona", ["parlare sopra la musica", "cambiare brano senza motivo"]),
      q("Collaborare in musica significa...", "mettere la propria parte al servizio del gruppo", ["suonare più forte degli altri", "decidere sempre da soli"]),
      q("Un suono molto intenso per lungo tempo può...", "affaticare l'orecchio", ["migliorare sempre l'udito", "non avere mai conseguenze"]),
      q("Se non capisco una consegna musicale, posso...", "chiedere spiegazioni con rispetto", ["disturbare chi lavora", "dire che è tutto inutile"]),
      q("Durante una prova di gruppo è corretto...", "ascoltare anche le parti degli altri", ["seguire solo il proprio strumento", "coprire tutti con il volume"]),
      q("Una critica utile deve essere...", "precisa e gentile", ["offensiva", "detta per umiliare"]),
      q("Il silenzio in musica può servire a...", "ascoltare meglio e prepararsi", ["punire la classe", "rendere inutile l'attività"]),
      q("Quando ascolto un compagno, mostro attenzione se...", "guardo, aspetto e rispondo sul tema", ["parlo con altri", "cambio argomento"]),
      q("Una classe che ascolta bene...", "rispetta tempi, turni e differenze", ["premia solo chi parla di più", "esclude chi è timido"]),
      q("La cura dell'udito riguarda...", "responsabilità personale e rispetto degli altri", ["solo i tecnici audio", "solo i musicisti professionisti"]),
      q("Prima di intervenire in una discussione musicale è meglio...", "aver ascoltato fino in fondo", ["decidere subito chi ha torto", "alzare la voce"])
    ],
    anthem: [
      q("Chi scrisse il testo dell'Inno d'Italia?", "Goffredo Mameli", ["Giuseppe Verdi", "Michele Novaro"]),
      q("Chi compose la musica dell'Inno d'Italia?", "Michele Novaro", ["Goffredo Mameli", "Alessandro Manzoni"]),
      q("L'Inno d'Italia è legato soprattutto a...", "identità nazionale e storia del Risorgimento", ["pubblicità televisive", "musica da ballo"]),
      q("Quando si ascolta l'inno in una cerimonia è corretto...", "mantenere un atteggiamento rispettoso", ["ridere e disturbare", "cambiare parole per scherzo"]),
      q("La parola 'Fratelli' richiama l'idea di...", "unità e appartenenza", ["competizione tra regioni", "isolamento personale"]),
      q("Studiare l'inno significa anche...", "capire simboli e valori civici", ["imparare solo una melodia", "evitare la storia"]),
      q("L'inno nazionale rappresenta...", "una comunità e la sua memoria", ["un gusto musicale privato", "una canzone qualunque"]),
      q("Il Tricolore è un simbolo...", "della Repubblica italiana", ["di una squadra", "di un social network"]),
      q("Il rispetto dell'inno non obbliga a...", "pensare tutti nello stesso modo", ["avere attenzione", "conoscere il contesto"]),
      q("Il contesto storico dell'inno è importante perché...", "aiuta a comprenderne il significato", ["sostituisce l'ascolto", "rende inutile il testo"]),
      q("Durante l'inno, cantare insieme può creare...", "senso di partecipazione", ["disprezzo", "esclusione automatica"]),
      q("Un simbolo civico va trattato...", "con consapevolezza e rispetto", ["come uno scherzo senza conseguenze", "solo se piace musicalmente"]),
      q("L'inno può essere usato a scuola per parlare di...", "cittadinanza e memoria condivisa", ["classifiche musicali", "moda del momento"]),
      q("Conoscere autore e compositore serve a...", "dare contesto all'opera", ["decidere chi canta meglio", "evitare di leggere il testo"]),
      q("Una discussione corretta sull'inno deve...", "rispettare opinioni e simboli", ["offendere chi la pensa diversamente", "ignorare la Costituzione"])
    ],
    memorySongs: [
      q("Perché ascoltare i canti della Memoria?", "Per collegare storia, emozioni e responsabilità", ["Solo per conoscere canzoni famose", "Solo per studiare tecnica vocale"]),
      q("Prima di ascoltare un canto storico è importante conoscere...", "il contesto e il significato del brano", ["la posizione in classifica", "solo il volume corretto"]),
      q("Un comportamento corretto durante l'ascolto è...", "ascoltare con attenzione e rispetto", ["ridicolizzare parole o lingua", "distrarsi apposta"]),
      q("La memoria serve soprattutto a...", "capire il passato per agire meglio nel presente", ["dimenticare il passato", "preparare solo una verifica"]),
      q("Un canto storico può trasmettere...", "dolore, speranza e dignità", ["solo intrattenimento leggero", "solo rumore"]),
      q("Parlare di memoria in classe richiede...", "linguaggio rispettoso", ["battute offensive", "indifferenza"]),
      q("Un brano legato alla Shoah va ascoltato...", "con consapevolezza del contesto", ["come sottofondo casuale", "senza spiegazioni"]),
      q("La musica della memoria aiuta a...", "dare voce a storie e persone", ["cancellare i fatti", "semplificare tutto in uno slogan"]),
      q("Quando un compagno si commuove ascoltando un canto...", "rispetto la sua reazione", ["lo derido", "gli dico che sbaglia"]),
      q("Un ascolto responsabile collega...", "suono, testo e storia", ["solo volume", "solo velocità"]),
      q("Ricordare è anche una responsabilità verso...", "il futuro", ["la distrazione", "l'oblio"]),
      q("Le parole di un canto storico vanno...", "lette con attenzione", ["cambiate per scherzo", "ignorate sempre"]),
      q("Un canto può diventare testimonianza quando...", "racconta esperienze e valori", ["serve solo a riempire tempo", "non ha contesto"]),
      q("Durante un confronto sulla memoria è importante...", "ascoltare senza banalizzare", ["fare paragoni offensivi", "interrompere chi parla"]),
      q("Studiare i canti della Memoria aiuta a riconoscere...", "dignità, diritti e responsabilità", ["solo generi musicali", "solo strumenti"])
    ],
    environmentMusic: [
      q("Quale suono appartiene spesso al paesaggio naturale?", "pioggia", ["clacson continuo", "trapano acceso"]),
      q("Che cosa significa sostenibilità?", "Rispettare l'ambiente", ["Consumare senza limiti", "Produrre più rifiuti"]),
      q("Con cosa possiamo costruire strumenti ecologici?", "Materiali riciclati", ["Solo strumenti costosi", "Plastica nuova"]),
      q("Ascoltare la natura può aiutare a...", "riconoscere e rispettare l'ambiente", ["ignorare i luoghi", "aumentare l'inquinamento"]),
      q("Un paesaggio sonoro è...", "l'insieme dei suoni di un luogo", ["solo una canzone famosa", "un disegno senza suoni"]),
      q("Il rumore eccessivo può causare...", "inquinamento acustico", ["silenzio naturale", "riciclo automatico"]),
      q("Una scelta sostenibile in musica può essere...", "riusare materiali per creare strumenti", ["sprecare oggetti nuovi", "buttare tutto"]),
      q("Registrare suoni naturali richiede...", "attenzione e rispetto del luogo", ["disturbare animali e persone", "urlare sempre"]),
      q("Il silenzio in un ambiente naturale può farci...", "ascoltare dettagli nascosti", ["perdere ogni informazione", "inquinare di più"]),
      q("La musica può parlare di ambiente quando...", "fa riflettere su cura e responsabilità", ["nega ogni problema", "invita allo spreco"]),
      q("Un comportamento corretto in un parco è...", "ridurre rumori inutili", ["alzare musica al massimo", "lasciare rifiuti"]),
      q("I materiali riciclati permettono di...", "dare nuova vita agli oggetti", ["aumentare sempre gli sprechi", "evitare ogni creatività"]),
      q("Ascoltare un temporale in sicurezza può far capire...", "ritmo, intensità e timbro naturali", ["solo il testo di una canzone", "la marca degli strumenti"]),
      q("La cura dell'ambiente riguarda...", "scelte quotidiane e comunità", ["solo gli adulti", "solo gli scienziati"]),
      q("Un laboratorio musicale sostenibile dovrebbe...", "limitare sprechi e valorizzare il riuso", ["comprare e buttare materiali", "ignorare i rifiuti"])
    ],
    mediaRights: [
      q("Prima di usare una musica online devo controllare...", "permessi e licenza", ["solo se mi piace", "solo il colore della copertina"]),
      q("Citare la fonte serve a...", "riconoscere autore e provenienza", ["rendere sempre libero qualunque file", "nascondere l'autore"]),
      q("Copiare un testo e firmarlo come proprio è...", "plagio", ["collaborazione", "ascolto attivo"]),
      q("Se uso contenuti creati con IA, è corretto...", "dichiararlo quando richiesto", ["fingere che sia tutto mio", "non controllare nulla"]),
      q("Un brano famoso in MP3 sul sito scolastico...", "richiede attenzione a diritti e permessi", ["è sempre libero", "si può caricare sempre se gratuito"]),
      q("Una licenza Creative Commons indica...", "condizioni di utilizzo", ["che non esiste autore", "che tutto è senza regole"]),
      q("Un link a una piattaforma ufficiale è spesso più sicuro di...", "ricaricare un file protetto", ["citare l'autore", "leggere la fonte"]),
      q("Quando preparo una presentazione devo...", "tenere traccia delle fonti", ["copiare immagini a caso", "eliminare i crediti"]),
      q("Il diritto d'autore protegge...", "opere e autori", ["solo computer", "solo spartiti antichi"]),
      q("Usare un'immagine trovata online richiede...", "controllo della licenza", ["nessuna verifica", "solo cambiare colore"]),
      q("Un uso corretto dei media digitali è...", "responsabile e trasparente", ["frettoloso e nascosto", "senza fonti"]),
      q("Scaricare e ripubblicare materiali protetti può...", "creare problemi legali e di rispetto", ["rendere tutto pubblico automaticamente", "annullare i diritti"]),
      q("Per una playlist didattica online è meglio...", "raccogliere titoli e link ufficiali", ["caricare MP3 protetti", "nascondere le fonti"]),
      q("Quando non so se posso usare un contenuto, devo...", "fermarmi e controllare", ["pubblicare subito", "cambiare solo il nome file"]),
      q("La cittadinanza digitale richiede...", "rispetto di persone, fonti e regole", ["copia senza limiti", "assenza di responsabilità"])
    ],
    emotionSoundtrack: [
      q("Se un compagno prova emozioni diverse dalle tue ascoltando una canzone...", "rispetti il suo punto di vista", ["lo correggi", "lo prendi in giro"]),
      q("La musica può aiutare a...", "capire le emozioni", ["evitare il dialogo", "giudicare gli altri"]),
      q("L'empatia significa...", "ascoltare e comprendere gli altri", ["convincere tutti a pensarla uguale", "ignorare le emozioni"]),
      q("Una classe inclusiva...", "accoglie tutti", ["esclude chi è diverso", "ascolta solo i più bravi"]),
      q("Per spiegare un'emozione musicale è utile...", "citare un elemento musicale ascoltato", ["dire solo che gli altri sbagliano", "scegliere sempre l'emozione più popolare"]),
      q("Davanti a una risposta diversa dalla tua...", "ascolti e fai una domanda rispettosa", ["interrompi subito", "cambi argomento"]),
      q("Il ritmo veloce può comunicare spesso...", "energia o movimento", ["sempre silenzio", "assenza di emozioni"]),
      q("Un volume molto piano può sembrare...", "intimo o delicato", ["sempre aggressivo", "sempre comico"]),
      q("Associare un colore a una musica serve a...", "raccontare una percezione personale", ["trovare l'unica risposta giusta", "giudicare gli altri"]),
      q("Una playlist di classe dovrebbe contenere...", "scelte motivate e rispettose", ["brani imposti senza spiegazione", "prese in giro"]),
      q("Quando descrivo un brano posso parlare di...", "ritmo, timbro, intensità e ricordi", ["solo del voto", "solo del volume del telefono"]),
      q("Non esiste una sola emozione corretta perché...", "ogni persona ascolta con storia e sensibilità proprie", ["tutti devono copiare", "la musica non comunica nulla"]),
      q("Una domanda gentile dopo l'ascolto è...", "Quale punto ti ha fatto pensare a quell'emozione?", ["Perché sbagli sempre?", "Chi ti ha detto di rispondere così?"]),
      q("Il timbro di uno strumento può cambiare...", "il colore percepito della musica", ["il nome dell'autore", "la durata della lezione"]),
      q("Nel mini poster emotivo devo spiegare...", "emozione, colori, forma e motivazione", ["solo il titolo", "solo il disegno senza senso"])
    ]
  };

  const state = {};

  function q(prompt, correct, wrong) {
    return {
      prompt,
      options: shuffle([
        { text: correct, correct: true },
        ...wrong.map((text) => ({ text, correct: false }))
      ])
    };
  }

  function shuffle(items) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const target = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[target]] = [copy[target], copy[index]];
    }
    return copy;
  }

  function nextRound(bankId, count) {
    const bank = banks[bankId] || [];
    if (!state[bankId] || state[bankId].remaining.length < count) {
      const currentIds = new Set((state[bankId]?.current || []).map((item) => item.prompt));
      const next = shuffle(bank).filter((item) => !currentIds.has(item.prompt));
      state[bankId] = { current: [], remaining: next.length >= count ? next : shuffle(bank) };
    }
    state[bankId].current = state[bankId].remaining.splice(0, count);
    return state[bankId].current;
  }

  function renderQuestion(question, index) {
    const article = document.createElement("article");
    article.className = "quizQuestion";
    article.dataset.answer = String(question.options.findIndex((option) => option.correct));

    const title = document.createElement("h3");
    title.textContent = `${index + 1}. ${question.prompt}`;
    article.appendChild(title);

    question.options.forEach((option, optionIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.value = String(optionIndex);
      button.textContent = option.text;
      article.appendChild(button);
    });

    return article;
  }

  function initCivicQuiz(config) {
    const quiz = document.getElementById(config.quizId);
    const result = document.getElementById(config.resultId);
    const checkButton = document.getElementById(config.checkId);
    const resetButton = document.getElementById(config.resetId);
    const bank = banks[config.bankId] || [];
    const count = Math.min(config.questionsPerRound || 3, bank.length);
    if (!quiz || !result || !checkButton || !resetButton || !bank.length || !count) return;

    const renderRound = () => {
      result.textContent = "";
      quiz.classList.add("civicQuiz");
      quiz.replaceChildren(...nextRound(config.bankId, count).map(renderQuestion));
    };

    quiz.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-value]");
      if (!button || !quiz.contains(button)) return;
      const question = button.closest(".quizQuestion");
      question.querySelectorAll("button").forEach((option) => {
        option.classList.remove("selected", "correct", "wrong");
        option.disabled = false;
      });
      button.classList.add("selected");
      result.textContent = "";
    });

    checkButton.addEventListener("click", () => {
      const questions = [...quiz.querySelectorAll(".quizQuestion")];
      const unanswered = questions.filter((question) => !question.querySelector("button.selected"));
      if (unanswered.length) {
        questions.forEach((question) => {
          question.querySelectorAll("button").forEach((button) => button.classList.remove("correct", "wrong"));
        });
        result.textContent = unanswered.length === 1
          ? "Rispondi a tutte le domande prima di controllare: ne manca 1."
          : `Rispondi a tutte le domande prima di controllare: ne mancano ${unanswered.length}.`;
        return;
      }

      let score = 0;

      questions.forEach((question) => {
        const answer = question.dataset.answer;
        const selected = question.querySelector("button.selected");
        question.querySelectorAll("button").forEach((button) => {
          button.classList.remove("correct", "wrong");
          if (button.dataset.value === answer) button.classList.add("correct");
        });
        if (selected?.dataset.value === answer) {
          score += 1;
        } else if (selected) {
          selected.classList.add("wrong");
        }
      });

      result.textContent = score === questions.length
        ? (config.successMessage || `Perfetto: ${score}/${questions.length}.`)
        : `Hai totalizzato ${score}/${questions.length}. ${config.retryMessage || "Riprova con nuove domande."}`;
    });

    resetButton.addEventListener("click", renderRound);
    renderRound();
  }

  window.MGH = window.MGH || {};
  window.MGH.initCivicQuiz = initCivicQuiz;
})();
