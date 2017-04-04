let User = require('../models/User');
var bcrypt = require('bcryptjs');
let Client = require('../models/Client');
let userController={
  /*create user (client), the request contains the attributes of the user,
  check the attribute not to be empty and aslo check password length between 8 to 15 and
  also contain at least one (uppercase letter,lowercase letter,number,Special character)
  and after checking that there is no errors in the attributes create user and save it and then
  create client with id reference to the user created and the other attributes.
  */
  createUser:function(req,res){
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
    console.log(errors);
    if(errors)
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
},

/*
function used to update the username of the user, first it checks if he will update it
with the same name as the current username, the respond will indicates that this is his current
username then it will search in the data base to make sure that there is no user with the username
entered if there exists the respond will indicate that this username is invalid to use and if this
username is not used it will update the user and resave it.
*/

changeUsername:function(req,res){

  var newUsername=req.body.username;
  if(req.body.oldUsername == newUsername){

    res.send('This is your current username!');

  }else{

      User.findOne({username:newUsername},function(err,user){

        if(err)
          res.send(err);
        else {
          if(!user)
          {

            User.findOne({username:req.body.oldUsername}, function(err, currentUser){

              if(err){

                res.send(err);

              }else{

                if(currentUser){

                    currentUser.username = newUsername;
                    currentUser.save(function(err){

                      if(err){

                        res.send(err);

                      }else{

                        res.send('Account Updated Successfully!');

                      }

                    });

                }else{

                  res.send('user not found');

                }

              }

            });

        }
        else {
          res.send('username is Unavailable');
        }
      }

      });

  }


}









};

module.exports = userController;
