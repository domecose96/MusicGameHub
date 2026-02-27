/* ==================== VARIABILI GLOBALI ==================== */
let mode = null;          // "note", "pause", "misto"
let currentFigure = null;

document.addEventListener("DOMContentLoaded", () => {

  const figureImage = document.getElementById("figureImage");
  const answersDiv = document.getElementById("answers");
  const menu = document.getElementById("menu");
  const game = document.getElementById("game");

  /* ==================== MENU ==================== */
  window.setMode = function(selectedMode, el){
    mode = selectedMode;

    // rimuove selezione dai bottoni menu
    document.querySelectorAll("#menu .buttonGroup button")
      .forEach(btn => btn.classList.remove("selected"));

    el.classList.add("selected");
  };

  /* ==================== INIZIO GIOCO ==================== */
  window.startGame = function(){
    if(!mode){
      alert("Seleziona una modalità prima di iniziare");
      return;
    }

    menu.classList.add("hidden");
    game.classList.remove("hidden");

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

    if(figureImage) figureImage.src = "";
    if(answersDiv) answersDiv.innerHTML = "";
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

    // reset bottoni prima di creare nuovi
    resetButtons();

    answersDiv.innerHTML = "";

    let pool = [];
    if(mode==="note") pool = figures;
    else if(mode==="pause") pool = pauses;
    else pool = figures.concat(pauses);

    currentFigure = pool[Math.floor(Math.random()*pool.length)];

    // carica immagine
    figureImage.src = "img/" + currentFigure + ".png";

    // crea opzioni
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

    // rimuove eventuali classi precedenti
    allButtons.forEach(b => {
      b.classList.remove("correct","wrong");
      b.style.pointerEvents = "auto";
    });

    button.style.pointerEvents = "none"; // blocca clic multipli

    if(answer === currentFigure.replace("pausa_","")){
      button.classList.add("correct"); // verde
    } else {
      button.classList.add("wrong");   // rosso
      // evidenzia quello corretto
      allButtons.forEach(btn=>{
        if(btn.innerText === prettifyLabel(currentFigure)){
          btn.classList.add("correct");
        }
      });
    }

    // dopo 1 secondo passa alla prossima figura
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
    .replace(/^\w/,c=>c.toUpperCase());
  }
  function shuffleOptions(correct){

    const correctBase = correct.replace("pausa_","");

    const pool = [...figures];

    const set = new Set();
    set.add(correctBase);

    while(set.size < 4){
        const rand = pool[Math.floor(Math.random()*pool.length)];
        set.add(rand);
    }

    return Array.from(set)
        .sort(()=>Math.random()-0.5);
  }

  /* ==================== INVIO TASTIERA ==================== */
  document.addEventListener("keydown", e=>{
    if(e.key === "Enter"){
      const firstBtn = document.querySelector("#answers button");
      if(firstBtn) firstBtn.click();
    }
  });

});

    function goHome() {
    // Colora il bottone come selezionato
    const btn = document.getElementById("homeBtn");
    btn.classList.add("selected");

    // Torna alla home dopo breve delay per mostrare l'effetto
    setTimeout(() => {
        window.location.href = "index.html"; // sostituisci con il tuo file home
    }, 150);
    }
