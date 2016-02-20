var config = require('../config');
var router = require('express').Router();
var jwt = require('jsonwebtoken');
var Team = require('../models').Team;
var Message = require('../models').Message;
var authenticated = require('../middleware').authenticated;
var response = require('../utils').response;
var rp = require('request-promise');

// Get all messages of a team
router.get('/:teamId', authenticated, function(req, res, next) {
	var query = Team.findOne({ '_id' : req.params.teamId }).exec();

	query.then(function(team) {
		if(team) {
			if(team.users.indexOf(req.decoded._doc._id) === -1) res.json(response.error(response.errorTypes.accessDenied));
			else {
				team.messagesReadBy.push(req.decoded._doc._id);
				return team.save();
			}
		} 
		else {
			res.json(response.error(response.errorTypes.notFound));
		}
	}).then(function() {
		var query2 = Message.find({ 'teamId' : req.params.teamId }).exec();
		
		query2.then(function(messages) {
			if(messages) {
				res.json(response.success(messages));
			} else {
				res.json(response.error(response.errorTypes.notFound));
			}
		}).catch(function(err) {
			console.log(err);
			res.json(response.error(response.errorTypes.internalServerError));
		});
	});
});

// New message to team chat
router.post('/:teamId', authenticated, function(req, res, next) {
	var query = Team.findOne({ '_id' : req.params.teamId }).exec();

	query.then(function(team) {
		if(team) {
			if(team.users.indexOf(req.decoded._doc._id) === -1) res.json(response.error(response.errorTypes.accessDenied));
			else if(req.body.text.length === 0) res.json(response.error(response.errorTypes.incorrectParameters));
			else {
				var message = new Message({
					/* Data */
					teamId: req.params.teamId,
					from: req.decoded._doc._id,
					text: req.body.text				
				});
				message.save().then(function(message) {
					res.json(response.success({'_id': message._id, 'text': message.text, 'from': message.from, 'createdAt': message.createdAt}));
				}).catch(function(err) {
					console.log(err);
					res.json(response.error(response.errorTypes.internalServerError));
				});
			}
		} 
		else {
			res.json(response.error(response.errorTypes.notFound));
		}
	}).catch(function(err) {
		console.log(err);
		res.json(response.error(response.errorTypes.internalServerError));
	});
});

module.exports = router;