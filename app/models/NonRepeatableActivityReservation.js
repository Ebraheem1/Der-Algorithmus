var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let stripe = require("stripe")("sk_test_Hr41ZUg64PJe2duUepC7ruyr");
var NonRepeatableActivityReservationSchema = new Schema({

	nonRepeatableActivity_id: {type: mongoose.Schema.Types.ObjectId, ref: 'NonRepeatableActivity', required: true},
	client_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true},
	participants: {type:Number, required:true}, //number of people who will participate in the activity
	price: {type:Number, required:true}, // calculated price according to number of participants, pricePerPerson and offer(if available)
	charge_key:{type:String,required:true}
});
NonRepeatableActivityReservationSchema.pre('remove',function(next){

	stripe.refunds.create( {
						charge : this.charge_key
					},function(err,refund){
						if(err)
						res.json({succes:false,message:err});

					});
	next();
});

module.exports = mongoose.model('NonRepeatableActivityReservation', NonRepeatableActivityReservationSchema);
