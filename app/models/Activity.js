var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ActivitySchema = new Schema({

	type: String,// Repeatable or non Repeatable .
	description: String,
	price: Number,
	BusinessOwner_id: {type: mongoose.Schema.Types.ObjectId, ref: 'BusinessOwner', required: true}

});


module.exports = mongoose.model('Activity', ActivitySchema);
