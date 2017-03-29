var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({

	username: {type: String, unique: true},
	password: String,
	phoneNumber: String,
	email: {type: String, unique: true},

});


module.exports = mongoose.model('User', UserSchema);
