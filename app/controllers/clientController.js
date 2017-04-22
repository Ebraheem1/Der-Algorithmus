let Client = require('../models/Client');
let RActivity = require('../models/RepeatableActivity');
let NRActivity = require('../models/NonRepeatableActivity');
let BusinessOwner = require('../models/BusinessOwner');
let Reviews=require('../models/Review');
var bcrypt = require('bcryptjs');
var User = require('../models/User');
var ObjectId = require('mongodb').ObjectID;

let clientController= {
/*
  function used to show summary of the venues of businessOwners on the website
  it checks in the data base if exists businessOwners if not it will respond with that There
  is no Venues else it will forward the array of businessOwners to the front end to be used
*/
getActivity:function(req,res){
  var id= req.params.id;
  var date=new Date();
  RActivity.findById(id,function(err,ractivity){
    if(err){
      res.json({success:false,message:err});
    }
    else if(!ractivity) {
      NRActivity.findById(id,function(err,nactivity){
        if(err){
          res.json({success:false,message:err});
        }
        else if(!nactivity | nactivity.travelingDate<=date){
          res.json({success:false,message:'404 Not found'});

        }
        else {

          res.json({success:true,activity:nactivity,type:'N'});

        }
      });
    }
    else {
      res.json({success:true,activity:ractivity,type:'R'});

    }
  });
},

viewSummaries:function(req,res){
  BusinessOwner.find(function(err,businessOwners)
{
  if(err){
    res.json({success:false,message:err});
  }else {

    if(businessOwners.length==0){
      res.json({success:false,message:'there exist no venues'});
    }else{
      res.json({success:true,message:'Loading',BusinessOwners:businessOwners});
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
      res.json({success:false,message:err});
    }
    else {
       user.email=(email==null | email=="")?user.email:email;
       user.phoneNumber=(phoneNumber==null | phoneNumber=="")?user.phoneNumber:phoneNumber;
       User.update({_id:user._id},{$set:{phoneNumber:user.phoneNumber,email:user.email}},function(err){
         if(err){
            res.json({success:false,message:err});
          }
        else {
          Client.findOne({user_id:user.id},function(err,client){
            if(err)
            {
              res.json({success:false,message:err});
            }
            else {
                  client.firstName=(firstName==null | firstName=="")?client.firstName:firstName;
                    client.lastName=(lastName==null | lastName=="")?client.lastName:lastName;
                    client.gender=(gender==null | gender=="")?client.gender:gender;
                    Client.update({_id:client._id},{$set:{firstName:client.firstName,lastName:client.lastName,gender:client.gender}},function(err){
                      if(err){
                        res.json({success:false,message:err});
                      }
                      else {
                        res.json({success:true,message:'Account Updated Succesfully'});
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
    BusinessOwner.findOne( {_id:req.params.id},function(err,BusinessOwner)
    {
      if(err)
      {
        res.json({success:false,message:err});
      }
      else {
        if(!BusinessOwner){
          res.json({success:false,message:'404 Not Found'});
        }else{
        NRActivity.find({businessOwner_id: req.params.id}, function(err, NRactivities){
          console.log(req.params.id);
          if(err){

            res.json({success:false,message:err});

          }else{
            console.log(NRactivities);
              RActivity.find({businessOwner_id:req.params.id},function(err,Ractivities){
              if(err){
                res.json({success:false,message:err});
              }
              else {
                console.log(Ractivities);
                var activities=NRactivities.concat(Ractivities);
                if(activities.length==0){
                  res.json({success:true,businessOwner:BusinessOwner,message:'No activities'});

                }
                else
                {
                  res.json({success:true,businessOwner:BusinessOwner,activities:activities});

                }

              }
            });
          }

        });
      }
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
                    callback(null,null);
                }
                if(user)
                {
                Client.findOne({user_id:user.id}, function(err,client)
                    {
                        if(err)
                        {
                            callback(null,null);
                        }
                        if(client){
                            bcrypt.compare(password, user.password, function(err, isMatch) {
                            if(err) {
                                callback(null,null);
                            }
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

    //This method takes the user_id and newRating from the req.body and takes the businessID from the req.params
    //It then checks if the user has an old rating for this business and delete it if Found
    //It then adds the new rating to the ratings of the business and update the new average rating
    rateBusiness: function (req, res) {

        var client = req.user.user_id;
        var currentBusiness = req.params.businessownerID;
        var newRating = req.body.rate;

        if(newRating > 10 || newRating < 0)
        {
          res.send({success: false, message: "not a valid rating"});
          return;
        }

        var condition = {
            _id: currentBusiness
        };

        //delete old rating
        BusinessOwner.update(condition, {
            $pull: {
                ratings: {
                    client_id: client
                }
            }
        }, function (err) {

            if (err) {
              res.send({success: false, message: err});
              return;

            }
            //add newRating
            BusinessOwner.update(condition, {
                $push: {
                    ratings: {
                        client_id: client,
                        rating: newRating
                    }
                }
            }, function (err) {

                if (err) {
                    res.json({success: false, message: err});
                    return;
                } else {

                    //update average rate
                    BusinessOwner.findOne(condition, function (err, business) {
                      if(err)
                      {
                        res.json({success: false, message: err});
                        return;
                      }
                      if(! business)
                      {
                        res.json({success: false, message: 'No matched BusinessOwner found'});
                        return;
                      }

                        var ratings = business.ratings;

                        var sum = 0;

                        for (var i = 0; i < ratings.length; i++) {
                            sum = sum + ratings[i].rating;
                        }

                        var average = sum / ratings.length;

                        console.log("new average is " + business.ratings);

                        BusinessOwner.update(condition, {
                            avgRating: average
                        }, function (err) {
                            if (err) {
                                res.json({success: false, message: "unsuccessful average update"});
                            } else {
                                res.json({success: true, message: "Rating successfully updated", avg: average});
                            }
                        });

                    });
                    //END OF UPDATE AVERAGE

                }

            });
            //END OF ADD NEW RATING

        });
        //END OF DELETE OLD RATING
    }

};


module.exports = clientController;
