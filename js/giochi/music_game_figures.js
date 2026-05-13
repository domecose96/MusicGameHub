/* ==================== VARIABILI GLOBALI ==================== */
let mode = null;          // "note", "pause", "misto"
let currentFigure = null;

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

    warning.textContent = "";
    menu.classList.add("hidden");
    game.classList.remove("hidden");

    updateHeaderModeLabel(getModeLabel());
    nextQuestion();
  };

  /* ==================== INDIETRO ==================== */
  window.goBack = function(){
    game.classList.add("hidden");
    menu.classList.remove("hidden");

    mode = null;
    currentFigure = null;

    document.querySelectorAll(".selected")
      .forEach(btn => btn.classList.remove("selected"));

    updateHeaderModeLabel("");

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
    else pool = figures.concat(pauses);

    currentFigure = pool[Math.floor(Math.random() * pool.length)];

    figureImage.src = "../img/" + currentFigure + ".png";

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

    if(answer === currentFigure.replace("pausa_","")){
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

    setTimeout(() => {
      resetButtons();
      nextQuestion();
    }, 1000);
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
