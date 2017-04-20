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
let NonRepeatableActivityReservation= require('../models/NonRepeatableActivityReservation');
let RepeatableActivityReservation= require('../models/RepeatableActivityReservation');

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

                if(err){
                    res.json({success:false, message: err});
                    return;
                }
            });
        }

    },

    addActivity:function(req,res){

        // should be replaced with req.user._id
        var businessOwnerId='58f499e6695f871fff9a7615';

        var type=req.body.data.type;

        req.body.data.businessOwner_id=businessOwnerId;

        BusinessOwner.findById(businessOwnerId,function(err,businessOwner){

            if(!businessOwner){
                res.json({success:false, message: 'wrong ID for business owner'});
                return;
            }

            if(err){
                res.json({success:false, message: err});
                return;
            }

            if(type=='Trip' || type=='Safari')
            {
                NonRepeatableActivity.create(req.body.data,function(err,nonRepeatableActivity){

                    if(err){
                        res.json({success:false, message: err.message});
                        return;
                    }
/*                    
                    var date=new Date(nonRepeatableActivity.travelingDate);
                    console.log(date);
                    var dateFormat=date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear();
                    console.log(dateFormat); */
                    businessownerController.updateBusinessTypes(businessOwner,type);

                    res.json({success:true, message: 'Activity has been created successfully!'});

                });
            } 

            else if(type=='Room-Escaping' || type=='Paintball Fight' || type=='Battlefield' || type=='Playground')
            {
                
                RepeatableActivity.create(req.body.data,function(err,repeatableActivity){

                    if(err){
                        res.json({success:false, message: err.message});
                        return;
                    }
  
                    var slots=req.body.slots;
                    for(var i=0;i<slots.length;i++){

                        var startTime=businessownerController.convertDateToTime(slots[i].startTime);
                        var endTime=businessownerController.convertDateToTime(slots[i].endTime);
                        repeatableActivity.slots.push(
                            {
                                startTime: startTime,
                                endTime: endTime

                            });
                    } 
                    
                    var pricePackages=req.body.pricePackages;
                    for(var i=0;i<pricePackages.length;i++)
                    {

                        repeatableActivity.pricePackages.push(
                            { 
                                participants: pricePackages[i].participants,
                                price: pricePackages[i].price
                            });
                    }
                    
                    if(req.body.data.Sunday)
                        repeatableActivity.dayOffs.push(0);

                    if(req.body.data.Monday)
                        repeatableActivity.dayOffs.push(1);

                    if(req.body.data.Tuesday)
                        repeatableActivity.dayOffs.push(2);

                    if(req.body.data.Wednesday)
                        repeatableActivity.dayOffs.push(3);

                    if(req.body.data.Thursday)
                        repeatableActivity.dayOffs.push(4);

                    if(req.body.data.Friday)
                        repeatableActivity.dayOffs.push(5);

                    if(req.body.data.Saturday)
                        repeatableActivity.dayOffs.push(6);

                    repeatableActivity.save(function(err,repeatableActivity){

                        if(err){
                            res.json({success:false, message: err.message});
                            return;
                        }
        
                    });
                    
                    businessownerController.updateBusinessTypes(businessOwner,type); 
                    res.json({success:true, message: 'Activity has been created successfully!'});

                });


            }


        });
       
    },

    convertDateToTime: function(dateEntry){

        var date=new Date(dateEntry);
        var minutes=date.getMinutes();
        var hours=date.getHours();
        if(hours<10)
            hours='0'+hours;
        if(minutes<10)
            minutes='0'+minutes; 
        var time=hours+':'+minutes;
        return time;  
              
    },

    getBusinessActivities:function(businessOwnerId,res){

        NonRepeatableActivity.find({businessOwner_id:businessOwnerId},function(err,nonRepeatableActivities){

            if(err){
                res.json( {success:false, message:err } );
                return;
            }

            RepeatableActivity.find({businessOwner_id:businessOwnerId},function(err,repeatableActivities){

                if(err){

                    res.json({success:false, message:err });
                    return;
                }
                if(nonRepeatableActivities.length==0 && repeatableActivities.length==0){

                    res.json({ success:false, message:'Currently you have no acitivites',nonRepeatableActivities:nonRepeatableActivities, repeatableActivities:repeatableActivities});
                }
                else{

                    res.json({ success:true, nonRepeatableActivities:nonRepeatableActivities, repeatableActivities:repeatableActivities });
                }
                
            });

        });
    },
    
    viewBusinessActivities: function(req,res){

        // should be replaced with req.user._id
        var businessOwnerId='58f499e6695f871fff9a7615';
        NonRepeatableActivity.find({businessOwner_id:businessOwnerId},function(err,nonRepeatableActivities){

            if(err){
                res.json( {success:false, message:err } );
                return;
            }

            RepeatableActivity.find({businessOwner_id:businessOwnerId},function(err,repeatableActivities){

                if(err){

                    res.json({success:false, message:err });
                    return;
                }
                if(nonRepeatableActivities.length==0 && repeatableActivities.length==0){

                    res.json({ success:false, message:'Currently you have no acitivites',nonRepeatableActivities:nonRepeatableActivities, repeatableActivities:repeatableActivities});
                }
                else{

                    res.json({ success:true, nonRepeatableActivities:nonRepeatableActivities, repeatableActivities:repeatableActivities });
                }
                
            });

        });

        

    },

   // business owner deletes a non-repeatable activity
    deleteNonRepeatableActivity: function(req,res){

        // should be replaced with req.user._id
        var businessOwnerId='58f499e6695f871fff9a7615';

        BusinessOwner.findById(businessOwnerId,function(err,businessOwner){

            if(!businessOwner)
            {
                res.json({success:false, message:'wrong ID for business owner'});
                return;
            }

            NonRepeatableActivityReservation.find({nonRepeatableActivity_id:req.params.activityId}, function(err,reservations){

                if(err){

                    res.json({success:false, message:err});
                    return;
                }
                if(reservations.length!=0){

                    res.json({success:false, message:'You can not delete this activity, since reservation(s) have already been made.'});
                    return;
                }
                NonRepeatableActivity.findByIdAndRemove(req.params.activityId, function(err,activityDeleted){

                    if(!activityDeleted){
                        res.json({success:false, message:'wrong ID for activity'});
                        return;
                    }
                    if(err){

                        res.json({success:false, message: err});
                        return;

                    }
                    var deletedType=activityDeleted.type;
                    NonRepeatableActivity.find({businessOwner_id:businessOwnerId, type:deletedType},function(err,activityArray){

                        if(err){

                            res.json({success:false, message: err});
                            return;
                        }
                        //if the activity deleted was the last one of its type, then remove this type from the types array of the businessOwner
                        if(activityArray.length==0)
                        {
                            var typesArray=businessOwner.types;
                            var index=typesArray.indexOf(deletedType);
                            typesArray.splice(index, 1);

                            businessOwner.types=typesArray;
                            businessOwner.save(function(err,businessOwner){
                                if(err){

                                    res.json({success:false, message:err});
                                    return;
                                }

                            }); 

                        }

                        businessownerController.getBusinessActivities(businessOwnerId,res);

                    });

                });

            });

        });

    },

    // business owner deletes a repeatable activity
    deleteRepeatableActivity: function(req,res){

        // should be replaced with req.user._id
        var businessOwnerId='58f499e6695f871fff9a7615';

        BusinessOwner.findById(businessOwnerId,function(err,businessOwner){

            if(!businessOwner)
            {
                res.json({success:false, message:'wrong ID for business owner'});
                return;
            }
            RepeatableActivityReservation.find({repeatableActivity_id:req.params.activityId},function(err,reservations){

                for(var i=0;i<reservations.length;i++){

                    var reservationDate=new Date(reservations[i].date);
                    var todayDate=new Date();
                    todayDate.setHours(0);
                    todayDate.setMinutes(0);
                    todayDate.setSeconds(0);

                    if(reservationDate>=todayDate)
                    {
                       res.json({success:false, message:'You can not delete this activity, since there are upcoming reservation(s)'});
                       return;                        
                    }
                }
                RepeatableActivity.findByIdAndRemove(req.params.activityId, function(err,activityDeleted){

                    if(!activityDeleted){
                        res.json({success:false, message:'wrong ID for activity'});
                        return;
                    }
                    if(err){

                        res.json({success:false, message: err});
                        return;

                    }
                    var deletedType=activityDeleted.type;
                    RepeatableActivity.find({businessOwner_id:businessOwnerId, type:deletedType},function(err,activityArray){

                        if(err){

                            res.json({success:false, message: err});
                            return;
                        }
                        //if the activity deleted was the last one of its type, then remove this type from the types array of the businessOwner
                        if(activityArray.length==0)
                        {
                            var typesArray=businessOwner.types;
                            var index=typesArray.indexOf(deletedType);
                            typesArray.splice(index, 1);

                            businessOwner.types=typesArray;
                            businessOwner.save(function(err,businessOwner){
                                if(err){

                                    res.json({success:false, message:err});
                                    return;
                                }

                            }); 

                        }

                        businessownerController.getBusinessActivities(businessOwnerId,res);

                    });

                });

            });

        });

    },

    viewNonRepeatableReservations: function(req,res){

        NonRepeatableActivityReservation
        .find({nonRepeatableActivity_id: req.params.activityId})
        .populate({
            path:'client_id',
            populate:{path:'user_id'}
        })
        .exec( function(err, reservations){

            if(err){

                res.json({success:false, message:err});
                return;
            }
            if(reservations.length==0){

                res.json({success:false, message:'There are no reservations yet'});
            }
            else{

                var reservationsInfo=[];
                for(var i=0;i<reservations.length;i++){

                    reservationsInfo.push({
                    participants: reservations[i].participants, 
                    price: reservations[i].price,
                    firstName: reservations[i].client_id.firstName,
                    lastName: reservations[i].client_id.lastName,
                    email: reservations[i].client_id.user_id.email,
                    phoneNumber: reservations[i].client_id.user_id.phoneNumber 

                    });                                   
                }
                res.json({success:true, reservations:reservationsInfo})                
            }
            
        });

    }, 

    viewRepeatableReservations: function(req,res){

        RepeatableActivityReservation
        .find({repeatableActivity_id: req.params.activityId})
        .populate('repeatableActivity_id')
        .populate({
            path:'client_id',
            populate:{path:'user_id'}
        })
        .exec( function(err, reservations){

            if(err){

                res.json({success:false, message:err});
                return;
            }
            if(reservations.length==0){

                res.json({success:false, message:'There are no upcoming reservations'});
            }
            else{
                var reservationsInfo=[];
                var upcomingReservation=false;
                for(var i=0;i<reservations.length;i++){

                    var reservationDate=new Date(reservations[i].date);
                    var todayDate=new Date();
                    todayDate.setHours(0);
                    todayDate.setMinutes(0);
                    todayDate.setSeconds(0); 
                
                    if(reservationDate>=todayDate){

                        upcomingReservation=true;

                        var reservedSlot=reservations[i].repeatableActivity_id.slots.id(reservations[i].slot_id);

                        reservationsInfo.push({
                        reservedSlot: reservedSlot,
                        participants: reservations[i].participants, 
                        price: reservations[i].price,
                        date: reservations[i].date,
                        firstName: reservations[i].client_id.firstName,
                        lastName: reservations[i].client_id.lastName,
                        email: reservations[i].client_id.user_id.email,
                        phoneNumber: reservations[i].client_id.user_id.phoneNumber 

                        });
                    }                 

                }

                if(upcomingReservation){

                    res.json({success:true,reservations:reservationsInfo});
                }
                else{

                    res.json({success:false,message:'There are no upcoming reservations'});

                }
                
            }

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
