var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var UserSchema = new Schema({

	username: {type: String, unique: true},
	password: String,
	phoneNumber: String,
	email: {type: String, unique: true},

});




UserSchema.pre('save', function(next) {// before saving The User this schema will be executed
  var user = this ;
  bcrypt.hash(user.password,null,null,function(err,hash){
    if(err)
      return next(err); // jump to next
    user.password = hash ;
    next();
  });

});



UserSchema.methods.comparePassword = function(password){

  return  bcrypt.compareSync(password,this.password);
};


module.exports = mongoose.model('User', UserSchema);
