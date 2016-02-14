var config = require('./index'),
    mongoose = require('mongoose');

module.exports = function() {
  console.log("ASDF");
  console.log(config.db);

    var db = mongoose.connect(config.db, function(err){
        if (err) console.log(err);
    });

    require('../models/Visit');

    return db;
};
