let BusinessOwner = require('../models/BusinessOwner');
var User = require('../models/User');
var bcrypt = require('bcryptjs');

let businessownerController={
//Write here the functions in the format of function_name:function(params)
//This method takes the inputs which are username and password passed from routes
//It searches in User and BusinessOwner collections if the inputs match a tuple in both
//Then the BusinessOwner Object is returned, otherwise, null will be returned
getOwner:function(username,password,callback)
    {
    	var query = {username: username};
    	User.findOne(query, function(err,user)
    		{
    			if(err)
    			{
    				throw err;
    			}
    			if(user)
    			{
    			BusinessOwner.findOne({user_id:user.id}, function(err,businessOwner)
    				{
    					if(err)
    					{
    						throw err;
    					}
    					if(BusinessOwner)
    					{
    					bcrypt.compare(password,user.password,function(err,isMatch)
    						{
    							if(err)
    							{
    								throw err;
    							}
    							if(isMatch)
    							{
    								callback(null,businessOwner);
    							}
    							else{
    								callback(null,null);
    							}
    						});
    					}
    					else{
    						callback(null,null);
    					}

    				});
    			}
    			else{
    				callback(null,null);
    			}
    		});
    }
};

module.exports = businessownerController;