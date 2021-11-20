//Maybe turn these two arrays into JSON? 
const buttons = ["Start", "Continue", "How to Play", "Settings"];
const buttonClicks = ["start()", "continueGame()", "howToPlay()", "settings()"];

var userName;
var audio = new Audio("bgm.mp3"); //BGM
audio.loop = true;
const shapeNum = 6; //Number of shapes 
var shapeArr = new Array(shapeNum); //Shape Array

var displayShapes = 4; // Number of shapes visible on gameboard (Changes on difficulty)
var gameArray= new Array(displayShapes);

for(var i = 1; i <= shapeNum; i++){
   shapeArr[i-1] = "shapes/shape" + i + ".png";//Assign each shape into ARRAY
}

//Prepare GAME MENU when window loaded
window.onload = function () {

   userName = prompt("Username:", ""); //FUNCTIONAL REQUIREMENT: Prompt for a username
   audio.play(); //FUNCTIONAL REQUIREMENT: Audio

   //OPTION BUTTONS
   for (var i = 1; i <= 4; i++) {
      var btn = document.createElement("button");

      $(btn).html(buttons[i - 1]);
      $(btn).attr("id", "btn" + i);
      $(btn).attr("onclick", buttonClicks[i - 1]);

      $("nav").append(btn);
   }
};


/* Fisher-Yates Shuffle to generate subset of main shape array list
* Parameters:
* New size of array - displayShapes
* Masterlist of shapes- list
*/
function generateArray(displayShapes, shapeArr){
   var shuffled = shapeArr.slice(0);
   var i = shapeArr.length;
   var min = i - displayShapes;
   var temp;
   var index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

//Start Game Function
function start(){
   $(".gameBoard").empty();//Empty the gameboard
   
   //Generate Random Array of Shapes
   gameArray = generateArray(displayShapes, shapeArr);
   
   //Display shapes on gameboard
   for (var i = 0; i < gameArray.length; i++) {
      //Generate shapes onto gameboard, randomized
      var img = document.createElement("img");
      $(img).attr("src", gameArray[i]);
      $(img).attr("class", "shape");
      $("#gameBoard").append(img);
   }
}
function continueGame(){
   $(".gameBoard").empty();//Empty the gameboard
   
   
}
function howToPlay(){
   $(".gameBoard").empty();//Empty the gameboard
   
}
function settings(){
   $(".gameBoard").empty();//Empty the gameboard

}
