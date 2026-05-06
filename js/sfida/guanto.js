// ==================== VARIABILI GLOBALI ====================
const allNotes = ["Do","Re","Mi","Fa","Sol","La","Si"];

let numQuestions = null;
let questions = [];
let currentIndex = 0;
let errors = 0;
let startTime;
let timerInterval;

let currentMode = "sfida";

// ==================== RIFERIMENTI DOM ====================
const quizDiv = document.getElementById("quiz");
const quizSVG = document.getElementById("quizSVG");
const noteEl = document.getElementById("note");
const ledgerGrp = document.getElementById("ledgerLines");
const figureImg = document.getElementById("figureImage");
const figureContainer = document.getElementById("figureContainer");
const answersDiv = document.getElementById("answers");
const questionBox = document.getElementById("questionBox");
const timerDiv = document.getElementById("timer");
const headerModeLabel = document.getElementById("headerModeLabel");

// ==================== HEADER MODE ====================
function getModeLabel(){
  if(numQuestions === 10) return "Sfida breve";
  if(numQuestions === 20) return "Sfida media";
  if(numQuestions === 30) return "Sfida completa";
  return "";
}

function updateHeaderModeLabel(label = ""){
  MGH.updateHeaderModeLabel(label);
}

// ==================== SELEZIONE NUMERO DOMANDE ====================
function selectNum(btn,num){
  MGH.selectExclusive("#config .menuButton", btn);
  numQuestions = num;
  MGH.setWarning("", "#config .warningText");
}

// ==================== INIZIO SFIDA ====================
async function startChallenge(){
  if(!numQuestions){
    MGH.setWarning("Seleziona una modalità prima di iniziare", "#config .warningText");
    return;
  }

  currentMode = "sfida";
  MGH.setWarning("", "#config .warningText");

  document.getElementById("config").classList.add("hidden");
  quizDiv.classList.remove("hidden");
  document.getElementById("endScreen").classList.add("hidden");

  updateHeaderModeLabel(getModeLabel());

  currentIndex = 0;
  errors = 0;
  startTime = Date.now();

  await generateQuestions();
  showQuestion();
  startTimer();
}

// ==================== TIMER ====================
function startTimer(){
  clearInterval(timerInterval);
  timerDiv.innerText = "Tempo: 0s";

  timerInterval = setInterval(()=>{
    const elapsed = Math.floor((Date.now() - startTime)/1000);
    timerDiv.innerText = "Tempo: " + elapsed + "s";
  }, 1000);
}

// ==================== GENERA DOMANDE ====================
async function generateQuestions(){
  questions = [];

  try{
    const response = await fetch("js/sfida/question.json");
    const allData = await response.json();
    questions = allData.sort(()=> Math.random()-0.5).slice(0, numQuestions);
  }catch(err){
    console.error("Errore caricamento domande:", err);
    alert("Errore nel caricamento delle domande.");
  }
}

// ==================== MOSTRA DOMANDA ====================
function showQuestion() {
  if (currentIndex >= questions.length) {
    endChallenge();
    return;
  }

  const q = questions[currentIndex];
  answersDiv.innerHTML = "";

  quizSVG.style.display = "none";
  figureImg.style.display = "none";
  figureContainer.classList.add("hidden");

  if (q.type === "note") {
    quizSVG.style.display = "block";
    questionBox.innerText = "Indovina la nota sul pentagramma:";
    noteEl.setAttribute("cy", q.y);
    drawLedgerLines(q.y);

    allNotes.forEach(n => {
      const btn = document.createElement("button");
      btn.innerText = n;
      btn.className = "noteButton";
      btn.onclick = () => checkAnswerNote(n, btn, q);
      answersDiv.appendChild(btn);
    });
  }

  else if (q.type === "figure") {
    figureContainer.classList.remove("hidden");

    figureImg.style.display = "block";
    figureImg.src = "img/" + q.img;

    questionBox.innerText = "Indovina la figura musicale:";

    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.innerText = opt;
      btn.className = "noteButton";
      btn.onclick = () => checkAnswerFigurazione(i, q.correct, btn);
      answersDiv.appendChild(btn);
    });
  }

  else if (q.type === "figurazione" || q.type === "theory") {
    quizSVG.style.display = "none";
    figureContainer.classList.add("hidden");
    questionBox.innerText = q.q;

    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.innerText = opt;
      btn.className = "noteButton";
      btn.onclick = () => checkAnswerFigurazione(i, q.correct, btn);
      answersDiv.appendChild(btn);
    });
  }
}

// ==================== CONTROLLO RISPOSTE ====================
function checkAnswerNote(answer,btn,q){
  document.querySelectorAll(".noteButton").forEach(b=>b.style.pointerEvents="none");

  if(answer.trim().toLowerCase() === q.name.trim().toLowerCase()){
    btn.classList.add("correct");
  } else {
    btn.classList.add("wrong");
    errors++;
  }

  setTimeout(()=>{
    currentIndex++;
    showQuestion();
  },1000);
}

function checkAnswerFigurazione(ansIdx, correctIdx, btn){
  document.querySelectorAll(".noteButton").forEach(b=>b.style.pointerEvents="none");

  if(ansIdx === correctIdx){
    btn.classList.add("correct");
  } else {
    btn.classList.add("wrong");
    errors++;
  }

  setTimeout(()=>{
    currentIndex++;
    showQuestion();
  },1000);
}

// ==================== PENTAGRAMMA ====================
function drawLedgerLines(y){
  ledgerGrp.innerHTML = "";

  for(let pos=150; pos<=165; pos+=10) {
    if(y>=pos) createLedger(pos);
  }

  for(let pos=90; pos>=80; pos-=10) {
    if(y<=pos) createLedger(pos);
  }
}

function createLedger(y){
  const cx = parseFloat(noteEl.getAttribute("cx"));
  const rx = parseFloat(noteEl.getAttribute("rx"));

  const line = document.createElementNS("http://www.w3.org/2000/svg","line");
  line.setAttribute("x1", cx-rx-4);
  line.setAttribute("x2", cx+rx+4);
  line.setAttribute("y1", y);
  line.setAttribute("y2", y);
  line.setAttribute("stroke","black");
  line.setAttribute("stroke-width","2");

  ledgerGrp.appendChild(line);
}

// ==================== FINE PARTITA ====================
function endChallenge(){
  clearInterval(timerInterval);

  quizDiv.classList.add("hidden");
  document.getElementById("endScreen").classList.remove("hidden");
  document.getElementById("saveScoreBox").style.display = "flex";

  const timeTaken = Math.floor((Date.now()-startTime)/1000);
  const score = Math.max(0, 1000 - errors*50 - timeTaken*5);

  document.getElementById("scoreText").innerText =
    `Punteggio: ${score} — Errori: ${errors} — Tempo: ${timeTaken}s`;
}

// ==================== SALVA PUNTEGGIO ====================
function saveScore(){
  const nameInput = document.getElementById("playerName");
  const name = nameInput.value.trim();

  if(!name){
    alert("Inserisci il tuo nome!");
    nameInput.focus();
    return;
  }

  const timeTaken = Math.floor((Date.now()-startTime)/1000);
  const score = Math.max(0, 1000 - errors*50 - timeTaken*5);

  const key = `leaderboard_${currentMode}_${numQuestions}`;
  let board = JSON.parse(localStorage.getItem(key) || "[]");

  board.push({
    name,
    score,
    errors,
    time: timeTaken,
    date: new Date().toLocaleString()
  });

  board.sort((a,b)=>b.score-a.score);

  if(board.length>5) board = board.slice(0,5);

  localStorage.setItem(key, JSON.stringify(board));

  nameInput.value = "";
  document.getElementById("saveScoreBox").style.display = "none";
  loadAllLeaderboards();
}

// ==================== CLASSIFICHE ====================
function showLeaderboard(){
  document.getElementById("config").classList.add("hidden");
  quizDiv.classList.add("hidden");
  document.getElementById("endScreen").classList.remove("hidden");
  document.getElementById("scoreText").innerText = "🏆 Classifiche Top 10";
  document.getElementById("saveScoreBox").style.display = "none";

  updateHeaderModeLabel("Classifiche");

  loadAllLeaderboards();
}

function loadAllLeaderboards(){
  loadLeaderboard("sfida","lb_note",10);
  loadLeaderboard("sfida","lb_teoria",20);
  loadLeaderboard("sfida","lb_sfida",30);
}

function loadLeaderboard(mode, elementId, numQ){
  const key = `leaderboard_${mode}_${numQ}`;
  const board = JSON.parse(localStorage.getItem(key) || "[]");
  const container = document.getElementById(elementId);

  if(!container) return;

  container.innerHTML = "";

  board.slice(0,5).forEach((e,i)=>{
    const row = document.createElement("div");
    row.className = "recordRow bestEver";

    const name = document.createElement("strong");
    name.textContent = `${i+1}. ${e.name}`;

    const details = document.createTextNode(`${e.score} pts — Err: ${e.errors} — ${e.time}s`);

    row.append(name, document.createElement("br"), details);
    container.appendChild(row);
  });
}

function goBack(){
  clearInterval(timerInterval);

  document.getElementById("endScreen").classList.add("hidden");
  quizDiv.classList.add("hidden");
  document.getElementById("config").classList.remove("hidden");

  document.querySelectorAll("#config .selected").forEach(btn=>btn.classList.remove("selected"));

  answersDiv.innerHTML = "";
  ledgerGrp.innerHTML = "";
  timerDiv.innerText = "";
  questionBox.innerText = "";

  currentIndex = 0;
  errors = 0;
  numQuestions = 10;
  questions = [];

  updateHeaderModeLabel("");
}
