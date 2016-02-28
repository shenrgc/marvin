var router = require('express').Router();
var User = require('../models').User;
var response = require('../utils').response;
var MarvinError = response.MarvinError;

// Get data profile of user authenticated
router.get('/me', function(req, res, next) {
	var query = User.findOne({ '_id' : req.decoded._doc._id }).select('-password').exec();

	query.then(function(user) {
		res.json(response.success(user));
	})
	.catch(function(err) {
		res.json(response.error(new MarvinError(response.errorTypes.internalServerError)));
	});
});

// Get data profile from other user of the app
router.get('/:id', function(req, res, next) {
	var query = User.findOne({ '_id' : req.params.id }).select('-password').exec();

	query.then(function(user) {
		res.json(response.success(user));
	})
	.catch(function(err) {
		res.json(response.error(new MarvinError(response.errorTypes.internalServerError)));
	});
});

// New user in Marvin
router.post('/', function(req, res, next) {
	if (!req.body.email || !req.body.name || !req.body.password) {
		res.json(response.error(new MarvinError(response.errorTypes.incorrectParameters)));
	}

	var query = User.findOne({ 'email' : req.body.email }).select('-password').exec();

	query.then(function(user) {
		if(user) {
			res.json(response.error(new MarvinError(response.errorTypes.emailInUse)));
		}
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
		res.json(response.error(new MarvinError(esponse.errorTypes.internalServerError)));
	});
});

// Update user data profile of Marvin
router.put('/', function(req, res, next) {
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
		res.json(response.error(new MarvinError(response.errorTypes.internalServerError)));
	});
});

router.delete('/', function(req, res, next) {
	var userId = req.decoded._doc._id;

	if (!userId) {
		res.send(response.error(new MarvinError(response.errorTypes.incorrectParameters)));
	}

	var query = User.remove({
		_id : userId
	}).exec();

	query.then(function(user) {
		res.json(response.success('User '+req.decoded._doc._id+' has been deleted'));
	})
	.catch(function(err) {
		res.json(response.error(new MarvinError(response.errorTypes.internalServerError)));
	 });
});

module.exports = router;
