let Application = require('../models/Application');
var bcrypt = require('bcryptjs');
var expressValidator = require('express-validator');
var bodyParser=require('body-parser');
var mongoose=require('mongoose');	


let applicationController= {

	createApplication: function(req, res){

		req.checkBody('name', 'Name Required').notEmpty();
    	req.checkBody('username', 'Username Required').notEmpty();
    	req.checkBody('email', 'Email Required').notEmpty();
    	req.checkBody('email', 'Not a valid email address').isEmail();
    	req.checkBody('password', 'Password at least 8 characters and at most 20').len(8, 20);
	    req.checkBody('password-confirm', 'Passwords do not match').equals(req.body.password);
	    req.checkBody('password', 'must contain a digit and a special character').matches(/^(?=(.*\d){1})(?=.*[a-zA-Z])(?=.*[!@#$%])[0-9a-zA-Z!@#$%]{8,20}$/, "i");

	    var errors = req.validationErrors();

        if(!errors){        	
				
			var application = new Application({

				username: req.body.username,
				name: req.body.name,
				email: req.body.email,
				phoneNumber: req.body.phoneNumber,
				description: req.body.description,
				locations: req.body.locations

			});

			bcrypt.genSalt(10, function(err, salt) {
			    
			    bcrypt.hash(req.body.password, salt, function(err, hash) {

			        application.password = hash;
					
					application.save(function(err){		

						if(err){
							
							res.redirect('/business/apply');
						
						}else{

							res.send('Your application has been submitted successfully. We will notify you once the review process has been completed');

						}

					});			    
			    
			    });
			
			});	

		}else{

			res.send(errors);

		}

	}
	
};


module.exports = applicationController;