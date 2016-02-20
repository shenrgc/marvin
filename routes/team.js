var config = require('../config');
var router = require('express').Router();
var jwt = require('jsonwebtoken');
var Team = require('../models').Team;
var authenticated = require('../middleware').authenticated;
var response = require('../utils').response;
var rp = require('request-promise');

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
	var request = rp({
        'url': 'https://www.uuidgenerator.net/',
        'method': 'GET'
	}).promise().then(function(page) {
		var team = new Team({
			/* Data */
			name: req.body.name,
			users: [req.decoded._doc._id],
			reminders: [],
			messagesReadBy: [req.decoded._doc._id],
			miniMarvinId: page.substring(page.indexOf('"uuid"')+7, page.indexOf('"uuid"')+39)
		});
		team.save().then(function(team) {
			res.json(response.success({'_id': team._id, 'name': team.name, 'miniMarvinId': team.miniMarvinId}));
		}).catch(function(err) {
			console.log(err);
			res.json(response.error(response.errorTypes.internalServerError));
		});
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
	if(req.params.id) {
		var query = Team.findOne({ '_id' : req.params.id }).exec();

		query.then(function(team) {
			var reminder = {
				'title': req.body.title,
				'type': req.body.type,
				'triggerTime': null,
				'chill': req.body.chill,
				'active': req.body.active
			};
			var repeated = false;
			for(var i = 0; i < team.reminders.length && !repeated; ++i) {
				if(team.reminders[i].title === req.body.title) repeated = true;
			}

			if(repeated) res.json(response.error(response.errorTypes.incorrectParameters));
			else {
				team.reminders.push(reminder);
				team.save().then(function(team) {
					res.json(response.success({'_id': team._id, 'name': team.name, 'reminders': team.reminders}));
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

// Update reminder of a team
router.put('/:id/reminder', authenticated, function(req, res, next) {
	if(req.params.id) {
		var query = Team.findOne({ '_id' : req.params.id }).exec();

		query.then(function(team) {
			var n = team.reminders.length;
			var i = 0;
			while(i < n && team.reminders[i].title !== req.body.title) ++i;
			if(i === n) res.json(response.error(response.errorTypes.incorrectParameters));
			else {
				if(req.body.type) team.reminders[i].type = req.body.type;
				if(req.body.chill) team.reminders[i].chill = req.body.chill;
				if(req.body.active) team.reminders[i].active = req.body.active;
				team.save().then(function(team) {
					res.json(response.success({'_id': team._id, 'name': team.name, 'reminders': team.reminders}));
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

router.delete('/:id/reminder', authenticated, function(req, res, next) {
	if(req.params.id) {

		var query = Team.findOne({ '_id' : req.params.id }).exec();

		query.then(function(team) {
			var n = team.reminders.length;
			var i = 0;
			while(i < n && team.reminders[i].title !== req.body.title) ++i;
			console.log(n);
			if(i === n) res.json(response.error(response.errorTypes.incorrectParameters));
			else {
				team.reminders.splice(i, 1);
				team.save().then(function(team) {
					res.json(response.success({'_id': team._id, 'name': team.name, 'reminders': team.reminders}));
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

module.exports = router;