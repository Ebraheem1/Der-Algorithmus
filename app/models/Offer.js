var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var OfferSchema = new Schema({
	offer : String,
	image : String
});

module.exports = mongoose.model('Offer', OfferSchema);