/* ==================== VARIABILI GLOBALI ==================== */
let mode = null;          // "note", "pause", "misto"
let currentFigure = null;
let rankedCorrect = 0;
let rankedWrong = 0;
let rankedScore = 0;
let rankedQuestionIndex = 0;
let rankedStartTime = 0;
let rankedQuestionStart = 0;

document.addEventListener("DOMContentLoaded", () => {

  const figureImage = document.getElementById("figureImage");
  const answersDiv = document.getElementById("answers");
  const menu = document.getElementById("menu");
  const game = document.getElementById("game");
  const feedbackEl = document.getElementById("feedback");
  const headerModeLabel = document.getElementById("headerModeLabel");
  const warning = document.getElementById("warning");

  function getModeLabel(){
    if(mode === "note") return "Note";
    if(mode === "pause") return "Pause";
    if(mode === "misto") return "Misto";
    return "";
  }

  function updateHeaderModeLabel(label = ""){
    MGH.updateHeaderModeLabel(label);
  }

  /* ==================== MENU ==================== */
  window.setMode = function(selectedMode, el){
    mode = selectedMode;
    warning.textContent = "";

    MGH.selectExclusive("#menu .buttonGroup button", el);
  };

  /* ==================== INIZIO GIOCO ==================== */
  window.startGame = function(){
    if(!mode){
      warning.textContent = "Seleziona una modalità prima di iniziare";
      return;
    }

    if(mode === "ranked"){
      showRankedIntro({
        gameName: "figure",
        title: "Modalità Classificata",
        text: "Riconosci 10 figure o pause. La sfida è mista e il punteggio premia velocità e precisione.",
        onStart: startRankedGame
      });
      return;
    }

    warning.textContent = "";
    menu.classList.add("hidden");
    game.classList.remove("hidden");
    hideLeaderboardButton();
    hideRankedUI();

    updateHeaderModeLabel(getModeLabel());
    nextQuestion();
  };

  function startRankedGame(){
    warning.textContent = "";
    rankedCorrect = 0;
    rankedWrong = 0;
    rankedScore = 0;
    rankedQuestionIndex = 0;
    rankedStartTime = Date.now();

    menu.classList.add("hidden");
    game.classList.remove("hidden");
    hideLeaderboardButton();
    showRankedUI();
    updateHeaderModeLabel("Classificata");
    updateRankedProgressUI({ score: rankedScore, current: rankedQuestionIndex, total: RANKED_DEFAULT_QUESTIONS });
    nextQuestion();
  }

  /* ==================== INDIETRO ==================== */
  window.goBack = function(){
    game.classList.add("hidden");
    menu.classList.remove("hidden");

    mode = null;
    currentFigure = null;
    rankedQuestionIndex = 0;

    document.querySelectorAll(".selected")
      .forEach(btn => btn.classList.remove("selected"));

    updateHeaderModeLabel("");
    hideRankedUI();
    showLeaderboardButton();

    if(figureImage) figureImage.src = "";
    if(answersDiv) answersDiv.innerHTML = "";
    if(feedbackEl) feedbackEl.textContent = "";
  };

  /* ==================== FIGURE ==================== */
  const figures = [
    "semibreve","minima","semiminima","croma",
    "semicroma","biscroma","semibiscroma"
  ];

  const pauses = [
    "pausa_semibreve","pausa_minima","pausa_semiminima","pausa_croma",
    "pausa_semicroma","pausa_biscroma","pausa_semibiscroma"
  ];

  /* ==================== NUOVA DOMANDA ==================== */
  function nextQuestion(){

    if(!figureImage || !answersDiv) return;

    resetButtons();
    if(feedbackEl) feedbackEl.textContent = "";

    answersDiv.innerHTML = "";

    let pool = [];
    if(mode === "note") pool = figures;
    else if(mode === "pause") pool = pauses;
    else if(mode === "ranked") pool = figures.concat(pauses);
    else pool = figures.concat(pauses);

    currentFigure = pool[Math.floor(Math.random() * pool.length)];
    rankedQuestionStart = Date.now();

    figureImage.src = "../img/" + currentFigure + ".webp";

    const options = shuffleOptions(currentFigure);

    options.forEach(opt=>{
      const btn = document.createElement("button");
      btn.innerText = prettifyLabel(opt);
      btn.className = "noteButton";

      btn.onclick = () => checkAnswer(opt, btn);

      answersDiv.appendChild(btn);
    });
  }

  /* ==================== CONTROLLO RISPOSTA ==================== */
  function checkAnswer(answer, button){
    const allButtons = document.querySelectorAll("#answers .noteButton");

    allButtons.forEach(b => {
      b.classList.remove("correct","wrong");
      b.style.pointerEvents = "auto";
    });

    button.style.pointerEvents = "none";

    const isCorrect = answer === currentFigure.replace("pausa_","");

    if(isCorrect){
      button.classList.add("correct");
      if(feedbackEl) feedbackEl.textContent = "Hai indovinato! Nuova figura in arrivo...";
    } else {
      button.classList.add("wrong");
      if(feedbackEl) feedbackEl.textContent = `Hai sbagliato! La risposta giusta era ${prettifyLabel(currentFigure)}.`;

      allButtons.forEach(btn=>{
        if(btn.innerText === prettifyLabel(currentFigure)){
          btn.classList.add("correct");
        }
      });
    }

    if(mode === "ranked"){
      handleRankedAnswer(isCorrect);
      return;
    }

    setTimeout(() => {
      resetButtons();
      nextQuestion();
    }, 1000);
  }

  function handleRankedAnswer(isCorrect){
    const elapsed = (Date.now() - rankedQuestionStart) / 1000;

    if(isCorrect){
      rankedCorrect++;
      rankedScore += elapsed <= 2 ? 125 : elapsed <= 5 ? 110 : 100;
    } else {
      rankedWrong++;
    }

    rankedQuestionIndex++;
    updateRankedProgressUI({ score: rankedScore, current: rankedQuestionIndex, total: RANKED_DEFAULT_QUESTIONS });

    setTimeout(async () => {
      resetButtons();

      if(rankedQuestionIndex >= RANKED_DEFAULT_QUESTIONS){
        await finishRankedGame();
      } else {
        nextQuestion();
      }
    }, 1000);
  }

  async function finishRankedGame(){
    const totalTime = Math.round((Date.now() - rankedStartTime) / 1000);
    const saved = await saveRankedScore({
      gameName: "figure",
      totalScore: rankedScore,
      correct: rankedCorrect,
      wrong: rankedWrong,
      totalQuestions: RANKED_DEFAULT_QUESTIONS,
      totalTime
    });

    game.classList.add("hidden");
    menu.classList.remove("hidden");
    hideRankedUI();
    showLeaderboardButton();
    updateHeaderModeLabel("");
    warning.innerHTML = `Classificata completata! Punteggio: <strong>${Math.round(rankedScore)}</strong> · Corrette: <strong>${rankedCorrect}/${RANKED_DEFAULT_QUESTIONS}</strong>${saved ? "" : " · salvataggio non riuscito"}`;
    document.querySelectorAll(".selected").forEach(btn => btn.classList.remove("selected"));
    mode = null;
  }

  /* ==================== RESET BOTTONI ==================== */
  function resetButtons(){
    document.querySelectorAll("#answers .noteButton").forEach(b=>{
      b.classList.remove("correct","wrong");
      b.style.pointerEvents = "auto";
    });
  }

  /* ==================== GENERA OPZIONI ==================== */
  function prettifyLabel(f){
    return f
      .replace("pausa_","")
      .replace(/_/g," ")
      .replace(/^\w/, c => c.toUpperCase());
  }

  function shuffleOptions(correct){

    const correctBase = correct.replace("pausa_","");
    const pool = [...figures];

    const set = new Set();
    set.add(correctBase);

    while(set.size < 4){
      const rand = pool[Math.floor(Math.random() * pool.length)];
      set.add(rand);
    }

    return Array.from(set)
      .sort(() => Math.random() - 0.5);
  }

  /* ==================== INVIO TASTIERA ==================== */
  document.addEventListener("keydown", e=>{
    if(e.key === "Enter"){
      const firstBtn = document.querySelector("#answers button");
      if(firstBtn) firstBtn.click();
    }
  });

});
