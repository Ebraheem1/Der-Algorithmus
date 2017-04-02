var mongoose = require('mongoose');

var reviewSchema = mongoose.Schema({
	user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true},
	business_id: {type: mongoose.Schema.Types.ObjectId, ref: 'BusinessOwner', required: true},
	comment: {type: String, required: true}
	});

var Review = mongoose.model("Review", reviewSchema);

//trying

module.exports = Review;