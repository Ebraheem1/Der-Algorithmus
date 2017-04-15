var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RepeatableActivityReservationSchema = new Schema({

	repeatableActivity_id: {type: mongoose.Schema.Types.ObjectId, ref: 'RepeatableActivity', required: true},
	client_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true},
	slot_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true},
	date: {type: Date, required: true}, // Time attributes will not be used
	participants: {type:Number, required:true}, //number of people who will participate in the activity
	price: {type:Number, required:true} // calculated price according to number of participants, pricePackages and offer(if available)

});


module.exports = mongoose.model('RepeatableActivityReservation', RepeatableActivityReservationSchema);