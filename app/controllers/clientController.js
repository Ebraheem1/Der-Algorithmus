let Client = require('../models/Client');
let User = require('../models/User');
let BusinessOwner = require('../models/BusinessOwner');
var bcrypt = require('bcryptjs');

let clientController= {


view_summary:function(req,res){
  BusinessOwner.find(function(err,BusinessOwner)
{
  if(err)
  res.send('There exist no Venues');
  else {
    res.send(BusinessOwner);
  }
});
},



get_update_Info:function(req,res){
  res.send('update_Info');
},



update_Info:function(req,res){
    var iD;
    User.findOne({username:req.user.username},function(err,user)
  {
    if(err) throw err;
    else {
          iD=user._id;
      }
  });

  if(req.body.phoneNumber!=null | req.body.phoneNumber!="")
  {
      User.updateOne({username:req.user.username},{$set:{phoneNumber:req.body.phoneNumber}});
      res.send('Account Updated Succesfully');
  }
  if(req.body.email!=null | req.body.email!="")
  {
    User.updateOne({username:req.user.username},{$set:{email:req.body.email}});

    res.send('Account Updated Succesfully');
  }
  if(req.body.newpassword!=null | req.body.newpassword!="")
  {
    req.checkBody('newpassword', 'Password at least 8 characters and at most 20').len(8, 15);
    req.checkBody('newpassword', 'must contain a digit and a special character').matches(/^(?=(.*\d){1})(?=.*[a-zA-Z])(?=.*[!@#$%])[0-9a-zA-Z!@#$%]{8,20}$/, "i");
    var errors=req.validationErrors();
    if(errors)
    {
      res.send(errors);
    }
    else {
          var flag=userG.comparePassword(req.body.oldPassword);
          if(flag){
              bcrypt.hash(req.body.newpassword,null,null,function(err,hash){
                if(err)
                  return next(err);
                  User.updateOne({username:req.user.username},{$set:{password:hash}});
                res.send('Account Updated Succesfully');

            });
          }
          else {
            res.send('Incorrect oldPassword');
          }
    }
  }
  if(req.body.username!=null | req.body.username!="")
  {
      User.findOne({username:req.body.username},function(err,user)
    {
      if(err)//this means that there is no other user with this username
      {
        User.updateOne({username:req.user.username},{$set:{username:req.body.username}});
        res.send('Account Updated Succesfully');

      }
      else {
        res.send('This Username unavailable');
      }
    });
  }
  if(req.body.firstName!=null | req.body.firstName!="")
  {
    User.updateOne({user_id:iD},{$set:{firstName:req.body.firstName}});
    res.send('Account Updated Succesfully');

  }
  if(req.body.lastName!=null | req.body.lastName!="")
  {
    User.updateOne({user_id:iD},{$set:{lastName:req.body.lastName}});
    res.send('Account Updated Succesfully');

  }
  if(req.body.gender!=null | req.body.gender!="")
  {
    User.updateOne({user_id:iD},{$set:{gender:req.body.gender}});
      res.send('Account Updated Succesfully');

  }
},

view_Business:function(req,res){
  BusinessOwner.findOne({_id:req.params.id},function(err,BusinessOwner)
  {
    if(err)
    {
      res.send(err);
    }
    else {
      res.send(BusinessOwner);
    }
  });
}




};


module.exports = clientController;
