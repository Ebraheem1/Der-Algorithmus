var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let RepeatableActivityReservation = require("../models/RepeatableActivityReservation");
var PricePackage= new Schema({

	participants: {type: Number, required:true},
	price: {type: Number, required:true}

});

var Slot= new Schema({

	startTime: String,
	endTime: String

});

var Offer = new Schema({
	offer : {type:String,required:true},
	image : {type:String,required:true},
	discount : {type:Number,required:true,min:0,max :100},
	exp_date : {type:Date,required:true}
});

var RepeatableActivitySchema = new Schema({

	businessOwner_id: {type: mongoose.Schema.Types.ObjectId, ref: 'BusinessOwner', required: true},
	type: {type: String, required:true}, //Room-Escaping, Paintball Fight, Battlefield, Playground
	image: {type: String, required:true},
	theme: {type: String, required:true},
	description: {type: String, required:true},
	pricePackages: [PricePackage],
	slots: [Slot],
	offer:{type:Offer,default:null},
	dayOffs: [Number],
    dayOffsNames : [String],
	cancellationWindow: Number //client is allowed to cancel reservation and get refund <cancellationWindow> days before reservation date
});
// This pre function is used to make sure that all the reservations related to this activity is deleted 
RepeatableActivitySchema.pre('remove',function(next){
		RepeatableActivityReservation.find({repeatableActivity_id:this._id},function(err,reservations){
			reservations.forEach(function(reservation){
				reservation.remove();
			});
		});

next();
});

module.exports = mongoose.model('RepeatableActivity', RepeatableActivitySchema);
