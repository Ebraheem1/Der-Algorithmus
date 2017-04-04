let Review = require('../models/Review');
var User = require('../models/User');
var BusinessOwner = require('../models/BusinessOwner');
let Client = require('../models/Client');
var ObjectId = require('mongodb').ObjectID;

let reviewController = {
    //Write here the functions in the format of function_name:function(params)

    viewBusinessReviews: function (req, res) {

        // var u = new User();
        // u.username = "Ahmed";
        // u.email = "Ahmed@gmail.com";

        // var C = new Client();

        // u.save(function(err){
        // C.user_id = u._id;
        // C.firstName = "Ahmed";
        // C.lastName = "Tarek";
        // C.gender = "Male"; 
        // C.save(function(err){
        //     if(err){
        //         console.log(err);
        //     }else{
        //         console.log("Client Saved WOHOOOOO !!");
        //     }
        // });
        // });

        // var r = new Review();
        // r.user_id = ObjectId("58e387965084c1349b92693d");
        // r.business_id = ObjectId("58e37fa9d348412b5a84536f");
        // r.comment = "bardo 7elw awi el business daaaaa !! ";
        // r.save();

        var BusID = "58e37fa9d348412b5a84536f";

        var conditions = {
            "business_id": BusID
        };

        var reviews = Review.find(conditions, function (err, reviews) {

            if (err) {

                res.send(err);

                console.log(err);

            } else {

                console.log(reviews);

                return reviews;

            }

        });


    }
};

module.exports = reviewController;