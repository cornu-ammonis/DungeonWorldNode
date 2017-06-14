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