const canvas = document.getElementById("staffRunnerCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("runnerScore");

let player = {
  x: 60,
  y: 122,
  baseY: 122,
  vy: 0,
  jumping: false
};

let obstacles = [];
let score = 0;
let speed = 3;
let gravity = 0.6;
let spawnTimer = 0;
let gameOver = false;
let started = false;

function jump(){
  if(gameOver){
    resetGame();
    return;
  }

  started = true;

  if(!player.jumping){
    player.vy = -11;
    player.jumping = true;
  }
}

function resetGame(){
  obstacles = [];
  score = 0;
  speed = 3;
  spawnTimer = 0;
  gameOver = false;
  started = true;
  player.y = player.baseY;
  player.vy = 0;
  player.jumping = false;
  scoreEl.textContent = score;
}

function spawnObstacle(){
  const symbols = ["♪","♩","♫","♬"];

  obstacles.push({
    x: canvas.width + 20,
    y: player.baseY,
    symbol: symbols[Math.floor(Math.random()*symbols.length)],
    passed:false
  });
}

function update(){
  if(!started || gameOver) return;

  player.vy += gravity;
  player.y += player.vy;

  if(player.y >= player.baseY){
    player.y = player.baseY;
    player.vy = 0;
    player.jumping = false;
  }

  spawnTimer--;

  if(spawnTimer <= 0){
    spawnObstacle();
    spawnTimer = 85 + Math.floor(Math.random()*70);
  }

  obstacles.forEach(obs=>{
    obs.x -= speed;

    if(!obs.passed && obs.x < player.x){
      obs.passed = true;
      score++;
      scoreEl.textContent = score;
      speed += 0.05;
    }

    const hit =
      obs.x < player.x + 30 &&
      obs.x + 22 > player.x &&
      player.y > 88;

    if(hit){
      gameOver = true;
    }
  });

  obstacles = obstacles.filter(o=>o.x > -40);
}

function drawStaff(){
  ctx.strokeStyle = "rgba(51,51,51,.55)";
  ctx.lineWidth = 1.5;

  for(let i=0;i<5;i++){
    const y = 72 + i*12;
    ctx.beginPath();
    ctx.moveTo(15,y);
    ctx.lineTo(canvas.width-15,y);
    ctx.stroke();
  }
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  drawStaff();

  ctx.font = "42px serif";
  ctx.fillStyle = "#ff6600";
  ctx.fillText("𝄢",player.x,player.y);

  ctx.font = "30px serif";
  ctx.fillStyle = "#333";
  obstacles.forEach(o=>{
    ctx.fillText(o.symbol,o.x,o.y);
  });

  if(!started){
    drawMsg("Tocca per iniziare");
  }

  if(gameOver){
    drawMsg("Game Over");
  }
}

function drawMsg(text){
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,.86)";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle = "#ff6600";
  ctx.font = "bold 22px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(text,canvas.width/2,canvas.height/2);
  ctx.restore();
}

function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}

canvas.addEventListener("pointerdown",jump);

document.addEventListener("keydown",e=>{
  if(e.code==="Space"){
    e.preventDefault();
    jump();
  }
});

loop();