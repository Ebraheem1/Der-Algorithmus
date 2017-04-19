var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var UserSchema = new Schema({

	username: {type: String, unique: true},
	email: {type: String, unique: true},
	password: String,
	phoneNumber: String

});




UserSchema.pre('save', function(next) {// before saving The User this schema will be executed
  var user = this ;
	bcrypt.genSalt(10, function(err, salt) {
	bcrypt.hash(user.password, salt, function(err, hash) {
	    if(err)
      return next(err); // jump to next
    	user.password = hash ;
    	next();
  });

});
});




UserSchema.methods.comparePassword = function(password){

  return  bcrypt.compareSync(password,this.password);
};


module.exports = mongoose.model('User', UserSchema);