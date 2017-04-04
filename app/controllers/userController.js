//Dependencies
let User = require('../models/User');
let BusinessOwner= require('../models/BusinessOwner');
let Activity = require('../models/Activity');
var bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

//Setting up nodemailer.
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
    forgotPassword: function(req, res) {
        var email = req.body.email;
        var username = req.body.username;
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
        });

    },

//Here I search using keyword (Regular Expression) to match the keyword that the user writes
//with either the name of the businessOwner, the description of the businessOwner, or
//the types of the activity appear in our activity collection
search:function(req,res)
{
    var keyword = req.params.keyword;
    var flag=0;
    var list=[];
    BusinessOwner.find({$or:[{name:new RegExp(".*"+keyword+".*")},{description:new RegExp(".*"+keyword+".*")}]},function(err,businesses)
    {
        if(businesses.length > 0)
        {
            
            for(var i =0 ; i < businesses.length  ; i++)
            {
                flag  = 0 ;
                for(var j =0; j < list.length && (!flag); j++)
                {
                    if(list[j] == businesses[i])
                    {
                        flag = 1;
                    }
                }
                if(!flag)
                {
                    list.push(businesses[i]);
                }
            }
        }
        Activity.find({type: new RegExp(".*"+keyword+".*")},function(err,activities)
        {
            for(var i = 0 ; i< activities.length ; i++)
            {
                flag = 0;
                BusinessOwner.findById(activities[i].BusinessOwner_id, function(error,business)
                    {
                        if(business)
                        {
                            for(var j = 0; j < list.length && (!flag) ; j++)
                            {
                                if(list[j] == business)
                                {
                                    flag = 1;
                                }
                            }
                            if(!flag)
                            {
                                list.push(business);
                            }

                        }
                    });
            }
        });

    });
    //Here we render to the view + the list variable

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

    //Function for sending email .
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
    // the Hash for password does not work .
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
