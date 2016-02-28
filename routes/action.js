var router = require('express').Router();
var User = require('../models').User;
var Team = require('../models').Team;
var response = require('../utils').response;
var MarvinError = response.MarvinError;

// Possible actions

// Get all of the teams that user who has requested this function is involved
router.get('/enterRegion/:miniMarvinId', function(req, res, next) {
	var query = Team.findOne({ miniMarvinId : req.params.miniMarvinId }).exec();

	query.then(function(team) {
		console.log(team);
		if(team.users.indexOf(req.decoded._doc._id) !== -1) {
			var result = [];
			for(var i = 0; i < team.reminders.length; ++i) {
				console.log(i);
				console.log(team.reminders[i]);
				console.log(team.reminders[i].active);
				console.log(team.reminders[i].active == "true");
				if(team.reminders[i].active === "true" && team.reminders[i].type === 0) result.push(team.reminders[i]);
			}
			res.json(response.success(result));
		}
		else {
			res.json(response.success([]));
		}
	})
	.catch(function(err) {
		res.json(response.error(new MarvinError(response.errorTypes.internalServerError)));
	});
});

// Get all of the teams that user who has requested this function is involved
router.get('/exitRegion/:miniMarvinId', function(req, res, next) {
	var query = Team.findOne({ miniMarvinId : req.params.miniMarvinId }).exec();

	query.then(function(team) {
		console.log(team);
		if(team.users.indexOf(req.decoded._doc._id) !== -1) {
			var result = [];
			for(var i = 0; i < team.reminders.length; ++i) {
				console.log(i);
				console.log(team.reminders[i]);
				console.log(team.reminders[i].active);
				console.log(team.reminders[i].active == "true");
				if(team.reminders[i].active === "true" && team.reminders[i].type === 1) result.push(team.reminders[i]);
			}
			res.json(response.success(result));
		}
		else {
			res.json(response.success([]));
		}
	})
	.catch(function(err) {
		res.json(response.error(new MarvinError(response.errorTypes.internalServerError)));
	});
});

module.exports = router;
