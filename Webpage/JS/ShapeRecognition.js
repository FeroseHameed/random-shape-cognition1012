var userName;
var audio = new Audio("bgm.mp3"); //BGM
audio.volume = 0.6;
audio.loop = true;
var sfxAudio = new Audio(""); //BGM
sfxAudio.volume = 0.3;
/*Button Arrays- Maybe turn these two arrays into JSON?*/
const buttons = ["Start", "Leaderboard", "How to Play", "Settings"];
const buttonClicks = ["start()", "leaderboard()", "howToPlay()", "settings()"];
/*Shape Array Related Variables*/
const shapeNum = 13; //Number of shapes 
var shapeArr = new Array(shapeNum); 
var imgArr=[];
var imgArrColor=["hue-rotate(40deg)", "hue-rotate(140deg)", "hue-rotate(240deg)", "hue-rotate(80deg)", "hue-rotate(120deg)"];
var displayShapes = 13; // Number of shapes visible on gameboard
var gameArray = new Array(displayShapes);
var sleepLooper = 0; //I may need this later
var highlightNum = 0; //Random shape selector
var score = 0;
var settingsTblRow;
var settingsTbl;
var btn;
var newHeader;
var settingsDiv;

/*Assign shapes to their respective index*/
for (var i = 1; i <= shapeNum; i++) {
    shapeArr[i - 1] = "shapes/shape" + i + ".png";
}

/*Prepare GAME MENU when window loaded*/
window.onload = function() {

    //userName = prompt("Username:", ""); //FUNCTIONAL REQUIREMENT: Prompt for a username
    audio.play(); //FUNCTIONAL REQUIREMENT: Audio
    
    gameMenu();
    
};

/*Start Game Function*/
function start() {
    $("nav").empty(); // Empty the navigator
    /*Pause Button*/
    btn = document.createElement("button");
    $(btn).html("Pause");
    $(btn).attr("onclick", "pause()");

    $("nav").append(btn);

    $(".gameBoard").empty(); //Empty the gameboard
    document.getElementById("gameBoard").style.flexDirection = "column";

    //Header before divider
    newHeader = document.createElement("h2");
    $(newHeader).html("Score: "+ score);
    $("#gameBoard").append(newHeader);

    //Generate Random Array of Shapes
    gameArray = generateArray(displayShapes, shapeArr);
    //New Divider
    var newDiv = document.createElement("div");
    $(newDiv).attr("id", "shapeContainer");
    $("#gameBoard").append(newDiv);

    //Display shapes on gameboard
    for (var i = 0; i < gameArray.length; i++) {
        //Generate shapes onto gameboard, randomized
        var img = document.createElement("img");
        $(img).attr("src", gameArray[i]);
        $(img).attr("class", "shape");
        $(img).attr("i", i);
        $(img).attr("onclick", "checkShape(this)");
        $(newDiv).append(img);
        imgArr[i] = img;
    }

    //sleepLooper=0;
    colorRepeat();
}

function leaderboard() {
    $(".gameBoard").empty(); //Empty the gameboard
    //ADD CODE BELOW

}

function howToPlay() {
    $(".gameBoard").empty(); //Empty the gameboard
}

function settings() {
    //Empty the gameboard
    //Modify CSS to fit the page
    document.getElementById("gameBoard").style.justifyContent = "top";
    document.getElementById("gameBoard").style.flexDirection = "column";

    options("Settings");
}

function pause(){
    $("nav").empty(); // Empty the navigator

    /*Continue Button*/
    btn = document.createElement("button");
    $(btn).html("Continue");
    $(btn).attr("onclick", "continue()");
    $("nav").append(btn);
    /*Options Button (Similar to settings but without difficulty sliders*/
    btn = document.createElement("button");
    $(btn).html("Options");
    $(btn).attr("onclick", "options(\"Options\")");
    $("nav").append(btn);
    /*Quit Button (quit should save score before going to menu*/
    btn = document.createElement("button");
    $(btn).html("Quit");
    $(btn).attr("onclick", "quitGame()");
    $("nav").append(btn);
}

function quitGame(){
    gameMenu();
}
function options(name){
    $("nav").empty(); // Empty the navigator
    //Return to paused state
    btn = document.createElement("button");
    $(btn).html("Back");
    $(btn).attr("onclick", "start()"); //start() is temp
    $("nav").append(btn);

    $(".gameBoard").empty();//Temporary

    //Settings Divider
    settingsDiv = document.createElement("div");
    $(settingsDiv).attr("id", "settings");
    $("#gameBoard").append(settingsDiv);
    document.getElementById("settings").style.flexDirection = "row";

    //Header before divider
    newHeader = document.createElement("h2");
    $(newHeader).html(name);
    $(settingsDiv).before(newHeader);
    

    //Create Table to hold option sliders in
    settingsTbl = document.createElement("table");
    $(settingsTbl).attr("width", "110%");
    $(settingsTbl).attr("cellpadding", "0");
    $(settingsTbl).attr("celspacing", "0");
    $(settingsDiv).append(settingsTbl);
    
    //Slider Options
    createSlider("BGM", "bgm", 0, 100, (audio.volume * 100), "audio.volume = (this.value) / 100");
    createSlider("SFX", "sfx", 0, 100, (sfxAudio.volume * 100), "sfxAudio.volume = (this.value) / 100");

}

function gameMenu(){
    $(".gameBoard").empty();
    $("nav").empty();

    //OPTION BUTTONS
    for (var i = 0; i < 4; i++) {
        btn = document.createElement("button");

        $(btn).html(buttons[i]);
        $(btn).attr("id", "btn" + (i+1)); //May be deleted
        $(btn).attr("onclick", buttonClicks[i]);

        $("nav").append(btn);
    }
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

//Change all shapes back to their original colour
function colorChanger(){
    for(var i = 0; i < gameArray.length; i++){
        imgArr[i].style.filter= "";
    }

}

//Set random shape to a random colour
function colorRepeat(){
    highlightNum =  Math.floor(Math.random() * gameArray.length);
    var colorNum =  Math.floor(Math.random() * imgArrColor.length);
    
    imgArr[highlightNum].style.filter = "hue-rotate(140deg)";

    //Option for random colours instead
    //imgArr[highlightNum].style.filter = imgArrColor[colorNum];

    setTimeout(colorChanger, 1000);
}

//Check if user pressed the correct shape by comparing values
function checkShape(el){
    if( el.getAttribute('i') == highlightNum){
        colorRepeat();
        score++;
        $(newHeader).html("Score: "+ score);
    }else{

        score = 0;
        $(newHeader).html("Score: "+ score);
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
