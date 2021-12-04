var fs = require('fs');
var codes = {};
var express = require('express');
var app = express();
var score = 0;

app.get('/getuser', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    console.log("Getting users.... ");
    var out = readfile();
    res.send(out);
    console.log("Users listed");
});

function readfile() {
    var filedata;//Stores text file
    var fileerror;//Stores error
    try {//Read give text file
        filedata = fs.readFileSync('users/userinfo.txt', 'utf8');
        console.log(filedata);
        //console.log(name);
        //console.log(scoreNum);
    } catch (err) {
        fileerror = err;
        console.error(err);
    }
    return filedata;
}

app.get('/setuser', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    var name = req.query['name'];
    console.log("Score before: " + score);
    if(score < req.query['score']){
        score = req.query['score'];
        console.log("Score after: " + score);
    }
    var content = '';
    var filedata = readfile();
    console.log('Setting users....');
    console.log(filedata);
    var usersjson;
    try {
        usersjson = JSON.parse(filedata);
    } catch (err) {
        console.log(err);
        usersjson = {};
    }
    console.log(usersjson);
    if (usersjson.hasOwnProperty('users')) {
        console.log('JSON file OK!');
        var found = false;
        console.log(usersjson.users);
        for (var i = 0; i < usersjson.users.length; i++) {
            var obj = usersjson.users[i];
            if (name == obj.name) {
                found = true;
                obj.score = parseInt(score);
                break;
            }
        }
        if (!found) {
            usersjson.users.push({ "name": name, "score": parseInt(score) });
        }
        content = JSON.stringify(usersjson);
    } else {
        console.log('JSON file broke!');
        content = `{"users":[{"name":"` + name + `","score":` + score + `}]}`;
        console.log(content);
    }
    fs.writeFile('users/userinfo.txt', content,
        function (err) { if (err) { return console.log(err); } });
    res.send(content);
});

app.get('/setsequence', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    var highlightTimes = req.query['highlight'];
    var arrSeq = req.query['storearray'];
    var arrlength = req.query['arrlength'];
    console.log("Creating a new sequence.... ");
    var someSequence = [];
    for (var i = 0; i < highlightTimes; i++) {
        var someNum = Math.floor(Math.random() * arrlength);
        someSequence.push(someNum + 1);
    }
    arrSeq = someSequence;
    console.log("Sequence code: " + arrSeq);
    var sequencejson = JSON.stringify({
        'sequence': arrSeq
    });
    console.log("Sequence created");
    console.log(sequencejson);
    res.send(sequencejson);
});

app.listen(3000);
