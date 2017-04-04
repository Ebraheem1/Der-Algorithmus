let Review = require('../models/Review');
var User = require('../models/User');
let Client = require('../models/Client');
var ObjectId = require('mongodb').ObjectID;
var BusinessOwner = require('../models/BusinessOwner');

      
let reviewController={

	// http://localhost:8080/review/newReview
	newReview:function(req,res){
		var review = new Review();
		review.user_id = req.body.user_id;
		review.business_id = req.body.business_id;
		review.comment = req.body.comment;
		var missingFields = req.body.user_id==null || req.body.user_id=='' || req.body.business_id==null || req.body.business_id=='' || 
		                    req.body.comment==null || req.body.comment=='';

		if(missingFields){
			res.send('The fields: (user_id, business_id, comment) are required!');
		}
		else{
			review.save(function(err){
				if(err){
					res.send(err);
				}
				else{
					res.send('Review has been posted successfully.');
				}
			});

		}
	},

	// http://localhost:8080/review/editReview/#
	//by using angular's ng-show, it will be guaranteed that each user can only update his own reviews
	editReview: function(req,res){
		var review_user_id = req.body.user_id;
		var review_newComment = req.body.comment;
		var review_id =  req.params.id;
		var missingFields = review_user_id==null || review_user_id=='' || review_newComment==null || review_newComment=='';
		if(missingFields){
			res.send('The fields: (user_id, comment) are required!');
		}
		else{
			Review.findOne({_id:review_id}, function(err, review) {
		        if(err){
		            res.send(err);
		        }
		        else{
			        if(!review){
		                res.send('Review with this id does not exist!');
		            }
		            else{
			            if(review.user_id!=review_user_id){
			            	res.send('You can only edit your own review!');
			            }
				        else{
				        	review.comment = review_newComment;
				            review.save(function(err) {
				                if(err){
				                    res.send(err);
				                } 
				                else {
				                    res.send('Review has been updated successfully.');
				                }
				            });

				        }
		            }
		        }
	        });
		}
	},

	// http://localhost:8080/review/deleteReview/#
	//by using angular's ng-show, it will be guaranteed that each user can only delete his own reviews
	deleteReview: function(req,res){
		var review_user_id = req.body.user_id;
        var review_id =  req.params.id;
        var missingFields = review_user_id==null || review_user_id=='';
		if(missingFields){
			res.send('The field: (user_id) is required!');
		}
		else{
			Review.findOne({_id:review_id}, function(err, review){
	            if(err){
	                res.send(err);
	            }
	            else{
		            if(!review){
		                res.send('Review with this id does not exist!');
		            }
		            else{
			            if(review.user_id!=review_user_id){
			            	res.send('You can only delete your own review!');
			            }
			            else{
			            	Review.findOneAndRemove({ _id:review_id }, function(err, reviewToBeDeleted) {
		                        if(err){
		                        	res.send(err);
		                        }
		                        else{
		                        	res.send('Review has been deleted successfully.'); 
		                        }
	                    	});
			                
			            }
		            }
	            }
       		});
		}
	}, 
    
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


