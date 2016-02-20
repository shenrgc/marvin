var router = require('express').Router();

/* GET home page.*/
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/auth', require('./auth.js'));
router.use('/user', require('./user.js'));
router.use('/team', require('./team.js'));
//router.use('/enterRegion', require('./enterRegion.js'));

//router.use('/test', require('./test.js'));

module.exports = router;