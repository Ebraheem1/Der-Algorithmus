let Administrator = require('../models/Administrator');
var bcrypt = require('bcryptjs');

let administratorController={
//Write here the functions in the format of function_name:function(params)
comparePassword:function(username,candidatePassword, hash, callback){
    
    callback(null,(candidatePassword==hash && username=="admin") );
},
getAdmin:function(password,callback)
{
	var query = {password: password};
	Administrator.findOne(query,callback);
},
createAdmin:function(newAdmin,callback)
{
	newAdmin.save(callback);
}
};

module.exports = administratorController;