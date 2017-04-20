//Dependencies
var express = require('express');
var router = express.Router();
var reviewController=require('./controllers/reviewController');
var activityController=require('./controllers/activityController');
var administratorController = require('./controllers/administratorController');
var applicationController = require('./controllers/applicationController');
var businessOwnerController = require('./controllers/businessownerController');
var User = require('./models/User');
var passport=require('passport');
var clientController = require('./controllers/clientController');
var userController = require('./controllers/userController');
var authController = require('./controllers/AuthenticationController');
var jwt = require('jsonwebtoken');
var secret = 'DerAlgorithmus'

var jwt = require('jsonwebtoken');
var secret = 'Der-Algorithmus-Team';
var multer = require('multer')

require('./config/passport')(passport);

//multer stuff, to upload a file
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/gallery/');
  },
  filename: function (req, file, cb) {
    if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
      var err = new Error();
      err.code = 'notAnImage';
      return cb(err);
    } else {
      cb(null, Date.now()+'_'+file.originalname);
    }
  }
});

var upload = multer({ 
  storage: storage
}).single('myfile');

//uploading files route
router.post('/upload', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      if(err.code=='notAnImage'){
        res.json({success:false, message: 'File should be an image of one of these extension (png, jpeg, jpg)!'});
        return;
      }
      res.json({success:false, message: 'File Upload Error!'});
    }
    else{
      if(!req.file){
        res.json({success:false, message: 'No file was selected!'});
      }
      else{
        res.json({success:true, message: 'File was uploaded successfully.', path: req.file.path, name: req.file.filename});
      }

    }

  });
});

//here we have username and password as an input parameters
//we search if a client exists with in the Client table so we authenticate the client
//If we couldn't find a client with matching username and password, so we search if
//the data passed from the front-end is matching admin credentials, thus, the
//authentication would be done for admins.
//If the data didn't match also the admin credentials, so we search in the BusinessOwner
//table, if we found a matched tuple then the authentication would be done for 
//BusinessOwner, if not found then the data entered doesn't exist in my system
//an error message is displayed accordingly.
router.post('/login', function(req, res) {
  //These extra checks to maintain the code secure 
  req.checkBody('username',' Username Required').notEmpty();
  req.checkBody('password',' Password Required').notEmpty();
  var errors=req.validationErrors();
  if(errors)
  {
    return res.json({success:false, message: 'Username and Password are required'});
  }
  var username = req.body.username;
  var password = req.body.password;
  clientController.getClient(username,password, function(err, client){
  if(err) {
    return res.json({ success: false, message: 'Authentication failed.' });
  }
  if(client){
    var token = jwt.sign({user:client,type:1}, secret, {
        expiresIn: '24h' 
        });
    return res.json({ success: true,id:client._id ,username:username ,type: 1 ,token: 'JWT ' + token });
 }
 else{
 administratorController.comparePassword(password,function(err, isAdmin){
    if(err){
      return res.json({ success: false, message: 'Authentication failed.' });
    } 
    if(isAdmin && username=="admin"){
      administratorController.getAdmin(function(err,admin)
      {
        if(err)
        {
          return res.json({ success: false, message: 'Authentication failed.' });
        }
        var token = jwt.sign({user:admin[0],type:0}, secret, {
        expiresIn: '24h' 
        });
        return res.json({ success: true,id:admin[0]._id , username:username ,type: 0 ,token: 'JWT ' + token });
      });
    }
  else{
  businessOwnerController.getOwner(username,password,function(err,businessOwner)
  {
    if(err)
    {
      return res.json({ success: false, message: 'Authentication failed.' });
    }
    if(businessOwner)
    {
      var token = jwt.sign({user:businessOwner,type:2}, secret, {
        expiresIn: '24h' 
        });
      return res.json({ success: true,id:businessOwner._id ,username:username , type:2 ,token: 'JWT ' + token });
    }
    else{
      return res.json({ success: false, message: 'Authentication failed. Invalid username or password' });
    }

  });
  }
  });
}
 });
    
  });//done--

//Routes

//routing for creating a new Cient
router.post('/register',userController.createUser); //done --

//routing for viewing the summary of venues of the Business owners
router.get('/view-summary',clientController.viewSummaries);//done --

//routing for updating client accont information(firstname,lastname,gender,email,phonenumber)
router.post('/update-Info',clientController.updateInfo);//done --

//routing for viewing detailed venue page for a specific Business Owner
router.get('/businessOwner/:id', clientController.viewBusiness);//done --

//routing for changing the username of the User
router.post('/change-username',userController.changeUsername);//done --

//
router.get('/application/:username/reject',applicationController.reject);//done --
router.get('/application/:username/accept',applicationController.accept);//done --
router.post('/user/forgotPassword',userController.forgotPassword);//done --

//routing for viewing applications
router.get('/applications/:page', administratorController.viewApplicationsIndex);//done --
router.get('/applications', administratorController.viewApplications);//done --

//routing for creating application
router.post('/business/apply', applicationController.createApplication);//done --

//routing for updating basic info
router.post('/business/update-info', businessOwnerController.updateInfo);//done

//routing for locations operations
router.post('/business/locations/add', businessOwnerController.addLocation);//done --
router.post('/business/locations/remove', businessOwnerController.removeLocation);//done --

//routing for security
router.post('/security/change-password', businessOwnerController.changePassword);//done --

router.get('/logout',passport.authenticate('generalLogin', { session: false }),authController.generalLogOut);

router.get('/search/:keyword',userController.search);//done--

router.post('/gallery', businessOwnerController.addMedia);//done--
router.post('/offer', businessOwnerController.addOffer);//done--
router.get('/showReview/:businessownerID', businessOwnerController.showReview);//done--
router.post('/reply/:reviewID', businessOwnerController.reply);//done--

router.get('/review/getReview/:id', reviewController.getReview);//done--
router.post('/review/newReview', reviewController.newReview);//done--
router.post('/review/editReview/:id', reviewController.editReview);//done--
router.post('/review/deleteReview/:id', reviewController.deleteReview);//done--
router.get('/client/review/view/:businessownerID', reviewController.clientViewReviews ); //////////////added NEW///////
router.get('/review/view/:businessownerID', reviewController.viewBusinessReviews );//done--
router.post('/client/rate/:businessownerID', clientController.rateBusiness );//Changed from /business/rate////

router.get('/activity/getActivity/:id', activityController.getActivity);
router.post('/activity/editActivityImage/:id', activityController.editActivityImage);
router.post('/activity/addRepeatableActivitySlot/:id', activityController.addRepeatableActivitySlot);
router.post('/activity/addRepeatableActivityPricePackage/:id', activityController.addRepeatableActivityPricePackage);
router.post('/activity/deleteRepeatableActivitySlot', activityController.deleteRepeatableActivitySlot);
router.post('/activity/deleteRepeatableActivityPricePackage', activityController.deleteRepeatableActivityPricePackage);
router.post('/activity/editActivity/:id', activityController.editActivity);//done--
router.post('/activity/changeActivityImage', activityController.editActivityImage);

router.post('/addActivity/:BusinessOwnerId',multer({ dest: './public/gallery'}).single('image'),businessOwnerController.addActivity);//done --
router.get('/deleteActivity/:activityId/:BusinessOwnerId',businessOwnerController.deleteActivity);//done--

router.get('/viewBusinesses',administratorController.viewBusinesses);//done--
router.get('/removeBusiness/:businessId',administratorController.removeBusiness);//done--

router.post('/createAdmin',administratorController.createAdmin);//done--


//export router
module.exports = router;


