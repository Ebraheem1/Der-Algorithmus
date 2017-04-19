let Activity = require('../models/Activity');

let activityController={



	getActivity:function(req,res){
		var activity_id =  req.params.id;
		Activity.findOne({_id:activity_id}, function(err, activity) {
	        if (err) {
	        	res.json({success:false, message: err});
	        }
	        else{
		        if(!activity){
		        	res.json({success:false, message: 'Activity with this id does not exist!'});
	            }
	            else{
	            	res.json({success:true, message:'Activity has been updated successfully.', activity: activity});
	            }

	        }
        });
	},


	newActivity:function(req,res){
		var activity = new Activity();
		activity.type = req.body.type;
		activity.description = req.body.description;
		activity.price = req.body.price;
		activity.BusinessOwner_id = req.body.BusinessOwner_id;
		var missingFields = activity.type==null || activity.type=='' || activity.description==null || activity.description=='' || 
		                    activity.price==null || activity.price=='' || activity.BusinessOwner_id==null || activity.BusinessOwner_id=='';
		if(missingFields){
			res.json({success:false, message: 'The fields: (type, description, price, BusinessOwner_id) are required!'});
		}
		else{
			activity.save(function(err){
				if(err){
					res.json({success:false, message: err});
				}
				else{
					res.json({success:true, message: 'Activity has been created successfully.'});
				}
			});

		}		
	},

	/*	this function receives requests for editing activites, an activity has multiple attributes;
	the function gurantees to edit all parameters given, the request should include the BusinessOwner_id and at least one attrbute to be edited*/
	editActivity: function(req,res){
		var activity_BusinessOwner_id = '58f13a6ef286e74e0ecdadcc';
		var activity_description =  req.body.description;
		var activity_price = req.body.price;
		var activity_id =  req.params.id;
		var missingFields = activity_BusinessOwner_id==null || activity_BusinessOwner_id=='';
		var atleastOne = (activity_description!=null && activity_description!='') || ( activity_price!=null &&  activity_price!='');
		if(missingFields||(!atleastOne)){
			res.json({success:false, message: 'The field (BusinessOwner_id) and at least one of the following fields: (type, description, price) are required!'});
		}
		else{
			Activity.findOne({_id:activity_id}, function(err, activity) {
		        if (err) {
		        	res.json({success:false, message: err});
		        }
		        else{
			        if(!activity){
			        	res.json({success:false, message: 'Activity with this id does not exist!'});
		            }
		            else{
			            if(activity.BusinessOwner_id!=activity_BusinessOwner_id){
			            	res.json({success:false, message: 'You can only edit your own activity!'});
			            }
				        else{
				        	activity.description = (activity_description==null||activity_description=='')? activity.description:activity_description;
				        	activity.price = (activity_price==null||activity_price=='')? activity.price:activity_price;
				            activity.save(function(err) {
				                if (err) {
				                	res.json({success:false, message: err});
				                } 
				                else {
				                	res.json({success:true, message: 'Activity has been updated successfully.'});
				                }
				            });

				        }
		            }

		        }
	        });
		}		
	}

};

module.exports = activityController;

