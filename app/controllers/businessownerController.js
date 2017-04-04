let BusinessOwner = require('../models/BusinessOwner');
var Review = require('../models/Review');
var bcrypt = require('bcryptjs');
var path = require('path');
var multer = require('multer');
var ownerUploadsPath = path.resolve(__dirname,"gallery");
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

  var upload = multer({ storage: storage}).single('fileToUpload');


let businessownerController={

  // this function for uploading pictures and videos to the gallery of the businessOwner
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


 }


}

module.exports = businessownerController;


