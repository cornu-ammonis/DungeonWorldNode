'use strict';

const express = require('express');
const app = express();

let pcConstructor = require('./models/pc.js');

let test = new pcConstructor(1, 2, 3, 4, 5, 6);
let test2 = new pcConstructor(6, 5, 4, 3, 2, 1);
app.get('/', function (req, res) {
	//res.send('Hello World!');
	res.send(JSON.stringify(test) + " " + JSON.stringify(test2));
});


let port = 3000;

app.listen(port, function() {
	console.log('Listening on port ' + port);
});

