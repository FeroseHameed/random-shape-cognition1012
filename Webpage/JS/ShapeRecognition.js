const buttons = ["Start", "Continue", "How to Play", "Settings"];
var userName;
var audio = new Audio("bgm.mp3");
audio.loop=true;


//Prepare GAME MENU when window loaded
window.onload = function(){
    //FUNCTIONAL REQUIREMENT: Prompt for a username
    userName = prompt("Username:", "");

    //FUNCTIONAL REQUIREMENT: Audio
    audio.play();

    //Main Buttons
    for(var i = 1; i <= 4; i++){
       var btn = document.createElement("button");
 
       $(btn).html(buttons[i-1]);
       $(btn).attr("id", "btn" +  i);

       //May need onclick function set here
 
       $("nav").append(btn);
    }

 };
