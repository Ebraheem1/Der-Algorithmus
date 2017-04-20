var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NonRepeatableActivityReservationSchema = new Schema({

	nonRepeatableActivity_id: {type: mongoose.Schema.Types.ObjectId, ref: 'NonRepeatableActivity', required: true},
	client_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true},
	participants: {type:Number, required:true}, //number of people who will participate in the activity
	price: {type:Number, required:true} // calculated price according to number of participants, pricePerPerson and offer(if available)

});


module.exports = mongoose.model('NonRepeatableActivityReservation', NonRepeatableActivityReservationSchema);