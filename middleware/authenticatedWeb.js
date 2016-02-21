var config = require('../config');
var response = require('../utils').response;
var jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.params.token || req.headers['x-access-token'];

	if (token) {
		jwt.verify(token, config.secretHash, function(err, decoded) {
			if (err) {
				req.decoded = null;
				next();
			} else {
				req.decoded = decoded;
				req.decoded.token = token;
				next();
			}
		});
	} else {
		req.decoded = null;
		next();
	}
};
