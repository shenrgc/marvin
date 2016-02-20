var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
	/* Auth Data */
	password : String

	/* Data */
	name : String,
	email : String,
	
    createdAt: Date,
    updatedAt: Date
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

//Trigger before save
userSchema.pre('save', function(next) {
    this.updatedAt = new Date();

    if (!this.createdAt)
        this.createdAt = this.updatedAt;

    next();
});

//Indexes
userSchema.index({ email: 1 });

//Create & export the model
var User = mongoose.model('User', userSchema);

module.exports = User;