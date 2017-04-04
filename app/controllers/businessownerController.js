
let BusinessOwner = require('../models/BusinessOwner');
let Review = require('../models/Review');
var bcrypt = require('bcryptjs');
var path = require('path');
var multer = require('multer');
var ownerUploadsPath = path.resolve(__dirname,"gallery");

var upload = multer({ storage: storage}).single('fileToUpload');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
let User = require('../models/User');
let Activity = require('../models/Activity');

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/gallery');
  },
  filename: function (req, file, callback) {
  	if(file.originalname != null || file.originalname !=''){
  	//console.log(file.originalname);
  	var filename = file.originalname;
  	var arr = filename.split(".");
  	var filetype = arr[arr.length-1];
  	//should be replaced when session is used
  	var businessownerID='58e3bbdfb803791535b613cf';
  	BusinessOwner.findById(businessownerID,function(err,businessowner){
  		if (err) res.send(err) ; 
  		else {

        var newfilename = businessowner.name + '-' + Date.now()+'.'+filetype;
        callback(null, newfilename);
        businessowner.gallery.push(newfilename);
    	  businessowner.save();
        
    
  		}

  	});
   
  }
}
});

let businessownerController={// this function for uploading pictures and videos to the gallery of the businessOwner
	addMedia:function(req,res){
	upload(req,res,function(err){
		if(err){
			res.send(err) ; 
		}
	});
 }, 
   
// this function for adding any offer (discount or bounce) by the businessOwner
   addOffer : function(req,res){
	var offer = req.body.offer ;

	var businessownerID='58e3bbdfb803791535b613cf';
  	BusinessOwner.findById(businessownerID,function(err,businessowner){
  		if (err) res.send(err) ; 
  		else {

	businessowner.offers.push(offer);
    businessowner.save();	
   


}

		res.end('DONE');

	
  });

},

// this function for showing reviews of the logged-in businessOwner
  showReview : function(req,res){

    var businessownerID='58e3bbdfb803791535b613cf';
    Review.find({business_id:businessownerID},function(err,reviews){
      if (err) res.send(err) ; 
      else {
          reviews.forEach(function(review){
            console.log(review);
            
          });
      


}
res.end('Done');
  });
 },

//this function to reply on a specific review by the businessOwner
 reply : function(req,res){
       var reply = req.body.reply;

       var reviewID='58e3c08808c6391680f28efe';
    Review.findById(reviewID,function(err,review){
      if (err) res.send(err) ; 
      else {

    review.reply = reply;
    review.save(); 
   


}

    res.end('DONE');

  
  });


 },

    addActivity:function(req,res){

        var BusinessOwnerId=req.user.id;

        req.body.BusinessOwner_id=BusinessOwnerId;
        Activity.create(req.body,function(err,activity){

            if(err) throw err;
            BusinessOwner.findById(BusinessOwnerId,function(err,businessOwner){

                if(err) throw err;

                var typesArray=businessOwner.types;
                var index=typesArray.indexOf(activity.type);
                //if no activites with the same type added before, then add this to the types array of the businessOwner
                if(index == -1)
                {
                    businessOwner.types.push(activity.type);
                    businessOwner.save(function(err,businessOwner){
                        if(err) throw err;
                        
                    });
                }
                // should be replaced with page rendering in sprint 2
                res.end('Activity has been created successfully!');

            });
            
        });

    },

    deleteActivity: function(req,res){

        
        var BusinessOwnerId=req.user.id;
        
        Activity.findByIdAndRemove(req.params.activityId, function(err,activityDeleted){
            if(err) throw err;
            var deletedType=activityDeleted.type;
            Activity.find({BusinessOwner_id:BusinessOwnerId, type:deletedType},function(err,activityArray){

                if(err) throw err;
                //if the activity deleted was the last one of its type, then remove this type from the types array of the businessOwner
                if(activityArray.length==0)
                {
                    BusinessOwner.findById(BusinessOwnerId,function(err,businessOwner){

                        if(err) throw err;
                        var typesArray=businessOwner.types;
                        var index=typesArray.indexOf(deletedType);
                        typesArray.splice(index, 1);

                        businessOwner.types=typesArray;
                        businessOwner.save(function(err,businessOwner){
                            if(err) throw err;
                        });                     

                    });
                }
                // should be replaced with page rendering in sprint 2
                res.end('Activity has been deleted successfully');

            });
            
        });
    },


    updateInfo: function(req, res){

        req.checkBody('name', 'Name Required').notEmpty();
        req.checkBody('email', 'Not a valid email address').isEmail();
        
        var errors = req.validationErrors();


        if(!errors){

            var loginUsername = req.session.user.username;
            
            var conditions = { username: loginUsername }
            
            , update = { $set: { phoneNumber: req.body.phoneNumber,
                    email: req.body.email } };

            User.update(conditions, update, null, function (err, user){
                    
                if(err){

                    res.send(err);

                }else{

                    User.findOne(conditions, function (err, user){

                        conditions = { user_id: user._id };

                        update = { $set: { name: req.body.name,
                        description: req.body.description } };

                        BusinessOwner.update(conditions, update, null, function (err, businessOwner){

                            if(err){

                                res.send(err);

                            }else{

                                res.send('Info updated successfully');

                            }

                        });

                    });                 

                }

            });

        }else{

            res.send(errors);

        }
    },

    addLocation: function (req, res){

        var loginUsername = req.session.user.username;
        
        var conditions = { username: loginUsername };

        User.findOne(conditions, function(err, user){

            if(err){

                res.send(err);

            }else{

                conditions = {user_id: user._id};

                BusinessOwner.findOne(conditions, function(err, businessOwner){

                    if(err){

                        res.send(err);

                    }else{

                        businessOwner.locations.push(req.body.location);

                        businessOwner.save();

                        //res.redirect('/business/locations');                      

                    }

                });

            }

        });

    },

    removeLocation: function (req, res){

        var loginUsername = req.session.user.username;
        
        var conditions = { username: loginUsername };

        User.findOne(conditions, function(err, user){

            if(err){

                res.send(err);

            }else{

                conditions = {user_id: user._id};

                BusinessOwner.findOne(conditions, function(err, businessOwner){

                    if(err){

                        res.send(err);

                    }else{

                        businessOwner.locations.pull(req.body.location);

                        businessOwner.save();

                        //res.redirect('/business/locations');                      

                    }

                });

            }

        });

    },

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

                    res.send(err);

                }else{

                    bcrypt.compare(req.body.oldPassword, user.password, function(err, isMatch){

                        console.log(isMatch);
                    
                        if(err){

                            res.send(err);

                        }else{

                            if(isMatch){

                                bcrypt.genSalt(10, function(err, salt) {
                                    
                                    bcrypt.hash(req.body.password, salt, function(err, hash) {

                                        user.password = hash;
                                        
                                        user.save(function(err){        

                                            if(err){
                                                
                                                res.send(err);
                                            
                                            }else{

                                                res.send('Your password has been changed successfully!');

                                            }

                                        });             
                                    
                                    });
                                
                                });                             

                            }else{

                                res.send('wrong password');

                            }

                        }
                            
                    
                    });             

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
                    throw err;
                }
                if(user)
                {
                BusinessOwner.findOne({user_id:user.id}, function(err,businessOwner)
                    {
                        if(err)
                        {
                            throw err;
                        }
                        if(BusinessOwner)
                        {
                        bcrypt.compare(password,user.password,function(err,isMatch)
                            {
                                if(err)
                                {
                                    throw err;
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

