var mongoose = require('mongoose');

var reviewSchema = mongoose.Schema({
	user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true},
	business_id: {type: mongoose.Schema.Types.ObjectId, ref: 'BusinessOwner', required: true},
	comment: {type: String, required: true},
	reply: String 
	});

var Review = mongoose.model("Review", reviewSchema);

module.exports = Review;