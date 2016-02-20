var config = require('../config');
var response = require('../utils').response;
var jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	if (token) {
		jwt.verify(token, config.secretHash, function(err, decoded) {
			if (err) {
				return res.json(response.error(response.errorTypes.unauthorized));
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		return res.json(response.error(response.errorTypes.noTokenProvided));
	}
};
