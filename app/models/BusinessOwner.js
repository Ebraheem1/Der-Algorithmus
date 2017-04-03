var mongoose = require('mongoose');

var businessownerSchema = mongoose.Schema({
	user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	name: String,
	description: String,
	locations: [String],
	pictures : [String],
	offers : [String]
	});

var BusinessOwner = mongoose.model("BusinessOwner", businessownerSchema);
module.exports.createBusinessOwner = function(newBusinessOwner, callback){
	        newBusinessOwner.save(callback);
	    
	}

module.exports = BusinessOwner;