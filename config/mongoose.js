var config = require('./index'),
    mongoose = require('mongoose');

module.exports = function() {

    mongoose.Promise = require('bluebird');
    var db = mongoose.connect(config.db, function(err) {
        if (err) console.log(err);
    });

	require('../models/User');
    require('../models/Team');
    require('../models/Message');

    return db;
};
