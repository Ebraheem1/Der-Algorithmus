let Review = require('../models/Review');

//try

let reviewController={
//Write here the functions in the format of function_name:function(params)
  
          viewBusinessReviews: function(req, res){

        var currentBusiness = req.session.currentBusiness;

        var conditions = { business_id: currentBusiness };

        var reviews = Review.find(conditions, function(err, reviews){

			if(err){

				res.send(err);

                console.log(err);

			}else{

                console.log(reviews);

                return reviews;

            }

		});


    }
};

module.exports = reviewController;
