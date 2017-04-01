let Administrator = require('../models/Administrator');
var bcrypt = require('bcryptjs');

let administratorController={
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