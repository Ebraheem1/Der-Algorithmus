let BusinessOwner = require('../models/BusinessOwner');
/*let NonRepeatableActivity = require('../models/NonRepeatableActivity');
let RepeatableActivity = require('/../models/RepeatableActivity');*/
let Review = require('../models/Review');
var bcrypt = require('bcryptjs');
var path = require('path');
var multer = require('multer');
var ownerUploadsPath = path.resolve(__dirname,"gallery");
var checkUpload = 0;


var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
let User = require('../models/User');
let RepeatableActivity = require('../models/RepeatableActivity');
let NonRepeatableActivity = require('../models/NonRepeatableActivity');
let NonRepeatableActivityReservation= require('../models/NonRepeatableActivityReservation');
let RepeatableActivityReservation= require('../models/RepeatableActivityReservation');


let businessownerController={

   addMedia:function(req,res){

    BusinessOwner.findById(req.user._id,function(err,businessowner){
                if (err) 
                    res.json({success:false , message:'error'}) ; 
                else {
                    if(!businessowner || businessowner.length == 0){
                        res.json({success:false , message :'Not found '});
                    }else{
                        res.json({success:true , message:'Your gallery updated successfully'});
                        if(req.body.image.match(/\.(mp4|mov|avi|flv|wmv)$/)){
                     businessowner.videos.push(req.body.image);
                     businessowner.save();

                 }
                 else {
                     businessowner.images.push(req.body.image);
                     businessowner.save();
                 }

                        }
                        }
                        });
                        },
// this function for adding any offer (discount or bounse) by the businessOwner
    addOffer : function(req,res){

        req.checkBody('offer', 'missingField').notEmpty();
        req.checkBody('discount', 'missingField').notEmpty();
        req.checkBody('exp_date', 'missingField').notEmpty();
        var x = new Date();
        x.setDate(x.getDate()+1);
        x.setHours(0);
        x.setMinutes(0);
        x.setSeconds(0);
        x.setMilliseconds(0);
        var y = new Date(req.body.exp_date);
        y.setDate(y.getDate()+1);
        var errors = req.validationErrors();
        if(errors){
            res.json({success:false , message:"missingField"});
            return ;
        }

        if(x>y){
            res.json({success:false , message:"Invalid Date"});
            return ;
        }
        
        if(req.body.discount<5){
            res.json({success:false , message:"Invalid discount"});
            return ;
        }

        if(req.file != undefined)
                req.body.image=req.file.filename;

        var activityID = req.params.activityID;
        NonRepeatableActivity.findById(activityID,function(err,nonrepeatableactivity){
            if (err)
                res.json({success:false , message:'Error occurred .. Try again'}) ;
            else {

                if(!nonrepeatableactivity || nonrepeatableactivity.length==0){

                RepeatableActivity.findById(activityID,function(err,repeatableactivity){
            if (err)
                res.json({success:false , message:'Error occurred .. Try again'}) ;
            else {

                if(!repeatableactivity || repeatableactivity.length==0){
                 res.json({success:false , message:'No activity found'});

                                  }
                                  else{
                            
                repeatableactivity.offer = {offer: req.body.offer , image: req.body.image , discount : req.body.discount , exp_date : y};
                repeatableactivity.save();   
                res.json({success:true , message:'Your offer has been posted successfully'});
            }
            }

        });
                                  }
                                  else{
                nonrepeatableactivity.offer = {offer: req.body.offer , image: req.body.image , discount : req.body.discount , exp_date : y};
                nonrepeatableactivity.save();   
                res.json({success:true , message:'Your offer has been posted successfully'});
            }
            }

        });

    },


// this function for showing reviews of the logged-in businessOwner
    showReview : function(req,res){

        var businessownerID=req.params.businessownerID;
        Review.find({business_id:businessownerID},function(err,reviews){

        if (err)
            res.json({success:false , message : 'An Error occurred .. Try again later'});

        else {
                if(!reviews || reviews.length == 0){
                    res.json({success:false , message:'No reviews found'});

                }
                else{
                res.json({success:true , reviews:reviews});
                    }
            }

        });
    },

    //this function to reply on a specific review by the businessOwner
    reply : function(req,res){
        var reply = req.body.reply;

        var reviewID=req.params.reviewID;
        Review.findById(reviewID,function(err,review){

            if (err) res.json({success:false , message:'Error occurred ..try again'}) ;

            else{
                if(!review ){
                    res.json({success:false, message:'No review found'});

                }
                else{
                
                review.reply = reply;

                review.save();
                res.json({success:true , message:'your reply has been posted successfully'});
            }}


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

addActivity:function(req,res){

        req.checkBody('data.type',' Type of Activity Required').notEmpty();

        var errors=req.validationErrors();
        if(errors)
        {

            res.json({success:false, message:errors});
            return;
        }

        var businessOwnerId=req.user._id;
     
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
                if( !req.body.data.transportation){
                    res.json({success: false, message: 'You must choose a transportation'} );
                    return;
                } 
                req.checkBody('data.travelingDate', 'Invalid Traveling Date').notEmpty().isDate();
                req.checkBody('data.returnDate', 'Invalid Return Date').notEmpty().isDate();
                req.checkBody('data.maxParticipants', 'Max Participants required').notEmpty();
                req.checkBody('data.pricePerPerson', 'Price Per Person required').notEmpty();
                req.checkBody('data.cancellationWindow', 'Cancellation Window required').notEmpty();
                var errors=req.validationErrors();
                if(errors)
                {

                    res.json({success:false, message:errors});
                    return;
                }
                if( isNaN(req.body.data.maxParticipants) ){
                    res.json( {success:false, message: 'Max Participants must be a number' } );
                    return;
                }
                if( isNaN(req.body.data.pricePerPerson) ){
                    res.json( {success:false, message: 'Price Per Person must be a number' } );
                    return;
                }
                if( isNaN(req.body.data.cancellationWindow) ){
                    res.json( {success:false, message: 'cancellation Window must be a number' } );
                    return;
                }
                if( req.body.data.maxParticipants < 1  ){

                    res.json( {success:false, message: 'Max Participants must be at least 1'} );
                    return;
                }
                if( req.body.data.pricePerPerson < 1  ){

                    res.json( {success:false, message: 'Price Per Person must be at least 1'} );
                    return;
                }
                if( req.body.data.cancellationWindow < 0){

                    res.json( {success:false, message: 'Cancellation Window can not be negative number'} );
                    return;
                }
                var travelingDate=new Date(req.body.data.travelingDate);
                var returnDate=new Date(req.body.data.returnDate);

                if(returnDate<travelingDate){
                    res.json({success:false, message: 'Return Date must be greater than or equal the Traveling Date'});
                    return;
                }

                travelingDate.setDate(travelingDate.getDate()+1); 
                var todayDate=new Date();
                todayDate.setDate(todayDate.getDate()+1);
                todayDate.setHours(0);
                todayDate.setMinutes(0);
                todayDate.setSeconds(0);
                todayDate.setMilliseconds(0);

                if(travelingDate<=todayDate){

                    res.json({success:false, message: 'Traveling Date must be greater than the Current Date'});
                    return;

                }

                req.body.data.travelingDate=travelingDate;

                returnDate.setDate(returnDate.getDate()+1);              
                req.body.data.returnDate=returnDate;
        
                NonRepeatableActivity.create(req.body.data,function(err,nonRepeatableActivity){

                    if(err){
                        res.json({success:false, message: err.message});
                        return;
                    }
                   
                     businessownerController.updateBusinessTypes(businessOwner,type);
                     res.json({success:true, message: 'Activity has been created successfully!'});

                });
            } 

            else if(type=='Room-Escaping' || type=='Paintball Fight' || type=='Battlefield' || type=='Playground')
            {

                req.checkBody('data.cancellationWindow', 'Cancellation Window required').notEmpty();
                var errors=req.validationErrors();
                if(errors)
                {

                    res.json({success:false, message:errors});
                    return;
                }
                if( isNaN(req.body.data.cancellationWindow) ){
                    res.json( {success:false, message: 'cancellation Window must be a number' } );
                    return;
                }
                if( req.body.data.cancellationWindow < 0){

                    res.json( {success:false, message: 'Cancellation Window can not be negative number'} );
                    return;
                }

                var slots=req.body.slots;

                var invalidSlot=false;
                for(var i=0;i<slots.length;i++){

                    var startTime=new Date(slots[i].startTime);
                    var endTime=new Date(slots[i].endTime);

                    if(endTime <= startTime){

                        invalidSlot=true;
                        break;
                    }
                }

                var overlapping=false;
                for(var i=0; i<slots.length;i++){

                    var start1=new Date(slots[i].startTime);
                    var end1=new Date(slots[i].endTime);

                    for(var j=0; j<slots.length; j++){

                        var start2=new Date(slots[j].startTime);
                        var end2=new Date(slots[j].endTime);

                        if(i!=j){

                            if( (start1>=start2 && start1<end2) || (end1>start2 && end1<=end2) ){
                                overlapping=true;
                                break;
                            }

                        }

                    }
                }

                if(invalidSlot || overlapping){

                   res.json({ success: false, message: 'Invalid slot(s). There must be no overlapping slots and end time must be greater than start time for each slot'});
                   return;     
                }

                var pricePackages=req.body.pricePackages;
                    var flag=false;
                    for(var i=0;i< pricePackages.length;i++){
                        var currentParticipants=pricePackages[i].participants;
                        for(var j=i+1; j<pricePackages.length;j++){

                            if(currentParticipants==pricePackages[j].participants){
                                flag=true;
                                break;
                            }

                        }
                }
                if(flag){

                        res.json({ success:false, message: 'You can not have 2 different price packages with the same number of participants'} );
                        return;
                }
                
                RepeatableActivity.create(req.body.data,function(err,repeatableActivity){

                    if(err){
                        res.json({success:false, message: err.message});
                        return;
                    }
  
                    for(var i=0;i<slots.length;i++){

                        var startTime=businessownerController.convertDateToTime(slots[i].startTime);
                        var endTime=businessownerController.convertDateToTime(slots[i].endTime);
                        repeatableActivity.slots.push(
                            {
                                startTime: startTime,
                                endTime: endTime

                            });
                    } 
                    
                    for(var i=0;i<pricePackages.length;i++)
                    {

                        repeatableActivity.pricePackages.push(
                            { 
                                participants: pricePackages[i].participants,
                                price: pricePackages[i].price
                            });
                    }
                    
                    if(req.body.data.Sunday){
                        repeatableActivity.dayOffs.push(0);
                        repeatableActivity.dayOffsNames.push("Sunday");
                    }
  
                    if(req.body.data.Monday){
                        repeatableActivity.dayOffs.push(1);
                        repeatableActivity.dayOffsNames.push("Monday");
                    }

                    if(req.body.data.Tuesday){
                        repeatableActivity.dayOffs.push(2);
                        repeatableActivity.dayOffsNames.push("Tuesday");
                    }

                    if(req.body.data.Wednesday){
                        repeatableActivity.dayOffs.push(3);
                        repeatableActivity.dayOffsNames.push("Wednesday");
                    }

                    if(req.body.data.Thursday){
                        repeatableActivity.dayOffs.push(4);
                        repeatableActivity.dayOffsNames.push("Thursday");
                    }

                    if(req.body.data.Friday){
                        repeatableActivity.dayOffs.push(5);
                        repeatableActivity.dayOffsNames.push("Friday");
                    }

                    if(req.body.data.Saturday){
                        repeatableActivity.dayOffs.push(6);
                        repeatableActivity.dayOffsNames.push("Saturday");
                    }

                    repeatableActivity.save(function(err,repeatableActivity){

                        if(err){
                            res.json({success:false, message: err.message});
                            return;
                        }

                        businessownerController.updateBusinessTypes(businessOwner,type); 
                        res.json({success:true, message: 'Activity has been created successfully!'});
        
                    });                   

                });

            }
            else
            {   
                res.json({success:false, message: 'Invalid Type of Activity'});
                return;
            }

        });

    },

    getBusinessActivities:function(businessOwnerId,res){

        NonRepeatableActivity.find({businessOwner_id:businessOwnerId},function(err,nonRepeatableActivities){

            if(err){
                res.json( {success:false, message:err } );
                return;
            }

            var runningActivities=[];
            for(var i=0;i<nonRepeatableActivities.length;i++){

                var returnDate=new Date(nonRepeatableActivities[i].returnDate);
                returnDate.setDate(returnDate.getDate() -1 );
                var todayDate=new Date();
                todayDate.setHours(0);
                todayDate.setMinutes(0);
                todayDate.setSeconds(0);
                todayDate.setMilliseconds(0);

                if(returnDate>=todayDate){
                    runningActivities.push(nonRepeatableActivities[i]);
                }

            }

            RepeatableActivity.find({businessOwner_id:businessOwnerId},function(err,repeatableActivities){

                if(err){

                    res.json({success:false, message:err });
                    return;
                }
                
                if(nonRepeatableActivities.length==0 && repeatableActivities.length==0){

                    res.json({ success:false, message:'Currently you have no acitivites',nonRepeatableActivities:runningActivities, repeatableActivities:repeatableActivities});
                }
                else{

                    res.json({ success:true, nonRepeatableActivities:runningActivities, repeatableActivities:repeatableActivities });
                }
                
            });

        });
    },
    
    viewBusinessActivities: function(req,res){

        // should be replaced with req.user._id
        var businessOwnerId=req.user._id;
        businessownerController.getBusinessActivities(businessOwnerId,res);

    },
  
    // business owner deletes a non-repeatable activity
    deleteNonRepeatableActivity: function(req,res){

        // should be replaced with req.user._id
        var businessOwnerId=req.user._id;

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
                if(reservations.length!=0)
                {

                    NonRepeatableActivity.find({businessOwner_id:businessOwnerId},function(err,nonRepeatableActivities){

                        if(err){
                            res.json( {success:false, message:err } );
                            return;
                        }

                        var runningActivities=[];
                        for(var i=0;i<nonRepeatableActivities.length;i++){

                            var returnDate=new Date(nonRepeatableActivities[i].returnDate);
                            returnDate.setDate(returnDate.getDate() -1 );
                            var todayDate=new Date();
                            todayDate.setHours(0);
                            todayDate.setMinutes(0);
                            todayDate.setSeconds(0);
                            todayDate.setMilliseconds(0);

                            if(returnDate>=todayDate){
                                runningActivities.push(nonRepeatableActivities[i]);
                            }

                        }

                        RepeatableActivity.find({businessOwner_id:businessOwnerId},function(err,repeatableActivities){

                            if(err){

                                res.json({success:false, message:err });
                                return;
                            }
                            
                            if(nonRepeatableActivities.length==0 && repeatableActivities.length==0){

                                res.json({ success:false, message:'Currently you have no acitivites',nonRepeatableActivities:runningActivities, repeatableActivities:repeatableActivities});
                            }
                            else{

                                res.json({ success:false, message:'You can not delete this activity, since reservation(s) have already been made.', nonRepeatableActivities:runningActivities, repeatableActivities:repeatableActivities });
                            }
                        
                        });

                    });

                }
                else
                {

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

                }

            });

        });

    },
    // business owner deletes a repeatable activity
    deleteRepeatableActivity: function(req,res){

        var businessOwnerId=req.user._id;

        BusinessOwner.findById(businessOwnerId,function(err,businessOwner){

            if(!businessOwner)
            {
                res.json({success:false, message:'wrong ID for business owner'});
                return;
            }
            RepeatableActivityReservation.find({repeatableActivity_id:req.params.activityId},function(err,reservations){

                var reserved=false;
                for(var i=0;i<reservations.length;i++){

                    var reservationDate=new Date(reservations[i].date);
                    var todayDate=new Date();
                    todayDate.setHours(0);
                    todayDate.setMinutes(0);
                    todayDate.setSeconds(0);
                    todayDate.setMilliseconds(0);

                    if(reservationDate>=todayDate)
                    {

                        reserved=true;
                        break;                     

                    }
                }
                if(reserved)
                {
                    NonRepeatableActivity.find({businessOwner_id:businessOwnerId},function(err,nonRepeatableActivities){

                        if(err){
                            res.json( {success:false, message:err } );
                            return;
                        }

                        var runningActivities=[];
                        for(var i=0;i<nonRepeatableActivities.length;i++){

                            var returnDate=new Date(nonRepeatableActivities[i].returnDate);
                            returnDate.setDate(returnDate.getDate() -1 );
                            var todayDate=new Date();
                            todayDate.setHours(0);
                            todayDate.setMinutes(0);
                            todayDate.setSeconds(0);
                            todayDate.setMilliseconds(0);

                            if(returnDate>=todayDate){
                                runningActivities.push(nonRepeatableActivities[i]);
                            }

                        }

                        RepeatableActivity.find({businessOwner_id:businessOwnerId},function(err,repeatableActivities){

                            if(err){

                                res.json({success:false, message:err });
                                return;
                            }
                            
                            if(nonRepeatableActivities.length==0 && repeatableActivities.length==0){

                                res.json({ success:false, message:'Currently you have no acitivites',nonRepeatableActivities:runningActivities, repeatableActivities:repeatableActivities});
                            }
                            else{

                                res.json({ success:false, message:'You can not delete this activity, since there are upcoming reservation(s)' , nonRepeatableActivities:runningActivities, repeatableActivities:repeatableActivities });
                            }
                            
                        });

                    });

                }
                else
                {
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

                }

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
                    price: (reservations[i].price/100)+' £',

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
                        price: (reservations[i].price/100)+' £',

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

 // This function is for retrieving the information of currently logged in business owner
 //for the viewing and updating purposes
 getBusinessInfo: function(req, res){

        BusinessOwner.findOne({_id: req.user._id}, function(err, businessOwner){

            if(err){

                res.json({success: false, message: err.message});

            }else{

                if(!businessOwner){

                    res.json({success: false, message: 'No business found'});

                }else{

                    User.findOne({_id: businessOwner.user_id}, function(err, user){

                        if(err){

                            res.json({success: false, message: err.message});

                        }else{

                            if(!user){

                                res.json({success: false, message: 'No business found'});

                            }else{

                                delete user.password;
                                res.json({success: true, businessOwner, user});

                            }

                        }

                    })

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
          if(phoneNumber != null && isNaN(phoneNumber)){
             res.json({success:false,message:'Not a valid phoneNumber'});
          }

        var conditions = {_id: req.user._id};

        BusinessOwner.findOne(conditions, function(err, businessOwner){

            if(err){

                res.json({success: false, message: err.message});

            }else{

                if(!businessOwner){

                    res.json({success: false, message: 'No profile found'});

                }else{

                    name = (name == null || name == "")? businessOwner.name: name;
                    description = (description == null || description ==" ")? businessOwner.description: description;

                    BusinessOwner.update(conditions, {$set: {name: name, description: description}}, function(err){

                        if(err){

                            res.json({success: false, message: err.message});

                        }else{

                            User.findOne({_id: businessOwner.user_id}, function(err, user){

                                if(err){

                                  res.json({success: false, message: err.message});

                                }else{

                                    if(!user){

                                        res.json({success: false, meassage: 'profile not found!'});

                                    }else{

                                        if(!(email == null || email == "")){

                                            req.checkBody('email', 'Not a valid email address').isEmail();

                                            var errors = req.validationErrors();

                                            if(errors){

                                                res.json({success: false, errors: errors});
                                                return;

                                            }else{

                                                user.email = email;

                                            }

                                        }else{

                                            email = user.email;

                                        }

                                        if(!(phoneNumber == null || phoneNumber == "")){

                                            req.checkBody('phoneNumber', 'Not a valid phone number').isInt();

                                            var errors = req.validationErrors();

                                            if(errors){

                                                res.json({success: false, errors: errors});
                                                return;

                                            }else{

                                                user.phoneNumber = phoneNumber;

                                            }

                                        }else{

                                            phoneNumber = user.phoneNumber;

                                        }


                                        User.update({_id: businessOwner.user_id}, {$set: {email: email, phoneNumber: phoneNumber}} ,function(err, userx){

                                            if(err){

                                                res.json({success: false, message: err.message});

                                            }else{

                                                res.json({success: true, message: 'info updated!'})

                                            }

                                        });

                                    }

                                }

                            });

                        }

                    });

                }

            }

        });

    },

    //the business owner adds a location to his set of locations

    addLocation: function (req, res){

        req.checkBody('location', 'location Required').notEmpty();

        var errors = req.validationErrors();

        if(!errors){

            var conditions = { _id: req.user._id };

            BusinessOwner.findOne(conditions, function(err, businessOwner){

                if(err){

                    res.json({success:false, message: err.message});

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

                                    res.json({success:false, message: err.message});

                                }else{

                                    res.json({success:true, message: 'location added!'});

                                }

                            });

                        }else{

                            res.json({success:false, message: 'location already exists'});

                        }

                    }

                }

            });

        }else{

            res.json({success:false, message: 'Cannot add an emty location'});

        }

    },

    //the business owner adds a location to his set of locations

    removeLocation: function (req, res){

        var conditions = { _id: req.user._id };

        BusinessOwner.findOne(conditions, function(err, businessOwner){

            if(err){

                res.json({success: false, message: err.message});

            }else{

                if(businessOwner){

                    if(businessOwner.locations.length>1){

                        var i = businessOwner.locations.indexOf(req.body.location);

                        if(i == -1){

                            res.json({success: false, message: 'location not found!'});

                        }else{

                            businessOwner.locations.pull(req.body.location);

                            businessOwner.save(function(err){

                                if(err){

                                    res.json({success: false, message: err.message});

                                }else{

                                    res.json({success: true, message: 'location removed from list!'});

                                }

                            });

                        }

                    }else{

                        res.json({success: false, message: 'must have at least one location'});
                    }


                }else{

                    res.json({success: false, message: 'user not found!'});

                }

            }

        });

    },


    //this function changes the user password to a new one that satisfies the security criteria

    changePassword: function(req, res){

        var loginId = req.user._id;
        var conditions = { _id: loginId };

        req.checkBody('password', 'Password at least 8 characters and at most 20').len(8, 20);
        req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);
        req.checkBody('password', 'must contain a digit and a special character').matches(/^(?=(.*\d){1})(?=.*[a-zA-Z])(?=.*[!@#$%])[0-9a-zA-Z!@#$%]{8,20}$/, "i");

        var errors = req.validationErrors();

        if(!errors){

            User.findOne(conditions, function(err, user){

                if(err){

                    res.json({success:false,message:err});

                }else{

                    if(user){

                        bcrypt.compare(req.body.oldPassword, user.password, function(err, isMatch){


                            if(err){

                                res.json({success:false,message:err});

                            }else{

                                if(isMatch){

                                    user.password = req.body.password;

                                    user.save(function(err){

                                        if(err){

                                            res.json({success:false,message:err});

                                        }else{

                                            res.json({success:true,message:'your Password changed successfully'});

                                        }

                                    });

                                }else{

                                    res.json({success:false,message:'wrong password'});

                                }

                            }

                        });

                    }else{

                        res.json({success:false,message:'user not found'});

                    }
                }

            });

        }else{

            res.json({success:false,message:errors});

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
