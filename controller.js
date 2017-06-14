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