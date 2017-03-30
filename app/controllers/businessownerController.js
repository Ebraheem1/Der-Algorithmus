let BusinessOwner = require('../models/BusinessOwner');
var bcrypt = require('bcryptjs');

let businessownerController={
//Write here the functions in the format of function_name:function(params)
getOwnerByUsername:function(username,callback)
    {
    	var query = {username: username};
    	BusinessOwner.findOne(query, callback);
    },
comparePassword:function(candidatePassword, hash, callback){
    	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
    }
};

module.exports = businessownerController;