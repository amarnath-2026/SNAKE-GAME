// script.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const upBtn = document.getElementById('up');
const downBtn = document.getElementById('down');
const leftBtn = document.getElementById('left');
const rightBtn = document.getElementById('right');
const restartBtn = document.getElementById('restart');

const gridSize = 20;
let canvasSize = 400; // Default size
let tileCount = canvasSize / gridSize;

canvas.width = canvasSize;
canvas.height = canvasSize;

// Adjust canvas for smaller screens
function resizeCanvas() {
    const maxSize = Math.min(window.innerWidth - 40, window.innerHeight / 2, 400);
    canvasSize = Math.floor(maxSize / gridSize) * gridSize; // Ensure divisible by grid
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    tileCount = canvasSize / gridSize;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let snake = [{ x: Math.floor(tileCount / 2), y: Math.floor(tileCount / 2) }];
let food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
let direction = { x: 0, y: 0 };
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameInterval;
let speed = 150; // Initial speed in ms (slower for professional feel)

highScoreElement.textContent = `High Score: ${highScore}`;

function draw() {
    // Clear canvas
    ctx.fillStyle = '#1e1e1e';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Draw snake with neon effect
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#00ff00' : '#00cc00'; // Head brighter
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 10;
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        ctx.shadowBlur = 0; // Reset shadow
    });

    // Draw food with neon effect
    ctx.fillStyle = '#ff0000';
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 10;
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    ctx.shadowBlur = 0;
}

function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // Check self collision
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    // Check if food eaten
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = `Score: ${score}`;
        food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };

        // Increase speed every 5 points
        if (score % 5 === 0) {
            speed = Math.max(50, speed - 10);
            clearInterval(gameInterval);
            gameInterval = setInterval(update, speed);
        }
    } else {
        snake.pop();
    }

    draw();
}

function changeDirection(newDir) {
    // Prevent reversing direction
    if (newDir.x !== -direction.x || newDir.y !== -direction.y) {
        direction = newDir;
    }
}

function gameOver() {
    clearInterval(gameInterval);
    alert(`Game Over! Your score: ${score}`);
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreElement.textContent = `High Score: ${highScore}`;
    }
}

function startGame() {
    resizeCanvas();
    snake = [{ x: Math.floor(tileCount / 2), y: Math.floor(tileCount / 2) }];
    food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
    direction = { x: 0, y: 0 };
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    speed = 150;
    clearInterval(gameInterval);
    gameInterval = setInterval(update, speed);
    draw();
}

// Keyboard controls
document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp': changeDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': changeDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': changeDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': changeDirection({ x: 1, y: 0 }); break;
    }
});

// Touch controls
upBtn.addEventListener('click', () => changeDirection({ x: 0, y: -1 }));
downBtn.addEventListener('click', () => changeDirection({ x: 0, y: 1 }));
leftBtn.addEventListener('click', () => changeDirection({ x: -1, y: 0 }));
rightBtn.addEventListener('click', () => changeDirection({ x: 1, y: 0 }));

// Restart button
restartBtn.addEventListener('click', startGame);

// Initial start
startGame();