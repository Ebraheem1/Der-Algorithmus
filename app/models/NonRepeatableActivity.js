var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NonRepeatableActivitySchema = new Schema({
	businessOwner_id: {type: mongoose.Schema.Types.ObjectId, ref: 'BusinessOwner', required: true},
	type: {type: String, required: true}, //Trip, Safari
	image: {type: String, required: true},
	travelingDate: {type: Date, required: true}, // Both date and time will be used
	returnDate: {type: Date, required: true}, //Both date and time will be used
	destination: {type: String, required: true},
	Accommodation: {type: String, required: true},
	transportation: {type: String, required: true}, //Airplane, Train, Bus, Minibus
	description: {type: String, required: true},
	maxParticipants: {type: Number, required: true}, //max number of people who can participate in the activity
	currentParticipants: {type: Number, default: 0}, //number of people who already reserved the activity
	pricePerPerson: {type: Number, required: true},
	cancellationWindow: Number //client is allowed to cancel reservation and get refund <cancellationWindow> days before reservation date

});


module.exports = mongoose.model('NonRepeatableActivity', NonRepeatableActivitySchema);
