let Review = require('../models/Review');
var BusinessOwner = require('../models/BusinessOwner')

let reviewController={
	 createReview : function(req,res){

   	Review.create(req.body,function(err,review){

   		if(err) throw err;
     
   		res.end('review created successfully');
   	});
//Write here the functions in the format of function_name:function(params)
}
}


module.exports = reviewController;