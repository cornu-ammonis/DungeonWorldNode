const repo = require('./repository');


exports.seed = function () {
	repo.seed();
}

// displays homepage
exports.index = function (req, res) {
	res.render("index", {title: "Dungeon World"});
}

// retrieves a session by the route parameter 'sessionName'. 
// displays characters in that session and a url for creation of new character.
// if session name is not fonud, it displays 'session not found'
//
// NOTE: time to validate whether session exists currently scales linearly 
//    with the total number of sessions present in the app. this could be improved
//    through use of more advanced data structures in the future (hash table in particular)
exports.retrieveSessionByName = function (req, res) {
	let sessionName = req.params['sessionName'];
	let addCharacterUrl = '/session/' + sessionName + '/addCharacter';
	let sessions = repo.retrieveSessionNames();
	
	let validSession = false;

	// loop through all session names, if given one is not found its not a valid session
	for (let i = 0; i < sessions.length; i++){
		if (sessions[i] === sessionName) {
			validSession = true;
		}
	}

	// if its valid, retrieve and display session characters
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
}

// renders form for session creation
exports.createSessionGet = function (req, res) {
	res.render('session_form', {title: "enter a name for your session"});
}


// attempts to create a new session using a string of user input. the string
// should uniquely identify the session. 
exports.createSessionPost = function (req, res) {
	req.checkBody('name', 'session name required, must be alphanumeric').notEmpty().isAlphanumericWithSpaces();

	req.sanitize('name').escape();
	req.sanitize('name').trim();

	var errors = req.validationErrors();

	let name = req.body.name;

	if(errors) {
		res.render('session_form', {name: name, errors: errors, message: ''});
		return;
	}
	else {
		let sessions = repo.retrieveSessionNames();

		// check that session name does not already exist
		for (let i = 0; i < sessions.length; i++) {
			if (sessions[i] === name) {
				res.render('session_form', {name: name, message: "session name already taken", title: "enter a name for your session"});
				return;
			}
		}

		repo.tryAddNewSessionName(name);
		res.redirect('/session/' + name);

	}
}

// renders form for the creation of a character
exports.addCharacterGet = function (req, res) {
	let sessionName = req.params['sessionName'];

	res.render('character_form', {actionUrl: "/session/" + sessionName + "/addCharacter"});
}

// adds a character to the specified session using user stat inputs.
exports.addCharacterPost = function (req, res) {
	
	// check all fields populated
	req.checkBody('name', 'character name required. must be alphanumeric').notEmpty().isAlphanumeric();
	req.checkBody('str', 'str required. must be an integer.').notEmpty().isInt();
	req.checkBody('int', 'int required. must be an integer.').notEmpty().isInt();
	req.checkBody('dex', 'dex required. must be an integer.').notEmpty().isInt();
	req.checkBody('wis', 'wis required. must be an integer.').notEmpty().isInt();
	req.checkBody('con', 'con required. must be an integer.').notEmpty().isInt();
	req.checkBody('cha', 'cha required. must be an integer.').notEmpty().isInt();
	req.checkBody('basehp', 'base hp required. must be an integer.').notEmpty().isInt();


	// sanitize each field
	
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


	// generate errors
	var errors = req.validationErrors();

	// name will always be parsed as string
	let name = req.body.name;
	

	if(errors) {

		// parse stats as strings in case of failure to input integer
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
		
		// can safely parse stats as strings because there were no errors
		let str = parseInt(req.body.str);
		let int = parseInt(req.body.int);
		let dex = parseInt(req.body.dex);
		let wis = parseInt(req.body.wis);
		let con = parseInt(req.body.con);
		let cha = parseInt(req.body.cha);
		let basehp = parseInt(req.body.basehp);

		// inport constructor for player character class
		let pcConstructor = require('./models/pc.js');
		
		// create new character
		let newPc = new pcConstructor(name, str, int, dex, wis, con, cha, basehp);
		
		// determine session to which to add character based on url parameter
		let sessionName = req.params['sessionName'];

		// commit to disc
		repo.persistPlayerCharacterToSession(newPc, sessionName);
		
		// returns to session home page
		res.redirect('/session/' + sessionName);
	}
}