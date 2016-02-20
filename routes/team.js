var config = require('../config');
var router = require('express').Router();
var jwt = require('jsonwebtoken');
var User = require('../models').User;
var Team = require('../models').Team;
var authenticated = require('../middleware').authenticated;
var response = require('../utils').response;

// Teams

// Get all of the teams that user who has requested this function is involved
router.get('/me', authenticated, function(req, res, next) {
	var query = Team.find({ users : req.decoded._doc._id }).exec();

	query.then(function(teams) {
		res.json(response.success(teams));
	}).catch(function(err) {
		console.log(err);
		res.json(response.error(response.errorTypes.internalServerError));
	});
});

// Get data of the team requested
router.get('/:id', authenticated, function(req, res, next) {
	var query = Team.findOne({ '_id' : req.params.id }).exec();

	query.then(function(team) {
		res.json(response.success(team));
	}).catch(function(err) {
		console.log(err);
		res.json(response.error(response.errorTypes.internalServerError));
	});
});

// Create new team in Marvin
router.post('/', authenticated, function(req, res, next) {
	var team = new Team({
		/* Data */
		name: req.body.name,
		users: [req.decoded._doc._id],
		remainders: [],
		messagesReadBy: [req.decoded._doc._id]
	});

	team.save().then(function(team) {
		res.json(response.success({'_id': team._id, 'name': team.name}));
	}).catch(function(err) {
		console.log(err);
		res.json(response.error(response.errorTypes.internalServerError));
	});
});


// Update team of Marvin
router.put('/', authenticated, function(req, res, next) {
	if(req.body._id) { 
		var query = Team.findOne({ '_id' : req.body._id }).exec();

		query.then(function(team) {
			console.log(team);
			if(team.users[0] !== req.decoded._doc._id) res.json(response.error(response.errorTypes.accessDenied));
			else {
				if(req.body.name) team.name = req.body.name;
				team.save().then(function(team) {
					res.json(response.success({'_id': team._id, 'name': team.name}));
				}).catch(function(err) {
					console.log(err);
					res.json(response.error(response.errorTypes.internalServerError));
				});
			}
		});
	}
	else {
		res.json(response.error(response.errorTypes.incorrectParameters));
	}
});

router.delete('/', authenticated, function(req, res, next) {
	if(req.body._id) {

		var query = Team.findOne({ '_id' : req.body._id }).exec();

		query.then(function(team) {
			if(team.users[0] !== req.decoded._doc._id) res.json(response.error(response.errorTypes.accessDenied));
			else {
				var query2 = Team.remove({
					_id: req.body._id
				}).exec();

				query2.then().then(function(user) {
					res.json(response.success('Team '+req.body._id+' has been deleted'));
				}).catch(function(err) {
					console.log(err);
					res.json(response.error(response.errorTypes.internalServerError));
				});
			}
		});
	}
	else {
		res.json(response.error(response.errorTypes.incorrectParameters));
	}	
});

// Reminders
// Create new reminder for a team
router.post('/:id/reminder', authenticated, function(req, res, next) {
	var query = Team.findOne({ '_id' : req.params.id }).exec();

	query.then(function(team) {
		var reminder = {

		};
	})
});


module.exports = router;
