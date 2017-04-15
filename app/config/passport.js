var Client = require('../models/Client');
var BusinessOwner=require('../models/BusinessOwner');
var User = require('../models/User');
var Administrator = require('../models/Administrator');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;


module.exports = function(passport) {
	var secret = 'Der-Algorithmus-Team';
	var opts = {};
	opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
	opts.secretOrKey = secret;

	//Passport authentication
passport.use('clientLogin', new JwtStrategy(opts,function(jwt_payload,done)
  {
    if(jwt_payload.type == 1)
    {

      Client.findOne({id: jwt_payload.user.id},function(err,client)
      {
        if(err)
        {
          return done(err,false);
        }
        if(client)
        {
          return done(null,client);
        }else{
          return done(null,false);
        }
      });
    }else{
      return done(null,false);
    }
  }));

passport.use('businessLogin', new JwtStrategy(opts,function(jwt_payload,done)
  {
    if(jwt_payload.type == 2)
    {

      BusinessOwner.findOne({id: jwt_payload.user.id},function(err,businessOwner)
      {
        if(err)
        {
          return done(err,false);
        }
        if(businessOwner)
        {
          return done(null,businessOwner);
        }else{
          return done(null,false);
        }
      });
    }else{
      return done(null,false);
    }
  }));

passport.use('adminLogin', new JwtStrategy(opts,function(jwt_payload,done)
  {
    if(jwt_payload.type == 0)
    {

      Administrator.findOne({id: jwt_payload.user.id},function(err,admin)
      {
        if(err)
        {
          return done(err,false);
        }
        if(admin)
        {
          return done(null,admin);
        }else{
          return done(null,false);
        }
      });
    }else{
      return done(null,false);
    }
  }));

passport.use('generalLogin', new JwtStrategy(opts,function(jwt_payload,done)
  {
    
      User.findOne({user_id: jwt_payload.user.user_id},function(err,admin)
      {
        if(err)
        {
          return done(err,false);
        }
        if(admin)
        {
          return done(null,admin);
        }else{

          Administrator.findOne({id: jwt_payload.user.id},function(err,admin)
          {
            if(err)
            {
              return done(err,false);
            }
            if(admin)
            {
              return done(null,admin);
            }else{
              return done(null,false);
            }
          });
        }
      });
    
  }));

};