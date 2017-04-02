var bcrypt = require('bcryptjs');

let BusinessOwner = require('../models/BusinessOwner');
let Activity = require('../models/Activity');



let businessownerController={

	addActivity:function(req,res){

		var BusinessOwnerId=req.user.id;

		req.body.BusinessOwner_id=BusinessOwnerId;
		Activity.create(req.body,function(err,activity){

			if(err) throw err;
			BusinessOwner.findById(BusinessOwnerId,function(err,businessOwner){

				if(err) throw err;

				var typesArray=businessOwner.types;
				var index=typesArray.indexOf(activity.type);
				//if no activites with the same type added before, then add this to the types array of the businessOwner
				if(index == -1)
				{
					businessOwner.types.push(activity.type);
					businessOwner.save(function(err,businessOwner){
						if(err) throw err;
						
					});
				}
				// should be replaced with page rendering in sprint 2
				res.end('Activity has been created successfully!');

			});
			
		});

	},

	deleteActivity: function(req,res){

		
		var BusinessOwnerId=req.user.id;
		
		Activity.findByIdAndRemove(req.params.activityId, function(err,activityDeleted){
			if(err) throw err;
			var deletedType=activityDeleted.type;
			Activity.find({BusinessOwner_id:BusinessOwnerId, type:deletedType},function(err,activityArray){

				if(err) throw err;
				//if the activity deleted was the last one of its type, then remove this type from the types array of the businessOwner
				if(activityArray.length==0)
				{
					BusinessOwner.findById(BusinessOwnerId,function(err,businessOwner){

						if(err) throw err;
						var typesArray=businessOwner.types;
						var index=typesArray.indexOf(deletedType);
						typesArray.splice(index, 1);

						businessOwner.types=typesArray;
						businessOwner.save(function(err,businessOwner){
							if(err) throw err;
						});						

					});
				}
				// should be replaced with page rendering in sprint 2
				res.end('Activity has been deleted successfully');

			});
			
		});
	}

}

module.exports = businessownerController;