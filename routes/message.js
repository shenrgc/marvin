var router = require('express').Router();
var Team = require('../models').Team;
var Message = require('../models').Message;
var response = require('../utils').response;
var MarvinError = response.MarvinError;
var rp = require('request-promise');

// Get all messages of a team
router.get('/:teamId', function(req, res, next) {
	if (req.params.teamId) {
		var teamQuery = Team.findOne({ '_id' : req.params.teamId });
		var messageQuery = Message.find({ 'teamId' : req.params.teamId }).select('_id text from createdAt').sort({ createdAt : -1 });

		teamQuery.exec()
		.then(function(team) {
			if (!team) throw new MarvinError(response.errorTypes.notFound);
			else if (team.users.indexOf(req.decoded._doc._id) < 0) throw new MarvinError(response.errorTypes.accessDenied);
			else return messageQuery.exec();
		})
		.then(function(messages) {
			res.json(response.success(messages));
		})
		.catch(function(err) {
			res.json(response.error(err));
		});
	}
	else {
		res.json(response.error(new MarvinError(response.errorTypes.incorrectParameters)));
	}
});

// New message to team chat
router.post('/:teamId', function(req, res, next) {
	if (req.body.text) {
		var query = Team.findOne({ '_id' : req.params.teamId }).exec();

		query.then(function(team) {
			if (!team) throw new MarvinError(response.errorTypes.notFound);
			else if(team.users.indexOf(req.decoded._doc._id) < 0) throw new MarvinError(response.errorTypes.accessDenied);
			else {
				team.messagesReadBy = [req.decoded._doc._id];
				var message = new Message({
					teamId: req.params.teamId,
					from: req.decoded._doc._id,
					text: req.body.text
				});
				return [team.save(), message.save()];
			}
		})
		.spread(function(team, message) {
			res.json(response.success({'_id': message._id, 'text': message.text, 'from': message.from, 'createdAt': message.createdAt}));
		})
		.catch(function(err) {
			res.json(response.error(err));
		});
	}
	else {
		res.json(response.error(new MarvinError(response.errorTypes.incorrectParameters)));
	}
});

module.exports = router;
