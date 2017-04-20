var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PricePackage= new Schema({

	participants: {type: Number, required:true},
	price: {type: Number, required:true}

});

var Slot= new Schema({

	startTime: String,
	endTime: String

});

var RepeatableActivitySchema = new Schema({

	businessOwner_id: {type: mongoose.Schema.Types.ObjectId, ref: 'BusinessOwner', required: true},
	type: {type: String, required:true}, //Room-Escaping, Paintball Fight, Battlefield, Playground
	image: {type: String, required:true},
	theme: {type: String, required:true},
	description: {type: String, required:true},
	pricePackages: [PricePackage],
	slots: [Slot],
	dayOffs: [Number],
	cancellationWindow: Number //client is allowed to cancel reservation and get refund <cancellationWindow> days before reservation date

	
		
});


module.exports = mongoose.model('RepeatableActivity', RepeatableActivitySchema);
