var BusinessOwner = require('../models/BusinessOwner');
var Client= require('../models/Client');


let AuthenticationController = {
  
  generalLogOut: function(req,res)
  {
      if(!req.user)
      {
        return res.json({success:false, message:'You are not authroized to logout'});
      }
      req.logout();
      return res.json({success:true, message:'You are logged Out Correctly'});
  }



};

module.exports = AuthenticationController;
