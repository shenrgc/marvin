var router = require('express').Router();
var authenticated = require('../middleware').authenticated;

// WEB ROUTES
router.use('/', require('./web.js'));

// REST API
router.use('/api/v1/auth', require('./auth.js'));
router.use(authenticated);
router.use('/api/v1/user', require('./user.js'));
router.use('/api/v1/team', require('./team.js'));
router.use('/api/v1/action', require('./action.js'));
router.use('/api/v1/message', require('./message.js'));

module.exports = router;
