let menuAction;
let scoreScreen = false
let finalScore = 0

let menu = "on"
let scores = new ScoreList

var canvas = myGameArea.canvas;
var context = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;

var logoImage = new Image();
var highScoreImage = new Image();
var playImage = new Image();
var bgImage = new Image();


var buttonX = [620, 535];
var buttonY = [200,300];
var buttonWidth = [620,535];
var buttonHeight = [200,300];

var scoreWidth = canvas.width/2 + this.width + this.width/3

var scoreX = [scoreWidth,scoreWidth,scoreWidth,scoreWidth,scoreWidth,scoreWidth,scoreWidth,scoreWidth,scoreWidth,scoreWidth,650]
var scoreY = [200,240,280,320,360,400,440,480,520,560]

logoImage.src = "../Images/logo.png";
playImage.src = "../Images/play_buttons.png";
highScoreImage.src = "../Images/score_buttons.png";
bgImage.src = "../Images/Background.png";

var initialX = [550, 650, 750]
var initialY = [500, 500, 500]

function updateMenu() {
  myGameArea.clear();
  move();
  draw();
}

var backgroundY = 0;
var speed = 0.5;

function move(){
  backgroundY -= speed;
  if(backgroundY === (-window.innerHeight)){
      backgroundY = 0;
  }
}

let letterIndex = 0;
let selectedLetter = 0;
let firstLetter = "_"
let secondLetter = "_"
let thirdLetter = "_"


function draw() {
context.drawImage(bgImage, 0, backgroundY, window.innerWidth, window.innerHeight * 2);
context.drawImage(logoImage, window.innerWidth/2 - logoImage.width/2,10);
switch (menuAction) {
  case 0:
    menu = "off"
    startGame()
    break;
  case 1:
    setHighScoresListeners() //put in a location to set once
    context.fillText("Press esc for menu", window.innerWidth/2 - this.width/2, 650)
    drawScores.call(scores)
    break;
  case 2:
    context.fillStyle= 'white'
    context.font="50px Timeburner"
    context.fillText(`Score: ${finalScore}`, scoreX[3], scoreY[3])
    context.fillText(firstLetter, initialX[0], initialY[0])
    context.fillText(secondLetter, initialX[1], initialY[1])
    context.fillText(thirdLetter, initialX[2], initialY[2])
    switch (selectedLetter) {
      case 0:
        firstLetter = genCharArray()[letterIndex]
        break;
      case 1:
        secondLetter = genCharArray()[letterIndex]
        break;
      case 2:
        thirdLetter = genCharArray()[letterIndex]
        break;
    }
    break;
  case 3:
    context.fillStyle= 'white'
    context.font="50px Timeburner"
    context.fillText(`Score: ${finalScore}`, scoreX[3], scoreY[3])
    context.fillText("Press esc for menu", window.innerWidth/2 - this.width/2 - this.width/4, 650)
    break;
  default:
    context.drawImage(playImage, buttonX[0], buttonY[0]);
    context.drawImage(highScoreImage, buttonX[1], buttonY[1]);
  }
}

function drawScores(){
  let i = 0;
  context.fillStyle= 'white'
  context.font="30px Timeburner";
  scores.renderAll().forEach(score => {
    context.fillText(score, scoreX[i], scoreY[i])
    i++
  })
}

var mouseX;
var mouseY;
let selection;

function setHighScoresListeners(){
  document.body.addEventListener('keyup', exitToMenu)
}

function exitToMenu(){
  if(event.key === "Escape"){
    removeHighScoresListeners()
    setMenuListeners()
    startFadeOut()
    menuAction = null
  }
}

function removeHighScoresListeners(){
  document.body.removeEventListener('keyup', exitToMenu)
}

function setMenuListeners(){
  canvas.addEventListener("mousemove", checkPos);
  canvas.addEventListener("mouseup", checkClick);
}

function checkPos(mouseEvent){
    mouseX = mouseEvent.pageX - this.offsetLeft;
    mouseY = mouseEvent.pageY - this.offsetTop;

    for(i = 0; i < buttonX.length; i++){
      if(mouseX > buttonX[i] && mouseX < buttonX[i] + buttonWidth[i]){
        if(mouseY > buttonY[i] && mouseY < buttonY[i] + buttonHeight[i]){
            selection = i
        }
      }
    }
}

function checkClick(mouseEvent){
    for(i = 0; i < buttonX.length; i++){
        if(mouseX > buttonX[i] && mouseX < buttonX[i] + buttonWidth[i]){
            if(mouseY > buttonY[i] && mouseY < buttonY[i] + buttonHeight[i]){
              startFadeOut()
              menuAction = selection
              canvas.removeEventListener("mousemove", checkPos);
              canvas.removeEventListener("mouseup", checkClick);
            }
        }
    }
}

function setEndGameListeners(){
  document.getElementById('body').addEventListener('keyup', keyUpListener)
}

function keyUpListener(){
  switch (event.key) {
    case "d":
    case "ArrowRight":
      if (selectedLetter === 2) {
        selectedLetter = 0;
      } else {
        selectedLetter++
      }
      break;
    case "a":
    case "ArrowLeft":
      if (selectedLetter === 0) {
        selectedLetter = 2;
      } else {
        selectedLetter--
      }
      break;
    case "W":
    case "ArrowUp":
      if (letterIndex === 25) {
        letterIndex = 0;
      } else {
        letterIndex++
      }
      break;
    case "s":
    case "ArrowDown":
      if (letterIndex === 0) {
        letterIndex = 25;
      } else {
        letterIndex--
      }
      break;
    case "Enter":
      startFadeOut()
      removeListeners()
      if (menuAction === 2) {
        let name = firstLetter + secondLetter + thirdLetter
        scores.addScore({initials: name, score: finalScore})
        scores.sortScoreArray()
      }
      setMenuListeners()
      menuAction = null
      break;
  }
}

function removeListeners(){
  document.body.removeEventListener('keyup', keyUpListener)
}

var time = 0.0;
var fadeId = 0;

function startFadeOut(){
  time = 0.0
  clearInterval(myGameArea.interval)
  fadeId = setInterval(fadeOut, 1000/frames);
}

function fadeOut(){
    context.fillStyle = "rgba(0,0,0, 0.05)";
    context.fillRect (0, 0, window.innerWidth, window.innerHeight + 500);
    time += 0.1;
    if(time >= 10){
        clearInterval(fadeId);
        createGameInterval.call(myGameArea)
    }
}

document.addEventListener("DOMContentLoaded", function () {
  music()
  setMenuListeners()
  myGameArea.start();
})
