var config = require('../config'),
	router = require('express').Router(),
	jwt = require('jsonwebtoken'),
	User = require('../models').User,
	response = require('../utils').response;

router.post('/email', function(req, res, next) {
	var email = req.body.email,
		password = req.body.password;

	if (!email || !password) {
		res.send(response.error(response.errorTypes.incorrectParameters));
	}

	var query = User.findOne({
		'email' : email
	}).exec();

	query.then(function(user) {
		if (!user) {
			res.json(response.error(response.errorTypes.userNotFound));
		} else if (user.local) {
			if (user.validPassword(password)) {
				//A - OK
				var token = jwt.sign(user, config.secretHash, {
					expires: 24 * 60 * 60, // expires in 24 hours
					issuer: 'Marvin',
					iat: new Date()
				});

				res.json(response.success({ 'token' : token }));
			} else {
				res.json(response.error(response.errorTypes.wrongPassword));
			}
		} else {
			res.json(response.error(response.errorTypes.userNotFound));
		}
	});
});

/*router.post('/facebook', function(req, res, next) {
	var token = req.body.token,
		fbId = req.body.fbId;

	if (!email || !password) {
		res.send(response.error(response.errorTypes.incorrectParameters));
	}



	//https://graph.facebook.com/oauth/client_code?access_token=...&amp;client_secret=...&amp;redirect_uri=...&amp;client_id=...

	var query = User.findOne({
		email : email
	}).exec();

	query.then(function(user) {
		if (!user) {
			res.send("User doesn't exist");
		} else if (user.local) {
			if (user.validPassword(password)) {
				//A - OK
				var token = jwt.sign(user, config.secretHash, {
					expires: 24 * 60 * 60, // expires in 24 hours
					issuer: 'Marvin',
					iat: new Date()
				});

				res.json(response.success({
					'token' : token
				}));
			} else {
				res.json(response.error(response.errorTypes.wrongPassword));
			}
		} else {
			res.json(response.error(response.errorTypes.userNotFound));
		}
	});
});

router.get('/google', function(req, res, next) {
});

router.get('/twitter', function(req, res, next) {
});

var db = cloudant.use(config.dbCredentials.dbName);
db.list(function(err, body) {
	//console.log(body);
	for (var i = 0; i < body.total_rows; i++) {
		console.log(body.rows[i].value);
		//console.log(row.value);
	}
	res.status(200).send("A - OK");
});
*/


module.exports = router;
