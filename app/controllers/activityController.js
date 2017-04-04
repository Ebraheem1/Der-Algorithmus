let Activity = require('../models/Activity');

let activityController={

	//http://localhost:8080/activity/newActivity
	//this function receives requests for creating new activites, and makes an entry to the database
	//the function ensures that the request includes the required fields (type, description, price, BusinessOwner_id)
	newActivity:function(req,res){
		var activity = new Activity();
		//in the next sprint, this should be replaced by the authenticated business owner id
		//it will be included in the request body for sprint 1
		activity.BusinessOwner_id = req.body.BusinessOwner_id;
		activity.type = req.body.type;
		activity.description = req.body.description;
		activity.price = req.body.price;
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
	},

	//http://localhost:8080/activity/editActivity/#
	//this function receives requests for editing activites, an activity has multiple attributes;
	//the function gurantees to edit all parameters given, the request should include the BusinessOwner_id and at least one attrbute to be edited
	editActivity: function(req,res){
		//in the next sprint, this should be replaced by the authenticated business owner id
		//it will be included in the request body for sprint 1
		var activity_BusinessOwner_id = req.body.BusinessOwner_id;
		var activity_type = req.body.type;
		var activity_description =  req.body.description;
		var activity_price = req.body.price;
		//this is the id of the activity instance given by MongoDB
		//once the user clicks on the option to edit a review, the activity's mongoDB _id will be included in the route
		var activity_id =  req.params.id;
		var missingFields = req.body.BusinessOwner_id==null || req.body.BusinessOwner_id=='';
		//a boolean condition to ensure at least one attrbute is given to be edited
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
			        	//corner-case: using an invalid id in the request
		                res.send('Activity with this id does not exist!');
		            }
		            else{
		            	//corner-case: a business owner trying to edit another business' actvity
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
	}

};

module.exports = activityController;

