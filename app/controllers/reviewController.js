let Review = require('../models/Review');
      
let reviewController={

	//http://localhost:8080/review/newReview
	//this function receives requests for creating new reviews, and makes an entry to the database
	//the function ensures that the request includes the required fields (user_id, business_id, comment)
	newReview:function(req,res){
		var review = new Review();
		//in the next sprint, this should be replaced by the authenticated user_id
		//it will be included in the request body for sprint 1
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

	//http://localhost:8080/review/editReview/#
	//this function receives requests for editing reviews, an review has multiple attributes;
	//the function ensures that the request includes the required fields (user_id, business_id, comment)
	//by using angular's ng-show, it will be guaranteed that each user can only update his own reviews
	editReview: function(req,res){
		//in the next sprint, this should be replaced by the authenticated user_id
		//it will be included in the request body for sprint 1
		var review_user_id = req.body.user_id;
		var review_newComment = req.body.comment;
		//this is the id of the review instance given by MongoDB
		//once the user clicks on the option to edit a review, the review's mongoDB _id will be included in the route
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
			        	//corner-case: using an invalid id in the route
		                res.send('Review with this id does not exist!');
		            }
		            else{
		            	//corner-case: a user trying to edit another user's review
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
	//this function receives requests for deleting reviews
	//the function ensures that the request includes the required field (user_id)
	//by using angular's ng-show, it will be guaranteed that each user can only delete his own reviews
	deleteReview: function(req,res){
		//in the next sprint, this should be replaced by the authenticated user_id
		//it will be included in the request body for sprint 1
		var review_user_id = req.body.user_id;
		//this is the id of the review instance given by MongoDB
		//once the user clicks on the option to edit a review, the review's mongoDB _id will be included in the route
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
		            	//corner-case: using an invalid id in the route
		                res.send('Review with this id does not exist!');
		            }
		            else{
			            if(review.user_id!=review_user_id){
			            	//corner-case: a user trying to delete another user's review
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
	}


};

module.exports = reviewController;


