
document.addEventListener("DOMContentLoaded", function () {

    loadMenu()

 })

 function loadMenu(endGame, endScore) {

   let scoreScreen = endGame
    myGameArea.start();

    scores = new ScoreList

    var canvas = myGameArea.canvas;
    var context = canvas.getContext("2d");
    var width = canvas.width;
    var height = canvas.height;

    var logoImage = new Image();
    var highScoreImage = new Image();
    var playImage = new Image();
    var bgImage = new Image();

    logoImage.src = "../Images/logo.png";
    playImage.src = "../Images/play.png";
    highScoreImage.src = "../Images/highscores.png";
    bgImage.src = "../Images/Background.png";

    var buttonX = [192,192];
    var buttonY = [100,160];
    var buttonWidth = [96,260,182,160];
    var buttonHeight = [40,40,40,40];

    var scoreX = [(width/3),(width/3),(width/3),(width/3),(width/3),(width/3),(width/3),(width/3),(width/3),(width/3)]
    var scoreY = [100,150,200,250,300,350,400,450,500,550]

    var initialX = [300, 400, 500]
    var initialY = [150, 150, 150]

    var framesRate = 30;
    var timerId = 0;

    timerId = setInterval(update, 1000/framesRate);

    function update() {
        myGameArea.clear();
        move();
        draw();
    }

    var backgroundY = 0;
    var speed = 1;

    function move(){
        backgroundY -= speed;
        if(backgroundY == -1 * height){
            backgroundY = 0;
        }
    }

    let selectedLetter = 0;
    let firstLetter = "_"
    let secondLetter = "_"
    let thirdLetter = "_"

    function draw() {
      if (scoreScreen) {
        context.drawImage(bgImage, 0, backgroundY);
        context.drawImage(logoImage, 200,-10);
        context.fillStyle= 'white'
        context.font="50px Georgia"
        context.fillText(endScore, scoreX[0], scoreY[0])
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
      }
      else {
        switch (menuAction) {
          case 1:
            context.drawImage(bgImage, 0, backgroundY);
            context.drawImage(logoImage, 200,-10);
            drawScores()
            break;
          default:
            context.drawImage(bgImage, 0, backgroundY);
            context.drawImage(logoImage, 200,-10);
            context.drawImage(playImage, buttonX[0], buttonY[0]);
            context.drawImage(highScoreImage, buttonX[1], buttonY[1]);
        }
      }
    }

    function drawScores(){
      let i = 0;
      context.fillStyle= 'white'
      context.font="50px Georgia";
      scores.renderAll().forEach(score => {
        context.fillText(score, scoreX[i], scoreY[i])
        i++
      })
    }


    var mouseX;
    var mouseY;
    let selection;

    canvas.addEventListener("mousemove", checkPos);

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



    let menuAction
    var fadeId = 0;

    canvas.addEventListener("mouseup", checkClick);

    function checkClick(mouseEvent){
        for(i = 0; i < buttonX.length; i++){
            if(mouseX > buttonX[i] && mouseX < buttonX[i] + buttonWidth[i]){
                if(mouseY > buttonY[i] && mouseY < buttonY[i] + buttonHeight[i]){
                  menuAction = selection
                  clearInterval(timerId);
                  fadeId = setInterval(fadeOut, 1000/framesRate);
                  canvas.removeEventListener("mousemove", checkPos);
                  canvas.removeEventListener("mouseup", checkClick);
                }
            }
        }
    }

    let letterIndex = 0;

    if(scoreScreen){
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
          scoreScreen = false
          clearInterval(timerId)
          removeListeners()
          let name = firstLetter + secondLetter + thirdLetter
          scores.addScore({initials: name, score: endScore})
          loadMenu()
          break;
      }
    }

    function removeListeners(){
      document.body.removeEventListener('keyup', keyUpListener)
    }

    var time = 0.0;

    function fadeOut(){
        context.fillStyle = "rgba(0,0,0, 0.2)";
        context.fillRect (0, 0, width, height);
        time += 0.1;
        if(time >= 2){
            clearInterval(fadeId);
            switch (menuAction) {
              case 0:
                startGame()
                break;
              case 1:
                timerId = setInterval(update, 1000/framesRate);
                break;
            }
        }
    }
}
