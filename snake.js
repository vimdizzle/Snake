const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const grid = 20;
const count = 10; // Lower is faster
let snake = [{x: 160, y: 200}];
let dx = grid;
let dy = 0;
let food = randomFood();
let score = 0;
let changingDirection = false;

function randomFood() {
  let foodX, foodY;
  do {
    foodX = Math.floor(Math.random() * (canvas.width / grid)) * grid;
    foodY = Math.floor(Math.random() * (canvas.height / grid)) * grid;
  } while (snake.some(segment => segment.x === foodX && segment.y === foodY));
  return {x: foodX, y: foodY};
}

function drawSnake() {
  ctx.fillStyle = '#0f0';
  snake.forEach(segment => ctx.fillRect(segment.x, segment.y, grid-2, grid-2));
}

function drawFood() {
  ctx.fillStyle = '#f00';
  ctx.fillRect(food.x, food.y, grid-2, grid-2);
}

function moveSnake() {
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById('score').textContent = 'Score: ' + score;
    food = randomFood();
  } else {
    snake.pop();
  }
}

function checkCollision() {
  const head = snake[0];
  // Wall collision
  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height
  ) return true;
  // Self collision
  for (let i = 1; i < snake.length; i++)
    if (head.x === snake[i].x && head.y === snake[i].y) return true;
  return false;
}

function clearCanvas() {
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
  if (checkCollision()) {
    alert('Game Over! Final Score: ' + score);
    snake = [{x: 160, y: 200}];
    dx = grid;
    dy = 0;
    food = randomFood();
    score = 0;
    document.getElementById('score').textContent = 'Score: ' + score;
    changingDirection = false;
    return;
  }

  setTimeout(function onTick() {
    changingDirection = false;
    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();
    gameLoop();
  }, 100);
}

document.addEventListener('keydown', e => {
  if (changingDirection) return;
  changingDirection = true;
  if (e.key === 'ArrowUp' && dy === 0) {
    dx = 0; dy = -grid;
  } else if (e.key === 'ArrowDown' && dy === 0) {
    dx = 0; dy = grid;
  } else if (e.key === 'ArrowLeft' && dx === 0) {
    dx = -grid; dy = 0;
  } else if (e.key === 'ArrowRight' && dx === 0) {
    dx = grid; dy = 0;
  }
});

gameLoop();