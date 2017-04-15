let BusinessOwner = require('../models/BusinessOwner');
let Review = require('../models/Review');
var bcrypt = require('bcryptjs');
var path = require('path');
var multer = require('multer');
var ownerUploadsPath = path.resolve(__dirname,"gallery");
var checkUpload = 0;


var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
let User = require('../models/User');
let Activity = require('../models/Activity');
let RepeatableActivity = require('../models/RepeatableActivity');
let NonRepeatableActivity = require('../models/NonRepeatableActivity');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/gallery');
    },
    filename: function (req, file, callback) {
        if(file.originalname != null || file.originalname !=''){
            var filename = file.originalname;
            var arr = filename.split(".");
            var filetype = arr[arr.length-1];
            //should be replaced when session is used
            var businessownerID=req.body.BusinessOwnerId;
            BusinessOwner.findById(businessownerID,function(err,businessowner){
                if (err) 
                    return ; 
                else {
                    if(!businessowner){
                        return ;
                    }else{
                     var newfilename = businessowner.name + '-' + Date.now()+'.'+filetype;
                     callback(null, newfilename);
                     businessowner.gallery.push(newfilename);
                     businessowner.save();
                     checkUpload = 1;
                    }

                    
                
            
                }

            });
       
        }

    }
});
var upload = multer({ storage: storage}).single('fileToUpload');

let businessownerController={

// this function for uploading pictures and videos to the gallery of the businessOwner
    addMedia:function(req,res){
        

            upload(req,res,function(err){
            if(err){
                res.send(err); 
            }
            else if (checkUpload ==1)
            {
                res.send('Your gallery updated successfully');
                checkUpload = 0;
            }
            else{
                res.send('No Data entered');
            }
        });
         }, 
   
// this function for adding any offer (discount or bounse) by the businessOwner
    addOffer : function(req,res){
    
        var offer = req.body.offer ;
        var businessownerID = req.body.businessownerID;
        BusinessOwner.findById(businessownerID,function(err,businessowner){
            if (err) 
                res.send(err) ; 
            else {
             
                if(!businessowner){
                    res.send('No businessowner');
                    return ;
                                  }
                businessowner.offers.push(offer);
                businessowner.save();   
                res.send('Your offer has been posted successfully');
            }

        });

    },
 

// this function for showing reviews of the logged-in businessOwner
    showReview : function(req,res){

        var businessownerID=req.params.businessownerID;
        Review.find({business_id:businessownerID},function(err,reviews){
        if (err) 
            res.send(err) ; 
        else {
                if(!reviews){
                    res.send('No reviews found');
                    return ;
                }
                res.send(reviews);

            }

        });
    },

//this function to reply on a specific review by the businessOwner
    reply : function(req,res){
        var reply = req.body.reply;

        var reviewID=req.params.reviewID;
        Review.findById(reviewID,function(err,review){
            if (err) res.send(err) ; 
            else{
                if(!review){
                    res.send('No review found');
                    return ;
                }

                review.reply = reply;
                review.save(); 
                res.send('your reply has been posted successfully');
            }

        });

    },

    updateBusinessTypes:function(businessOwner,addedType){

        var typesArray=businessOwner.types;
        var index=typesArray.indexOf(addedType);
        //if no activites with the same type added before, then add this to the types array of the businessOwner
        if(index == -1)
        {
            businessOwner.types.push(addedType);
            businessOwner.save(function(err,businessOwner){

                if(err)
                    return res.send(err);
            });
        }

    },

    addActivity:function(req,res){

        
        var type=req.body.type;
        
        req.body.businessOwner_id=req.params.BusinessOwnerId;

        BusinessOwner.findById(req.params.BusinessOwnerId,function(err,businessOwner){

            if(!businessOwner)
                return res.send('wrong ID for business owner');

            if(err)
                return res.send(err);

            if(req.file != undefined)
                req.body.image=req.file.filename;

            if(type=='Trip' || type=='Safari')
            {
                NonRepeatableActivity.create(req.body,function(err,nonRepeatableActivity){

                    if(err)
                        return res.send(err);

                    businessownerController.updateBusinessTypes(businessOwner,type);
                    res.send('Activity has been created successfully!');

                });
            }
            else if(type=='Room-Escaping' || type=='Paintball Fight' || type=='Battlefield' || type=='Playground')
            {
                RepeatableActivity.create(req.body,function(err,repeatableActivity){

                    if(err)
                        return res.send(err);

                    for(var i=1;i<=req.body.pricePackagesCount;i++)
                    {

                        repeatableActivity.pricePackages.push(
                            { 
                                participants: req.body['participant' + i],
                                price: req.body['price'+ i]
                            });
                    }
                    for(var i=1;i<=req.body.slotsCount;i++)
                    {
                        repeatableActivity.slots.push(
                            {
                                startTime: req.body['startTime'+i],
                                endTime: req.body['endTime'+i]
                            });

                    }
                    for(var i=0;i<7;i++)
                    {
                        if(req.body['day'+i])
                            repeatableActivity.dayOffs.push(i);

                    }
                    repeatableActivity.save(function(err){
                        if(err)
                            return res.send(err);
                    });
                    
                    businessownerController.updateBusinessTypes(businessOwner,type);
                    return res.send('Activity has been created successfully!');

                });


            }


        });
       
    },

   // business owner deletes an activity
    deleteActivity: function(req,res){

        // should be replaced with req.user._id later 
        var BusinessOwnerId=req.params.BusinessOwnerId;

        BusinessOwner.findById(BusinessOwnerId,function(err,businessOwner){

            if(!businessOwner)
            {
                res.send('wrong ID for business owner');
                return;
            }

            Activity.findByIdAndRemove(req.params.activityId, function(err,activityDeleted){

            if(!activityDeleted){
                res.send('wrong ID for activity');
                return;
            }
            if(err){

                res.send(err);

            }else{

                var deletedType=activityDeleted.type;
                Activity.find({BusinessOwner_id:BusinessOwnerId, type:deletedType},function(err,activityArray){

                    if(err){

                        res.send(err);

                    }else{
                        //if the activity deleted was the last one of its type, then remove this type from the types array of the businessOwner
                        if(activityArray.length==0)
                        {
                            var typesArray=businessOwner.types;
                            var index=typesArray.indexOf(deletedType);
                            typesArray.splice(index, 1);

                            businessOwner.types=typesArray;
                            businessOwner.save(function(err,businessOwner){
                                if(err){

                                    res.send(err);

                                }

                            }); 
   
                        }

                    }
                    // should be replaced with page rendering in sprint 2
                    res.send('Activity has been deleted successfully');

                });
            
            }

            });

        });

    },

    //this function updates the business owners info with that provided in the request
    //if a field has no specified value to update it with, it is not changed at all

    updateInfo: function (req,res) {

        var email=req.body.email;
        var phoneNumber = req.body.phoneNumber;
        var name = req.body.name;
        var description = req.body.description;
        
        var conditions = {username: req.body.username};

        User.findOne(conditions, function(err, user){
            
            if(err){
            
              res.json(err);
            
            }else{

                if(!(email == null | email == "")){

                    req.checkBody('email', 'Not a valid email address').isEmail();

                    var errors = req.validationErrors();

                    if(errors){

                        res.send(errors);
                        return;

                    }else{

                        user.email = email;

                    }

                }

                if(!(phoneNumber == null | phoneNumber == "")){

                    req.checkBody('phoneNumber', 'Not a valid phone number').isInt();

                    var errors = req.validationErrors();

                    if(errors){

                        res.send(errors);
                        return;

                    }else{

                        user.phoneNumber = phoneNumber;

                    }

                }
            
                user.save(function(err){
            
                    if(err){
            
                        res.send(err);
            
                    }else{
            
                        BusinessOwner.findOne({user_id: user.id}, function(err, businessOwner){
            
                            if(err){
            
                                res.send(err);
            
                            }else{
            
                                businessOwner.name = (name == null | name == "")? businessOwner.name: name;
                                businessOwner.description = (description == null | description ==" ")? businessOwner.description: description;
            
                                businessOwner.save(function(err){
            
                                    if(err){
            
                                        res.send(err);
            
                                    }else{
            
                                        res.send('Account Updated Succesfully!');
            
                                    }
            
                                });
            
                            }
            
                        });
            
                    }
            
                });
            
            }
        
        });

    },

    //the business owner adds a location to his set of locations

    addLocation: function (req, res){

        req.checkBody('location', 'location Required').notEmpty();

        var errors = req.validationErrors();

        if(!errors){

            var loginUsername = req.body.username;
            
            var conditions = { username: loginUsername };

            User.findOne(conditions, function(err, user){

                if(err){

                    res.json(err);

                }else{

                    if(user){

                        conditions = {user_id: user._id};
        
                        BusinessOwner.findOne(conditions, function(err, businessOwner){
        
                            if(err){
        
                                res.send(err);
        
                            }else{

                                if(businessOwner){

                                    var exists = false;

                                    for(var i = 0; i < businessOwner.locations.length; i++){

                                        if(businessOwner.locations[i] == req.body.location){

                                            exists = true;

                                            break;

                                        }

                                    }

                                    if(!exists){                            

                                        businessOwner.locations.push(req.body.location);
                
                                        businessOwner.save(function(err){
                
                                            if(err){
                
                                                res.json(err);
                
                                            }else{
                
                                                res.send('location added successfully');
                
                                            }
                
                                        }); 

                                    }else{

                                        res.send('location already exists!');

                                    }

                                }    
                            
                            }
        
                        });

                    }else{

                        res.send('user not found');

                    }

                }

            });

        }else{

            res.send('cannot use empty location!');

        }

    },

    //the business owner adds a location to his set of locations

    removeLocation: function (req, res){

        var loginUsername = req.body.username;
        
        var conditions = { username: loginUsername };

        User.findOne(conditions, function(err, user){

            if(err){

                res.json(err);

            }else{

                conditions = {user_id: user.id};

                BusinessOwner.findOne(conditions, function(err, businessOwner){

                    if(err){

                        res.json(err);

                    }else{

                        if(businessOwner){
                        
                            if(businessOwner.locations.length>1){

                                var i = businessOwner.locations.indexOf(req.body.location);
                                
                                if(i == -1){
        
                                    res.send('location not found');
        
                                }else{
        
                                    businessOwner.locations.pull(req.body.location);
        
                                    businessOwner.save(function(err){
        
                                        if(err){
        
                                            res.json(err);
        
                                        }else{
        
                                            res.send('location removed from list')
        
                                        }
        
                                    });
        
                                }

                            }else{

                                res.send('must have at least one location');

                            }


                        }else{

                            res.send('user not found');

                        }

                    }

                });

            }

        });

    },


    //this function changes the user password to a new one that satisfies the security criteria 

    changePassword: function(req, res){

        var loginUsername = req.body.username;
        
        var conditions = { username: loginUsername };

        req.checkBody('password', 'Password at least 8 characters and at most 20').len(8, 20);
        req.checkBody('password-confirm', 'Passwords do not match').equals(req.body.password);
        req.checkBody('password', 'must contain a digit and a special character').matches(/^(?=(.*\d){1})(?=.*[a-zA-Z])(?=.*[!@#$%])[0-9a-zA-Z!@#$%]{8,20}$/, "i");     

        var errors = req.validationErrors();

        if(!errors){

            User.findOne(conditions, function(err, user){

                if(err){

                    res.json(err);

                }else{

                    if(user){
                    
                        bcrypt.compare(req.body.oldPassword, user.password, function(err, isMatch){

                        
                            if(err){

                                res.json(err);

                            }else{

                                if(isMatch){

                                    user.password = req.body.password;
                                    
                                    user.save(function(err){        

                                        if(err){
                                            
                                            res.send(err);
                                        
                                        }else{

                                            res.send('Your password has been changed successfully!');

                                        }

                                    });                                        

                                }else{

                                    res.send('wrong password');

                                }

                            }
                                                        
                        });             
                    
                    }else{

                        res.send('user not found!');

                    }
                }

            });

        }else{

            res.send(errors);

        }

    },


//Write here the functions in the format of function_name:function(params)
//This method takes the inputs which are username and password passed from routes
//It searches in User and BusinessOwner collections if the inputs match a tuple in both
//Then the BusinessOwner Object is returned, otherwise, null will be returned
getOwner:function(username,password,callback)
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
                BusinessOwner.findOne({user_id:user._id}, function(err,businessOwner)
                    {
                        if(err)
                        {
                           callback(null,null);
                        }
                        
                        if(businessOwner)
                        {
                        bcrypt.compare(password,user.password,function(err,isMatch)
                            {
                                if(err)
                                {
                                    callback(null,null);
                                }
                                if(isMatch)
                                {
                                    callback(null,businessOwner);
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
    }
};


module.exports = businessownerController;
