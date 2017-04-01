var express = require('express');
var router = express.Router();
var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
var Administrator = require('./models/Administrator');
var clientController = require('./controllers/clientController');
var administratorController = require('./controllers/administratorController');
var businessownerController = require('./controllers/businessownerController');
var userController = require('./controllers/userController');

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

router.get('/logout',ensureAuthenticated, function(req, res){
  
  req.logout();

  req.flash('success_msg', 'You are logged out');

  res.redirect('/');
});

router.get('/search/:keyword',userController.search);
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
   	businessownerController.getOwnerByUsername(username,function(err,owner)
   	{
   		if(err)
   		{
   			throw err;
   		}
   		if(owner)
   		{
   			businessownerController.comparePassword(password,owner.password,function(err,isMatch)
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
//For general authentication purpose
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    //req.flash('error_msg','You are not logged in');
    return;
    //res.redirect('/login');
  }
}
//For only client authentication
function ensureClientAuthenticated(req, res, next){
  if(! req.user){
    //req.flash('error_msg','You are not logged in');
    return;
    //res.redirect('/login');
  } else {
    clientController.getClientByUsername(req.user.username,function(err,user)
    {
      if(err)
      {
        throw err;
      }
      if(! user)
      {
        //req.flash('error_msg','You are not logged in');
        return;
        //res.redirect('/login');
      }else{
        return next();
      }

    });
  }
}
//for only businessOWner Authentication
function ensureBusinessAuthenticated(req, res, next){
  if(! req.user){
    //req.flash('error_msg','You are not logged in');
    return;
    //res.redirect('/login');
  } else {
    businessownerController.getOwnerByUsername(req.user.username,function(err,user)
    {
      if(err)
      {
        throw err;
      }
      if(! user)
      {
        //req.flash('error_msg','You are not logged in');
        return;
        //res.redirect('/login');
      }
      else{
        return next();
      }

    });
  }
}


router.post('/login',
  passport.authenticate('login', {failureRedirect:'/login',failureFlash: true}),
  function(req, res) {
  	req.flash('success_msg', 'You are logged in correctly :)');
  	return;
    //res.redirect('/profile');
  });

//export router
module.exports = router;