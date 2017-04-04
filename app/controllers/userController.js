//Dependencies
let User = require('../models/User');
var bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

//The transport settings required for nodemailer . ( sender mail / refresh & accessToken / client ID and secret)
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

//The user controller
let userController = {
  // This function is used in case of the user forgetting the password . we go search for the user by the username
  //then we check that the email inserted is equal to the mail of the user you want to change the password for .
    forgotPassword: function(req, res) {
        var email = req.body.email;
        var username = req.body.username;
        req.checkBody('email', 'Email Required').notEmpty();
        req.checkBody('username', 'Username Required').notEmpty();
        	var errors = req.validationErrors();
          if(errors){
        User.findOne({
            username: username
        }, function(err, user) {
            if (user) {
                if (user.email == email) {
                    userController.changePassword(user);
                    res.send("Password updated correctly");
                } else {
                    res.send("You entered a wrong email ");
                    return;
                }
            } else {
                res.send("Could not find user!");
                return;
            }
        });}
        else{
          res.send(errors);
        }

    },

    //Function for generating random password between 5 to 15 characters
    generatePassword: function() {
        var length = (Math.random() * 6) + 10;
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
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
                console.log(err);
            else {
                console.log("Email sent");
            }
        });
    },
    // Changing password function . Creating new User and giving it all the past user info. because updating
    // the Hash for password does not work ,then we remove the previous user .
    changePassword: function(user) {
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
                console.log(err);
                return;
            }
            user2.save(function(err) {
                if (err) {
                    console.log("error");
                } else {
                    console.log("Done");
                }
            });
        });
    }
};

//Exporting the module .
module.exports = userController;
