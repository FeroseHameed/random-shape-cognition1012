var express = require('express');
var app = express();

var scores = {}; // an empty JS object, later it's going to store the score for the top ten end-users

app.post('/post', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    console.log("New express client");
    console.log("Received: ");
    console.log(JSON.parse(req.query['data']));
    var z = JSON.parse(req.query['data']);

    // check if the request action is generatePattern
    if (z['action'] == "update_leaderboard") {
        //generate a record for this user
        var nameID = z['name'];
        var score = z['score'];
        update_leaderboard(nameID, score);
        // sends response of user's score after loss at the game
        var jsontext = JSON.stringify({
            'action': 'update_leaderboard',
            'nameID': nameID,
            'score': score,
            'msg': 'Leaderboard updated'
        });
        console.log(jsontext);
        // send the response while including the JSON text		
        res.send(jsontext);
    } else if (z['action'] == "display_leaderboard") {
        display_leaderboard(nameID, highscore);
        /* the response will have 3 parts: request action, the name of the top 10 scores, the current top 10 scores of all clients (NOT COMPLETE)*/
        var jsontext = JSON.stringify({
            'action': 'display_leaderboard',
            'highscore': highscore,
            'msg': 'Leaderboard displayed'
        });
        console.log(jsontext);
        res.send(jsontext);
    } else {
        res.send(JSON.stringify({ 'msg': 'error!!!' }));
    }
}).listen(3000);
console.log("Server is running!");

function update_leaderboard(clientName, score) {
    //update leaderboard csv file with client's highest score (NOT COMPLETE)
    /*
    const fs = require('fs')
    const csv = require('csv-parser')
    const filename = 'leaderboard.csv';

    fs.writeFile(filename, extractAsCSV(users), err => {
        if (err) {
            console.log('Error writing to csv file', err);
        } else {
            console.log(`saved as ${filename}`);
        }
    });
    */
}

function display_leaderboard() {
    //display leadboard to the client

}
