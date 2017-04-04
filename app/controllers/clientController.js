let Client = require('../models/Client');
let BusinessOwner = require('../models/BusinessOwner');
var bcrypt = require('bcryptjs');
var User = require('../models/User');
var ObjectId = require('mongodb').ObjectID;

let clientController= {
/*
  function used to show summary of the venues of businessOwners on the website
  it checks in the data base if exists businessOwners if not it will respond with that There
  is no Venues else it will forward the array of businessOwners to the front end to be used
*/
viewSummaries:function(req,res){
  BusinessOwner.find(function(err,businessOwners)
{
  if(err){
    res.send(err);
  }else {

    if(businessOwners.length==0){
      res.send('There exist no Venues');
    }else{
      res.send(businessOwners);
    }

  }
});
},

/*
    function used to update email,phoneNumber,firstName,lastName and gender
    first by passing through the req the username of the logged in user then search in the database
    to get the user and then checks on email, phoneNumber if they are null leave the old data else
    update the values with the values in the req and then search in the data base for the client with user id
    correspondes to the user logged in and then update valus of firstName,lastName and gender with the same scenario as
    email and phoneNumber if null update it with the same current value else update it with the new value
    then respond that the Account is updated
*/
updateInfo:function(req,res){
  var email=req.body.email;
  var phoneNumber=req.body.phoneNumber;
  var firstName=req.body.firstName;
  var lastName=req.body.lastName;
  var gender=req.body.gender;
  User.findOne({username:req.body.username},function(err,user){
    if(err){
      res.send(err);
    }
    else {
       user.email=(email==null | email=="")?user.email:email;
       user.phoneNumber=(phoneNumber==null | phoneNumber=="")?user.phoneNumber:phoneNumber;
       user.save(function(err){
         if(err){
            res.send(err);
          }
        else {
          Client.findOne({user_id:user.id},function(err,client){
            if(err)
            {
              res.send(err);
            }
            else {
                  client.firstName=(firstName==null | firstName=="")?client.firstName:firstName;
                    client.lastName=(lastName==null | lastName=="")?client.lastName:lastName;
                    client.gender=(gender==null | gender=="")?client.gender:gender;
                    client.save(function(err){
                      if(err){
                        res.send(err);
                      }
                      else {
                        res.send('Account Succesfully Updated');
                      }
                    });
                  }
                  });
                  }
              });
            }
        });
  },

/*
  function used to view full detailed profile of the BusinessOwner, in the front end each BusinessOwner
  will be linked with the id and on pressing it will send to the back end the id and by searching
  in the data base for the BusinessOwner correspondes to this id and show it(forward it to the front end)
*/
viewBusiness:function(req,res){
  BusinessOwner.findOne({_id:req.params.id},function(err,BusinessOwner)
  {
    if(err)
    {
      res.send(err);
    }
    else {
      res.send(BusinessOwner);
    }
  });
},

//This method takes the inputs which are username and password passed from routes
//It searches in User and Client collections if the inputs match a tuple in both
//Then the Client Object is returned, otherwise, null will be returned
getClient:function(username,password,callback)
    {
        var query = {username: username};
        User.findOne(query, function(err,user)
            {
                if(err)
                {
                    throw err;
                }
                if(user)
                {
                Client.findOne({user_id:user.id}, function(err,client)
                    {
                        if(err)
                        {
                            throw err;
                        }
                        if(client){
                            bcrypt.compare(password, user.password, function(err, isMatch) {
                            if(err) throw err;
                            if(isMatch)
                                {
                                    callback(null,client);
                                }
                            else{
                            callback(null,null);
                            }
                            });   
                        }
                        else{
                            callback(null,null);
                        }
                    });
                }
                else{
                    callback(null,null);
                }

            });
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
