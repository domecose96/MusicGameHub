/* ==================== VARIABILI GLOBALI ==================== */
let mode = null;          // "note", "pause", "misto"
let currentFigure = null;
let rankedCorrect = 0;
let rankedWrong = 0;
let rankedScore = 0;
let rankedQuestionIndex = 0;
let rankedStartTime = 0;
let rankedQuestionStart = 0;
let rankedTimerInterval = null;

document.addEventListener("DOMContentLoaded", () => {
  MGHGameUI.ensureRankedHUD();

  const figureImage = document.getElementById("figureImage");
  const answersDiv = document.getElementById("answers");
  const menu = document.getElementById("menu");
  const game = document.getElementById("game");
  const feedbackEl = document.getElementById("feedback");
  const questionText = document.getElementById("questionText");
  const headerModeLabel = document.getElementById("headerModeLabel");
  const warning = document.getElementById("warning");
  const timerBox = document.getElementById("timerBox");
  const timerEl = document.getElementById("timer");

  function getModeLabel(){
    if(mode === "note") return "Note";
    if(mode === "pause") return "Pause";
    if(mode === "misto") return "Misto";
    return "";
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
    stopRankedTimer();
    MGHGameUI.enterTraining({ menu, game, modeLabel: getModeLabel(), feedbackEl });
    nextQuestion();
  };

  function startRankedGame(){
    warning.textContent = "";
    rankedCorrect = 0;
    rankedWrong = 0;
    rankedScore = 0;
    rankedQuestionIndex = 0;
    const rankedSession = startRankedMode("figure");
    rankedStartTime = rankedSession.startTime;

    startRankedTimer();
    MGHGameUI.enterRanked({ menu, game, score: rankedScore, current: rankedQuestionIndex, total: RANKED_DEFAULT_QUESTIONS, feedbackEl });
    nextQuestion();
  }

  /* ==================== INDIETRO ==================== */
  window.goBack = function(){
    mode = null;
    currentFigure = null;
    rankedQuestionIndex = 0;

    stopRankedTimer();

    if(figureImage) figureImage.src = "";
    if(answersDiv) answersDiv.innerHTML = "";
    MGHGameUI.returnToMenu({ menu, game, feedbackEl });
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
    MGH.setGameFeedback(feedbackEl, "");

    answersDiv.innerHTML = "";

    let pool = [];
    if(mode === "note") pool = figures;
    else if(mode === "pause") pool = pauses;
    else if(mode === "ranked") pool = figures.concat(pauses);
    else pool = figures.concat(pauses);

    if(questionText){
      if(mode === "note") questionText.textContent = "Che figura musicale riconosci?";
      else if(mode === "pause") questionText.textContent = "Che pausa musicale riconosci?";
      else questionText.textContent = "Che simbolo musicale riconosci?";
    }

    currentFigure = pickRandomNoRepeat(pool, { namespace: `figure-${mode || "misto"}` });
    rankedQuestionStart = Date.now();

    figureImage.src = "../img/" + currentFigure + ".webp";

    const options = shuffleOptions(currentFigure);

    options.forEach(opt=>{
      const btn = document.createElement("button");
      btn.innerText = prettifyLabel(opt);
      btn.className = "noteButton gameAnswerButton";

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
      MGH.setGameFeedback(feedbackEl, MGH.getAnswerFeedback(true, "Nuova figura in arrivo."), "correct");
    } else {
      button.classList.add("wrong");
      MGH.setGameFeedback(feedbackEl, MGH.getAnswerFeedback(false, `La risposta corretta era ${prettifyLabel(currentFigure)}.`), "wrong");

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
    const rankedSession = answerRankedQuestion(isCorrect);
    if(!rankedSession) return;

    rankedCorrect = rankedSession.correct;
    rankedWrong = rankedSession.wrong;
    rankedScore = rankedSession.totalScore;
    rankedQuestionIndex = rankedSession.currentQuestion;
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
    const finalData = await finishRankedMode();
    const session = finalData?.session;

    stopRankedTimer();
    warning.textContent = "";
    MGHGameUI.returnToMenu({ menu, game, feedbackEl });
    await showRankedCompletionModal({
      gameName: "figure",
      session,
      saveResult: finalData?.result,
      saved: Boolean(finalData?.saved)
    });
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

  function startRankedTimer(){
    stopRankedTimer();
    if(!timerBox || !timerEl) return;
    timerBox.classList.remove("hidden");
    timerEl.textContent = "0";
    rankedTimerInterval = window.setInterval(() => {
      timerEl.textContent = String(Math.round((Date.now() - rankedStartTime) / 1000));
    }, 250);
  }

  function stopRankedTimer(){
    if(rankedTimerInterval){
      window.clearInterval(rankedTimerInterval);
      rankedTimerInterval = null;
    }
    timerBox?.classList.add("hidden");
  }

});
