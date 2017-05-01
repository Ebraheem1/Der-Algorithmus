//Dependencies
let User = require('../models/User');
var bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
let Client = require('../models/Client');
let BusinessOwner=require('../models/BusinessOwner');
let Application=require('../models/Application');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'joexDev3999@gmail.com',
        clientId: '185255529184-jounso1ilj6mpi3molu4d9oeuabr3jov.apps.googleusercontent.com',
        clientSecret: 'AYOq-4rPU13vHvJSH57e7DX_',
        refreshToken: '1/P7pL-xjCxWojbyILAY0rRIU2Grs7_0B5GfYrP2ZLFty9kTHocgzesvrXWiLxFvoT',
        accessToken: 'ya29.GlseBHVNOi3l-FiJu9l50Age8FT8BgNG2-qWMb0FHD7WldWR98luCNjGRxjsjFwEHV3P1pxkKelIb7Dl5z8g1nvyLTv-HE3Y5e9ll4dtTYQKiGEKTISHOj9fRB2J'
    },
});

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
      req.checkBody('gender',' Gender Required').notEmpty();
      req.checkBody('phoneNumber',' phoneNumber Required').notEmpty();
      req.checkBody('password', 'Password at least 8 characters and at most 20').len(8, 20);
      req.checkBody('password', 'must contain a digit and a special character').matches(/^(?=(.*\d){1})(?=.*[a-zA-Z])(?=.*[!@#$%])[0-9a-zA-Z!@#$%_]{8,20}$/, "i");
      req.checkBody('confirmPassword','Passwords do not match').equals(req.body.password);

      var errors=req.validationErrors();
      if(isNaN(req.body.phoneNumber)|| req.body.phoneNumber.length<5){
          if(errors){
             errors.push({msg: 'Not a valid phone Number!'});

          }else{
            errors=[];
            errors.push({msg: 'Not a valid phone Number!'});
          }

        }
      if(errors)
      {

        res.json({success:false,errors:errors});
      }
      else {
        if(req.body.username.toLowerCase() == 'admin'){
          res.json({success:false,message:'Username Unavailable'});

        }else{

            Application.findOne({username:req.body.username},function(err,application)
            {
              if(err)
              {

                res.json({success:false,message:'Invalid Username'});

              }
              else
              {
                if(application){

                  res.json({success:false,message:'Username Unavailable'});

                }else{

            var user=new User({
            username:req.body.username,
            password:req.body.password,
            phoneNumber:req.body.phoneNumber,
            email:req.body.email
          });
           UserId=user._id;

            user.save(function(err){
                if(err){
              res.json({success:false,message:'Invalid Username or Email'});

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

                    res.json({success:false,message:err});
                  }
                  else {
                    res.json({success:true,message:'Client Saved '});

                  }
              });
          }
    });
    }}});
  }
  }
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
      if(req.user.username == newUsername){

        res.json({success:false,message:'this is your current username'});


      }else{

            Application.findOne({username:newUsername},function(err,application)
          {
                if(err)
                {
                  res.json({success:false,message:'Error in Updating, try again..'});
                }
                else
                {
                  if(application){


                  res.json({success:false,message:'username Unavailable'});
                  }else{

                    User.findOne({username:newUsername},function(err,user){

                      if(err){
                  res.json({success:false,message:'Error in Updating, try again..'});
                      }
                      else {
                        if(!user)
                        {

                          User.findOne({_id:req.user._id}, function(err, currentUser){

                            if(err){

                              res.json({success:false,message:'Error in Updating, try again..'});

                            }else{

                              if(currentUser){

                                  currentUser.username = newUsername;

                                   User.update({_id:currentUser._id},{$set :{username:newUsername}},function(err){
                                    if(err){

                                      res.json({success:false,message:'Error in Updating, try again..'});

                                    }else{

                                      res.json({success:true,message:'Account Updated Successfully'});

                                    }

                                  });

                              }else{

                                res.json({success:false,message:'user not found'});

                              }

                            }

                          });

                      }
                      else {
                        res.json({success:false,message:'username Unavailable'});
                      }
                    }

                  });
                      }
                    }
              });
        }






    },


  // This function is used in case of the user forgetting the password . we go search for the user by the username
  //then we check that the email inserted is equal to the mail of the user you want to change the password for .
    forgotPassword: function(req, res) {
        var email = req.body.email;
        var username = req.body.username;

        req.checkBody('email', 'Email Required').notEmpty();
        req.checkBody('username', 'Username Required').notEmpty();
          var errors = req.validationErrors();
          var missingFields = email==null ||email=='' ||
           username==null || username=='';
           if(missingFields)
           {
             res.json({succes:false,message:"Please enter an email and a username."});
             return;
           }

          if(!errors){
        User.findOne({
            username: username
        }, function(err, user) {
            if (user) {
                if (user.email == email) {
                  var response =  userController.changePassword(user,res);
                    res.json({success:true,message:"A new password have been sent to your email!"});


                } else {

                    res.json({success:false,message:"You entered a wrong email "});
                    return;
                }
            } else {

                  res.json({success:false,message:"Could not find user!"});
                return;
            }
        });}
        else{
          res.json({success:false,message:"Sorry ! An error occured .Please try again later"});
        }

    },


  /*Here I search using keyword (Regular Expression) to match the keyword that the user writes
  with either the name of the businessOwner, the description of the businessOwner, or
  the types of the activities appear in our system then display the businessowners that offer
  these activities*/
  search:function(req,res)
  {
      var keyword = req.params.keyword;
      var list=[];
      BusinessOwner.find({$or:[{name:new RegExp(".*"+keyword+".*")},{description:new RegExp(".*"+keyword+".*")}, {types:{"$in": [new RegExp(".*"+keyword+".*")]}}]},function(err,businesses){

        if(err){
          res.json({success:false, message: 'The search fails, try it again :)'})
        }

        if(businesses.length > 0){

          res.json({success:true,businesses:businesses});

        }else{

          res.json({success:true,businesses:businesses,message:'No matched Venues found'});


        }

      });

  },


    //Function for generating random password between 10 to 15 characters
    generatePassword: function() {
        var length = (Math.random() * 6) + 10;
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        while(!text.match(/^(?=(.*\d){1})(?=.*[a-zA-Z])(?=.*[!@#$%])[0-9a-zA-Z!@#$%_]{8,20}$/, "i")){

          text = "";

          for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
          }

        }
        return text;
    },

    //Function for sending email . we set the mail options to send a mail with certain format to the email of the user
    sendMail: function(user, pass) {


      //Setting up the mail options .
        let mailOptions = {
            from: 'Youssef@Dev.Team👻👻👻 <joexDev3999@gmail.com>', // sender address
            to: user.email, // list of receivers
            subject: 'Hello ✔', // Subject line
            text: 'Hello world', // plain text body
            html: '<b> Dear ' + user.username + '</b> <br> <h3>Your current Password is ' + pass + ' </h3> <br> <br> -Youssef From Dev. Team ' // html body
        };

        transporter.sendMail(mailOptions, function(err, res) {
            if (err)
                res.send(err);
            else {
                res.send('Email sent');
            }
        });
    },
    // Changing password function . Creating new User and giving it all the past user info. because updating
    // the Hash for password does not work ,then we remove the previous user .
    changePassword: function(user,res) {
        var pass = userController.generatePassword();
        userController.sendMail(user, pass);

        //Creting new user .
        var user2 = new User();
        user2._id = user._id;
        user2.username = user.username;
        user2.password = pass;
        user2.phoneNumber = user.phoneNumber;
        user2.email = user.email;

        //Removing the old user then saving the new user .
        User.remove({
            _id: user._id
        }, function(err) {
            if (err) {

                return false ;
            }
            user2.save(function(err) {
                if (err) {
                  return false
                } else {

                  return true ;

                }
            });
        });
    },



getUser:function(req,res){
  User.findById(req.user.user_id,function(err,user){
    if(err){
      res.json({success:false,message:"Error Getting the User"});
    }else {
      if(user){
        res.json({success:true,user:user,client:req.user});
      }
      else {

        res.json({success:false,message:"No user found"});
      }
    }

  });
}


};


//Exporting the module
module.exports = userController;
