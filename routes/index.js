var express = require('express'),
  router = express.Router(),
  moment = require('moment'),
  db = require('../config/mongoose'),
  Visit = require('../models').Visit;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/mongo', function(req, res, next) {
  var mongo = process.env.MONGO_URL || 'NADA';
  res.render('index', { title: 'LOL' });
});

router.get('/test', function(req, res, next) {
  var visit = new Visit({
    ip: '123.123.123.123',
    hits: 123,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  visit.save(function (err, visit) {
    if (err) console.log(err);

    console.log("SUCCESS");
    console.log(visit);
    res.send("A - OK");
  });
});

router.get('/crap', function(req, res, next) {
  Visit.find({}, function(err, list) {
    if (err) console.log(err);

    console.log("LOOOL");
    console.log(list.length);
    console.log(list);

    res.send("OK");
  });
});

router.get('/hits', function(req, res, next) {
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

module.exports = router;
