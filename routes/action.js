var config = require('../config');
var router = require('express').Router();
var jwt = require('jsonwebtoken');
var User = require('../models').User;
var Team = require('../models').Team;
var authenticated = require('../middleware').authenticated;
var response = require('../utils').response;

// Possible actions

// Get all of the teams that user who has requested this function is involved
router.get('/enterRegion/:miniMarvinId', authenticated, function(req, res, next) {
	/*var query = Team.find({ users : req.decoded._doc._id }).exec();

	query.then(function(teams) {
		res.json(response.success(teams));
	}).catch(function(err) {
		console.log(err);
		res.json(response.error(response.errorTypes.internalServerError));
	});*/
	res.json({'ok': 'ok!'});
});

module.exports = router;