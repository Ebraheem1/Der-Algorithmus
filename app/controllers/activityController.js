let Activity = require('../models/Activity');

let activityController={

	/*	this function receives requests for editing activites, an activity has multiple attributes;
	the function gurantees to edit all parameters given, the request should include the BusinessOwner_id and at least one attrbute to be edited*/
	editActivity: function(req,res){
		var activity_BusinessOwner_id = req.body.BusinessOwner_id;
		var activity_description =  req.body.description;
		var activity_price = req.body.price;
		var activity_id =  req.params.id;
		var missingFields = req.body.BusinessOwner_id==null || req.body.BusinessOwner_id=='';
		var atleastOne = (req.body.description!=null && req.body.description!='') || ( req.body.price!=null &&  req.body.price!='');
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
	}

};

module.exports = activityController;

