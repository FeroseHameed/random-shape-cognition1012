var userName;

var audio = new Audio("bgm.mp3"); //BGM
audio.loop = true;


//Button Arrays- Maybe turn these two arrays into JSON? 
const buttons = ["Start", "Leaderboard", "How to Play", "Settings"];
const buttonClicks = ["start()", "leaderboard()", "howToPlay()", "settings()"];

//Shape Array Related Variables
const shapeNum = 6; //Number of shapes 
var shapeArr = new Array(shapeNum); 
var imgArr=[];
var imgArrColor=["hue-rotate(40deg)", "hue-rotate(140deg)", "hue-rotate(240deg)", "hue-rotate(80deg)", "hue-rotate(120deg)"];
var displayShapes = 4; // Number of shapes visible on gameboard
var gameArray = new Array(displayShapes);

var sleepLooper = 0; //I may need this later

var highlightNum = 0; //Random shape selector
var score = 0;

for (var i = 1; i <= shapeNum; i++) {
    shapeArr[i - 1] = "shapes/shape" + i + ".png"; //Assign each shape into ARRAY
}

//Prepare GAME MENU when window loaded
window.onload = function() {

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

//Start Game Function
function start() {
    $(".gameBoard").empty(); //Empty the gameboard
    document.getElementById("gameBoard").style.flexDirection = "row";

    //Generate Random Array of Shapes
    gameArray = generateArray(displayShapes, shapeArr);
    
    //Display shapes on gameboard
    for (var i = 0; i < gameArray.length; i++) {
        //Generate shapes onto gameboard, randomized
        var img = document.createElement("img");
        $(img).attr("src", gameArray[i]);
        $(img).attr("class", "shape");
        $(img).attr("i", i);
        $(img).attr("onclick", "checkShape(this)");
        $("#gameBoard").append(img);
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
    $(".gameBoard").empty(); //Empty the gameboard
    //Modify CSS to fit the page
    document.getElementById("gameBoard").style.justifyContent = "top";
    document.getElementById("gameBoard").style.flexDirection = "column";

    //Settings Divider
    var settingsDiv = document.createElement("div");
    $(settingsDiv).attr("id", "settings");
    $("#gameBoard").append(settingsDiv);
    document.getElementById("settings").style.flexDirection = "row";

    //Header before divider
    var newHeader = document.createElement("h2");
    $(newHeader).html("Settings");
    $(settingsDiv).before(newHeader);

    //Creates volume slider (To be updated)
    var bgmSlider = document.createElement("input");
    $(bgmSlider).attr("type", "range");
    $(bgmSlider).attr("id", "bgm");
    $(bgmSlider).attr("min", "0");
    $(bgmSlider).attr("max", "100");
    $(bgmSlider).attr("value", "100");
    $(bgmSlider).attr("oninput", "audio.volume = (this.value) / 100");
    $(settingsDiv).append(bgmSlider);
    
}

//Change all shapes back to their original colour
function colorChanger(){
    for(var i = 0; i < gameArray.length; i++){
        imgArr[i].style.filter= "";
    }

    //Ignore, was used to highlight shape 10 times
    // sleepLooper++;
    // if(sleepLooper < 10){
        //setTimeout(colorRepeat, 1000);
    // }
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

    }else{
        alert("Fail");
    }
}
