let User = require('../models/User');
var bcrypt = require('bcryptjs');

let userController={

create:function(req,res){
	var newUser = new User({
			email:req.body.email,
			username: req.body.username,
			password: req.body.password,
			phoneNumber: req.body.phoneNumber
		});

		User.createUser(newUser, function(err, user){
			if(err){
			if(err.name == 'MongoError'){ 	
				req.flash('error_msg', 'username already exists');
			}}
			else{
			console.log(user);
				req.flash('success_msg', 'You are registered successfully');
		}
		});
}
//Write here the functions in the format of function_name:function(params)

}

module.exports = userController;