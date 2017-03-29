var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ActivitySchema = new Schema({

	type: String,
	description: String
	BusinessOwner_id: {type: mongoose.Schema.Types.ObjectId, ref: 'BusinessOwner', required: true},

});


module.exports = mongoose.model('Activity', ActivitySchema);