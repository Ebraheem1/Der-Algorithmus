let Client = require('../models/Client');
var bcrypt = require('bcryptjs');

let clientController= {
//Write here the functions in the format of function_name:function(params)
getClientByUsername:function(username,callback)
    {
    	var query = {username: username};
    	Client.findOne(query, callback);
    },
comparePassword:function(candidatePassword, hash, callback){
    	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
    },
getClientById:function(id,callback)
    {
    	Client.findById(id, callback);
    }

};


module.exports = clientController;