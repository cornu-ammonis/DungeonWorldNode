const repo = require('./repository');

exports.retrieveSessionByName = function (req, res) {
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
}

exports.createSession = function (req, res) {
	req.checkBody('name', 'session name required').notEmpty();

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

		for (let i = 0; i < sessions.length; i++) {
			if (sessions[i] === name) {
				res.render('session_form', {name: name, message: "session name already taken", title: "enter a name for your session"});
				return;
			}
		}

		repo.persistNewSessionName(name);
		res.redirect('/session/' + name);

	}
}

exports.addCharacterGet = function (req, res) {
	let sessionName = req.params['sessionName'];

	res.render('character_form', {actionUrl: "/session/" + sessionName + "/addCharacter"});
}

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