//Dependencies.
let Application = require('../models/Application');
let Owner = require('../models/BusinessOwner');
let User = require('../models/User')
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
var bcrypt = require('bcryptjs');
//NodeMailer Setup
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

  //Accepting Application function .
    accept: function(req, res) {
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
                    if (err){
                        res.send("Error occured while saving user");
                      return ;
                    }
                    else {  //Code was put in here to avoid asynchronous code.
                        applicationController.findId(application, owner);
                        applicationController.sendAcceptMail(application);
                    }
                });
                res.send("Application accepted successfuly");
            } else {
                res.send("Application was not found !");
            }
        });

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

//To link the buisness owner with the client instance just made .
    findId: function(application, owner) {
        User.findOne({
            username: application.username
        }, function(err, UserA) {
            if (UserA) {

                owner.user_id = UserA._id;
                applicationController.save(owner,application);
            } else {
                console.log('User was not saved in DB');
            }
        });
    },
  //To save the owner.
    save: function(owner,application) {
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
  //to Send the rejection mail
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
    // To remove the application after acceptance or rejection .
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
