var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
var administratorController = require('./administratorController');
var businessownerController = require('./businessownerController');
var userController = require('./userController');
var clientController = require('./clientController');


let AuthenticationController = {
	//for only businessOWner Authentication
	ensureBusinessAuthenticated: function(req,res,next){
		if(! req.user){
    		//req.flash('error_msg','You are not logged in');
    		return;
    		//res.redirect('/login');
  		} else {
    		businessownerController.getOwnerByUsername(req.user.username,function(err,user)
    		{
      		if(err)
      		{
        		throw err;
      		}
      			if(! user)
      			{
        			//req.flash('error_msg','You are not logged in');
        			return;
        			//res.redirect('/login');
      			}
      			else{
        			return next();
      				}

    		});
  		}

	},
	//For only client authentication
	ensureClientAuthenticated: function(req, res, next){
  		if(! req.user){
    		//req.flash('error_msg','You are not logged in');
    		return;
    		//res.redirect('/login');
  		} else {
    		clientController.getClientByUsername(req.user.username,function(err,user)
    		{
      			if(err)
      			{
        			throw err;
      			}
      			if(! user)
      			{
        			//req.flash('error_msg','You are not logged in');
        			return;
        			//res.redirect('/login');
      			}
      			else{
        			return next();
      			}

    		});
  		}
},
//For general authentication purpose
	ensureAuthenticated:function(req,res,next)
	{
		if(req.isAuthenticated()){
    		return next();
  		} else {
    		//req.flash('error_msg','You are not logged in');
    		return;
    		//res.redirect('/login');
  		}
	},
	generalLogOut: function(req,res)
	{
		req.logout();

  		req.flash('success_msg', 'You are logged out');

  		res.redirect('/');
	}


};

module.exports = AuthenticationController;