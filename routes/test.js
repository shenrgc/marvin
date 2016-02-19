var config = require('../config'),
	router = require('express').Router(),
	jwt = require('jsonwebtoken'),
	User = require('../models').User;

router.get('/facebook', function(req, res, next) {
});

router.get('/google', function(req, res, next) {
});

router.get('/twitter', function(req, res, next) {
});


/*
var db = cloudant.use(config.dbCredentials.dbName);
db.list(function(err, body) {
	//console.log(body);
	for (var i = 0; i < body.total_rows; i++) {
		console.log(body.rows[i].value);
		//console.log(row.value);
	}
	res.status(200).send("A - OK");
});
*/


module.exports = router;
