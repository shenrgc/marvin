var router = require('express').Router();
var User = require('../models').User;
var Team = require('../models').Team;
var Promise = require('bluebird');
var response = require('../utils').response;
var MarvinError = response.MarvinError;
var rp = require('request-promise');
var _ = require('underscore');

// Teams

// Get all of the teams that user who has requested this function is involved
router.get('/me', function(req, res, next) {
	var query = Team.find({ users : req.decoded._doc._id }).exec();

	query.then(function(teams) {
		res.json(response.success(teams));
	})
	.catch(function(err) {
		res.json(response.error(new MarvinError(response.errorTypes.internalServerError)));
	});
});

// Get data of the team requested
router.get('/:id', function(req, res, next) {
	var query = Team.findOne({ '_id' : req.params.id }).exec();

	query.then(function(team) {
		if(team) res.json(response.success(team));
		else res.json(response.error(new MarvinError(response.errorTypes.notFound)));
	})
	.catch(function(err) {
		res.json(response.error(new MarvinError(response.errorTypes.internalServerError)));
	});
});

// Create new team in Marvin
router.post('/', function(req, res, next) {
	var request = rp({
        'url': 'https://www.uuidgenerator.net/',
        'method': 'GET'
	}).promise()
	.then(function(page) {
		var team = new Team({
			name: req.body.name,
			users: [req.decoded._doc._id],
			reminders: [],
			messagesReadBy: [req.decoded._doc._id],
			miniMarvinId: page.substring(page.indexOf('"uuid"')+7, page.indexOf('"uuid"')+39)
		});
		return team.save();
	})
	.then(function(team) {
		res.json(response.success({'_id': team._id, 'name': team.name, 'miniMarvinId': team.miniMarvinId}));
	})
	.catch(function(err) {
		res.json(response.error(new MarvinError(response.errorTypes.internalServerError)));
	});
});


// Update team of Marvin
router.put('/', function(req, res, next) {
	if(req.body._id) {
		var query = Team.findOne({ '_id' : req.body._id }).exec();

		query.then(function(team) {
			if(team.users[0] !== req.decoded._doc._id) {
				res.json(response.error(new MarvinError(response.errorTypes.accessDenied)));
			}
			else {
				if(req.body.name) team.name = req.body.name;
				return team.save();
			}
		})
		.then(function(team) {
			res.json(response.success({'_id': team._id, 'name': team.name}));
		})
		.catch(function(err) {
			res.json(response.error(new MarvinError(response.errorTypes.internalServerError)));
		});
	}
	else {
		res.json(response.error(new MarvinError(response.errorTypes.incorrectParameters)));
	}
});

router.delete('/', function(req, res, next) {
	if(req.body._id) {
		var query = Team.findOne({ '_id' : req.body._id }).exec();

		query.then(function(team) {
			if (team.users.length === 0) {
				res.json(response.error(new MarvinError(response.errorTypes.internalServerError)));
			}
			else if(team.users[0] !== req.decoded._doc._id) {
				res.json(response.error(new MarvinError(response.errorTypes.accessDenied)));
			}
			else {
				return Team.remove({ _id: req.body._id }).exec();
			}
		})
		.then(function(user) {
			res.json(response.success('Team '+req.body._id+' has been deleted'));
		})
		.catch(function(err) {
			res.json(response.error(new MarvinError(response.errorTypes.internalServerError)));
		});
	}
	else {
		res.json(response.error(new MarvinError(response.errorTypes.incorrectParameters)));
	}
});

// Reminders

// Create new reminder for a team
router.post('/:id/reminder', function(req, res, next) {
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
			_.each(team.reminders, function(reminder) {
				if (reminder.title ===  req.body.title)	repeated = true;
			});

			if(repeated) res.json(response.error(new MarvinError(response.errorTypes.incorrectParameters)));
			else {
				team.reminders.push(reminder);
				return team.save();
			}
		})
		.then(function(team) {
			res.json(response.success({'_id': team._id, 'name': team.name, 'reminders': team.reminders}));
		})
		.catch(function(err) {
			res.json(response.error(new MarvinError(response.errorTypes.internalServerError)));
		});
	}
	else {
		res.json(response.error(new MarvinError(response.errorTypes.incorrectParameters)));
	}
});

// Update reminder of a team
router.put('/:id/reminder', function(req, res, next) {
	if (req.body.id) {
		var query = Team.findOne({ '_id' : req.params.id }).exec();

		query.then(function(team) {
			if (!team) res.json(response.error(new MarvinError(response.errorTypes.notFound)));
			var n = team.reminders.length;
			var i = 0;
			while(i < n && team.reminders[i].title !== req.body.title) ++i;
			if(i === n) res.json(response.error(new MarvinError(response.errorTypes.notFound)));
			else {
				var reminder = {
					'title': team.reminders[i].title,
					'type': team.reminders[i].type,
					'triggerTime': team.reminders[i].triggerTime,
					'chill': team.reminders[i].chill,
					'active': team.reminders[i].active
				};
				if(req.body.type) reminder.type = req.body.type;
				if(req.body.chill) reminder.chill = req.body.chill;
				if(req.body.active) reminder.active = req.body.active;
				team.reminders.splice(i, 1, reminder);
				return team.save();
			}
		})
		.then(function(team) {
			res.json(response.success({'_id': team._id, 'name': team.name, 'reminders': team.reminders}));
		})
		.catch(function(err) {
			res.json(response.error(new MarvinError(response.errorTypes.internalServerError)));
		});
	}
	else {
		res.json(response.error(new MarvinError(response.errorTypes.incorrectParameters)));
	}
});

// Delete reminder from a team
router.delete('/:id/reminder', function(req, res, next) {
	if (req.params.id) {
		var query = Team.findOne({ '_id' : req.params.id }).exec();

		query.then(function(team) {
			if (!team) res.json(response.error(new MarvinError(response.errorTypes.notFound)));
			var n = team.reminders.length;
			var i = 0;
			while(i < n && team.reminders[i].title !== req.body.title) ++i;
			if(i === n) res.json(response.error(new MarvinError(response.errorTypes.incorrectParameters)));
			else {
				team.reminders.splice(i, 1);
				return team.save();
			}
		})
		.then(function(team) {
			res.json(response.success({'_id': team._id, 'name': team.name, 'reminders': team.reminders}));
		})
		.catch(function(err) {
			res.json(response.error(new MarvinError(response.errorTypes.internalServerError)));
		});
	}
	else {
		res.json(response.error(new MarvinError(response.errorTypes.incorrectParameters)));
	}
});

// Team members

router.post('/:id/user', function(req, res, next) {
	if(req.body.email) {
		var userId;
		var userQuery = User.findOne({ 'email' : req.body.email }).exec();
		var teamQuery = Team.findOne({ '_id' : req.params.id }).exec();

		Promise.all([userQuery, teamQuery])
		.then(function(user, team) {
			if (!user || !team) res.json(response.error(new MarvinError(response.errorTypes.notFound)));
			else if (team.users.indexOf(user._id) !== -1) res.json(response.error(new MarvinError(response.errorTypes.incorrectParameters)));
			else if (team.users[0] !== req.decoded._doc._id) res.json(response.error(new MarvinError(response.errorTypes.accessDenied)));
			else {
				team.users.push(user._id);
				return team.save();
			}
		})
		.then(function(team) {
			res.json(response.success({'_id': team._id, 'name': team.name, 'users': team.users}));
		})
		.catch(function(err) {
			res.json(response.error(new MarvinError(response.errorTypes.internalServerError)));
		});
 	}
	else {
 		res.json(response.error(new MarvinError(response.errorTypes.incorrectParameters)));
 	}
});

// Delete user from a team
router.delete('/:id/user', function(req, res, next) {
	if(req.body._id) {
		var userQuery = User.findOne({ '_id' : req.body._id }).exec();
		var teamQuery = Team.findOne({ '_id' : req.params.id }).exec();

		Promise.all([userQuery, teamQuery])
		.then(function(user, team) {
			if (!user || !team) res.json(response.error(new MarvinError(response.errorTypes.notFound)));
			else if(team.users.indexOf(user._id) === -1) res.json(response.error(new MarvinError(response.errorTypes.notFound)));
			else if ((team.users.length > 1) && ((team.users[0] === req.decoded._doc._id) || (req.body._id === req.decoded._doc._id))) {
				team.users.splice(team.users.indexOf(user._id), 1);
				return team.save();
			}
		})
		.then(function(team) {
			res.json(response.success({'_id': team._id, 'name': team.name, 'users': team.users}));
		})
		.catch(function(err) {
			res.json(response.error(new MarvinError(response.errorTypes.internalServerError)));
 		});
 	} else {
 		res.json(response.error(new MarvinError(response.errorTypes.incorrectParameters)));
 	}
});

module.exports = router;
