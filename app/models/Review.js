var mongoose = require('mongoose');

var reviewSchema = mongoose.Schema({
	//The Schema will be edited for now to avoid foreign keys execptions

	//Original
	//user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true},
	//business_id: {type: mongoose.Schema.Types.ObjectId, ref: 'BusinessOwner', required: true},

	//Temp
	user_id: {type: Number, required: true},
	business_id: {type: Number, required: true},


	comment: {type: String, required: true}
	});


var Review = mongoose.model("Review", reviewSchema);

module.exports = Review;