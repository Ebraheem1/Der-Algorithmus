var mongoose = require('mongoose');

var clientSchema = mongoose.Schema({
	user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	firstName: {
		type: String,
		required: true
	},
	lastName: String,
	gender: String
});

var Client = mongoose.model("Client", clientSchema);

module.exports = Client;
