var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let stripe = require("stripe")("sk_test_Hr41ZUg64PJe2duUepC7ruyr");
var RepeatableActivityReservationSchema = new Schema({

	repeatableActivity_id: {type: mongoose.Schema.Types.ObjectId, ref: 'RepeatableActivity', required: true},
	client_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true},
	slot_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true},
	date: {type: Date, required: true}, // Time attributes will not be used
	participants: {type:Number, required:true}, //number of people who will participate in the activity
	price: {type:Number, required:true}, // calculated price according to number of participants, pricePackages and offer(if available)
	charge_key:{type:String,required:true}
});

// this pre function is to make sure that this reservation is refunded before it's deletion
RepeatableActivityReservationSchema.pre('remove',function(next){
	var date = new Date();
	if(this.date>=date){
	stripe.refunds.create( {
						charge : this.charge_key
					},function(err,refund){
						if(err)
						res.json({succes:false,message:err});

					});
	next();
}else{
		next();
	}
});

module.exports = mongoose.model('RepeatableActivityReservation', RepeatableActivityReservationSchema);
