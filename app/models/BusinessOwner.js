var mongoose = require('mongoose');
let NonRepeatableActivity = require('../models/NonRepeatableActivity');
let RepeatableActivity = require("../models/RepeatableActivity");
let User= require('../models/User');

var businessownerSchema = mongoose.Schema({
	user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	name: String,
	description: String,
	locations: [String],
	images : [String],
	videos : [String],
	offers : [String],
	ratings: [{ client_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true} ,
				rating: {type:Number,min:0, max:10} }],
	avgRating: {type:Number, default: 0},
	types: [String],
	logo:String
	});

	businessownerSchema.pre('remove',function(next){
		User.find({_id:this.user_id},function(err,users){

			users.forEach(function(user){

						user.remove();
			});
		});

		NonRepeatableActivity.find( {businessOwner_id:this._id},function(err,activitys){
			activitys.forEach(function(activity){
				activity.remove();
			});
		});
		RepeatableActivity.find( {businessOwner_id:this._id},function(err,activitys){
			activitys.forEach(function(activity){
				activity.remove();
			});
		});
	next();
	});
var BusinessOwner = mongoose.model("BusinessOwner", businessownerSchema);
module.exports.createBusinessOwner = function(newBusinessOwner, callback){
	        newBusinessOwner.save(callback);

	}




module.exports = BusinessOwner;
