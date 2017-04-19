//Dependencies.
let Application = require('../models/Application');
let Owner = require('../models/BusinessOwner');
let User = require('../models/User');
let userController = require('./userController');
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

        var pass = userController.generatePassword();
    
        var errors=null;
        if (!errors) {
            var id = req.params.id;
            Application.findOne({
                _id: id
            }, function(err, application) {
                if(application){
                    var owner = new Owner();
                    var user = new User();
                    //copying application properites to user instance .
                    user.username = application.username;
                    user.password = pass;
                    user.phoneNumber = application.phoneNumber;
                    user.email = application.email;
                    owner.name = application.name;
                    owner.description = application.description;
                    owner.locations = application.locations;


                    user.save(function(err) {
                        if (err) {
                            res.json({success:false, message: 'problem with saving!'});
                            return;
                        } else { //Code was put in here to avoid asynchronous code.
                            applicationController.findId(application, owner);
                            applicationController.sendAcceptMail(application,pass);

                            res.json({success:true, message: 'Business owner saved successfully!'});
                        }
                    });
                    return;
                } else {
                    res.json({success:false, message: 'Application was not found!'});
                    return;
                }
            });
        } else {
            res.json({success:true, message: errors});
            return;
        }

    },

    checkUsername: function(req, res){

        if(req.body.username && req.body.username != ''){

            Application.find({username: req.body.username}, function(err, applications){

                if(err){

                    res.json({success: false, message: err.message});

                }else{

                    if(applications.length > 0){

                        res.json({success: false, message: 'Username not available!'});

                    }else{

                        User.find({username: req.body.username}, function(err, users){

                            if(err){

                                res.json({success: false, message: err.message});

                            }else{

                                if(users.length > 0){

                                    res.json({success: false, message: 'Username not available!'});

                                }else{

                                    res.json({success: true, message: '✔'});

                                }

                            }

                        });

                    }

                }

            });

        }else{



        }

    },

    checkEmail: function(req, res){

        console.log('a7a');

        if(req.body.email && req.body.email != ''){

            Application.find({email: req.body.email}, function(err, applications){

                if(err){

                    res.json({success: false, message: err.message});

                }else{

                    if(applications.length > 0){

                        res.json({success: false, message: 'Email not available!'});

                    }else{

                        User.find({email: req.body.email}, function(err, users){

                            if(err){

                                res.json({success: false, message: err.message});

                            }else{

                                if(users.length > 0){

                                    res.json({success: false, message: 'Email not available!'});

                                }else{

                                    res.json({success: true, message: '✔'});

                                }

                            }

                        });

                    }

                }

            });

        }else{



        }

    },
    //in this function we create a business owner application using the data provided by the applicant
    //this application is to be later reviewed by the admin
    createApplication: function(req, res) {

        console.log('a7a');

        req.checkBody('name', 'Name Required').notEmpty();
        req.checkBody('username', 'Username Required').notEmpty();
        req.checkBody('email', 'Email Required').notEmpty();
        req.checkBody('email', 'Not a valid email address').isEmail();
        req.checkBody('locations', 'at least one location is Required').notEmpty();
        req.checkBody('description', 'description Required').notEmpty();
        req.checkBody('phoneNumber', 'phoneNumber Required').notEmpty();

        var errors = req.validationErrors();

        if (!errors){
            
            if(req.body.username.toLowerCase() == 'admin'){

                res.json({success:false, message: 'Username requested not available!'});
            
            }else{
            
                User.find({username:req.body.username}, function(err, users){

                    if(err){

                        res.json({success:false, message: err.message});

                    }else{

                        if(users.length>0){

                            res.json({success:false, message: 'Username requested not available!'});

                        }else{

                            User.find({email: req.body.email}, function(err, users){

                                if(err){
                                    
                                    res.json({success:false, message: err.message});

                                }else{

                                    if(users.length>0){

                                        res.json({success:false, message: 'email entered not available!'});

                                    }else{

                                         var application = new Application({

                                            username: req.body.username,
                                            name: req.body.name,
                                            email: req.body.email,
                                            phoneNumber: req.body.phoneNumber,
                                            description: req.body.description,
                                            locations: req.body.locations

                                        });  

                                        application.save(function(err){
                                        
                                            if(err){
                                        
                                                res.json({success:false, message: 'problem submitting application!'});
                                        
                                            }else{
                                                
                                                res.json({success:true, message: 'Your application was submitted succesffuly! you\'ll be notified once it is reviewed'});
                                        
                                            }
                                                 
                                        });
                                                                        
                                    }

                                }

                            });

                        }

                    }

                });

            }

        }else{

            res.json({success:false, message: errors});

        }

    },
    //Rejecting application function
    reject: function(req, res) {
        var id = req.params.id; // Could be changed to ID later .

        Application.findOne({
            _id: id
        }, function(err, application) {

            if (application) {

                applicationController.sendRejectMail(application);
                applicationController.removeApplication(application);
                res.json({success:true, message: 'Application rejected!'});
            
            } else {

                res.json({success:false, message: 'Application was not found!'});

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
            } 
        });
    },
    //To save the owner.
    save: function(owner, application) {
        owner.save(function(err) {
            if (err)
                return;
            else {
                applicationController.removeApplication(application);
            }
        });
    },
    //To Send the acceptance mail .
    //This method is used to send the acceptance mail with a certain format to the mail which was present in the application (owner mail )
    sendAcceptMail: function(application,pass) {
        let mailOptions = {
            from: 'Youssef@Dev.Team👻👻👻 <joexDev3999@gmail.com>', // sender address
            to: application.email, // list of receivers
            subject: 'Hello ✔', // Subject line
            text: 'Hello world', // plain text body
            html: '<b> Dear ' + application.name + ' ,</b> <br> <h3>Your application to our directory website has been accepted .We are very happy to work with you  ,and We wish to see more of your organization in the near future :D your password is '+pass+' . </h3> <br> <br> -Youssef From Dev. Team ' // html body
        };
        transporter.sendMail(mailOptions, function(err, res) {
            if (err)
                res.send(err);
            else {
                res.send("Email sent");
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
                res.send(err);
            else {
                res.send("Email sent");
            }
        });
    },
    // To remove the application after acceptance or rejection . we search for the application with the application id
    //and delete it 
    removeApplication: function(application) {
        Application.remove({
            _id: application._id
        }, function(err) {
            if (err){
            
                return;
            }
            
        });
    }
};

//Exporting the module .
module.exports = applicationController;

