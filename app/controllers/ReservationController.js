let Activity = require('../models/Activity');
let NonRepeatableActivity = require('../models/NonRepeatableActivity');
let RepeatableActivity = require("../models/RepeatableActivity");
let NonRepeatableActivityReservation = require("../models/NonRepeatableActivityReservation");
let RepeatableActivityReservation = require("../models/RepeatableActivityReservation");

let ReservationController={

    reserveSlot:function(req,res){
      if(req.params.type==0)
      return ReservationController.repeatableReserveSlot(req,res);
      else{
       return   ReservationController.nonRepeatableReserveSlot(req,res);
      }
    },


    repeatableReserveSlot:function(req,res){//TODO : User is in request params according to session ? / CLEAN
      console.log(req);
      var client_id = req.body.client_id; //TODO : to be changed to user._id;
      var slot_id = req.body.slot_id;
      var participants =  req.body.participants;
      var date = req.body.date;
      var repeatableActivity_id = req.params.activity_id;
      var price = req.body.price; // TODO : check what you send in params/ currently the whole price
console.log(client_id);
console.log(slot_id);
console.log(participants);
console.log(date);
console.log(repeatableActivity_id);
console.log(price);
      var missingFields = client_id==null ||client_id=='' ||
       slot_id==null || slot_id==''|| participants==null || participants==''
      repeatableActivity_id==null || repeatableActivity_id==''|| price ==null
       || price ==''||date==null || date =='';

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
              var reservation = new RepeatableActivityReservation();
              reservation.repeatableActivity_id = repeatableActivity_id;
              reservation.client_id=client_id;
              reservation.slot_id=slot_id;
              reservation.participants=participants;
              reservation.date=date;
              reservation.price=price;
              reservation.save(function(err){
                if(err)
                res.json({success:false,status:0,message:err});
                else {
                  res.json({success:true,status:1,message:"Reserved Successfuly"});
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
                    reservation.save(function(err){
                      if(err)
                      res.json({success:false,status:0,message:err});
                      else {
                        NonRepeatableActivity.update({_id:nonRepeatableActivity_id},{$inc:{currentParticipants:participants}},function(err){
                          if(err)
                          res.json({success:false,status:0,message:err});
                          else{
                              res.json({success:true,status:1,message:"Reserved Successfuly"});
                          }
                        } );
                      }
                    });
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
    }


};

module.exports = ReservationController;
