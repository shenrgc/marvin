var config = require('./index.js'),
    mongoose = require('mongoose');

module.exports = function() {
    var db = mongoose.connect(config.db, function(err){
        if (err) console.log(err);
    });

    require('../models/Visit.js');

    return db;
};
