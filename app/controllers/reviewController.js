let Review = require('../models/Review');
var User = require('../models/User');
let Client = require('../models/Client');
var ObjectId = require('mongodb').ObjectID;
var BusinessOwner = require('../models/BusinessOwner');

      
let reviewController={


	getReview: function(req,res){
		var review_id =  req.params.id;
		Review.findOne({_id:review_id}, function(err, review) {
	        if(err){
	        	res.json({success: false, message:err});
	        }
	        else{
		        if(!review){
		        	res.json({success: false, message:'Review with this id does not exist!'});
	            }
	            else{
	            	res.send({success: true, message:'Review has been retrieved successfully.', review: review});
			    }
	        }
        });
	},

	
	//clients write review about business
	//this function receives requests for creating new reviews, and makes an entry to the database
	//the function ensures that the request includes the required fields (user_id, business_id, comment)
	newReview:function(req,res){

		var review = new Review();
		review.user_id = req.body.user_id;
		review.business_id = '58f13a6ef286e74e0ecdadcc';
		review.comment = req.body.comment;
		var missingFields = req.body.user_id==null || req.body.user_id=='' || req.body.comment==null || req.body.comment=='';

		if(missingFields){
			//The fields: (user_id, business_id, comment) are required!
			res.json({success: false, message: 'Your review is empty!'})
		}
		else{
			review.save(function(err){
				if(err){
					res.json({success: false, message: err})
				}
				else{
					res.json({success: true, message: 'Review has been posted successfully.'})
				}
			});

		}
	},

	//by using angular's ng-show, it will be guaranteed that each user can only update his own reviews
	//this function receives requests for editing reviews, an review has multiple attributes;
	//the function ensures that the request includes the required fields (user_id, business_id, comment)
	//by using angular's ng-show, it will be guaranteed that each user can only update his own reviews
	editReview: function(req,res){
		var review_user_id = req.body.user_id;
		var review_newComment = req.body.comment;
		var review_id =  req.params.id;
		var missingFields = review_user_id==null || review_user_id=='' || review_newComment==null || review_newComment=='';
		if(missingFields){
			//'The fields: (user_id, comment) are required!'
			res.json({success: false, message: 'Your review is empty!'});
		}
		else{
			Review.findOne({_id:review_id}, function(err, review) {
		        if(err){
		        	res.json({success: false, message: err});
		        }
		        else{
			        if(!review){
			        	res.json({success: false, message: 'Review with this id does not exist!'});
		            }
		            else{
			            if(review.user_id!=review_user_id){
			            	res.json({success: false, message: 'You can only edit your own review!'});
			            }
				        else{
				        	review.comment = review_newComment;
				            review.save(function(err) {
				                if(err){
				                    res.send(err);
				                } 
				                else {
				                	res.json({success: true, message: 'Review has been updated successfully.'});
				                }
				            });

				        }
		            }
		        }
	        });
		}
	},

	//by using angular's ng-show, it will be guaranteed that each user can only delete his own reviews
	//this function receives requests for deleting reviews
	//the function ensures that the request includes the required field (user_id)
	//by using angular's ng-show, it will be guaranteed that each user can only delete his own reviews
	deleteReview: function(req,res){
		console.log(req.body.user_id+' | '+req.params.id);
		var review_user_id = req.body.user_id;
        var review_id =  req.params.id;
        var missingFields = review_user_id==null || review_user_id=='';
		if(missingFields){
			//The field: (user_id) is required!
			res.json({success: false, message: 'Contact Development Team!'});
		}
		else{
			Review.findOne({_id:review_id}, function(err, review){
	            if(err){
	            	res.json({success: false, message: err});
	            }
	            else{
		            if(!review){
		            	res.json({success: false, message: 'Review with this id does not exist!'});
		            }
		            else{
			            if(review.user_id!=review_user_id){
			            	res.json({success: false, message: 'You can only delete your own review!'});
			            }
			            else{
			            	Review.findOneAndRemove({ _id:review_id }, function(err, reviewToBeDeleted) {
		                        if(err){
		                        	res.json({success: false, message: err});
		                        }
		                        else{
		                        	res.json({success: true, message: 'Review has been deleted successfully.'});
		                        }
	                    	});
			                
			            }
		            }
	            }
       		});
		}
	}, 
    
  viewBusinessReviews: function (req, res) {

  
    var BusID = req.params.businessownerID;

    var conditions = {
        "business_id": BusID
    };

    var reviews = Review.find(conditions, function (err, reviews) {

        if (err) {

            res.send(err);

           

        } else {

            res.send(reviews);

        }

    });
  },

  clientViewReviews: function (req, res) {


  	var BusID = req.params.businessownerID;

  	var conditions = {
  		"business_id": BusID
  	};

  	var reviews = Review.find(conditions, function (err, rev) {
  		if (err) {

  			res.json({
  				success: false,
  				message: err
  			});

  		} else {
			
  			res.json({
  				success: true,
  				message: 'Reviews has been retrieved successfully.',
  				reviews: rev
  			});

  		}
		  
  	});

  }

};

module.exports = reviewController;


