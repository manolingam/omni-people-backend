var express = require('express');
var Twitter = require('twitter');
var cors = require('cors');

require('dotenv').config();

const app = express();

app.use(cors());

var client = new Twitter({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token_key: process.env.ACCESS_TOKEN_KEY,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

app.get('/:name', (req, res) => {
	client.get('users/search', { q: req.params.name }, function(
		error,
		tweets,
		response
	) {
		if (error) throw error;
		res.json(tweets); // The favorites. // Raw response object.
	});
});

app.listen(4000, () => console.log('Listening...'));
