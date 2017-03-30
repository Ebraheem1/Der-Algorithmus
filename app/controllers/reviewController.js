var Review = require('../models/Review');
      

module.exports = function(reviewRouter){


	// http://localhost:8080/review/newReview
	reviewRouter.post('/newReview', function(req, res){
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
	});


	// http://localhost:8080/review/editReview/#
	//by using angular's ng-show, it will be guaranteed that each user can only update his own reviews
	reviewRouter.put('/editReview/:id', function(req, res){
		var review_user_id = req.body.user_id;
		var review_newComment = req.body.comment;
		var review_id =  req.params.id;
		var missingFields = review_user_id==null || review_user_id=='' || review_newComment==null || review_newComment=='';
		if(missingFields){
			res.send('The fields: (user_id, comment) are required!');
		}
		else{
			Review.findOne({_id:review_id}, function(err, review) {
		        if (err) {
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
				                if (err) {
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
	});


	// http://localhost:8080/review/deleteReview/#
	//by using angular's ng-show, it will be guaranteed that each user can only delete his own reviews
	reviewRouter.delete('/deleteReview/:id', function(req, res){
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
	                        if (err) 
	                        	res.send(err);
	                        else{
	                        	res.send('Review has been deleted successfully.'); 
	                        }
	                    	});
			                
			            }
		            }
	            }
       		});
		}
	});


	return reviewRouter;
}


