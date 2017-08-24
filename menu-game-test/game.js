let myGamePiece;
let myObstacles = [];
let myEnemies = [];
let enemyBullets = [];
let myBullets = [];
let myScore;
let updatedScore = 0;
let enemiesDestroyed = 0
let gameOver = 0

function startGame() {
  setEventListeners()
  myGamePiece = new component(50, 50, "red", 50, 200);
  myGamePiece.gravity = 100;
  myScore = new component("50px", "Consolas", "black", 280, 40, "text");
  myGameArea.play();
}

function createGameInterval(){
  this.interval = setInterval(updateGameArea, 30); //speed, lower = faster, framerate, 1000 times/sec
}

let myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 800;
        this.canvas.height = 600;
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
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed = this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
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
        let myright = this.x + (this.width);
        let mytop = this.y;
        let mybottom = this.y + (this.height);
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
      myGameArea.frameNo += 1;
      if (myGameArea.frameNo == 1 || everyinterval(300)) {
        x = myGameArea.canvas.width;
        minHeight = 20; //change to increase size of obstacles
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 200;
        maxGap = myGameArea.canvas.height;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(10, height, "green", x, 0));
        myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
      }
      for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
      }
      if (everyinterval(200)) {
        x = myGameArea.canvas.width;
        position = Math.floor(Math.random()*(myGameArea.canvas.height));
        myEnemies.push(new component(35, 35, "blue", x, position));
      }
      for (i = 0; i < myEnemies.length; i += 1) {
        myEnemies[i].x += -2;
        myEnemies[i].update();
      }
      if (everyinterval(200)) {
        for (i = 0; i < myEnemies.length; i += 1) {
          x = myEnemies[i].x
          y = myEnemies[i].y + ( myEnemies[i].height / 2 )
          enemyBullets.push(new component(20, 5, "orange", x, y ));
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
    myBullets.push(new component(20, 5, "black", x, y ));
}

function endGameScreen() {
  startFadeOut()
  removeEventListeners()
  finalScore = updatedScore
  reset()
  setEndGameListeners()
  menu = "on"
  menuAction = 2
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
