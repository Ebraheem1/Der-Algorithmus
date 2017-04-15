//Dependencies
var express = require('express');
var router = express.Router();
var reviewController=require('./controllers/reviewController');
var activityController=require('./controllers/activityController');
var administratorController = require('./controllers/administratorController');
var applicationController = require('./controllers/applicationController');
var businessOwnerController = require('./controllers/businessownerController');
var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
var clientController = require('./controllers/clientController');
var userController = require('./controllers/userController');
var authController = require('./controllers/AuthenticationController');
var multer = require('multer')


//Passport authentication
passport.use('login', new LocalStrategy(
  //here we have username and password as an input parameters
  //we search if a client exists with in the Client table so we authenticate the client
  //If we couldn't find a client with matching username and password, so we search if
  //the data passed from the front-end is matching admin credentials, thus, the
  //authentication would be done for admins.
  //If the data didn't match also the admin credentials, so we search in the BusinessOwner
  //table, if we found a matched tuple then the authentication would be done for 
  //BusinessOwner, if not found then the data entered doesn't exist in my system
  //an error message is displayed accordingly.
  function(username, password, done) {
    
   clientController.getClient(username,password, function(err, client){
    if(err) {
      return done(null, false, {message: 'Error Happened'});
    }
    if(client){
      return done(null, client);
   }
   else{
   administratorController.comparePassword(password,function(err, isAdmin){
      if(err){
        return done(null, false, {message: 'Error Happened'});
      } 
      if(isAdmin && username=="admin"){
        administratorController.getAdmin(function(err,admin)
        {
          if(err)
          {
            return done(null, false, {message: 'Error Happened'});
          }
          return done(null, admin[0]);
        });
      }
    else{
    businessOwnerController.getOwner(username,password,function(err,businessOwner)
    {
      if(err)
      {
        return done(null, false, {message: 'Error Happened'});
      }
      if(businessOwner)
      {
        return done(null, businessOwner);
      }
      else{
        return done(null, false, {message: 'Invalid username or password'});
      }

    });
    }
    });
  }
   });
  }));

passport.serializeUser(function(user, done) {
  done(null,user);
});

passport.deserializeUser(function(obj, done) {
  done(null,obj);
});
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

router.get('/logout',authController.ensureAuthenticated, authController.generalLogOut);

router.get('/search/:keyword',userController.search);//done--

router.post('/gallery', businessOwnerController.addMedia);//done--
router.post('/offer', businessOwnerController.addOffer);//done--
router.get('/showReview/:businessownerID', businessOwnerController.showReview);//done--
router.post('/reply/:reviewID', businessOwnerController.reply);//done--

router.post('/review/newReview', reviewController.newReview);//done--
router.put('/review/editReview/:id', reviewController.editReview);//done--
router.delete('/review/deleteReview/:id', reviewController.deleteReview);//done--

router.get('/review/view/:businessownerID', reviewController.viewBusinessReviews );//done--
router.post('/business/rate', clientController.rateBusiness );//done--

router.put('/activity/editActivity/:id', activityController.editActivity);//done--

router.post('/addActivity/:BusinessOwnerId',multer({ dest: './public/gallery'}).single('image'),businessOwnerController.addActivity);//done --
router.get('/deleteActivity/:activityId/:BusinessOwnerId',businessOwnerController.deleteActivity);//done--

router.get('/viewBusinesses',administratorController.viewBusinesses);//done--
router.get('/removeBusiness/:businessId',administratorController.removeBusiness);//done--

router.post('/createAdmin',administratorController.createAdmin);//done--

router.post('/login',
  passport.authenticate('login', {failureFlash: true}),
  function(req, res) {
    req.flash('success_msg', 'You are logged in correctly :)');
    res.send("Logged In successfully");
    return;
  });//done--


//export router
module.exports = router;


