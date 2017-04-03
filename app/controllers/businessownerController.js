let BusinessOwner = require('../models/BusinessOwner');
var bcrypt = require('bcryptjs');
var path = require('path');
var multer = require('multer');
var ownerUploadsPath = path.resolve(__dirname,"images");
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/images');
  },
  filename: function (req, file, callback) {
  	if(file.originalname != null || file.originalname !=''){
  	//console.log(file.originalname);
  	var filename = file.originalname;
  	var arr = filename.split(".");
  	var filetype = arr[arr.length-1];
  	//should be replaced when session is used
  	var businessownerID='58e0d7b68515e50fe8daad9f';
  	BusinessOwner.findById(businessownerID,function(err,businessowner){
  		if (err) throw err ;
  		else {

        var newfilename = businessowner.name + '-' + Date.now()+'.'+filetype;
        callback(null, newfilename);
        if (businessowner.pictures[0]=='')
        {
        	businessowner.pictures=[newfilename];
        	businessowner.save();
        }
        else 
        {
    	businessowner.pictures.push(newfilename);
    	businessowner.save();
        }
    
  		}

  	});
  /*	var newfilename = req.user.name + '-' + Date.now()+'.'+filetype;
    callback(null, newfilename);
        if (req.user.pictures[0]=='')
        {
        	req.user.pictures=[newfilename];
        	req.user.save();
        }
        else 
        {
    	req.user.pictures.push(newfilename);
    	req.user.save();
        }
    	req.flash('success_msg','A picture uploaded successfully');
*/
   
  }
}
});

  var upload = multer({ storage: storage}).single('fileToUpload');


let businessownerController={
	addPicture:function(req,res){
	upload(req,res,function(err){
		if(err){
			throw err ; 
		}
	});
 }, 

   createBusiness : function(req,res){

   	BusinessOwner.create(req.body,function(err,businessowner){

   		if(err) throw err;

   		res.end('businessowner created successfully');
   	});



/*	var newUser = new BusinessOwner({
			user_id:'58e0261992c309223c4404e2',
			name: req.body.name,
			description:req.body.description,


		});

		BusinessOwner.createBusinessOwner(newUser, function(err, user){
			if(err){
			if(err.name == 'MongoError'){ 	
				req.flash('error_msg', 'username already exists');
			}}
			else{
			console.log(user);
				req.flash('success_msg', 'You are registered successfully');
		}
		});

	*/	
},


   addOffer : function(req,res){
	var offer = req.body.offer ;

	var businessownerID='58e0d7b68515e50fe8daad9f';
  	BusinessOwner.findById(businessownerID,function(err,businessowner){
  		if (err) throw err ;
  		else {

	businessowner.offers.push(offer);
    businessowner.save();	
   


}

		res.end('DONE');

	
  });

}
}
//Write here the functions in the format of function_name:function(params)


module.exports = businessownerController;


