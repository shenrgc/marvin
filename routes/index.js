var router = require('express').Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/auth', require('./auth.js'));
router.use('/users', require('./users.js'));
router.use('/hits', require('./hits.js'));
router.use('/test', require('./test.js'));

module.exports = router;


/*
// BASURA:

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

module.exports = router;
*/
