let User = require('../models/User');
var bcrypt = require('bcryptjs');
let Client = require('../models/Client');
let userController={
  register:function(req,res)
  {
    res.send('register');
  },

  createUser:function(req,res)
  {
    req.checkBody('username',' Username Required').notEmpty();
    req.checkBody('email',' Email Required').isEmail();
    req.checkBody('firstName',' firstName Required').notEmpty();
    req.checkBody('lastName',' lastName Required').notEmpty();
    req.checkBody('gender',' gender Required').notEmpty();
    req.checkBody('phoneNumber',' phoneNumber Required').notEmpty();
    req.checkBody('password', 'Password at least 8 characters and at most 20').len(8, 15);
    req.checkBody('password', 'must contain a digit and a special character').matches(/^(?=(.*\d){1})(?=.*[a-zA-Z])(?=.*[!@#$%])[0-9a-zA-Z!@#$%]{8,20}$/, "i");
    req.checkBody('confirmPassword','Passwords do not match').equals(req.body.password);

    var errors=req.validationErrors();

    if(errors|req.body.username=='admin'|req.body.username=='Admin')
    {
      if(errors)
      res.send(errors);
      else
      res.send('Invalid Username');

    }
    else {
        var user=new User({
          username:req.body.username,
          password:req.body.password,
          phoneNumber:req.body.phoneNumber,
          email:req.body.email
        });
         UserId=user._id;
      }
  user.save(function(err){
    if(err){
            res.send(err);
      }
    else {
              var client=new Client({
              user_id:UserId,
              firstName:req.body.firstName,
              lastName:req.body.lastName,
              gender:req.body.gender
            });
            client.save(function(err){
                if(err){
                  res.send(err);
                }
                else {
                  res.send('Client saved !');
                }
            });
        }
  });
}

};

module.exports = userController;
