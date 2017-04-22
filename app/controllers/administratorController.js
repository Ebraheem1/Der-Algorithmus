//required dependencies
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var bcrypt = require('bcryptjs');
var expressValidator = require('express-validator');
var paginate = require('express-paginate');

//required models
let Application = require('../models/Application');

let NonRepeatableActivity = require('../models/NonRepeatableActivity');
let RepeatableActivity = require("../models/RepeatableActivity");
let NonRepeatableActivityReservation = require("../models/NonRepeatableActivityReservation");
let RepeatableActivityReservation = require("../models/RepeatableActivityReservation");
let Administrator = require('../models/Administrator');
let BusinessOwner= require('../models/BusinessOwner');
let User= require('../models/User');


let administratorController={

	// Administrator views businesses in the directory
	viewBusinesses:function(req,res){

		BusinessOwner.find( {}, function(err,BusinessesArray){

			if(err){

        	res.json({success: false, message:err});

      		}else{
        	// should be replaced with page rendering in sprint 2
			res.json({success: true, message:"All Businesses retrieved successfully", business:BusinessesArray});

      		}
		});
	},


	removeBusiness2:function(req,res){
		BusinessOwner.findOne( {_id:req.params.businessId},function(err,owner){
			if(err){
				res.json({success: false, message:err});
				return;
			}else{
				if(owner){
						owner.remove( function(err){
							if(err)
										return res.json({success: false, message:err});
										else{
											return res.json({success:true,message:"Everything deleted successfully"});
										}
						});
			} else{
				res.json({success:false,message:"User Does Not Exist"});
				console.log("Does not exist");
				return;
			}


		} } );
	},
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


//check the entered password against the entered one
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
		if(err)
		{
			return res.json({success: false, message: 'Access Denied'});
		}
		if(admins.length > 0)
		{
			return res.json({success: false, message: 'Access Denied'});
			
		}
		else{
			bcrypt.genSalt(10, function(err, salt) {
    		bcrypt.hash(password, salt, function(err, hash) {
    			var newAdmin = new Administrator({
    				password:hash
    			});
    			
        		newAdmin.save();
        		return res.json({success: true, message: 'Admin created successfully'});
        		
    		});
		});
		}

	});
        
}

};

module.exports = administratorController;
