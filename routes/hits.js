var express = require('express'),
  router = express.Router(),
  moment = require('moment'),
  Visit = require('../models').Visit,
  _ = require('underscore');

router.get('/', function(req, res, next) {
  var visitorIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  Visit.findByIp(visitorIp, function(err, visits) {
      if (err) res.render('error', err);

      if (visits.length > 0) {
          var returningVisitor = visits[0],
              previousDate = "[" + moment(returningVisitor.updatedAt).toISOString() + "]",
              previousHits = returningVisitor.hits;

          Visit.incrementHits(visitorIp, function(err) {
              if (err) res.render('error', err);

              res.render('hits', {
                  hits: previousHits+1,
                  lastVisit: previousDate
              });
          });
      } else {
          //New visitor -> Create & Save
          var newVisitor = Visit({
              ip: visitorIp,
              hits: 1
          });

          newVisitor.save(function(err) {
              var currentDate = "[" + moment().toISOString() + "]";

              res.render('hits', {
                  hits: 1,
                  lastVisit: currentDate
              });
          });
      }
  });

});

router.get('/all', function(req, res, next) {
	var query = Visit.find().exec();

	query.then(function(users) {
		console.log("Users:");
		_.each(users, function(user) {
			console.log(user);
		});
		console.log("-----");
		res.status(200).send("A - OK");
	}).catch(function(err) {
		console.log(err);
	});

});

module.exports = router;
