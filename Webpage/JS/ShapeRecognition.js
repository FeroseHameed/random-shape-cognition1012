var userName;
var audio = new Audio("bgm.mp3"); //BGM
audio.volume = 0.2;
audio.loop = true;
var sfxAudio = new Audio("shapeClick.mp3"); //SFX
sfxAudio.volume = 0.7;
var gameOverAudio = new Audio("gameOver.mp3"); //SFX
gameOverAudio.volume = 0.7;
/*Button Arrays- Maybe turn these two arrays into JSON?*/
const buttons = ["Start", "Leaderboard", "How to Play", "Settings"];
const buttonClicks = ["start(restartGame)", "leaderboard()", "howToPlay()", "settings()"];
/*Shape Array Related Variables*/
var shapeDelay = 1000;
var shapeNum = 13; //Number of shapes 
var shapeArr = new Array(shapeNum); 
var imgArr=[];
var imgArrColor=["hue-rotate(40deg)", "hue-rotate(140deg)", "hue-rotate(240deg)", "hue-rotate(80deg)", "hue-rotate(120deg)"];
var displayShapes = 8; // Number of shapes visible on gameboard
var numOfTimesHighlighted = 2;
var highlightedArray = new Array(0);
var gameArray = new Array(displayShapes);
var sleepLooper = 1; //I may need this later
var highlightNum = 0; //Random shape selector
var score = 0; //Score 
var orderFollower = 0; //Assists with creating new sequence
var checkOrder = 0; // Assists with checking if input sequence matches game sequence

//Appending Elements
var settingsTblRow;
var settingsTbl;
var btn;
var newHeader;
var settingsDiv;

var restartGame = true;
var needToHighlight = true;

/*Assign shapes to their respective index*/
for (var i = 1; i <= shapeNum; i++) {
    shapeArr[i - 1] = "shapes/shape" + i + ".png";
}
/*Window functions (in order)
- Window on load
- Menu
- Start Game 
    - Pause
    - Continue Game
    - Game Over Screen
- Leaderboard
- How to Play
- Settings
    - Options
*/
window.onload = function() {
    audio.play(); //FUNCTIONAL REQUIREMENT: Audio
    userName = prompt("Username:", ""); //FUNCTIONAL REQUIREMENT: Prompt for a username
    if (userName === "") {//If username left blank, rename to guest
        userName = "guest";
    } else if (userName) {
    } else {
        userName = "guest";
    }
    gameMenu();
};
function gameMenu(){
    $(".gameBoard").empty();//Empty Gameboard and nav
    $("nav").empty();
    for (var i = 0; i < 4; i++) {//Append Buttons
        createNewBtn(buttons[i], buttonClicks[i]);
    }
    var someText = document.createElement("p");//Append text
    $(someText).html("Welcome " + userName + " to the game!");
    $(".gameBoard").append(someText);
}
function start(restartGame) {
    
    $(".gameBoard").empty();//Empty Gameboard and nav
    $("nav").empty();
    document.getElementById("gameBoard").style.flexDirection = "column"; //CSS Elements
    createNewBtn("Pause", "pause()"); //Pause
    newHeader = document.createElement("h2");//Score Keeper
    $(newHeader).html("Score: "+ score);
    $("#gameBoard").append(newHeader);
    if(restartGame){//Generate Random Array of Shapes on NEW game
        gameArray = generateArray(displayShapes, shapeArr);
        restartGame = false;
    }
    var newDiv = document.createElement("div");//This container will hold all the shapes
    $(newDiv).attr("id", "shapeContainer");
    $("#gameBoard").append(newDiv);
    for (var i = 0; i < gameArray.length; i++) {//Generate shapes onto gameboard, randomized
        var img = document.createElement("img");
        $(img).attr("src", gameArray[i]);
        $(img).attr("class", "shape");
        $(img).attr("id", i);
        $(img).attr("onclick", "checkShape(this)");
        $(newDiv).append(img);
        imgArr[i] = img;
    }
    if(needToHighlight){
        sleepLooper = 1;
        colorRepeat();
    }
    needToHighlight = false;
}
function pause(){
    $("nav").empty(); // Empty the navigator
    newHeader.style.opacity = "0.5"; //CSS Style changes
    for(var i = 0; i < gameArray.length; i++){ //Make images unclickable
        imgArr[i].style.zIndex = "-1";
        imgArr[i].style.opacity = "0.5";
    }
    createNewBtn("Continue", "continueGame()");//Buttons on nav
    createNewBtn("Options", "options(\"Options\")");
    createNewBtn("Quit","gameOver()");
}
function continueGame(){
    $("nav").empty(); // Empty the navigator
    createNewBtn("Pause", "pause()");//Pause
    for(var i = 0; i < gameArray.length; i++){//Make buttons clickable again
        imgArr[i].style.zIndex = "1";
        imgArr[i].style.opacity = "1";
    }
}
function gameOver(){
    restartGame = true;//Reset board next time play is clicked
    $("nav").empty();//Empty the gameboard and nav
    $(".gameBoard").empty(); 
    var someText = document.createElement("h3");//Game Over header
    $(someText).html("Game Over");
    $(".gameBoard").append(someText);
    var finalScore = document.createElement("h2");//Final score Display
    $(finalScore).html("Your Final Score: " + score);
    $(".gameBoard").append(finalScore);
    createNewBtn("Quit","gameMenu()");//Quit
}
function leaderboard() {
    $(".gameBoard").empty(); //Empty the gameboard
    //ADD CODE BELOW
}
function howToPlay() {
    $(".gameBoard").empty(); //Empty the gameboard
    var someText = document.createElement("p");//Text that explains how to play
    $(someText).html("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.");
    $(".gameBoard").append(someText);
}
function settings() {
    document.getElementById("gameBoard").style.justifyContent = "top";//Modify CSS
    document.getElementById("gameBoard").style.flexDirection = "column";
    options("Settings");//Options
    createSlider("Shapes", "numOfShapes", 4, shapeNum, displayShapes, "displayShapes = this.value");//Extra sliders exclusive to settings
    createSlider("Highlight Timing", "highlightDelay", 1, 5, (shapeDelay / 1000), "shapeDelay = this.value * 1000");
}
function options(name){
    $("nav").empty(); // Empty the navigator and gameboard
    $(".gameBoard").empty();
    btn = document.createElement("button");//Return to paused state
    $(btn).html("Back");
    if(name == "Options"){
        $(btn).attr("onclick", "start(restartGame)");
    }else if(name == "Settings"){
        $(btn).attr("onclick", "gameMenu()");
    }
    $("nav").append(btn);
    settingsDiv = document.createElement("div");//Settings Divider
    $(settingsDiv).attr("id", "settings");
    $("#gameBoard").append(settingsDiv);
    document.getElementById("settings").style.flexDirection = "row";
    newHeader = document.createElement("h2");//Header before divider
    $(newHeader).html(name);
    $(settingsDiv).before(newHeader);
    settingsTbl = document.createElement("table");//Create Table to hold option sliders in
    $(settingsTbl).attr("width", "110%");
    $(settingsTbl).attr("cellpadding", "0");
    $(settingsTbl).attr("celspacing", "0");
    $(settingsDiv).append(settingsTbl);

    createSlider("BGM", "bgm", 0, 100, (audio.volume * 100), "audio.volume = (this.value) / 100");//Slider Options
    createSlider("SFX", "sfx", 0, 100, (sfxAudio.volume * 100), "sfxAudio.volume = (this.value) / 100; gameOverAudio.volume = (this.value) / 100;");
}

/*BELOW THIS LINE ARE FUNCTIONS THAT ASSIST THE MAIN BUTTON FUNCTIONS IN MAKING THE GAME FUNCTION.
--------------------------------------------------------------
*/
/* Fisher-Yates Shuffle to generate subset of main shape array list
 * Parameters:
 * New size of array - displayShapes
 * Masterlist of shapes- list
 */
function generateArray(displayShapes, shapeArr) {
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
//Change all shapes back to their original colour after sequence is finished
function colorChanger(){
    for(var i = 0; i < gameArray.length; i++){
        imgArr[i].style.filter= "";
    }
    if(sleepLooper == numOfTimesHighlighted){
        document.getElementById("pause").disabled = false;
        document.getElementById("pause").style.cursor= "pointer";
        document.getElementById("pause").style.opacity= "1";
        for(var i = 0; i < gameArray.length; i++){
            imgArr[i].style.zIndex= "1";
            imgArr[i].style.opacity= "1";
        
        }
    }
    sleepLooper++;
    if(sleepLooper <= numOfTimesHighlighted){
        setTimeout(colorRepeat, shapeDelay);
    }

}
//Set random shape to a random colour
function colorRepeat(){
    highlightNum =  Math.floor(Math.random() * gameArray.length);
    imgArr[highlightNum].style.filter = "hue-rotate(140deg)";

    //Add highlighted shape to array and increment index
    highlightedArray.push(highlightNum + 1);
    orderFollower++;
    document.getElementById("pause").disabled = true;
    document.getElementById("pause").style.cursor= "auto";
    document.getElementById("pause").style.opacity= "0.8";
    for(var i = 0; i < gameArray.length; i++){
        imgArr[i].style.zIndex= "-1";
        imgArr[i].style.opacity= "0.8";
    }
    setTimeout(colorChanger, shapeDelay);
}
//Check if user pressed the correct shape by comparing values
function checkShape(el){

    if( el.getAttribute("id") == (highlightedArray[checkOrder] - 1)){
        sfxAudio.play();
        if(checkOrder == orderFollower-1){
            //Reset all values
            //Array Order
            checkOrder = 0;
            orderFollower = 0;
            highlightedArray = [];
            sleepLooper = 1;
            //Need to highlight
            needToHighlight = true;
            //Increase the sequence
            if (numOfTimesHighlighted < 10){
                numOfTimesHighlighted++;
            }
            if (shapeDelay > 100){
                shapeDelay -= 25;
            }

            colorRepeat();
            
        }else{
            checkOrder++;
        }
        
        score++;
        $(newHeader).html("Score: " + score);
    }else{
        gameOverAudio.play();
        gameOver();
        score = 0;
        checkOrder = 0;
        orderFollower = 0;
        needToHighlight = true;
        numOfTimesHighlighted = 2;
        highlightedArray = [];
    }
}
//Create sliders more efficiently
function createSlider(title, idName, minVal, maxVal, defVal, stringFunc){
    settingsTblRow = document.createElement("tr");
    $(settingsTbl).append(settingsTblRow);
    var settingsTblD = document.createElement("td");
    $(settingsTblD).attr("width", "10%");
    $(settingsTblD).html(title);
    $(settingsTblRow).append(settingsTblD);

    var settingsTblD2 = document.createElement("td");
    $(settingsTblD2).attr("width", "80%");
    $(settingsTblD2).html("<input type=\"range\" id=\"" + idName + "\" min=\"" + minVal + "\" max=\"" + maxVal + "\" value=\"" + defVal + "\"  oninput=\"" + stringFunc + " \">");
    $(settingsTblRow).append(settingsTblD2);
}
//Create a new button
function createNewBtn(captionName, funcName){
    /*Quit Button*/
    btn = document.createElement("button");
    $(btn).html(captionName);
    if(captionName == "Pause"){
        $(btn).attr("id","pause");
    }
    $(btn).attr("onclick", funcName);
    $("nav").append(btn);
}
