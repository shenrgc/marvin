var config = require('../config');
var response = require('../utils').response;
var jwt = require('jsonwebtoken');

module.exports = function(req) {
	var token = req.body.token || req.params.token || req.headers['x-access-token'];
	if (token) {
		jwt.verify(token, config.secretHash, function(err, decoded) {
			if (err) {
				return false;
			} else {
				req.decoded = decoded;
				return true;
			}
		});
	} else {
		return false;
	}
};