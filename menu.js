var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
var width = canvas.getAttribute('width');
var height = canvas.getAttribute('height');

var logoImage = new Image();
var highScoreImage = new Image();
var playImage = new Image();
var bgImage = new Image();

logoImage.src = "../Images/logo.png";
playImage.src = "../Images/play.png";
highScoreImage.src = "../Images/highscores.png";
bgImage.src = "../Images/Background.png";

var buttonX = [192,110,149,160];
var buttonY = [100,140,180,220];
var buttonWidth = [96,260,182,160];
var buttonHeight = [40,40,40,40];


// logoImage.onload = function(){
//     context.drawImage(logoImage, 200, -10);
// }
// playImage.onload = function(){
//     context.drawImage(playImage, buttonX[0], buttonY[0]);
// }
// highScoreImage.onload = function(){
//     context.drawImage(highScoreImage, buttonX[3], buttonY[3]);
// }
// bgImage.onload = function(){
//     context.drawImage(bgImage, 0, 0);
// };


var frames = 30;
var timerId = 0;
 
timerId = setInterval(update, 1000/frames);

function update() {
    clear();
    move();
    draw();
}

function clear(){
    context.clearRect(0, 0, width, height);
}

var backgroundY = 0;
var speed = 1;

function move(){
    backgroundY -= speed;
    if(backgroundY == -1 * height){
        backgroundY = 0;
    }
}

function draw() {

context.drawImage(bgImage, 0, backgroundY);
context.drawImage(logoImage, 200,-10);
context.drawImage(playImage, buttonX[0], buttonY[0]);
context.drawImage(highScoreImage, buttonX[3], buttonY[3]);

}


var mouseX;
var mouseY;
 
canvas.addEventListener("mousemove", checkPos);

function checkPos(mouseEvent){
    mouseX = mouseEvent.pageX - this.offsetLeft;
    mouseY = mouseEvent.pageY - this.offsetTop;

    for(i = 0; i < buttonX.length; i++){
    if(mouseX > buttonX[i] && mouseX < buttonX[i] + buttonWidth[i]){
        if(mouseY > buttonY[i] && mouseY < buttonY[i] + buttonHeight[i]){
            console.log(`on button, ${i}`)
        }
    }else{
         console.log("off button")
        }
    }
}


2
var fadeId = 0;
canvas.addEventListener("mouseup", checkClick);

function checkClick(mouseEvent){
    for(i = 0; i < buttonX.length; i++){
        if(mouseX > buttonX[i] && mouseX < buttonX[i] + buttonWidth[i]){
            if(mouseY > buttonY[i] && mouseY < buttonY[i] + buttonHeight[i]){
               fadeId = setInterval("fadeOut()", 1000/frames);
                clearInterval(timerId);
                canvas.removeEventListener("mousemove", checkPos);
                canvas.removeEventListener("mouseup", checkClick);  
            }
        }
    }
}

var time = 0.0;

function fadeOut(){
    context.fillStyle = "rgba(0,0,0, 0.2)";
    context.fillRect (0, 0, width, height);
    time += 0.1;
    if(time >= 2){
        clearInterval(fadeId);
        time = 0;
        timerId = setInterval("update()", 1000/frames);
        canvas.addEventListener("mousemove", checkPos);
        canvas.addEventListener("mouseup", checkClick);
    }
}