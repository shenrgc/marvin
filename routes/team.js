var config = require('../config');
var router = require('express').Router();
var jwt = require('jsonwebtoken');
var User = require('../models').User;
var Team = require('../models').Team;
var authenticated = require('../middleware').authenticated;
var response = require('../utils').response;

router.get('/', authenticated, function(req, res, next) {
	
});

module.exports = router;