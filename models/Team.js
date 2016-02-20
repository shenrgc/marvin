var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamSchema = new Schema({
	/* Data */
	name : String,
	users: [String],
	reminders: [],
	messagesReadBy: [String],
    miniMarvinId: String,
    createdAt: Date,
    updatedAt: Date
});

//Trigger before save
teamSchema.pre('save', function(next) {
    this.updatedAt = new Date();

    if (!this.createdAt)
        this.createdAt = this.updatedAt;

    next();
});

//Indexes
teamSchema.index({ name: 1 });

//Create & export the model
var Team = mongoose.model('Team', teamSchema);

module.exports = Team;