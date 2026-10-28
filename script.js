console.log("Crazy Space Game Started!");


// ==============================
// ELEMENTS
// ==============================

const game = document.getElementById("game");

const player = document.getElementById("player");

const enemies = document.querySelectorAll(".enemy");

const coin = document.getElementById("coin");

const shield = document.getElementById("shield");

const scoreText = document.getElementById("score");

const livesText = document.getElementById("lives");

const levelText = document.getElementById("level");

const highScoreText = document.getElementById("highScore");

const startScreen = document.getElementById("startScreen");

const gameOverScreen = document.getElementById("gameOver");

const startButton = document.getElementById("startButton");

const restartButton = document.getElementById("restartButton");

const finalScore = document.getElementById("finalScore");

const finalHighScore = document.getElementById("finalHighScore");

const hitEffect = document.getElementById("hitEffect");


// ==============================
// GAME VARIABLES
// ==============================

let playerX = 320;

let score = 0;

let lives = 3;

let level = 1;

let speed = 4;

let gameRunning = false;

let shieldActive = false;

let shieldTime = 0;


// High score
let highScore =
    Number(localStorage.getItem("crazyHighScore")) || 0;

highScoreText.innerText = highScore;


// ==============================
// ENEMY DATA
// ==============================

let enemyData = [];


// Create data for every enemy

enemies.forEach(function(enemy, index) {

    enemyData.push({

        element: enemy,

        x: Math.floor(Math.random() * 630),

        y: -100 - (index * 180),

        speed: speed + index

    });

});


// ==============================
// COIN
// ==============================

let coinX = 200;

let coinY = -100;


// ==============================
// SHIELD
// ==============================

let shieldX = 400;

let shieldY = -500;


// ==============================
// START GAME
// ==============================

startButton.addEventListener("click", function() {

    startScreen.style.display = "none";

    gameRunning = true;

});


// ==============================
// RESTART GAME
// ==============================

restartButton.addEventListener("click", function() {

    location.reload();

});


// ==============================
// PLAYER MOVEMENT
// ==============================

document.addEventListener("keydown", function(event) {

    if (!gameRunning) {
        return;
    }


    // Left

    if (
        event.key === "ArrowLeft" ||
        event.key.toLowerCase() === "a"
    ) {

        if (playerX > 0) {

            playerX -= 25;

        }

    }


    // Right

    if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
    ) {

        if (playerX < 630) {

            playerX += 25;

        }

    }


    player.style.left = playerX + "px";

});


// ==============================
// MAIN GAME LOOP
// ==============================

setInterval(function() {

    if (!gameRunning) {
        return;
    }


    // ==========================
    // ENEMIES
    // ==========================

    enemyData.forEach(function(enemy) {

        enemy.y += speed + 1;


        // Enemy reached bottom

        if (enemy.y > 560) {

            enemy.y = -70;

            enemy.x =
                Math.floor(Math.random() * 630);


            score++;

            updateScore();

        }


        enemy.element.style.left =
            enemy.x + "px";

        enemy.element.style.top =
            enemy.y + "px";


        // Collision

        if (
            isColliding(
                player,
                enemy.element
            )
        ) {

            hitEnemy(enemy);

        }

    });


    // ==========================
    // COIN MOVEMENT
    // ==========================

    coinY += 4;


    if (coinY > 560) {

        coinY = -50;

        coinX =
            Math.floor(Math.random() * 630);

    }


    coin.style.left =
        coinX + "px";

    coin.style.top =
        coinY + "px";


    // Coin collected

    if (
        isColliding(player, coin)
    ) {

        score += 5;

        updateScore();

        coinY = -100;

    }


    // ==========================
    // SHIELD MOVEMENT
    // ==========================

    if (score >= 5) {

        shieldY += 2;


        if (shieldY > 560) {

            shieldY = -500;

            shieldX =
                Math.floor(Math.random() * 630);

        }


        shield.style.display = "block";

        shield.style.left =
            shieldX + "px";

        shield.style.top =
            shieldY + "px";


        // Shield collected

        if (
            isColliding(player, shield)
        ) {

            shieldActive = true;

            shieldTime = 5000;

            shieldY = -500;

            shield.style.display = "none";

            player.classList.add(
                "shieldActive"
            );

        }

    }


    // ==========================
    // SHIELD TIMER
    // ==========================

    if (shieldActive) {

        shieldTime -= 40;


        if (shieldTime <= 0) {

            shieldActive = false;

            player.classList.remove(
                "shieldActive"
            );

        }

    }


}, 40);


// ==============================
// ENEMY HIT
// ==============================

function hitEnemy(enemy) {


    // Shield protects player

    if (shieldActive) {

        enemy.y = -100;

        enemy.x =
            Math.floor(Math.random() * 630);

        return;

    }


    // Lose life

    lives--;

    updateLives();


    // Explosion effect

    showExplosion();


    // Reset enemy

    enemy.y = -100;

    enemy.x =
        Math.floor(Math.random() * 630);


    // Game over

    if (lives <= 0) {

        endGame();

    }

}


// ==============================
// UPDATE SCORE
// ==============================

function updateScore() {

    scoreText.innerText = score;


    // Level increases every 10 score

    level =
        Math.floor(score / 10) + 1;


    levelText.innerText = level;


    // Increase speed

    speed =
        4 + (level - 1) * 0.8;

}


// ==============================
// UPDATE LIVES
// ==============================

function updateLives() {

    livesText.innerText = lives;

}


// ==============================
// COLLISION
// ==============================

function isColliding(a, b) {

    const rectA =
        a.getBoundingClientRect();

    const rectB =
        b.getBoundingClientRect();


    return (

        rectA.left < rectB.right &&

        rectA.right > rectB.left &&

        rectA.top < rectB.bottom &&

        rectA.bottom > rectB.top

    );

}


// ==============================
// EXPLOSION
// ==============================

function showExplosion() {

    hitEffect.style.display = "block";

    hitEffect.style.left =
        (playerX - 10) + "px";

    hitEffect.style.top =
        "430px";


    setTimeout(function() {

        hitEffect.style.display = "none";

    }, 400);

}


// ==============================
// GAME OVER
// ==============================

function endGame() {

    gameRunning = false;


    // Save high score

    if (score > highScore) {

        highScore = score;

        localStorage.setItem(
            "crazyHighScore",
            highScore
        );

    }


    finalScore.innerText =
        score;

    finalHighScore.innerText =
        highScore;


    gameOverScreen.style.display =
        "flex";

}