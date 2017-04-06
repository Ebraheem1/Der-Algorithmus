var BusinessOwner = require('../models/BusinessOwner');
var Client= require('../models/Client');


let AuthenticationController = {
	//Authentication for the business owners
	ensureBusinessAuthenticated: function(req,res,next){
		if(! req.user){
    		req.flash('error_msg','You are not logged in');
    		return;
  		} else {
    		BusinessOwner.findById(req.user._id,function(err,user)
    		{
      		if(err)
      		{
        		res.send(err);
            return;
      		}
      			if(! user)
      			{
        			req.flash('error_msg','You are not logged in');
        			return;
      			}
      			else{
        			return next();
      				}

    		});
  		}

	},
	//authentication for regular clients
	ensureClientAuthenticated: function(req, res, next){
  		if(! req.user){
    		req.flash('error_msg','You are not logged in');
    		return;
  		} else {
    		Client.findById(req.user._id,function(err,user)
    		{
      			if(err)
      			{
        			res.send(err);
              return;
      			}
      			if(! user)
      			{
        			req.flash('error_msg','You are not logged in');
        			return;
      			}
      			else{
        			return next();
      			}

    		});
  		}
},
	//For general purpose authentication to be used in methods that require general 
	//authentication not only for a specific type system user like logout method
	ensureAuthenticated:function(req,res,next)
	{
		if(req.isAuthenticated()){
    		return next();
  		} else {
    		req.flash('error_msg','You are not logged in');
    		return;
  		}
	},
	//Logout Function to end the session
	generalLogOut: function(req,res)
	{
		req.logout();

  		req.flash('success_msg', 'You are logged out');

  		res.redirect('/');
	}


};

module.exports = AuthenticationController;