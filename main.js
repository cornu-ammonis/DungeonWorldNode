'use strict';

const express = require('express');
const app = express();
app.set('view engine', 'pug');

const fs = require('fs');
let sessions = require('./data/sessions.json');


let pcConstructor = require('./models/pc.js');

let test1 = new pcConstructor("dargon", 1, 2, 3, 4, 5, 6);
let test2 = new pcConstructor("elf", 6, 5, 4, 3, 2, 1);
let characters = [test1, test2];

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

