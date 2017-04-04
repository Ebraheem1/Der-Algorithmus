let BusinessOwner = require('../models/BusinessOwner');
let User = require('../models/User');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

let businessownerController = {


    updateInfo: function(req, res) {

        req.checkBody('name', 'Name Required').notEmpty();
        req.checkBody('email', 'Not a valid email address').isEmail();

        var errors = req.validationErrors();


        if (!errors) {

            var loginUsername = req.session.user.username;

            var conditions = {
                    username: loginUsername
                }

                ,
                update = {
                    $set: {
                        phoneNumber: req.body.phoneNumber,
                        email: req.body.email
                    }
                };

            User.update(conditions, update, null, function(err, user) {

                if (err) {

                    res.send(err);

                } else {

                    User.findOne(conditions, function(err, user) {

                        conditions = {
                            user_id: user._id
                        };

                        update = {
                            $set: {
                                name: req.body.name,
                                description: req.body.description
                            }
                        };

                        BusinessOwner.update(conditions, update, null, function(err, businessOwner) {

                            if (err) {

                                res.send(err);

                            } else {

                                res.send('Info updated successfully');

                            }

                        });

                    });

                }

            });

        } else {

            res.send(errors);

        }
    },

    addLocation: function(req, res) {

        var loginUsername = req.session.user.username;

        var conditions = {
            username: loginUsername
        };

        User.findOne(conditions, function(err, user) {

            if (err) {

                res.send(err);

            } else {

                conditions = {
                    user_id: user._id
                };

                BusinessOwner.findOne(conditions, function(err, businessOwner) {

                    if (err) {

                        res.send(err);

                    } else {

                        businessOwner.locations.push(req.body.location);

                        businessOwner.save();

                        //res.redirect('/business/locations');

                    }

                });

            }

        });

    },

    removeLocation: function(req, res) {

        var loginUsername = req.session.user.username;

        var conditions = {
            username: loginUsername
        };

        User.findOne(conditions, function(err, user) {

            if (err) {

                res.send(err);

            } else {

                conditions = {
                    user_id: user._id
                };

                BusinessOwner.findOne(conditions, function(err, businessOwner) {

                    if (err) {

                        res.send(err);

                    } else {

                        businessOwner.locations.pull(req.body.location);

                        businessOwner.save();

                        //res.redirect('/business/locations');

                    }

                });

            }

        });

    },

    changePassword: function(req, res) {

        var loginUsername = req.body.username;

        var conditions = {
            username: loginUsername
        };

        req.checkBody('password', 'Password at least 8 characters and at most 20').len(8, 20);
        req.checkBody('password-confirm', 'Passwords do not match').equals(req.body.password);
        req.checkBody('password', 'must contain a digit and a special character').matches(/^(?=(.*\d){1})(?=.*[a-zA-Z])(?=.*[!@#$%])[0-9a-zA-Z!@#$%]{8,20}$/, "i");

        var errors = req.validationErrors();

        if (!errors) {

            User.findOne(conditions, function(err, user) {

                if (err) {

                    res.send(err);

                } else {

                    bcrypt.compare(req.body.oldPassword, user.password, function(err, isMatch) {

                        console.log(isMatch);

                        if (err) {

                            res.send(err);

                        } else {

                            if (isMatch) {

                                bcrypt.genSalt(10, function(err, salt) {

                                    bcrypt.hash(req.body.password, salt, function(err, hash) {

                                        user.password = hash;

                                        user.save(function(err) {

                                            if (err) {

                                                res.send(err);

                                            } else {

                                                res.send('Your password has been changed successfully!');

                                            }

                                        });

                                    });

                                });

                            } else {

                                res.send('wrong password');

                            }

                        }


                    });

                }

            });

        } else {

            res.send(errors);

        }

    }


    //Write here the functions in the format of function_name:function(params)
    getOwnerByUsername: function(username, callback) {
        var query = {
            username: username
        };
        BusinessOwner.findOne(query, callback);
    },
    comparePassword: function(candidatePassword, hash, callback) {
        bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
            if (err) throw err;
            callback(null, isMatch);
        });
    }
};

module.exports = businessownerController;
