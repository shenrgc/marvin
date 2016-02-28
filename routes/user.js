var router = require('express').Router();
var User = require('../models').User;
var response = require('../utils').response;
var MarvinError = response.MarvinError;

// Get data profile of all users
router.get('/', function(req, res, next) {
	var query = User.find().select('-password').exec();

	query.then(function(users) {
		res.json(response.success(users));
	})
	.catch(function(err) {
		res.json(response.error(err));
	});
});

// Get data profile of user authenticated
router.get('/me', function(req, res, next) {
	var query = User.findOne({ '_id' : req.decoded._doc._id }).select('-password').exec();

	query.then(function(user) {
		res.json(response.success(user));
	})
	.catch(function(err) {
		res.json(response.error(err));
	});
});

// Get data profile from other user of the app
router.get('/:id', function(req, res, next) {
	var query = User.findOne({ '_id' : req.params.id }).select('-password').exec();

	query.then(function(user) {
		res.json(response.success(user));
	})
	.catch(function(err) {
		res.json(response.error(err));
	});
});

// New user in Marvin
router.post('/', function(req, res, next) {
	if (req.body.email && req.body.name && req.body.password) {
		var query = User.findOne({ 'email' : req.body.email }).select('-password').exec();

		query.then(function(user) {
			if(user) throw new MarvinError(response.errorTypes.emailInUse);
			else {
				user = new User({
					name: req.body.name,
					email : req.body.email
				});
				user.password = user.generateHash(req.body.password);
				return user.save();
			}
		})
		.then(function(user) {
			res.json(response.success({'_id': user._id, 'name': user.name, 'email': user.email}));
		})
		.catch(function(err) {
			res.json(response.error(err));
		});
	}
	else {
		res.json(response.error(new MarvinError(response.errorTypes.incorrectParameters)));
	}
});

// Update user data profile of Marvin
router.put('/me', function(req, res, next) {
	var query = User.findOne({ '_id' : req.decoded._doc._id }).exec();

	query.then(function(user) {
		if(req.body.name) user.name = req.body.name;
		if(req.body.email) user.email = req.body.email;
		if(req.body.password) user.password = req.body.password;
		return user.save();
	})
	.then(function(user) {
		res.json(response.success({'_id': user._id, 'name': user.name, 'email': user.email}));
	})
	.catch(function(err) {
		res.json(response.error(err));
	});
});

router.delete('/', function(req, res, next) {
	var userId = req.decoded._doc._id;
	if (userId) {
		var query = User.remove({
			_id : userId
		}).exec();

		query.then(function(user) {
			res.json(response.success('User '+userId+' has been deleted'));
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
