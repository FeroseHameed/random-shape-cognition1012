var highscore = 0;
var url = "http://localhost:3000/post";

function leaderboard() {
    $(".gameBoard").empty(); //Empty the gameboard
    //ADD CODE BELOW

    //creates a div for leaderboard
    var leaderboardDiv = document.createElement("div");
    $(leaderboardDiv).attr("id", "leaderboard");
    //creates a table with headings for leaderboard
    var table = document.createElement("table");
    var td = document.createElement("td");
    var th = document.createElement("th");
    var txt = document.createTextNode("Player Name");
    th.appendChild(txt);
    table.appendChild(th);
    var th = document.createElement("th");
    var txt = document.createTextNode("Score");
    th.appendChild(txt);
    table.appendChild(th);

    //appends current player's username and highest score to leaderboard
    var tr = document.createElement("tr");

    for (y = 0; y < 2; y++) {
        var td = document.createElement("td");
        if (y == 0) {
            var txt = document.createTextNode(userName);
        }
        else {
            var txt = document.createTextNode(highscore);
        }
        td.appendChild(txt);
        tr.appendChild(td);
        table.appendChild(tr);
    }

    $("#gameBoard").append(leaderboardDiv);
    $(leaderboardDiv).append(table);
}

//Check if user pressed the correct shape by comparing values
function checkShape(el) {
    if (el.getAttribute('i') == highlightNum) {
        colorRepeat();
        score++;
    } else {
        alert("Fail");
        //send request to server to update leaderboard

        if (score > highscore) {
            highscore = score;
        }

        $.post(url + '?data=' + JSON.stringify({
            'name': userName,    //client's identity on the server
            'score': score,      //client's final score
            'action': 'update_leaderboard'
        }),
            response);

        score = 0;              //resets score
    }
}