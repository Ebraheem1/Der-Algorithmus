var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ActivitySchema = new Schema({

	type: String,
	description: String,
	price: Number,

	//The Schema will be edited for now to avoid foreign keys execptions

	//Original
	//BusinessOwner_id: {type: mongoose.Schema.Types.ObjectId, ref: 'BusinessOwner', required: true}

	//Temp
	BusinessOwner_id: {type: String, required: true}

});


module.exports = mongoose.model('Activity', ActivitySchema);