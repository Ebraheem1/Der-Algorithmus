var mongoose = require('mongoose');

var businessownerSchema = mongoose.Schema({
	user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	name: String,
	description: String,
	locations: [String],
	gallery : [String],
	offers : [String],
	ratings: [{ client_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true} ,
				rating: {type:Number,min:0, max:10} }],
	avgRating: {type:Number, default: 0},
	types: [String],
	logo:String
	});

var BusinessOwner = mongoose.model("BusinessOwner", businessownerSchema);
module.exports.createBusinessOwner = function(newBusinessOwner, callback){
	        newBusinessOwner.save(callback);

	}

module.exports = BusinessOwner;
