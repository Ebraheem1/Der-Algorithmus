let Activity = require('../models/Activity');
let NonRepeatableActivity = require('../models/NonRepeatableActivity');
let RepeatableActivity = require("../models/RepeatableActivity");
let NonRepeatableActivityReservation = require("../models/NonRepeatableActivityReservation");
let RepeatableActivityReservation = require("../models/RepeatableActivityReservation");
let stripe = require("stripe")("sk_test_Hr41ZUg64PJe2duUepC7ruyr");
let ReservationController={

    reserveSlot:function(req,res){
      if(req.params.type==0)
      return ReservationController.repeatableReserveSlot(req,res);
      else{
       return   ReservationController.nonRepeatableReserveSlot(req,res);
      }
    },


    repeatableReserveSlot:function(req,res){//TODO : User is in request params according to session ? / CLEAN

      var client_id = req.body.client_id; //TODO : to be changed to user._id;
      var slot_id = req.body.slot_id;
      var package_id = req.body.package_id;
      var date = req.body.date;
      var repeatableActivity_id = req.params.activity_id;
      var price ;


      var missingFields = client_id==null ||client_id=='' ||
       slot_id==null || slot_id==''||
      repeatableActivity_id==null || repeatableActivity_id==''||date==null || date =='';

      if(missingFields){
        res.json({success:false,status:-1,message:"Please insert all missing fields"});
      }else{
         RepeatableActivityReservation.findOne({slot_id:slot_id,repeatableActivity_id:repeatableActivity_id,date:date},function(err,activity){
          if(err)
          res.json({success:false,status:0,message:err});
          else
          {

            if(activity){
              res.json({success:false,status:2,message:"Sorry , This slot is already reserved ."});
            }else{
              RepeatableActivity.findOne({_id:repeatableActivity_id},function(err,activity){
                if(activity)
                {

                  var packagee  = activity.pricePackages.id(package_id);
                    var price = packagee.price;
                    var participants = packagee.participants;

                  var reservation = new RepeatableActivityReservation();
                  reservation.repeatableActivity_id = repeatableActivity_id;
                  reservation.client_id=client_id;
                  reservation.slot_id=slot_id;
                  reservation.participants=participants;
                  reservation.date=date;
                  reservation.price=price;
                  return ReservationController.FreeDayCheck(req,res,activity,date,reservation);

                }
              });

            }
          }


        });

      }



    },
    nonRepeatableReserveSlot:function(req,res){

      var nonRepeatableActivity_id = req.params.activity_id;
      var client_id = req.body.client_id ;// TODO : client._id;
      var participants = req.body.participants;
      var price = req.body.price;
      if(Number(participants)<1){

              res.json({success:false,status:-1,message:"Number of participants can't be less than 1 "});
              return ;
      }
      var missingFields = client_id==null ||client_id=='' ||nonRepeatableActivity_id==null || nonRepeatableActivity_id==''|| participants==null || participants=='' || price ==null || price =='';
      if(missingFields)
      res.json({success:false,status:-1,message:"Please Enter all fields "});
      else{

          NonRepeatableActivity.findOne({_id:nonRepeatableActivity_id},function(err,activity){
            if(err)
            res.json({success:false,status:0,message:err});
            else {
              if(activity){
                if(Number(participants)+Number(activity.currentParticipants)>Number(activity.maxParticipants)){
                  res.json({success:false,status:1,message:"Sorry , there are no enough places for you in this activity."});
                }else{

                    var reservation = new NonRepeatableActivityReservation();
                    reservation.nonRepeatableActivity_id = nonRepeatableActivity_id;
                    reservation.client_id = client_id;
                    reservation.participants= participants;
                    reservation.price = price ;
                      res.json({success:true,status:1,message:"You Reserved Succesfuly",reservation:reservation});

                }

              }else{
                  res.json({succes:false,status:-1,message:"Activity is not present !"});
              }
            }

            });

      }
    },

    getActivity:function(req,res){

      var activity_id = req.params.activity_id;
      var activity_type = req.params.activity_type;

        if(activity_type==0){

          RepeatableActivity.findOne({_id:activity_id},function(err,activity){
            if(err)
            res.json({success:false,message:err});
            else {
              if(activity){
              res.json({success:true,activity});
                    }
              else {
                res.json({success:false,message:"Activity not found "});
              }
            }
          });
      }else{
        NonRepeatableActivity.findOne({_id:activity_id},function(err,activity){
            if(err)
            res.json({success:false,message:err});
            else {
              if(activity)
              res.json({success:true,activity});
              else {
                res.json({success:false,message:"Activity not found "});
              }
            }
        });
      }
    },
    FreeDayCheck:function(req,res,activity,date,reservation){
  var dat = new Date(date);

var found = false ;
  for(var i =0 ; i<7;i++){
    if(activity.dayOffs[i]==dat.getDay()){
      found= true ;
    }
  }

  if(!found){
    res.json({success:true,status:1,message:"You reserved successfuly",reservation:reservation});
    }else{
          res.json({success:false,status:0,message:"Sorry this day is a day Off. Please choose another"});
      }
    },
    Pay:function(req,resp){
      console.log(req.body.client_id);
      if(req.body.type==0){
          var token = req.body.stripeToken;
				      var chargeAmount = req.body.chargeAmount;
				var charge = stripe.charges.create ({
					amount:chargeAmount,
					currency:"gbp",
					source: token
				},function(err,charge){
					if(err)
					console.log(err);
          else{
            var res = new   RepeatableActivityReservation();
            res.repeatableActivity_id = req.body.repeatableActivity_id;
            res.client_id = req.body.client_id;
            res.slot_id = req.body.slot_id;
            res.date=req.body.date;
            res.participants= req.body.participants;
            res.price=req.body.price;

            res.save(function(err){
              if(err){
                console.log(err);
              }else{
                console.log("ok2");
              resp.redirect("/login");

              }
            });
}});




      }else{
        console.log(req.body);
				var token = req.body.stripeToken;
				var chargeAmount = req.body.chargeAmount;
				var charge = stripe.charges.create ({
					amount:chargeAmount,
					currency:"gbp",
					source: token
				},function(err,charge){
					if(err)
					console.log(err);
              else{
                var   res = new NonRepeatableActivityReservation();
                res.nonRepeatableActivity_id = req.body.nonRepeatableActivity_id;
                res.client_id = req.body.client_id;
                res.participants=req.body.participants;
                res.price = req.body.price;
                  res.save(function(err){
                    if(err)
                    resp.json({success:false,status:0,message:err});
                    else {
                      NonRepeatableActivity.update({_id:req.body.nonRepeatableActivity_id},{$inc:{currentParticipants:req.body.participants}},function(err){
                        if(err)
                        resp.json({success:false,status:0,message:err});
                        else{

                            resp.redirect('/');

                        }
                      } );
                    }
                  });

              }

				});

      }
    }


};

module.exports = ReservationController;