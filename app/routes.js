var express = require('express');
var router = express.Router();
var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
var clientController = require('./controllers/clientController');
var administratorController = require('./controllers/administratorController');
var businessownerController = require('./controllers/businessownerController');
var userController = require('./controllers/userController');
var authController = require('./controllers/AuthenticationController');
var x = require('./controllers/untitleds');





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


router.get('/logout',authController.ensureAuthenticated, authController.generalLogOut);

router.get('/search/:keyword',userController.search);

router.post('/login',
  passport.authenticate('login', {failureRedirect:'/login',failureFlash: true}),
  function(req, res) {
    req.flash('success_msg', 'You are logged in correctly :)');
    return;
    //res.redirect('/profile');
  });

//export router
module.exports = router;
