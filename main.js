'use strict';

const express = require('express');
const app = express();
const repo = require('./repository');
var controller = require('./controller.js');
app.set('view engine', 'pug');



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
app.get('/', controller.index);

app.get('/session/:sessionName', controller.retrieveSessionByName);

app.get('/createSession', function (req, res) {
	res.render('session_form', {title: "enter a name for your session"});
});

app.post('/createSession', controller.createSession);

app.get('/session/:sessionName/addCharacter', controller.addCharacterGet);

// POST for character creation form
app.post('/session/:sessionName/addCharacter', controller.addCharacterPost);

let port = 3000;

app.listen(port, function() {
	console.log('Listening on port ' + port);
});

