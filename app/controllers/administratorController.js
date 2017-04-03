//required dependencies
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var expressValidator = require('express-validator');
var paginate = require('express-paginate');

//required models
let Administrator = require('../models/Administrator');
let Application = require('../models/Application');


let administratorController={


	viewApplications: function(req, res){

		res.redirect('/applications/1');

	},

	viewApplicationsIndex: function(req, res){

		Application.count(function(err, c){

		if(c == 0){

			res.send('No Applications to Show');

		}else{
		
				var maxPages = Math.ceil(c/10);
	
					var page = Math.max(1, req.params.page);
	
					Application.find(function(err, applications){
						
			            
			            if(err){
	
			                res.send(err.message);	
			            
			            }else{
	
			   				if(page>maxPages){
	
			   					res.redirect('/applications/'+maxPages);
			   				
			   				}else{

			   					if(page<1){

			   						res.redirect('/applications/1');

			   					}else{

			   						res.send(applications);
			   						
			   					}	
	
			   				}
			           		
			            }
		
			        }).skip((page-1)*10).limit(10);
		
				}
	    });

	}
//Write here the functions in the format of function_name:function(params)
comparePassword:function(username,candidatePassword, callback){
	Administrator.find(function(err,admins)
	{
		if(err)
		{
			throw err;
		}
		bcrypt.compare(candidatePassword, admins[0].password, function(err, isAdmin) {
    	if(err) throw err;
    	callback(null, isAdmin);
		});

	});
},
getAdmin:function(callback)
{
	Administrator.find(callback);
},
createAdmin:function(newAdmin, callback){
        bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newAdmin.password, salt, function(err, hash) {

	        newAdmin.password = hash;
	        newAdmin.save(callback);
	    });
	});
},

};

module.exports = administratorController;