let Client = require('../models/Client');
let BusinessOwner = require('../models/BusinessOwner');
var bcrypt = require('bcryptjs');
var User = require('../models/User');
var ObjectId = require('mongodb').ObjectID;

let clientController = {
 
  //Write here the functions in the format of function_name:function(params)
    getClientByUsername:function(username,callback){
          var query = {username: username};
          Client.findOne(query, callback);
    },
  
    comparePassword:function(candidatePassword, hash, callback){
          bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
          if(err) throw err;
          callback(null, isMatch);
      });
     },
  
    getClientById:function(id,callback){
          Client.findById(id, callback);
    },


    rateBusiness: function (req, res) {

        // var u = new User();
        // u.username = "Business";
        // u.email = "Business@gmail.com";

        // var C = new BusinessOwner();

        // u.save(function(err){
        // C.user_id = u._id;
        // C.name = "Business"; 
        // C.save(function(err){
        //     if(err){
        //         console.log(err);
        //     }else{
        //         console.log("wohoooo");
        //     }
        // });
        // });




        var client = new ObjectId("58e376eb850d0f25ca8022a5");

        var currentBusiness = new ObjectId("58e37fa9d348412b5a84536f");

        var newRating = 3;

        var condition = {
            user_id: currentBusiness
        };

        //////////////delete old rating////////////////////
        BusinessOwner.update(condition, {
            $pull: {
                ratings: {
                    client_id: client
                }
            }
        }, function (err) {

            if (err) {

                console.log(err);
                console.log('unsuccessul remove old rating');

            } else {

                console.log('successful remove old rating');

            }

            ///////////////////////add newRating//////////////////
            BusinessOwner.update(condition, {
                $push: {
                    ratings: {
                        client_id: client,
                        rating: newRating
                    }
                }
            }, function (err) {

                if (err) {
                    console.log(err);
                    console.log('unsuccessful add new rating');
                } else {
                    console.log('successful add new rating');

                    ////////////////////update average rate//////////////////////
                    BusinessOwner.findOne(condition, function (err, business) {

                        var ratings = business.ratings;

                        var sum = 0;

                        for (var i = 0; i < ratings.length; i++) {
                            sum = sum + ratings[i].rating;
                        }

                        var average = sum / ratings.length;

                        BusinessOwner.update(condition, {
                            avgRating: average
                        }, function (err) {
                            if (err) {
                                console.log(err);
                                console.log("unsuccessful average update");
                            } else {
                                console.log("successful average update = " + average);
                            }
                        });

                    });
                    ////////////////////////END OF UPDATE AVERAGE//////////////////////////

                }

            });
            //////////////////////END OF ADD NEW RATING//////////////////////

        });
        ////////////////////END OF DELETE OLD RATING/////////////////////
    }
};


module.exports = clientController;