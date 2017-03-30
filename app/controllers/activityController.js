var Activity = require('../models/Activity');

module.exports = function(activityRouter){


	// http://localhost:8080/activity/newActivity
	activityRouter.post('/newActivity', function(req, res){
		var activity = new Activity();
		activity.type = req.body.type;
		activity.description = req.body.description;
		activity.price = req.body.price;
		activity.BusinessOwner_id = req.body.BusinessOwner_id;
		var missingFields = req.body.type==null || req.body.type=='' || req.body.description==null || req.body.description=='' || 
		                    req.body.price==null || req.body.price=='' || req.body.BusinessOwner_id==null || req.body.BusinessOwner_id=='';
		if(missingFields){
			res.send('The fields: (type, description, price, BusinessOwner_id) are required!');
		}
		else{
			activity.save(function(err){
				if(err){
					res.send(err);
				}
				else{
					res.send('Activity has been created successfully.');
				}
			});

		}
	});


	// http://localhost:8080/activity/editActivity/#
	activityRouter.put('/editActivity/:id', function(req, res){
		var activity_BusinessOwner_id = req.body.BusinessOwner_id;
		var activity_type = req.body.type;
		var activity_description =  req.body.description;
		var activity_price = req.body.price;
		var activity_id =  req.params.id;
		var missingFields = req.body.BusinessOwner_id==null || req.body.BusinessOwner_id=='';
		var atleastOne = (req.body.type!=null && req.body.type!='') || (req.body.description!=null && req.body.description!='') || ( req.body.price!=null &&  req.body.price!='');
		if(missingFields||(!atleastOne)){
			res.send('The field (BusinessOwner_id) and at least one of the following fields: (type, description, price) are required!');
		}
		else{
			Activity.findOne({_id:activity_id}, function(err, activity) {
		        if (err) {
		            res.send(err);
		        }
		        else{
			        if(!activity){
		                res.send('Activity with this id does not exist!');
		            }
		            else{
			            if(activity.BusinessOwner_id!=activity_BusinessOwner_id){
			            	res.send('You can only edit your own activity!');
			            }
				        else{
				        	activity.type = (activity_type==null||activity_type=='')? activity.type:activity_type;
				        	activity.description = (activity_description==null||activity_description=='')? activity.description:activity_description;
				        	activity.price = (activity_price==null||activity_price=='')? activity.price:activity_price;
				            activity.save(function(err) {
				                if (err) {
				                    res.send(err);
				                } 
				                else {
				                    res.send('Activity has been updated successfully.');
				                }
				            });

				        }
		            }

		        }
	        });
		}
	});

	return activityRouter;
}

