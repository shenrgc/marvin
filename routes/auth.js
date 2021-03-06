var config = require('../config');
var router = require('express').Router();
var jwt = require('jsonwebtoken');
var User = require('../models').User;
var response = require('../utils').response;
var MarvinError = response.MarvinError;

router.post('/email', function(req, res, next) {
	var email = req.body.email;
	var password = req.body.password;

	if (email && password) {
		var query = User.findOne({ 'email' : email });

		query.exec()
		.then(function(user) {
			if (!user) throw new MarvinError(response.errorTypes.notFound);
			else if (user.password) {
				if (user.validPassword(password)) {
					//A - OK
					var token = jwt.sign(user, config.secretHash, {
						expires: 24 * 60 * 60, // expires in 24 hours
						iat: new Date()
					});

					res.json(response.success({ 'token' : token }));
				}
				else {
					throw new MarvinError(response.errorTypes.wrongPassword);
				}
			}
			else {
				throw new MarvinError(response.errorTypes.notFound);
			}
		})
		.catch(function(err) {
			res.json(response.error(err));
		});
	}
	else {
		res.json(response.error(new MarvinError(response.errorTypes.incorrectParameters)));
	}
});

module.exports = router;
