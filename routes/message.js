var router = require('express').Router();
var Team = require('../models').Team;
var Message = require('../models').Message;
var response = require('../utils').response;
var MarvinError = response.MarvinError;
var rp = require('request-promise');

// Get all messages of a team
router.get('/:teamId', function(req, res, next) {
	if (!req.params.teamId) res.json(response.error(new MarvinError(response.errorTypes.incorrectParameters)));

	var teamQuery = Team.findOne({ '_id' : req.params.teamId }).exec();
	var messageQuery = Message.find({ 'teamId' : req.params.teamId }).exec();

	Promise.all([teamQuery, messageQuery])
	.then(function(team, messages) {
		if(team) {
			if(team.users.indexOf(req.decoded._doc._id) === -1) res.json(response.error(new MarvinError(response.errorTypes.accessDenied)));
			else if (team.messagesReadBy.indexOf(req.decoded._doc._id) >= 0) return [team, messages];
			else {
				team.messagesReadBy.push(req.decoded._doc._id);
				return [team.save(), messages];
			}
		}
		else {
			res.json(response.error(new MarvinError(response.errorTypes.notFound)));
		}
	})
	.spread(function(team, messages) {
		res.json(response.success(messages));
	})
	.catch(function(err) {
		res.json(response.error(new MarvinError(response.errorTypes.internalServerError)));
	});
});

// New message to team chat
router.post('/:teamId', function(req, res, next) {
	if (!req.body.text) res.json(response.error(new MarvinError(response.errorTypes.incorrectParameters)));

	var query = Team.findOne({ '_id' : req.params.teamId }).exec();

	query.then(function(team) {
		if(team) {
			if(team.users.indexOf(req.decoded._doc._id) === -1) res.json(response.error(new MarvinError(response.errorTypes.accessDenied)));
			else {
				team.messagesReadBy = [req.decoded._doc._id];
				var message = new Message({
					teamId: req.params.teamId,
					from: req.decoded._doc._id,
					text: req.body.text
				});
				return [team.save(), message.save()];
			}
		}
		else {
			res.json(response.error(new MarvinError(response.errorTypes.notFound)));
		}
	})
	.spread(function(team, message) {
		res.json(response.success({'_id': message._id, 'text': message.text, 'from': message.from, 'createdAt': message.createdAt}));
	})
	.catch(function(err) {
		res.json(response.error(new MarvinError(response.errorTypes.internalServerError)));
	});
});

module.exports = router;
