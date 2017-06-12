'use strict';

const express = require('express');
const app = express();

app.get('/', function (req, res) {
	res.send('Hello World!');
});


let port = 3000;

app.listen(port, function() {
	console.log('Listening on port ' + port);
});

