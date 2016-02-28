var _ = require('underscore');
var router = require('express').Router();
var User = require('../models').User;
var Team = require('../models').Team;
var response = require('../utils').response;
var MarvinError = response.MarvinError;

// Possible actions

// Get all of the teams that user who has requested this function is involved
router.get('/enterRegion/:miniMarvinId', function(req, res, next) {
	var query = Team.find({ users : req.decoded._doc._id }).exec();

	query.then(function(teams) {
		if (!teams) throw new MarvinError(response.errorTypes.notFound);
		else {
			var result = [];
			_.each(teams, function(team) {
				if (team.miniMarvinId === req.params.miniMarvinId) {
					_.each(team.reminders, function (reminder) {
						if (reminder.active === true && reminder.type === 0) result.push(reminder);
					});
				}
			});
			res.json(response.success(result));
		}
	})
	.catch(function(err) {
		res.json(response.error(err));
	});
});

// Get all of the teams that user who has requested this function is involved
router.get('/exitRegion/:miniMarvinId', function(req, res, next) {
	var query = Team.find({ users : req.decoded._doc._id }).exec();

	query.then(function(teams) {
		if (!teams) throw new MarvinError(response.errorTypes.notFound);
		else {
			var result = [];
			_.each(teams, function(team) {
				if (team.miniMarvinId === req.params.miniMarvinId) {
					if (team.users.indexOf(req.decoded._doc._id) < 0) throw new MarvinError(response.errorTypes.accessDenied);
					_.each(team.reminders, function (reminder) {
						if (reminder.active === true && reminder.type === 1) result.push(reminder);
					});
				}
			});
			res.json(response.success(result));
		}
	})
	.catch(function(err) {
		res.json(response.error(err));
	});
});

module.exports = router;
