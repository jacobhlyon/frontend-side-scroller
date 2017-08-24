let myGamePiece;
let myObstacles = [];
let myEnemies = [];
let enemyBullets = [];
let myBullets = [];
let myScore;
let updatedScore = 0;
let enemiesDestroyed = 0
let gameOver = 0
let myBackground

function startGame() {
  setEventListeners()
  myGamePiece = new component(75, 75, "../Images/red_ship.png", 50, 200, "image");
  myGamePiece.gravity = 100;
  myScore = new component("50px", "Timeburner", "white", 280, 40, "text");
  myBackground = new component(window.innerWidth, window.innerHeight, "../Images/space.jpg", 0, 0, "background");
  myGameArea.play();
}

function createGameInterval(){
  this.interval = setInterval(updateGameArea, 7); //speed, lower = faster, framerate, 1000 times/sec
}

let myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        createGameInterval.call(this)
        },
    play : function () {
        gameOver = 0
        this.frameNo = 0;
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (this.type == "image" || this.type == "background") {
      this.image = new Image()
      this.image.src = color
    }
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else if (this.type == "image" || this.type == "background") {
            ctx.drawImage(this.image,
            this.x,
            this.y,
            this.width, this.height)
            if (type == "background") {
                ctx.drawImage(this.image,
                this.x + this.width, this.y, this.width, this.height);
            }
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed = this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        if (this.type == "background") {
            if (this.x == -(this.width)) {
                this.x = 0;
            }
        }
        this.hitBottom();
        this.hitTop()
    }
    this.hitBottom = function() {
        let rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }

    this.hitTop = function() {
      if (this.y < 0 ) {
        this.y = 0
        this.gravitySpeed = 0;
      }
    }

    this.crashWith = function(otherobj, firingSide, index) {
        let myleft = this.x;
        let myright = this.x + (this.width - 30);
        let mytop = this.y + 10;
        let mybottom = this.y + (this.height - 10);
        let otherleft = otherobj.x;
        let otherright = otherobj.x + (otherobj.width);
        let othertop = otherobj.y;
        let otherbottom = otherobj.y + (otherobj.height);
        let crash = false;
        if ( !((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright))) {
            if (firingSide === 'enemy') {
              crash = true;
            } else if (firingSide === 'friendly') {
              destroyEnemy(index);
            }
        }
        return crash;
    }
}

function updateGameArea() {
  if(menu === "on") {
    updateMenu()
  } else {
    let x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i], 'enemy')) {
          gameOver = 1
        }
    }
    for (i = 0; i < myEnemies.length; i += 1) {
        if (myGamePiece.crashWith(myEnemies[i], 'enemy')) {
          gameOver = 1
        }
    }
    for (i = 0; i < enemyBullets.length; i += 1) {
        if (myGamePiece.crashWith(enemyBullets[i], 'enemy')) {
          gameOver = 1
        }
    }
    for (i = 0; i < myBullets.length; i += 1) {
      for (j = 0; j < myEnemies.length; j += 1) {
          myEnemies[j].crashWith(myBullets[i], 'friendly', j)
        }
    }

    if(gameOver === 0) {

      myGameArea.clear();
      myBackground.update();
      myBackground.newPos();
      myBackground.speedX = -1
      myGameArea.frameNo += 1;

      if (myGameArea.frameNo == 1 || everyinterval(300)) {

        x = myGameArea.canvas.width;
        minHeight = 20; //change to increase size of obstacles
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 200;
        maxGap = myGameArea.canvas.height;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(40, height, "../Images/aestroid.png", x, 0, "image"));
        myObstacles.push(new component(40, x - height - gap, "../Images/aestroid.png", x, height + gap, "image"));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    if (everyinterval(200)) {
          x = myGameArea.canvas.width;
          position = Math.floor(Math.random()*(myGameArea.canvas.height));
          myEnemies.push(new component(50, 50, "../Images/blue_ship.png", x, position, "image"));
      }
      for (i = 0; i < myEnemies.length; i += 1) {
        myEnemies[i].x += -2;
        myEnemies[i].update();
      }
      if (everyinterval(200)) {
        for (i = 0; i < myEnemies.length; i += 1) {
          x = myEnemies[i].x
          y = myEnemies[i].y + ( myEnemies[i].height / 2 )
          enemyBullets.push(new component(40, 20, "../Images/bullet_blue.png", x, y, "image" ));
        }
      }
      for (i = 0; i < enemyBullets.length; i += 1) {
        enemyBullets[i].x += -5;
        enemyBullets[i].update();
      }
      for (i = 0; i < myBullets.length; i += 1) {
        myBullets[i].x += 7;
        myBullets[i].update();
      }
      myScore.text="SCORE: " + updateScore()
      myScore.update();
      myGamePiece.newPos();
      myGamePiece.update();
    } else {
      endGameScreen()
    }
  }
}

function destroyEnemy(i) {
    myEnemies.splice(i, 1)
    enemiesDestroyed++
}

function updateScore() {
    updatedScore = myGameArea.frameNo + (enemiesDestroyed * 1000)
    return updatedScore
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}

function shootGun() {
    x = myGamePiece.x
    y = myGamePiece.y + ( myGamePiece.height / 2 )
    myBullets.push(new component(50, 50, "../Images/bullet_red.png", x, y, "image" ));
}

function endGameScreen() {
  scores.sortScoreArray()
  if (scores.scoreList[9] && scores.scoreList[9].score > updatedScore) {
      menuAction = 3
  } else {
    if (scores.scoreList[9]) {
      scores.deleteScore(scores.scoreList[9].id)
    }
    menuAction = 2
    }
  startFadeOut()
  removeEventListeners()
  finalScore = updatedScore
  reset()
  setEndGameListeners()
  menu = "on"
}

function reset() {
    myObstacles = [];
    myEnemies = [];
    enemyBullets = [];
    myBullets = [];
    myScore = 0;
    updatedScore = 0;
    enemiesDestroyed = 0
}

function setKeydownListener(){
  if(event.key === "w" || event.key === "ArrowUp" ) { //up
    accelerate(-2)
  } else if (event.key === "s" || event.key === "ArrowDown") { //down
    accelerate(2)
  }
}

function setKeyupListener() {
  if (event.key === "w" ||
  event.key === "ArrowUp" ||
  event.key === "s" ||
  event.key === "ArrowDown") {
    accelerate(0)
  } else if(event.which === 32) { //space
    shootGun();
  }
}

function setEventListeners() {
  document.getElementById('body').addEventListener('keydown', setKeydownListener)
  document.getElementById('body').addEventListener('keyup', setKeyupListener)
}

function removeEventListeners(){
  document.body.removeEventListener('keydown', setKeydownListener)
  document.body.removeEventListener('keyup', setKeyupListener)
}
