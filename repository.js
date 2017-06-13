module.exports = {

	fs: require('fs.extra'),

	// either adds the specified character to the roster, or if a character with the 
	// same name already exists, updates that character, then persists changes. if roster
	// does not exist, it creates a roster consisting of just the given character.
	//
	// @param character - pc object to persist to roster
	// @sessionTitle - string identifier for the session
	persistPlayerCharacterToSession: function (character, sessionTitle) {

		try{
			var characters = require("./data/sessionrosters/" + sessionTitle + "/roster.json");

		}
		catch(e)
		{
			characters = [];
		}
		
		var alreadyExisted = false;

		for (let i = 0; i < characters.length; i++) {
			if (characters[i].name === character.name) {
				characters[i] = character;
				alreadyExisted = true;
			}
		}

		if (!alreadyExisted)
		{
			characters.push(character);
		}

		this.fs.writeFileSync("./data/sessionrosters/" + sessionTitle + "/roster.json", JSON.stringify(characters));
	},

	retrievePlayerCharactersForSession: function (sessionTitle)
	{
		try {
			var characters = require("./data/sessionrosters/" + sessionTitle + "/roster.json");
		}
		catch (e)
		{
			var characters = [];
		}

		return characters;
	}

}