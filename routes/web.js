var config = require('../config');
var router = require('express').Router();
var jwt = require('jsonwebtoken');
var User = require('../models').User;
var authenticatedWeb = require('../middleware').authenticatedWeb;
var response = require('../utils').response;
var rp = require('request-promise');

// Profile of user
router.get('/', authenticatedWeb, function(req, res) {
	res.render('index');
});

// Login
router.get('/login', authenticatedWeb, function(req, res) {
	if(req.decoded) res.render('index', { 'token' : req.decoded.token, 'name': req.decoded.name});
	else res.render('login', {'token':''});
});

// Register
router.get('/register', authenticatedWeb, function(req, res) {
	if(req.decoded) res.render('index');
	else res.render('register');
});

// Get token
router.post('/getToken', function(req, res) {
	rp({
        'url': 'http://marvin.visualcosita.xyz/api/v1/auth/email',
        'method': 'POST',
        'json': true,
        'headers': {
	        'Content-Type': 'application/json'
        },
        'body': req.body
	}).promise().then(function(response) {
		if(response.code === 200) res.json({'token': response.data.token});
		else res.json({'token': null});
	});
});

// Register and get token
router.post('/register', function(req, res) {
	console.log(req.body);
	rp({
        'url': 'http://marvin.visualcosita.xyz/api/v1/user',
        'method': 'POST',
        'json': true,
        'headers': {
	        'Content-Type': 'application/json'
        },
        'body': req.body
	}).promise().then(function(response) {
		if(response.code === 200) {
			console.log("200!");
			return rp({
		        'url': 'http://marvin.visualcosita.xyz/api/v1/auth/email',
		        'method': 'POST',
		        'json': true,
		        'headers': {
			        'Content-Type': 'application/json'
		        },
		        'body': {
		        	'email': response.data.email,
		        	'password': req.body.password
		        }
			}).promise().then(function(response) {
				res.json({
				  'token': response.data.token
				});
			});
		}
		else {
			res.json({
			  'token': null
			});
		}
	});
});

module.exports = router;