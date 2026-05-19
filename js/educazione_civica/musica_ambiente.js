const natureSoundDetails = {
  vento: {
    title: "Vento",
    text: "Può sembrare leggero o impetuoso: in musica spesso diventa una linea fluida, fatta di crescendi, soffi e movimenti continui.",
    audio: "../audio/ambiente/vento.mp3"
  },
  acqua: {
    title: "Acqua",
    text: "Può comunicare calma, profondità o forza. Onde, ruscelli e pioggia suggeriscono ritmi diversi e continui cambiamenti.",
    audio: "../audio/ambiente/acqua.mp3"
  },
  animali: {
    title: "Animali",
    text: "I versi degli animali possono diventare melodie, richiami o piccoli motivi musicali riconoscibili.",
    audio: "../audio/ambiente/animali.mp3"
  },
  pioggia: {
    title: "Pioggia",
    text: "Il suo ritmo può essere regolare, fitto o improvviso: per questo è perfetta per lavorare su pulsazione e intensità.",
    audio: "../audio/ambiente/pioggia.mp3"
  },
  bosco: {
    title: "Bosco",
    text: "Un bosco mescola silenzio, foglie, rami, passi e richiami lontani. È un paesaggio sonoro ricco di dettagli.",
    audio: "../audio/ambiente/bosco.mp3"
  },
  terra: {
    title: "Terra",
    text: "Il suono della terra può essere grave e profondo: tamburi, contrabbassi e percussioni aiutano a evocare forza e stabilità.",
    audio: "../audio/ambiente/terra.mp3"
  }
};

const listeningDetails = {
  vivaldi: {
    label: "Ascolto guidato",
    title: "Le quattro stagioni",
    composer: "Antonio Vivaldi",
    audio: "../audio/ambiente/brani/vivaldi_quattro_stagioni.mp3",
    body: `
      <p><strong>Che cosa ascoltare:</strong> Vivaldi usa ritmo, melodie e contrasti dinamici per suggerire immagini naturali: il canto degli uccelli, il vento, il temporale, il caldo, il freddo e il movimento delle stagioni.</p>
      <p><strong>Significato:</strong> il brano mostra come la musica possa descrivere un paesaggio senza usare immagini o parole. Ogni stagione diventa un piccolo racconto sonoro, utile per capire il rapporto tra natura, emozione e fantasia musicale.</p>
    `,
    question: "Durante l'ascolto prova a chiederti: quale stagione immagini e quali strumenti te la fanno riconoscere?"
  },
  beethoven: {
    label: "Ascolto guidato",
    title: "Sinfonia Pastorale",
    composer: "Ludwig van Beethoven",
    audio: "../audio/ambiente/brani/beethoven_pastorale.mp3",
    body: `
      <p><strong>Che cosa ascoltare:</strong> Beethoven non imita soltanto i rumori della campagna: costruisce un'atmosfera. Le melodie ampie suggeriscono serenità, mentre alcuni passaggi evocano acqua, temporale e vita all'aperto.</p>
      <p><strong>Significato:</strong> la natura diventa uno spazio emotivo. Il brano invita ad ascoltare il paesaggio come luogo di calma, energia e meraviglia, collegando musica descrittiva e sensibilità verso l'ambiente.</p>
    `,
    question: "Quale momento ti sembra più vicino a un paesaggio reale: la calma, il movimento dell'acqua o il temporale?"
  },
  saens: {
    label: "Video e ascolto guidato",
    title: "Il carnevale degli animali",
    composer: "Camille Saint-Saëns",
    audio: "../audio/ambiente/brani/saint_saens_carnevale_animali.mp3",
    videoUrl: "https://www.youtube.com/watch?v=HOER1v5QWBg&t=336s",
    body: `
      <p><strong>Che cosa ascoltare:</strong> Saint-Saëns associa strumenti, registri e movimenti musicali a diversi animali. Alcuni passaggi sono buffi e teatrali, altri eleganti o misteriosi.</p>
      <p><strong>Significato:</strong> il brano è perfetto per capire come timbro, ritmo e melodia possano suggerire caratteri e movimenti. La musica diventa quasi una piccola scena: senza vedere l'animale, possiamo immaginarlo.</p>
    `,
    question: "Quale animale riesci a riconoscere dal modo in cui si muove la musica?"
  },
  earth: {
    label: "Canzone e ambiente",
    title: "Earth Song",
    composer: "Michael Jackson",
    audio: "../audio/ambiente/brani/michael_jackson_earth_song.mp3",
    body: `
      <p><strong>Che cosa ascoltare:</strong> il brano cresce progressivamente: parte in modo più raccolto e diventa sempre più intenso, quasi come una domanda rivolta all'umanità.</p>
      <p><strong>Significato:</strong> è una canzone di denuncia e sensibilizzazione. Michael Jackson la realizzò per richiamare l'attenzione su guerra, distruzione della natura, sofferenza degli esseri viventi e responsabilità collettiva verso la Terra.</p>
      <p><strong>Riflessione:</strong> la voce e l'intensità del brano fanno percepire dolore, richiesta di ascolto e bisogno di cambiamento. Non racconta solo un problema ambientale: chiede a chi ascolta di sentirsi parte della soluzione.</p>
      <p><strong>Collegamento con educazione civica:</strong> la musica qui non descrive solo un paesaggio: diventa un messaggio. Invita a riflettere su ciò che facciamo al pianeta e su come possiamo cambiare comportamenti quotidiani.</p>
    `,
    question: "Secondo te una canzone può aiutare le persone a cambiare atteggiamento verso l'ambiente?"
  },
  bertoli: {
    label: "Canzone e ambiente",
    title: "Eppure soffia",
    composer: "Pierangelo Bertoli",
    audio: "../audio/ambiente/brani/bertoli_eppure_soffia.mp3",
    body: `
      <p><strong>Contesto:</strong> la canzone affronta il rapporto difficile tra uomo e natura. Denuncia i danni provocati dall'inquinamento, dalle guerre, dalla distruzione dell'ambiente e dal rischio nucleare.</p>
      <p><strong>Che cosa ascoltare:</strong> le parti più drammatiche raccontano un mondo ferito, mentre il ritornello introduce un'immagine di resistenza e speranza: la natura continua a vivere attraverso vento, mare, fiori e foglie.</p>
      <p><strong>Significato:</strong> il brano aiuta a capire che la denuncia ambientale non serve solo a spaventare, ma anche a far nascere responsabilità. La musica diventa uno spazio per riconoscere il problema e immaginare un cambiamento.</p>
      <p><strong>Collegamento con educazione civica:</strong> si può collegare alla tutela dell'ambiente, alla Costituzione, allo sviluppo sostenibile e al ruolo di ogni cittadino nella cura del pianeta.</p>
    `,
    question: "Quale emozione prevale per te: preoccupazione, rabbia, tristezza o speranza?"
  },
  guccini: {
    label: "Canzone e ambiente",
    title: "Il vecchio e il bambino",
    composer: "Francesco Guccini",
    audio: "../audio/ambiente/brani/guccini_vecchio_bambino.mp3",
    body: `
      <p><strong>Contesto:</strong> il brano immagina il dialogo tra un anziano e un bambino in un mondo devastato dall'uomo. Il vecchio ricorda una natura piena di colori e vita, mentre il bambino non riesce quasi a immaginarla.</p>
      <p><strong>Che cosa ascoltare:</strong> il tono è malinconico e narrativo. La musica sostiene il contrasto tra memoria del passato e povertà del presente, creando un senso di nostalgia e inquietudine.</p>
      <p><strong>Significato:</strong> la canzone invita a pensare alle generazioni future. Se oggi non proteggiamo ambiente, paesaggi e biodiversità, chi verrà dopo di noi potrebbe conoscere la natura solo attraverso racconti e ricordi.</p>
      <p><strong>Collegamento con Agenda 2030:</strong> il brano si presta a discutere comportamenti corretti e scorretti verso l'ambiente, consumo responsabile e protezione degli ecosistemi.</p>
    `,
    question: "Che cosa vorresti che un bambino del futuro potesse ancora vedere, ascoltare e vivere nella natura?"
  }
};

function initNatureSoundCards() {
  const output = document.getElementById("natureSoundOutput");
  const outputText = output?.querySelector(".natureSoundText");
  const outputAudio = document.getElementById("natureSoundAudio");
  const buttons = document.querySelectorAll(".natureSoundSelect");
  const cards = document.querySelectorAll(".natureSoundCard");
  if (!output || !buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const item = natureSoundDetails[button.dataset.sound];
      if (!item) return;

      cards.forEach((card) => card.classList.remove("active"));
      button.closest(".natureSoundCard")?.classList.add("active");

      if (outputText) {
        outputText.innerHTML = `<h3>${item.title}</h3><p>${item.text}</p>`;
      }

      if (outputAudio) {
        outputAudio.pause();
        outputAudio.src = item.audio;
        outputAudio.load();
      }
    });
  });
}

function initListeningModal() {
  const modal = document.getElementById("listeningModal");
  const label = document.getElementById("listeningModalLabel");
  const title = document.getElementById("listeningModalTitle");
  const composer = document.getElementById("listeningModalComposer");
  const media = document.getElementById("listeningModalMedia");
  const body = document.getElementById("listeningModalBody");
  const question = document.getElementById("listeningModalQuestion");
  const cards = document.querySelectorAll(".listeningCard[data-listening]");
  if (!modal || !label || !title || !composer || !media || !body || !question || !cards.length) return;

  const openModal = (detail) => {
    if (!detail) return;

    label.textContent = detail.label;
    title.textContent = detail.title;
    composer.textContent = detail.composer;
    media.innerHTML = `
      <audio class="environmentAudio" controls preload="none">
        <source src="${detail.audio}" type="audio/mpeg">
      </audio>
      ${detail.videoUrl ? `<a class="videoLink" href="${detail.videoUrl}" target="_blank" rel="noopener">Guarda il video su YouTube</a>` : ""}
    `;
    body.innerHTML = detail.body;
    question.textContent = detail.question;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    media.innerHTML = "";
    document.body.style.overflow = "";
  };

  cards.forEach((card) => {
    const openCard = () => openModal(listeningDetails[card.dataset.listening]);
    card.addEventListener("click", openCard);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCard();
      }
    });
  });

  modal.querySelectorAll("[data-close-listening]").forEach((element) => {
    element.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
  });
}

function initEnvironmentQuiz() {
  const questions = document.querySelectorAll(".quizQuestion");
  const result = document.getElementById("environmentQuizResult");
  const checkButton = document.getElementById("checkEnvironmentQuiz");
  const resetButton = document.getElementById("resetEnvironmentQuiz");
  if (!questions.length || !result || !checkButton || !resetButton) return;

  questions.forEach((question) => {
    question.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        question.querySelectorAll("button").forEach((option) => {
          option.classList.remove("selected", "correct", "wrong");
        });
        button.classList.add("selected");
        result.textContent = "";
      });
    });
  });

  checkButton.addEventListener("click", () => {
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

    result.textContent =
      score === questions.length
        ? `Perfetto: ${score}/${questions.length}. Hai collegato bene musica, natura e sostenibilità.`
        : `Hai totalizzato ${score}/${questions.length}. Rileggi le card e riprova.`;
  });

  resetButton.addEventListener("click", () => {
    questions.forEach((question) => {
      question.querySelectorAll("button").forEach((button) => {
        button.classList.remove("selected", "correct", "wrong");
      });
    });
    result.textContent = "";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNatureSoundCards();
  initListeningModal();
  initEnvironmentQuiz();
});

window.addEventListener("scroll", () => MGH.detectActiveSection(), { passive: true });
