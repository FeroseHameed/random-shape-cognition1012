var pattern_length = 5;     // increment this number as the level increases
var num_shapes = 6; 	    // this number must be 2 or greater (to have diferrent sequence variations)
var lvl = 1;

var patterns = {}; // an empty JS object, later it's going to store the pattern for each end-user

var express = require('express');
var app = express();
var idCounter = 0;

app.post('/post', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    console.log("New express client");
    console.log("Received: ");
    console.log(JSON.parse(req.query['data']));
    var z = JSON.parse(req.query['data']);

    // check if the request action is generatePattern
    if (z['action'] == "generatePattern") {
        //generate a pattern for this user
        idCounter++;
        var nameID = z['name'] + idCounter;
        generatePattern(nameID);
        var jsontext = JSON.stringify({
            'action': 'generatePattern',
            'nameID': nameID,
            'msg': 'New pattern generated!!!'
        });
        console.log(jsontext);
        console.log(patterns);
        // send the response while including the JSON text		
        res.send(jsontext);
    } else if (z['action'] == "evaluate") {
        //evaluate the attempt_pattern for this user
        var [num_match, num_wrong, num_score]
            = evaluate(codes[z['name']], z['attempt_pattern']);
        
        var win = false;
        var answer = [];
        if ((num_match == pattern_length) || (lvl % 3 == 0))
            pattern_length++    // For every lvl reached that is divisible by 3 the pattern length is incremented by 1
        if (num_match == pattern_length)
            answer = patterns[z['name']];
            win = true;
            lvl++;
        
        /* the response will have 6 parts: request action, whether won or not, number of exact matches,
        number of wrong shapes, the current score of the client and the answer if the game ended */
        var jsontext = JSON.stringify({
            'action': 'evaluate',
            'win': win,
            'num_match': num_match,
            'num_wrong': num_wrong,
            'num_score': num_score,
            'pattern': answer
        });
        console.log(jsontext);
        res.send(jsontext);
    } else {
        res.send(JSON.stringify({ 'msg': 'error!!!' }));
    }
}).listen(3000);
console.log("Server is running!");

/*
 * Evaluate the client's attempting pattern
 * @param pattern is the server generated pattern for this client
 * @param attempt_pattern is the client attempted pattern in this request
 * @param time is the elapsed time before the client attempted pattern was inputted
 * @return num_match, num_wrong, num_score
 */
function evaluate(pattern, attempt_pattern, time) {
    var num_match = 0;   		 // number of exact matches, a good shape in a right spot
    var num_wrong = 0;			 // number of wrong shapes
    var num_score = 0;           // time * lvl multiplier * difficulty elapsed (Used to calculate score)

    //calculate the result
    for (var i = 0; i < pattern.length; i++) {
        if (pattern[i] == attempt_pattern[i]) num_match++;
        else if (pattern_code.includes(pattern[i])) {
            num_score += time;  // the score is currently the time elapse (We can incorporate the lvl into algorithim after)
        }
        else num_wrong++;
    }

    return [num_match, num_wrong, num_score];

}

/*
 * Generate a Pattern for this client
 * @param clientName is this client name
 */
function generatePattern(clientName) {
    //generate pattern
    var pattern = [];
    while (pattern.length < pattern_length) {
        var id = Math.floor(Math.random() * num_shapes) + 1;
        if (pattern.indexOf(id) === -1) pattern.push(id);
    }
    //store the pattern for this client
    patterns[clientName] = pattern;
}