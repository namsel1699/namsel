let gameState = "start";
let player;
let platforms = [];
let goal;
let img;
let chaserImg;
let playerImg;
let startScreenImg; 
let obstacleImg;
let heartImg;
let chaser;
let chaserStartX = 50;
let chaserStartY = 50;
let opacity = 0;

let obstacles = [
  { x: 210 + 200, y: 533, w: 23, h: 23 },
  { x: 60 + 290, y: 333, w: 23, h: 23 },
  { x: 350, y: 100, w: 23, h: 23 }
];

let score = 0;
let gameOver = false;

let currentLevel = 1;
const totalLevels = 6;

let restartButton;

function preload() {
  img = loadImage('Mountain.gif');
  playerImg = loadImage('Dorjee.gif');
  startScreenImg = loadImage('Sky.gif');
  obstacleImg = loadImage('Lynx.gif');
  heartImg = loadImage('Heart.gif');
  chaserImg = loadImage('Police.gif');
}

function setup() {
  createCanvas(706, 675);
  goal = createVector(630, 30);
  player = new Player(65, 620);
  chaser = new AI(50, 50);

  textFont('Courier');

  platforms = [
    new Platform(60, 645, 150, 45),
    new Platform(60 + 150, 645 - 45, 150, 45),
    new Platform(210 + 150, 600 - 45, 150, 45),
    new Platform(360 + 150, 555 - 45, 150, 45),
    new Platform(510 + 150, 510 - 45, 150, 45),
    new Platform(210 + 230, 600 - 200, 150, 45),
    new Platform(60 + 230, 555 - 200, 150, 45),
    new Platform(370 - 230, 510 - 200, 150, 45),
    new Platform(140, 310, 150, 45),
    new Platform(-10, 265, 150, 45),
    new Platform(150, 168, 150, 45),
    new Platform(300, 123, 150, 45),
    new Platform(450, 80, 260, 45)
  ];

  restartButton = createButton("Restart");
  restartButton.position(width / 2 - 40, height / 2 + 20);
  restartButton.mousePressed(restartGame);
  restartButton.hide();
}

function draw() {
  if (gameState === "start") {
    drawStartScreen();
  } else {
    background(img);
    if (gameState === "play") {
      drawPlayScreen();
      chaser.move(player.x, player.y);
      chaser.display();
      checkCollisions();
      
       if (currentLevel >= 6) {
        chaser.move(player.x, player.y);
        chaser.display();
        checkAIPlayerCollision();
      }

      for (let i = 0; i < 3 - score; i++) {
        image(heartImg, -20 + i * 35, -20, 90, 90);
      }

      fill(225);
      textSize(18);
      textAlign(LEFT);
      text("Level: " + currentLevel, 10, 50);
    } else if (gameState === "win") {
      drawWinScreen();
    } else if (gameState === "end") {
      drawEndScreen();
    }
  }
}

function checkCollisions() {
  for (let obs of obstacles) {
    image(obstacleImg, obs.x, obs.y, obs.w, obs.h);

    if (
      player.x + player.w > obs.x &&
      player.x < obs.x + obs.w &&
      player.y + player.h > obs.y &&
      player.y < obs.y + obs.h
    ) {
      score++;
      player.respawn();
      break;
    }
  }
  
  if (score >= 3) {
    gameOver = true;
    gameState = "end";
    restartButton.show();
  }
}

function checkAIPlayerCollision() {
  if (
    chaser.x < player.x + player.w &&
    chaser.x + chaser.w > player.x &&
    chaser.y < player.y + player.h &&
    chaser.y + chaser.h > player.y
  ) {
    player.respawn();
    score++;
    
    // Reset chaser's position
    chaser.x = chaserStartX;
    chaser.y = chaserStartY;
  }
}

function drawStartScreen() {
  background(startScreenImg);
  textAlign(CENTER);
  fill(0);
  textSize(35); 
  text("Journey's Beginning", width / 2, height / 2 - 60);
  textSize(33);
  text("Land of Snow", width / 2, height / 2 - 10);
  textSize(22);
  text("Click Anywhere to Start", width / 2, height / 2 + 30);
}

function drawPlayScreen() {
  player.move();
  player.display();

  for (let p of platforms) {
    p.display();
  }

  fill(0, 255, 0);
  rect(goal.x, goal.y, 40, 40);

  checkWin();
  
  // Display and move AI chaser only at level 6
  if (currentLevel >= 6) {
    chaser.move(player.x, player.y);
    chaser.display();
    checkAIPlayerCollision();
  }
}

function drawWinScreen() {
  background(0, 200, 100);
  textAlign(CENTER);
  fill(255);
  textSize(32);
  text("🎉 You Completed All Levels! 🎉", width / 2, height / 2);
  textSize(20);
  text("Click to Restart", width / 2, height / 2 + 40);
}

function drawEndScreen() {
  background(200, 50, 50);
  textAlign(CENTER);
  fill(255);
  textSize(32);
  text("Game Over", width / 2, height / 2);
  textSize(20);
}

function mousePressed() {
  if (gameState === "start") {
    gameState = "play";
  } else if (gameState === "win" || gameState === "end") {
    restartGame();
  }
}

function restartGame() {
  player.respawn();
  currentLevel = 1;
  score = 0;
  gameState = "start";
  gameOver = false;
  restartButton.hide();
}

function checkWin() {
  if (player.reaches(goal)) {
    currentLevel++;
    if (currentLevel > totalLevels) {
      gameState = "win";
    } else {
      player.respawn();
    }
  }
}

class Platform {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  display() {
    fill(200);
    rect(this.x, this.y, this.w, this.h);
  }
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 30;
    this.h = 40;
    this.ySpeed = 0;
    this.xSpeed = 0;
    this.onGround = false;
    this.jumpCount = 0;
  }

  move() {
    this.xSpeed = 0;
    if (keyIsDown(LEFT_ARROW)) this.xSpeed = -3;
    if (keyIsDown(RIGHT_ARROW)) this.xSpeed = 3;
    this.x += this.xSpeed;

    this.ySpeed += 0.8; 
    this.y += this.ySpeed;
    this.onGround = false;

    for (let p of platforms) {
      if (
        this.x + this.w > p.x &&
        this.x < p.x + p.w &&
        this.y + this.h > p.y &&
        this.y + this.h < p.y + p.h &&
        this.ySpeed >= 0
      ) {
        this.y = p.y - this.h;
        this.ySpeed = 0;
        this.onGround = true;
        this.jumpCount = 0;
      }
    }

    this.x = constrain(this.x, 0, width - this.w);
    if (this.y > height) this.respawn();
  }

  jump() {
    if (this.onGround || this.jumpCount < 2) {
      this.ySpeed = -12;
      this.jumpCount++;
    }
  }

  respawn() {
    this.x = 65;
    this.y = 620;
    this.ySpeed = 0;
    this.jumpCount = 0;
  }

  display() {
    image(playerImg, this.x, this.y, this.w, this.h);
  }

  reaches(goal) {
    return dist(this.x, this.y, goal.x, goal.y) < 30;
  }
}

function keyPressed() {
  if (gameOver) return;
  if (key === ' ' || keyCode === UP_ARROW) {
    player.jump();
  }
}

class AI {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 30;
    this.h = 40;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.speed = 2;
    this.onGround = false;
  }

  move(targetX, targetY) {
    // Set the stopping distance from the player
    let stoppingDistance = 10;

    // Move in x direction toward the player while respecting stopping distance
    if (targetX < this.x - stoppingDistance) {
      this.xSpeed = -this.speed;
    } else if (targetX > this.x + stoppingDistance) {
      this.xSpeed = this.speed;
    } else {
      this.xSpeed = 0;
    }

    this.x += this.xSpeed;

    // Gravity effect and jumping logic
    this.ySpeed += 0.8;
    this.y += this.ySpeed;
    this.onGround = false;

    // Platform collision logic
    for (let p of platforms) {
      if (
        this.x + this.w > p.x &&
        this.x < p.x + p.w &&
        this.y + this.h > p.y &&
        this.y + this.h < p.y + p.h &&
        this.ySpeed >= 0
      ) {
        this.y = p.y - this.h;
        this.ySpeed = 0;
        this.onGround = true;
      }
    }

    // Boundary constraints
    this.x = constrain(this.x, 0, width - this.w);

    // Logic for jumping if needed
    if (targetY < this.y && this.onGround) {
      this.jump();
    }
  }

  jump() {
    if (this.onGround) {
      this.ySpeed = -12;
    }
  }
  
  display() {
    image(chaserImg, this.x, this.y, this.w, this.h);
  }
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', { 
        height: '0', // Hide the player
        width: '0',
        videoId: 'xnpNwuxJBS0?si=epUj88GWCDm6XpXg', // Correctly put only the video ID
        playerVars: {
            'controls': 0, // Hide controls
            'autoplay': 1, // Autoplay the video
            'loop': 1, // Loop the video
            'playlist': 'xnpNwuxJBS0' // Ensure the same video ID for the playlist for looping
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo(); // Start playing the video once ready
    event.target.setVolume(20); // Adjust volume (0-100)
}
