const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 50, y: 110, vy: 0, jumping: false };
let obstacles = [];
let gravity = 0.6;
let speed = 3;
let gameOver = false;

function jump() {
  if (!player.jumping) {
    player.vy = -10;
    player.jumping = true;
  }
  if (gameOver) reset();
}

function reset() {
  obstacles = [];
  player.y = 110;
  player.vy = 0;
  gameOver = false;
}

function spawn() {
  obstacles.push({ x: canvas.width, y: 110 });
}

function update() {
  if (gameOver) return;

  player.vy += gravity;
  player.y += player.vy;

  if (player.y > 110) {
    player.y = 110;
    player.vy = 0;
    player.jumping = false;
  }

  if (Math.random() < 0.02) spawn();

  obstacles.forEach(o => o.x -= speed);

  // collision
  obstacles.forEach(o => {
    if (o.x < player.x + 20 && o.x > player.x &&
        player.y > 80) {
      gameOver = true;
    }
  });

  obstacles = obstacles.filter(o => o.x > -20);
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // pentagramma
  for (let i=0;i<5;i++){
    ctx.beginPath();
    ctx.moveTo(0,70+i*10);
    ctx.lineTo(canvas.width,70+i*10);
    ctx.stroke();
  }

  // player
  ctx.font = "40px serif";
  ctx.fillText("𝄢", player.x, player.y);

  // ostacoli
  ctx.font = "24px serif";
  obstacles.forEach(o=>{
    ctx.fillText("♪", o.x, o.y);
  });

  if (gameOver){
    ctx.fillText("Game Over", 180, 60);
  }
}

function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}

document.addEventListener("keydown", e=>{
  if(e.code==="Space") jump();
});

canvas.addEventListener("pointerdown", jump);

loop();