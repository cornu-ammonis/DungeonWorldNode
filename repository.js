module.exports = {

	fs: require('fs.extra'),

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