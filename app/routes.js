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
   administratorController.comparePassword(username,password,function(err, isAdmin){
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

    businessownerController.getOwner(username,password,function(err,businessOwner)
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

router.post('/application/:username/reject',applicationController.reject);
router.post('/application/:username/accept',applicationController.accept);
router.post('/user/forgotPassword',userController.forgotPassword);

//routing for viewing applications
router.get('/applications/:page', administratorController.viewApplicationsIndex);
router.get('/applications', administratorController.viewApplications);

//routing for creating application
router.post('/business/apply', applicationControllear.createApplication);

//routing for updating basic info
router.post('/business/update-info', businessOwnerController.updateInfo);

//routing for locations operations
router.post('/business/locations/add', businessOwnerController.addLocation);

//routing for security
router.post('/security/change-password', businessOwnerController.changePassword);

router.get('/logout',authController.ensureAuthenticated, authController.generalLogOut);

router.get('/search/:keyword',userController.search);

router.post('/review/newReview', reviewController.newReview);
router.put('/review/editReview/:id', reviewController.editReview);
router.delete('/review/deleteReview/:id', reviewController.deleteReview);

router.get('/review/view', reviewController.viewBusinessReviews );
router.get('/business/rate', clientController.rateBusiness );

router.post('/activity/newActivity', activityController.newActivity);
router.put('/activity/editActivity/:id', activityController.editActivity);

router.post('/addActivity',businessOwnerController.addActivity);
router.get('/deleteActivity/:activityId',businessOwnerController.deleteActivity);

router.get('/viewBusinesses',administratorController.viewBusinesses);
router.get('/removeBusiness/:businessId',administratorController.removeBusiness);

router.post('/login',
  passport.authenticate('login', {failureRedirect:'/login',failureFlash: true}),
  function(req, res) {
    req.flash('success_msg', 'You are logged in correctly :)');
    return;
    //res.redirect('/profile');
  });

//export router
module.exports = router;
