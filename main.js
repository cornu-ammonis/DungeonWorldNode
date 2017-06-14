'use strict';

const express = require('express');
const app = express();
app.set('view engine', 'pug');

const repo = require('./repository');

//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); // Add this after the bodyParser middlewares!

//let sessions = require('./data/sessions.json');

/*
let pcConstructor = require('./models/pc.js');
let sessionTitle = "testSession";


let test1 = new pcConstructor("dargon", 1, 1, 2, 3, 21, 8, 13);
repo.persistPlayerCharacterToSession(test1, sessionTitle);
let test2 = new pcConstructor("elf", 6, 5, 4, 3, 2, 1, 8);
repo.persistPlayerCharacterToSession(test2, sessionTitle);
//let characters = [test1, test2]; */

// home page; includes links to creating and opening a session 
app.get('/', function (req, res) {
	
	res.render("index", {title: "Dungeon World"});
});

app.get('/session/:sessionName', function (req, res) {
	
	let sessionName = req.params['sessionName'];
	let addCharacterUrl = '/session/' + sessionName + '/addCharacter';
	let sessions = repo.retrieveSessionNames();
	
	let validSession = false;

	for (let i = 0; i < sessions.length; i++){
		if (sessions[i] === sessionName) {
			validSession = true;
		}
	}

	if (validSession) {
		let characters = repo.retrievePlayerCharactersForSession(sessionName);

		res.render("session", {
			title: sessionName,
			pcs: characters,
			addCharacterUrl: addCharacterUrl
		});
	}
	else {
		console.log(sessions);
		res.send("session not found.");
	}
 
});

app.get('/createSession', function (req, res) {
	res.render('session_form', {title: "enter a name for your session"});
});

app.post('/createSession', function (req, res) {

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
		let sessions = repo.retrieveSessionNames();

		for (let i = 0; i < sessions.length; i++) {
			if (sessions[i] === name) {
				res.render('session_form', {name: name, errors: "session name already taken"});
				return;
			}
		}

		repo.persistNewSessionName(name);
		res.redirect('/session/' + name);

	}
})

app.get('/session/:sessionName/addCharacter', function (req, res) {
	let sessionName = req.params['sessionName'];

	res.render('character_form', {actionUrl: "/session/" + sessionName + "/addCharacter"});
});


app.post('/session/:sessionName/addCharacter', function (req, res) {
	req.checkBody('name', 'character name required. must be alphanumeric').notEmpty().isAlphanumeric();
	req.checkBody('str', 'str required. must be an integer.').notEmpty().isInt();
	req.checkBody('int', 'int required. must be an integer.').notEmpty().isInt();
	req.checkBody('dex', 'dex required. must be an integer.').notEmpty().isInt();
	req.checkBody('wis', 'wis required. must be an integer.').notEmpty().isInt();
	req.checkBody('con', 'con required. must be an integer.').notEmpty().isInt();
	req.checkBody('cha', 'cha required. must be an integer.').notEmpty().isInt();
	req.checkBody('basehp', 'base hp required. must be an integer.').notEmpty().isInt();


	req.sanitize('name').escape();
	req.sanitize('name').trim();
	
	req.sanitize('str').escape();
	req.sanitize('str').trim();
	
	req.sanitize('int').escape();
	req.sanitize('int').trim();
	
	req.sanitize('dex').escape();
	req.sanitize('dex').trim();
	
	req.sanitize('wis').escape();
	req.sanitize('wis').trim();
	
	req.sanitize('con').escape();
	req.sanitize('con').trim();

	req.sanitize('cha').escape();
	req.sanitize('cha').trim();
	
	req.sanitize('basehp').escape();
	req.sanitize('basehp').trim();

	var errors = req.validationErrors();

	let name = req.body.name;
	

	if(errors) {

		let str = req.body.str;
		let int = req.body.int;
		let dex = req.body.dex;
		let wis = req.body.wis;
		let con = req.body.con;
		let cha = req.body.cha;
		let basehp = req.body.basehp;
		
		res.render('character_form', {name: name, str: str, int: int, dex: dex, wis: wis, con: con, cha: cha, basehp: basehp, 
			errors: errors});
		return;
	}
	else {
		
		let str = parseInt(req.body.str);
		let int = parseInt(req.body.int);
		let dex = parseInt(req.body.dex);
		let wis = parseInt(req.body.wis);
		let con = parseInt(req.body.con);
		let cha = parseInt(req.body.cha);
		let basehp = parseInt(req.body.basehp);

		let pcConstructor = require('./models/pc.js');
		let newPc = new pcConstructor(name, str, int, dex, wis, con, cha, basehp);
		let sessionName = req.params['sessionName'];
		repo.persistPlayerCharacterToSession(newPc, sessionName);
		res.redirect('/session/' + sessionName);
	}
})

let port = 3000;

app.listen(port, function() {
	console.log('Listening on port ' + port);
});

