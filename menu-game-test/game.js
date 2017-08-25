let myGamePiece;
let myObstacles = [];
let myEnemies = [];
let enemyBullets = [];
let myBullets = [];
let myScore;
let updatedScore = 0;
let enemiesDestroyed = 0
let obstaclesDestroyed = 0
let gameOver = 0
let myBackground

let enemyBoss;
let level = 1
let bossFight = false
let bossMovement = "up"
let bossesDestroyed = 0
let bossHP = 0

function music() {
  let source;
  switch (menu) {
    case "on":
        source = "Toro_y_Moi_-_Still_Sound_Live__KEXP.mp3"
      break;
    case "off":
      if(bossFight === false){
        source = "Goto80_-_05_-_Soft_Commando.mp3"
      } else{
        source = "Goto80_-_06_-_Monster.wav"
      }
      break;
  }
  document.getElementById('audio').innerHTML = `<audio loop="loop" autoplay="autoplay"><source src="../Sounds/${source}" type="audio/mpeg" /></audio>`
}

function startGame() {
  music()
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

    this.crashWith = function(otherobj, firingSide, index, target) {
        let myleft = this.x;
        let myright = this.x + (this.width - 30);
        let mytop = this.y + 10;
        let mybottom = this.y + (this.height - 10);
        let otherleft = otherobj.x;
        let otherright = otherobj.x + (otherobj.width);
        let othertop = otherobj.y;
        let otherbottom = otherobj.y + (otherobj.height);
        if ( !((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright))) {
            return true
        }
        return false;
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
          if(myEnemies[j].crashWith(myBullets[i], 'friendly')){
            destroyEnemy(i, j, "enemy")
          }
        }
    }
    for (i = 0; i < myBullets.length; i += 1) {
      for (j = 0; j < myObstacles.length; j += 1) {
          if(myObstacles[j].crashWith(myBullets[i], 'friendly')){
            destroyEnemy(i, j, "asteroid")
          }
        }
    }

    if(gameOver === 0) {

      myGameArea.clear();
      myBackground.update();
      myBackground.newPos();
      myBackground.speedX = -1
      myGameArea.frameNo += 1;

      if (bossFight === false){
        if( everyinterval(Math.floor(50/level)) ) {
          x = myGameArea.canvas.width;
          position = Math.floor(Math.random()*(myGameArea.canvas.height - 50));
          myObstacles.push(new component(30, 30, "../Images/aestroid.png", x, position, "image"))
      }
      for (i = 0; i < myObstacles.length; i += 1) {
          myObstacles[i].x += -1;
          myObstacles[i].update();
      }
      if ( everyinterval(Math.floor(200/level)) ) {
            x = myGameArea.canvas.width;
            position = Math.floor(Math.random()*(myGameArea.canvas.height - 50));
            myEnemies.push(new component(60, 60, "../Images/blue_ship.png", x, position, "image"))
        }
        for (i = 0; i < myEnemies.length; i += 1) {
          myEnemies[i].x += -2;
          myEnemies[i].update();
        }
      }


      //BOSS FIGHT

      if(updatedScore > (1000 * level)){
        myEnemies = []
        myObstacles = []
        enemyBullets = []
        bossHP = (20 * level)
        level +=100
        bossFight = true
        music()
        createBoss()
      }

      if (bossFight === true) {
        myBackground.speedX = 0
        if(enemyBoss.x > 700) {
          enemyBoss.x += -4;
          enemyBoss.update();
        }

        if(enemyBoss.y + 600 === window.innerHeight) {
          bossMovement = "up"
        } else if (enemyBoss.y === 0) {
          bossMovement = "down"
        }

        if(bossMovement === "up"){
          enemyBoss.y += -1;
        } else if (bossMovement = "down"){
          enemyBoss.y += 1;
        }

        enemyBoss.update()

        if(everyinterval(150)){
          x = enemyBoss.x
          y1 = enemyBoss.y
          y2 = enemyBoss.y + ( Math.floor(enemyBoss.height * 0.75/3) )
          y3 = enemyBoss.y + ( Math.floor(enemyBoss.height / 2 ) )
          y4 = enemyBoss.y + ( Math.floor(enemyBoss.height * 3/4.0) )
          y5 = enemyBoss.y + enemyBoss.height
          enemyBullets.push(new component(60, 30, "../Images/bullet_blue.png", x, y1, "image" ));
          enemyBullets.push(new component(60, 30, "../Images/bullet_blue.png", x, y2, "image" ));
          enemyBullets.push(new component(60, 30, "../Images/bullet_blue.png", x, y3, "image" ));
          enemyBullets.push(new component(60, 30, "../Images/bullet_blue.png", x, y4, "image" ));
          enemyBullets.push(new component(60, 30, "../Images/bullet_blue.png", x, y5, "image" ));
        }

        for (i = 0; i < myBullets.length; i += 1) {
          if(enemyBoss.crashWith(myBullets[i], 'friendly', j, "enemy")) {
            destroyEnemy(i)
            bossHP--
            if(bossHP === 0){
              bossFight = false
              destroyEnemy(null,null, "boss")
              break;
            }
          }
        }

      }
        //

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
        if(myBullets[i].x > window.innerWidth){
          destroyEnemy(i)
        }
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

function createBoss() {
  x = window.innerWidth;
  position = Math.floor( window.innerHeight /8 );
  enemyBoss = new component(600, 600, "../Images/blue_boss.png", x, position, "image");
}

function destroyEnemy(i, j, target) {
  myBullets.splice(i, 1)
  switch (target) {
    case "enemy":
      myEnemies.splice(j, 1)
      enemiesDestroyed++
      break;
    case "asteroid":
      myObstacles.splice(j, 1)
      obstaclesDestroyed++
      break;
    case "boss":
      debugger
      enemyBoss = null
      bossesDestroyed++
      break;
    default:
  }

}

function updateScore() {
    updatedScore = myGameArea.frameNo + (enemiesDestroyed * 500) + (obstaclesDestroyed * 100) + (bossesDestroyed * 1000)
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
    y = myGamePiece.y + ( (myGamePiece.height / 2 ) - 27)
    myBullets.push(new component(50, 50, "../Images/bullet_red.png", x, y, "image" ));
}

function endGameScreen() {
  scores.sortScoreArray()
  if (scores.scoreList[9] && scores.scoreList[9].score > updatedScore) {
    setHighScoresListeners()
    menuAction = 3
  } else {
    menuAction = 2
    if (scores.scoreList[9]) {
      scores.deleteScore(scores.scoreList[9].id)
    }
    }
  startFadeOut()
  removeEventListeners()
  finalScore = updatedScore
  reset()
  setEndGameListeners()
  menu = "on"
  music()
}

function reset() {
    myObstacles = [];
    myEnemies = [];
    enemyBullets = [];
    myBullets = [];
    myScore = 0;
    updatedScore = 0;
    enemiesDestroyed = 0
    bossFight = false
    bossEnemy = null
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
