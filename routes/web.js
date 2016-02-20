var config = require('../config');
var router = require('express').Router();
var jwt = require('jsonwebtoken');
var User = require('../models').User;
var authenticatedWeb = require('../middleware').authenticatedWeb;
var response = require('../utils').response;

// Profile of user
router.get('/', function(req, res) {
	console.log(authenticatedWeb(req));
	if(authenticatedWeb(req)) res.render('index');
	else res.redirect('/login');
});

// Form to register new user
router.get('/login', function(req, res) {
	if(authenticatedWeb(req)) res.redirect('/');
	else res.render('login');
});

// Form to register new user
router.get('/register', function(req, res) {
	if(authenticatedWeb(req)) res.redirect('/');
	else res.render('register');
});

module.exports = router;