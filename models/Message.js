var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
	/* Data */
	teamId : String,
	from: String,			//userId who posted message
		
    createdAt: Date,
    updatedAt: Date
});

//Trigger before save
messageSchema.pre('save', function(next) {
    this.updatedAt = new Date();

    if (!this.createdAt)
        this.createdAt = this.updatedAt;

    next();
});

//Indexes
messageSchema.index({ teamId: 1 });

//Create & export the model
var Message = mongoose.model('Message', messageSchema);

module.exports = Message;