'use strict';

const express = require('express');
const app = express();
app.set('view engine', 'pug');

const repo = require('./repository');

let sessions = require('./data/sessions.json');


let pcConstructor = require('./models/pc.js');
let sessionTitle = "testSession";

let test1 = new pcConstructor("dargon", 1, 1, 2, 3, 21, 8, 13);
repo.persistPlayerCharacterToSession(test1, sessionTitle);
//let test2 = new pcConstructor("elf", 6, 5, 4, 3, 2, 1, 8);
//let characters = [test1, test2];



//fs.writeFileSync("./data/sessionrosters/" + sessionTitle + "/roster.json", JSON.stringify(characters));

let characters = require("./data/sessionrosters/" + sessionTitle + "/roster.json");

app.get('/', function (req, res) {
	//res.send('Hello World!');
	//res.send(JSON.stringify(test) + " " + JSON.stringify(test2) + JSON.stringify(sessions));
	res.render("session", {
		title: "your session",
		pcs: characters
	})
});


let port = 3000;

app.listen(port, function() {
	console.log('Listening on port ' + port);
});

