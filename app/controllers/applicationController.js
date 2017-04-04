//Dependencies.
let Application = require('../models/Application');
let Owner = require('../models/BusinessOwner');
let User = require('../models/User');
var bcrypt = require('bcryptjs');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
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

//Controller
let applicationController = {

    //Accepting Application function . we find the application with the given username ,  then we create a new buisness owner
    // and user
    accept: function(req, res) {
        req.checkBody('username', 'Name Required').notEmpty();
        var errors = req.validationErrors();
        if (!errors) {
            var username = req.param('username');
            Application.findOne({
                username: username
            }, function(err, application) {
                if (application) {
                    var owner = new Owner();
                    var user = new User();
                    //copying application properites to user instance .
                    user.username = application.username;
                    user.password = application.password;
                    user.phoneNumber = application.phoneNumber;
                    user.email = application.email;
                    owner.name = application.name;
                    owner.description = application.description;
                    owner.locations = application.locations;


                    user.save(function(err) {
                        if (err) {
                            res.send("Error occured while saving user");
                            return;
                        } else { //Code was put in here to avoid asynchronous code.
                            applicationController.findId(application, owner);
                            applicationController.sendAcceptMail(application);
                        }
                    });
                    res.send("Application accepted successfuly");
                } else {
                    res.send("Application was not found !");
                }
            });
        } else {
            res.send(errors);
        }

    },
    createApplication: function(req, res) {

        req.checkBody('name', 'Name Required').notEmpty();
        req.checkBody('username', 'Username Required').notEmpty();
        req.checkBody('email', 'Email Required').notEmpty();
        req.checkBody('email', 'Not a valid email address').isEmail();
        req.checkBody('password', 'Password at least 8 characters and at most 20').len(8, 20);
        req.checkBody('password-confirm', 'Passwords do not match').equals(req.body.password);
        req.checkBody('password', 'must contain a digit and a special character').matches(/^(?=(.*\d){1})(?=.*[a-zA-Z])(?=.*[!@#$%])[0-9a-zA-Z!@#$%]{8,20}$/, "i");

        var errors = req.validationErrors();

        if (!errors) {

            var application = new Application({

                username: req.body.username,
                name: req.body.name,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                description: req.body.description,
                locations: req.body.locations

            });

            bcrypt.genSalt(10, function(err, salt) {

                bcrypt.hash(req.body.password, salt, function(err, hash) {

                    application.password = hash;

                    application.save(function(err) {

                        if (err) {

                            res.redirect('/business/apply');

                        } else {

                            res.send('Your application has been submitted successfully. We will notify you once the review process has been completed');

                        }

                    });

                });

            });

        } else {

            res.send(errors);

        }

    },
    //Rejecting application function
    reject: function(req, res) {
        var username = req.param('username'); // Could be changed to ID later .

        Application.findOne({
            username: username
        }, function(err, application) {
            if (application) {
                applicationController.sendRejectMail(application);
                applicationController.removeApplication(application);
                res.send("Application rejected successfuly");
            } else {
                res.send("Application was not found !");
            }
        });
    },

    //To link the buisness owner with the client instance just made . we find the id of the user made so we can create
    //the owner using it
    findId: function(application, owner) {
        User.findOne({
            username: application.username
        }, function(err, UserA) {
            if (UserA) {

                owner.user_id = UserA._id;
                applicationController.save(owner, application);
            } else {
                console.log('User was not saved in DB');
            }
        });
    },
    //To save the owner.
    save: function(owner, application) {
        owner.save(function(err) {
            console.log("IN");
            if (err)
                console.log("Error occured while saving BusinessOwner");
            else {
                console.log("Business Owner saved ");
                applicationController.removeApplication(application);
            }
        });
    },
    //To Send the acceptance mail .
    //This method is used to send the acceptance mail with a certain format to the mail which was present in the application (owner mail )
    sendAcceptMail: function(application) {
        let mailOptions = {
            from: 'Youssef@Dev.Team👻👻👻 <joexDev3999@gmail.com>', // sender address
            to: application.email, // list of receivers
            subject: 'Hello ✔', // Subject line
            text: 'Hello world', // plain text body
            html: '<b> Dear ' + application.name + ' ,</b> <br> <h3>Your application to our directory website has been accepted .We are very happy to work with you  ,and We wish to see more of your organization in the near future :D . </h3> <br> <br> -Youssef From Dev. Team ' // html body
        };
        transporter.sendMail(mailOptions, function(err, res) {
            if (err)
                console.log(err);
            else {
                console.log("Email sent");
            }
        });
    },
    //to Send the rejection mail.with a certain format to the mail which was present in the application (owner mail )
    sendRejectMail: function(application) {
        let mailOptions = {
            from: 'Youssef@Dev.Team👻👻👻 <joexDev3999@gmail.com>', //TODO : sender address
            to: application.email, // list of receivers
            subject: 'Hello ✔', // Subject line
            text: 'Hello world', // plain text body
            html: '<b> Dear ' + application.name + ' ,</b> <br> <h3>We are flattered that you chose us as your main directory website ,but we are  sorry to inform you that your application for our website was rejected.  </h3> <br> <br> -Youssef From Dev. Team ' // html body
        };
        transporter.sendMail(mailOptions, function(err, res) {
            if (err)
                console.log(err);
            else {
                console.log("Email sent");
            }
        });
    },
    // To remove the application after acceptance or rejection . we search for the application with the application id
    //and delete it 
    removeApplication: function(application) {
        Application.remove({
            _id: application._id
        }, function(err) {
            if (err)
                console.log("Error has occured during deletion");
            else
                console.log("Application deleted succesffuly");
        });
    }
};

//Exporting the module .
module.exports = applicationController;
Window size: 1855 x 1056
Viewport size: 1855 x
