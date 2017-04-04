let Client = require('../models/Client');
var User = require('../models/User');
var bcrypt = require('bcryptjs');

let clientController= {
//This method takes the inputs which are username and password passed from routes
//It searches in User and Client collections if the inputs match a tuple in both
//Then the Client Object is returned, otherwise, null will be returned
getClient:function(username,password,callback)
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
                Client.findOne({user_id:user.id}, function(err,client)
                    {
                        if(err)
                        {
                            throw err;
                        }
                        if(client){
                            bcrypt.compare(password, user.password, function(err, isMatch) {
                            if(err) throw err;
                            if(isMatch)
                                {
                                    callback(null,client);
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


module.exports = clientController;