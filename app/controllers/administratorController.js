//required dependencies
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var bcrypt = require('bcryptjs');
var expressValidator = require('express-validator');
var paginate = require('express-paginate');

//required models
let Application = require('../models/Application');


let Administrator = require('../models/Administrator');
let BusinessOwner= require('../models/BusinessOwner');
let Activity= require('../models/Activity');
let User= require('../models/User');


let administratorController={

	// Administrator views businesses in the directory
	viewBusinesses:function(req,res){

		BusinessOwner.find( {}, function(err,BusinessesArray){

			if(err){
        
        	res.send(err);
        
      		}else{
        	// should be replaced with page rendering in sprint 2
			res.send(BusinessesArray);
       
      		}
		});
	},

	// Administrator removes business from the directory
	removeBusiness: function(req,res){

		BusinessOwner.findById( req.params.businessId, function(err,BusinessOwner){

			if(err){
				res.send(err);
				return;
			}
			if(!BusinessOwner){
				res.send('wrong ID for business owner');
				return;
			}
			// remove activities of the deleted business owner
			Activity.remove({BusinessOwner_id:req.params.businessId},function(err){

				if(err){
					res.send(err);
					return;
				}
				// remove the business owner
				BusinessOwner.remove({_id:req.params.businessId},function(err){

					if(err){
						res.send(err);
						return;
					}

					//remove the user referenced by the deleted business owner
					User.remove({_id:BusinessOwner.user_id},function(err){

						if(err){
							res.send(err);
							return;
						}

						res.send('Business owner deleted successfully !');
					});

				});

			});
			
		});
	},

	//the admin views all pending applications
	/*viewApplications: function(req, res){

		res.redirect('/applications/1');

	},*/

	//paging for the pending applications

	viewApplicationsIndex: function(req, res){

		Application.find(function(err, applications){
			
            
            if(err){

                res.json({authenticated: true, success: false, message: err.message});	
            
            }else{

            	if(!applications){

            		res.json({authenticated: true, success: false, message: 'error retrieving applications!'});

            	}else{

            		if(applications.length>0){

            			res.json({authenticated: true, success: true, applications});

            		}else{

            			res.send({authenticated: true, success: false, message: 'No applications Pending!'});

            		}

            	}
           		
            }

        });  

	},

	viewApplication: function(req, res){

		Application.findOne({_id: req.params.id}, function(err, application){

			if(err){

				res.json({success: false, message: err.message});

			}else{

				if(!application){

					res.json({success: false, message: 'Error retrieving application!'});

				}else{

					res.json({success: true, application});

				}

			}

		});

	},
//check the entered password against the stored one
comparePassword:function(candidatePassword, callback){
	Administrator.find(function(err,admins)
	{
		if(err)
		{
			callback(null,null);
		}
		if(admins.length > 0)
		{
		bcrypt.compare(candidatePassword, admins[0].password, function(err, isAdmin) {
    	if(err) {
    		callback(null,null);
    	}
    	callback(null, isAdmin);
		});
		}
		else{
			callback(null,false);	
		}

	});
},
getAdmin:function(callback)
{
	Administrator.find(callback);
},
createAdmin:function(req,res){
		var password = req.body.password;
		Administrator.find(function(err,admins)
		{
			if(admins.length > 0)
			{
				res.send("Admin already created");
				return;
			}
			else{
				bcrypt.genSalt(10, function(err, salt) {
	    		bcrypt.hash(password, salt, function(err, hash) {
	    			var newAdmin = new Administrator({
	    				password:hash
	    			});
	    			res.send("Administrator is successfully created!");
	        		newAdmin.save();
	        		return;
	    		});
			});
			}

		});
        
}

};

module.exports = administratorController;