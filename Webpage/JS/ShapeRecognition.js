var userName = "guest";
var score = 0; //Score 
const serverurl = "http://localhost:3000/";
var audio = new Audio("sounds/bgm.mp3"); //BGM
audio.volume = 0.2;
audio.loop = true;
var sfxAudio = new Audio("sounds/shapeClick.mp3"); //SFX
sfxAudio.volume = 0.7;
var gameOverAudio = new Audio("sounds/gameOver.mp3"); //SFX
gameOverAudio.volume = 0.7;
/*Button Arrays- Maybe turn these two arrays into JSON?*/
const buttons = ["Start", "Leaderboard", "How to Play", "Settings"];
const buttonClicks = ["start(restartGame)", "leaderboard()", "howToPlay()", "settings()"];
/*Shape Array Related Variables*/
var shapeDelay = 1000;
var shapeNum = 13; //Number of shapes 
var shapeArr = new Array(shapeNum);
var imgArr = [];
var displayShapes = 8; // Number of shapes visible on gameboard
var numOfTimesHighlighted = 2;
var highlightedArray = new Array(0);
var gameArray = new Array(displayShapes);
var sleepLooper = 1; //Helps with highlighting the right shapes
var highlightNum = 0; //Random shape selector
var orderMaker = 0; //Assists with creating new sequence
var checkOrder = 0; // Assists with checking if input sequence matches game sequence
var makeNewSequence = true;
//Server related
var url = "http://localhost:3000/post";
//Appending Elements
var settingsTblRow, settingsTbl, btn, newHeader, settingsDiv;
var restartGame = true;
var needToHighlight = true;

for (var i = 1; i <= shapeNum; i++) {
    shapeArr[i - 1] = "shapes/shape" + i + ".png";
}

window.onload = function () {
    audio.play();
    userName = prompt("Username:", "");
    if (userName === "") {
        userName = "guest";
    } else if (userName) {
    } else {
        userName = "guest";
    }
    gameMenu();
};

function gameMenu() {
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
    if (restartGame) {//Generate Random Array of Shapes on NEW game
        score = 0;
        gameArray = generateArray(displayShapes, shapeArr);
        restartGame = false;
    }
    newHeader = document.createElement("h2");//Score Keeper
    $(newHeader).html("Score: " + score);
    $("#gameBoard").append(newHeader);
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
    if (needToHighlight) {
        sleepLooper = 1;
        colorRepeat();
        needToHighlight = false;
    }
}

function pause() {
    $("nav").empty(); // Empty the navigator
    newHeader.style.opacity = "0.5"; //CSS Style changes
    for (var i = 0; i < gameArray.length; i++) { //Make images unclickable
        imgArr[i].style.zIndex = "-1";
        imgArr[i].style.opacity = "0.5";
    }
    createNewBtn("Continue", "continueGame()");//Buttons on nav
    createNewBtn("Options", "options(\"Options\")");
    createNewBtn("Quit", "gameOver()");
}

function continueGame() {
    $("nav").empty(); // Empty the navigator
    createNewBtn("Pause", "pause()");//Pause
    for (var i = 0; i < gameArray.length; i++) {//Make buttons clickable again
        imgArr[i].style.zIndex = "1";
        imgArr[i].style.opacity = "1";
    }
}

function gameOver() {
    ajaxFunction('setuser', "?name=" + userName + "&score=" + score );
    needToHighlight = true;
    makeNewSequence = true;
    restartGame = true;//Reset board next time play is clicked
    orderMaker = 0;
    checkOrder = 0;
    needToHighlight = true;
    numOfTimesHighlighted = 2;
    highlightedArray = [];
    $("nav").empty();//Empty the gameboard and nav
    $(".gameBoard").empty();
    var someText = document.createElement("h3");//Game Over header
    $(someText).html("Game Over");
    restartGame = true;
    $(".gameBoard").append(someText);
    var finalScore = document.createElement("h2");//Final score Display
    $(finalScore).html("Your Final Score: " + score);
    $(".gameBoard").append(finalScore);
    createNewBtn("Quit", "gameMenu()");//Quit
}

function ajaxFunction(weburl, queryString) {
    var ajaxRequest;  //The variable that makes Ajax possible!
    try {
        // Opera 8.0+, Firefox, Safari
        ajaxRequest = new XMLHttpRequest();
    } catch (e) {
        // Internet Explorer Browsers
        try {
            ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                // Something went wrong
                alert("Your browser broke!");
                return false;
            }
        }
    }
    // Create a function that will receive data sent from the server
    ajaxRequest.onreadystatechange = function () {
        if (ajaxRequest.readyState == 4) {
            var userScore = JSON.parse(ajaxRequest.responseText);
            if(weburl == 'setsequence'){
                generateShapeSequence(userScore);
                

            }else{
                setscoretbl(userScore);
            }
        }
    }
    ajaxRequest.open("GET", serverurl + weburl + queryString, true);
    ajaxRequest.send(null);
}

function leaderboard(name, score) {
    $("nav").empty();
    $(".gameBoard").empty();
    btn = document.createElement("button");
    $(btn).html("Back");
    $(btn).attr("onclick", "gameMenu()");
    $("nav").append(btn);
    settingsDiv = document.createElement("div");
    $(settingsDiv).attr("id", "settings");
    $("#gameBoard").append(settingsDiv);
    document.getElementById("settings").style.flexDirection = "row";
    newHeader = document.createElement("h2");
    $(newHeader).html(name);
    $(settingsDiv).before(newHeader);
    settingsTbl = document.createElement("table");
    $(settingsTbl).attr("width", "500vw");
    $(settingsTbl).attr("id", "scoreTbl");
    $(settingsTbl).attr("style", "border:1px solid rgb(238, 188, 52); border-collapse: collapse;");
    $(settingsTbl).attr("cellpadding", "0");
    $(settingsTbl).attr("celspacing", "0");
    $(settingsDiv).append(settingsTbl);
    ajaxFunction('getuser', '');
}

function setscoretbl(userScore) {
    createTR({name:" <u>Name</u> ", score:" <u>Score</u> "});
    userScore.users.sort(sortbyscore("score"));
    //Get top ten players displayed on leaderboard
    for (var i = 0; i < 10; i++) {
        var obj = userScore.users[i];
        createTR(obj);
    }
}

function createTR(obj) {    
    settingsTblRow = document.createElement("tr");
    $(settingsTblRow).attr("style", "border:1px solid rgb(238, 188, 52); border-collapse: collapse;");
    $(settingsTbl).append(settingsTblRow);
    var settingsTblD = document.createElement("td");
    $(settingsTblD).attr("style", "border:1px solid rgb(238, 188, 52); border-collapse: collapse;padding:5px;");
    $(settingsTblD).attr("width", "60%");
    $(settingsTblD).html(obj.name);
    $(settingsTblRow).append(settingsTblD);
    var settingsTblD2 = document.createElement("td");
    $(settingsTblD2).attr("style", "border:1px solid rgb(238, 188, 52); border-collapse: collapse;padding:5px;");
    $(settingsTblD2).attr("width", "40%");
    $(settingsTblD2).attr("align", "right");
    $(settingsTblD2).html(obj.score);
    $(settingsTblRow).append(settingsTblD2); 
} 

function sortbyscore(prop) {    
    return function(a, b) {    
        if (a[prop] < b[prop]) {    
            return 1;    
        } else if (a[prop] > b[prop]) {    
            return -1;    
        }    
        return 0;    
    }    
} 

function createScore(title, idName, minVal, maxVal, defVal, stringFunc) {
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

function howToPlay() {
    $(".gameBoard").empty(); //Empty the gameboard
    var someText = document.createElement("p");
    $(someText).html("The game will give you a sequence of shapes to follow by highlighting them in blue. <br><br>You must follow the sequence in proper order to successfuly gain points.<br><br>Good luck, have fun!");
    $(".gameBoard").append(someText);
}

function settings() {
    document.getElementById("gameBoard").style.justifyContent = "top";//Modify CSS
    document.getElementById("gameBoard").style.flexDirection = "column";
    options("Settings");//Options
    createSlider("Shapes", "numOfShapes", 4, shapeNum, displayShapes, "displayShapes = this.value");//Extra sliders exclusive to settings
    createSlider("Highlight Timing", "highlightDelay", 1, 5, (shapeDelay / 1000), "shapeDelay = this.value * 1000");
}

function options(name) {
    $("nav").empty(); // Empty the navigator and gameboard
    $(".gameBoard").empty();
    btn = document.createElement("button");//Return to paused state
    $(btn).html("Back");
    if (name == "Options") {
        $(btn).attr("onclick", "start(restartGame)");
    } else if (name == "Settings") {
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

function createSlider(title, idName, minVal, maxVal, defVal, stringFunc) {
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

function createNewBtn(captionName, funcName) {
    btn = document.createElement("button");
    $(btn).html(captionName);
    if (captionName == "Pause") {
        $(btn).attr("id", "pause");
    }
    $(btn).attr("onclick", funcName);
    $("nav").append(btn);
}

function generateArray(displayShapes, shapeArr) {//Fisher Yates Splice Shuffle
    var shuffled = shapeArr.slice(0);
    var i = shapeArr.length;
    var min = i - displayShapes;
    var temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

function checkShape(el) {//Evaluate input
    if (el.getAttribute("id") == (highlightedArray[checkOrder] - 1)) {
        sfxAudio.play();
        if (checkOrder == orderMaker - 1) {
            //Reset all values
            checkOrder = 0;
            orderMaker = 0;
            highlightedArray = [];
            sleepLooper = 1;
            //Need to highlight
            needToHighlight = true;
            makeNewSequence = true;
            //Increase the sequence
            if (numOfTimesHighlighted < 10) {
                numOfTimesHighlighted++;
            }
            if (shapeDelay > 100) {
                shapeDelay -= 25;
            }
            colorRepeat();
        } else {
            checkOrder++;
        }
        score++;
        $(newHeader).html("Score: " + score);
    } else {
        gameOverAudio.play();
        gameOver();
    }
}

function colorChanger() {//Change all shapes back to their original colour after sequence is finished
    for (var i = 0; i < gameArray.length; i++) {
        imgArr[i].style.filter = "";
    }
    if (sleepLooper == numOfTimesHighlighted) {
        document.getElementById("pause").disabled = false;
        document.getElementById("pause").style.cursor = "pointer";
        document.getElementById("pause").style.opacity = "1";
        for (var i = 0; i < gameArray.length; i++) {
            imgArr[i].style.zIndex = "1";
            imgArr[i].style.opacity = "1";
        }
    }
    sleepLooper++;
    if (sleepLooper <= numOfTimesHighlighted) {
        setTimeout(shapeHighlighter, shapeDelay);
    }
}

function colorRepeat() {//Gets the server sequence
    //Add highlighted shape to array and increment index
    if (makeNewSequence) {
        ajaxFunction('setsequence', "?highlight=" + numOfTimesHighlighted + "&storearray=" + highlightedArray + "&arrlength=" + gameArray.length);
        makeNewSequence = false;
    }
}

function generateShapeSequence(userScore) {
    highlightedArray = userScore.sequence;
    shapeHighlighter();
}

function shapeHighlighter() {//Highlight a shape in sequential order
    //HIGHLIGHT SHAPE
    imgArr[(highlightedArray[orderMaker]-1)].style.filter = "hue-rotate(140deg)";
    orderMaker++;
    document.getElementById("pause").disabled = true;
    document.getElementById("pause").style.cursor = "auto";
    document.getElementById("pause").style.opacity = "0.8";
    for (var i = 0; i < gameArray.length; i++) {
        imgArr[i].style.zIndex = "-1";
        imgArr[i].style.opacity = "0.8";
    }
    setTimeout(colorChanger, shapeDelay);
}
