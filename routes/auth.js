var config = require('../config');
var router = require('express').Router();
var jwt = require('jsonwebtoken');
var User = require('../models').User;
var response = require('../utils').response;

router.post('/email', function(req, res, next) {
	var email = req.body.email;
	var password = req.body.password;

	if (!email || !password) {
		res.json(response.error(response.errorTypes.incorrectParameters));
	}

	var query = User.findOne({
		'email' : email
	}).exec();

	query.then(function(user) {
		if (!user) {
			res.json(response.error(response.errorTypes.userNotFound));
		} else if (user.password) {
			if (user.validPassword(password)) {
				//A - OK
				var token = jwt.sign(user, config.secretHash, {
					expires: 24 * 60 * 60, // expires in 24 hours
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

module.exports = router;
