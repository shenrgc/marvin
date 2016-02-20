var config = require('../config'),
	router = require('express').Router(),
	jwt = require('jsonwebtoken'),
	User = require('../models').User,
	authenticated = require('../middleware').authenticated,
	response = require('../utils').response;

router.get('/', authenticated, function(req, res, next) {
	var query = User.find().exec();

	query.then(function(users) {
		res.json(users);
	}).catch(function(err) {
		console.log(err);
		res.json(response.error(response.errorTypes.internalServerError));
	});
});

router.delete('/:id', authenticated, function(req, res, next) {
	var userId = req.params.id;

	if (!userId) {
		res.send(response.error(response.errorTypes.incorrectParameters));
	}

	var query = User.remove({
		 _id : userId
	 }).exec();

	 query.then(function(usr) {
		 res.send("A - OK");
	 }).catch(function(err) {
		 console.log(err);
		 res.json(response.error(400, "Error deleting user with id: " + userId));
	 });
});

router.post('/createTestUser', function(req, res, next) {
	var user = new User({
		local : undefined,
	    facebook : undefined,
	    twitter : undefined,
	    google : undefined,

		/* Data */
		email : 'fdov88@gmail.com',
		avatar : '',
		biography : '',
		birthday : new Date(),
		gender : 'male',
		phone : '123123123'
	});

	user.local = {
		password : user.generateHash('password')
	};

	user.save().then(function(usr) {
		res.json(response.success('A - OK'));
	}).catch(function(err) {
		console.log(err);
		res.json(response.error(400, "Error creating user with id: " + userId));
	});
});

module.exports = router;
