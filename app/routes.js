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
/*router.post('/createadmin', function(req,res)
	{
	var pass = req.body.password;
	var newAdmin= new Administrator({password:pass});
	administratorController.createAdmin(newAdmin,function(err,admin)
	{
		if(err){
			throw err;
		}
		console.log(admin);
	});

	});
*/

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
   	return;
   }
   administratorController.comparePassword(username,password, "123456", function(err, isAdmin){
   		if(err) throw err;
   		if(isAdmin){
   			administratorController.getAdmin(password,function(err,admin)
   			{
   				if(err)
   				{
   					throw err;
   				}
   				console.log("AYwa ya wade3");
   				//return done(null, admin);
   			});
   			return;
   		}
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
   			return;
   		}
   		//To be removed after the front-end
   		console.log("No Valid Data");
   		return;
   		//return done(null, false, {message: 'Invalid username or password'});
   	});
   		
   	});
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

router.post('/login',
  passport.authenticate('login', {failureRedirect:'/login',failureFlash: true}),
  function(req, res) {
  	req.flash('success_msg', 'You are logged in correctly :)');
  	return;
    //res.redirect('/profile');
  });

//export router
module.exports = router;