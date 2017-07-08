var fs = require('fs.extra');

var sessionsMap = new Map();

function generateSessionsMap() {
	try {
		let sessionNames = JSON.parse(fs.readFileSync('./data/sessions.json'));

		for (let i = 0; i < sessionNames.length; i++) {
			let path = "./data/sessionrosters/" + sessionNames[i] + "/roster.json";
			
			if (fs.existsSync(path)){
				sessionsMap[sessionNames[i]] = fs.readFileSync(path);
			}
			else {
				sessionsMap[sessionNames[i]] = [];
			}
		}
	}
	catch (e) {
		console.log('something went wrong in generateSessionsMap');
		console.log (e.message);
		console.log (e.stack);
	}
}

function persistNewSessionName (name) {
		let sessions = module.exports.retrieveSessionNames();

		sessions.push(name);

		fs.writeFileSync("./data/sessions.json", JSON.stringify(sessions));
		fs.mkdir('./data/sessionrosters/' + name + '/');
}



module.exports = {

	// either adds the specified character to the roster, or if a character with the 
	// same name already exists, updates that character, then persists changes. if roster
	// does not exist, it creates a roster consisting of just the given character.
	//
	// @param character - pc object to persist to roster
	// @sessionTitle - string identifier for the session
	persistPlayerCharacterToSession: function (character, sessionTitle) {


		let path = "./data/sessionrosters/" + sessionTitle + "/roster.json";
		if (fs.existsSync(path)) {
			// load up current roster
			try {
				var characters = require("./data/sessionrosters/" + sessionTitle + "/roster.json");
			}
			catch(e) // something else went wrong with finding the file
			{
				console.log(e.message);
				return;
			}
			
			var alreadyExisted = false;

			// check current characters for matched name
			for (let i = 0; i < characters.length; i++) {

				// name matched, update character
				if (characters[i].name === character.name) {
					characters[i] = character;
					alreadyExisted = true;
				}

			}

			// add character to list if it didnt exist
			if (!alreadyExisted) {
				characters.push(character);
			}
		}
		// roster didnt already exist
		else {
			characters = [character];
		}
		
		// write to disc
		fs.writeFileSync("./data/sessionrosters/" + sessionTitle + "/roster.json", JSON.stringify(characters));
	},

	// retrieves an array of pc objects by deserializing the json file 
	// found under sessionTitle. returns an empty array if no file is found.
	//
	// @param sessionTitle - string uniquely identifying session to retrieve
	// @returns - array of pc or empty array if roster not found
	retrievePlayerCharactersForSession: function (sessionTitle) {
		
		let path = "./data/sessionrosters/" + sessionTitle + "/roster.json";
		let characters = []
		
		if (fs.existsSync(path)) {
			try {
				characters = require(path);
			}
			catch (e)
			{
				console.log(e.message);
				console.log(e.stack);
			}
		}

		return characters;
	},


	/* retrieveSessionNames: function () {

		var sessions = [];
		if (fs.existsSync("./data/sessions.json")) {

			try {
				sessions = require('./data/sessions.json');
			}
			catch (e) {
				console.log(e.message);
				console.log(e.stack);
			}	
		}
		else {
			console.log("session.json not found");
		}
		
		return sessions;
	}, */

	retrieveSessionNames: function() {
		return sessionsMap.keys();
	},

	tryAddNewSessionName: function(name) {
		persistNewSessionName(name);
	},

	seed: function() {
		if (fs.existsSync("./data/sessions.json")) {
			generateSessionsMap();
		}
		else {
			console.log('no sessions.json found - map is empty');
		}
	}
	

}