'use strict';

const express = require('express');
const app = express();
app.set('view engine', 'pug');

const repo = require('./repository');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); // Add this after the bodyParser middlewares!

//let sessions = require('./data/sessions.json');


let pcConstructor = require('./models/pc.js');
let sessionTitle = "testSession";


let test1 = new pcConstructor("dargon", 1, 1, 2, 3, 21, 8, 13);
repo.persistPlayerCharacterToSession(test1, sessionTitle);
let test2 = new pcConstructor("elf", 6, 5, 4, 3, 2, 1, 8);
repo.persistPlayerCharacterToSession(test2, sessionTitle);
//let characters = [test1, test2];

app.get('/', function (req, res) {
	let characters = repo.retrievePlayerCharactersForSession(sessionTitle);
	//res.send('Hello World!');
	//res.send(JSON.stringify(test) + " " + JSON.stringify(test2) + JSON.stringify(sessions));
	res.render("session", {
		title: "your session",
		pcs: characters
	})
});

app.get('/session/:sessionName', function (req, res) {
	let sessionName = req.params['sessionName'];
	let sessions = repo.retrieveSessionNames();
	
	let validSession = false;

	for (let i = 0; i < sessions.length; i++){
		if (sessions[i] === sessionName) {
			validSession = true;
		}
	}

	if (validSession) {
		let characters = repo.retrievePlayerCharactersForSession(sessionTitle);

		res.render("session", {
			title: "your session",
			pcs: characters
		});
	}
	else {
		console.log(sessions);
		res.send("session not found.");
	}
 
});

app.get('createSession', function (req, res) {
	res.render('session_form');
});

app.post('createSession', function (req, res) {

	req.checkBody('name', 'session name required').notEmpty();

	req.sanitize('name').escape();
	req.sanitize('name').trim();

	var errors = req.validationErrors();

	let name = req.body.name;

	if(errors) {
		res.render('session_form', {name: name, errors: errors});
		return;
	}
	else {

	}
})

let port = 3000;

app.listen(port, function() {
	console.log('Listening on port ' + port);
});

