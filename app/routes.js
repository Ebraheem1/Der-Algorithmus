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
var Administrator = require('./models/Administrator');
var clientController = require('./controllers/clientController');
var userController = require('./controllers/userController');
var authController = require('./controllers/AuthenticationController');


//It's only a tester
router.post('/createadmin', function(req,res)
	{
	var pass = "123456";
	var newAdmin= new Administrator({password:pass});
	administratorController.createAdmin(newAdmin,function(err,admin)
	{
		if(err){
			throw err;
		}
		console.log(admin);
	});

	});


//Logins
passport.use('login', new LocalStrategy(
  function(username, password, done) {
   clientController.getClientByUsername(username, function(err, user){
    if(err) {
      throw err;
    }
    if(user){
    clientController.comparePassword(password, user.password, function(err, isMatch){
      if(err) throw err;
      if(isMatch){
        return done(null, user);
      }
    });
   }
   else{
   administratorController.comparePassword(username,password,function(err, isAdmin){
      if(err) throw err;
      if(isAdmin && username=="admin"){
        administratorController.getAdmin(function(err,admin)
        {
          if(err)
          {
            throw err;
          }
          console.log("I have found the admin");
              console.log(admin[0]);
          return done(null, admin[0]);
        });
      }
    else{
    businessOwnerController.getOwnerByUsername(username,function(err,owner)
    {
      if(err)
      {
        throw err;
      }
      if(owner)
      {
        businessOwnerController.comparePassword(password,owner.password,function(err,isMatch)
        {
          if(err) throw err;
          if(isMatch){
          return done(null, owner);
          }
        });
      }
      else{
        //To be removed after the front-end
        console.log("No Valid Data");
        return;
        //return done(null, false, {message: 'Invalid username or password'});
      }

    });
    }
    });
  }
   });
  }));

passport.serializeUser(function(user, done) {
  //done(null, user.id);
  done(null,user);
});

passport.deserializeUser(function(obj, done) {
  /*clientController.getClientById(id, function(err, user) {
    done(err, user);
  });*/
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



