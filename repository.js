module.exports = {

	fs: require('fs.extra'),
	
	persistPlayerCharacterToSession: function (character, sessionTitle) {

		let characters = require("./data/sessionrosters/" + sessionTitle + "/roster.json");
		let alreadyExisted = false;

		for (currentCharacter in characters) {
			if (currentCharacter.name === character.name) {
				currentCharacter = character;
				alreadyExited = true;
			}
		}

		if (!alreadyExisted)
		{
			characters.append(character);
		}

		fs.writeFileSync("./data/sessionrosters/" + sessionTitle + "/roster.json", JSON.stringify(characters));
	}

}