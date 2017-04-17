let Activity = require('../models/Activity');
let NonRepeatableActivity = require('../models/NonRepeatableActivity');
let RepeatableActivity = require('../models/RepeatableActivity');
let RepeatableActivityReservation = require('../models/RepeatableActivityReservation');

let activityController={



	getActivity:function(req,res){
		var activity_id =  req.params.id;
		RepeatableActivity.findOne({_id:activity_id}, function(err, repeatableActivity) {
	        if (err) {
	        	res.json({success:false, message: err});
	        }
	        else{
		        if(!repeatableActivity){
					NonRepeatableActivity.findOne({_id:activity_id}, function(err, nonRepeatableActivity) {
				        if (err) {
				        	res.json({success:false, message: err});
				        }
				        else{
					        if(!nonRepeatableActivity){
					        	res.json({success:false, message: 'Activity with this id does not exist!'});
				            }
				            else{
				            	res.json({success:true, message:'Activity has been retrieved successfully.', activity: nonRepeatableActivity});
				            }

				        }
			        });
	            }
	            else{
	            	res.json({success:true, message:'Activity has been retrieved successfully.', activity: repeatableActivity});
	            }

	        }
        });
	},

	addRepeatableActivityPricePackage: function(req,res){
		var activity_id =  req.params.id;
		var businessOwner_id = '58f13a6ef286e74e0ecdadcb';
		var participants = req.body.participants;
		var price = req.body.price;

		var missingFields = businessOwner_id==null || businessOwner_id=='' || participants==null || participants=='' || price==null || price=='';
		if(missingFields){
			res.json({success:false, message: 'The fields: (businessOwner_id, participants, price) are required!'});
			return;
		}
		RepeatableActivity.findOne({_id:activity_id}, function(err, repeatableActivity){
			if(err){
				res.json({success:false, message: err});
			}else{
				if(!repeatableActivity){
					res.json({success:false, message: 'Activity with this id does not exist!'});
				}else{
					if(repeatableActivity.businessOwner_id!=businessOwner_id){
						res.json({success:false, message: 'You can only add price packages to your own activity!'});
					}else{
						RepeatableActivityReservation.findOne({_id:activity_id}, function(err, repeatableActivityReservation){
							if(err){
								res.json({success:false, message: err});
							}else{
								if(repeatableActivityReservation){
									var people = repeatableActivityReservation.participants+1;
									res.json({success:false, message: 'This activity is currently reserved by '+people+' person(s), You can add price packages to an activity only when it is not reserved!'});
									return;
								}
							}
						});
						repeatableActivity.pricePackages.push({ participants: participants,  price: price });
						repeatableActivity.save(function(err) {
			                if (err) {
			                	res.json({success:false, message: err});
			                } 
			                else {
			                	res.json({success:true, message: 'Price package has been added to the activity successfully.', packages:repeatableActivity.pricePackages});
			                }
	            		});
					}

				}
			}
		});	
	},

	deleteRepeatableActivityPricePackage: function(req,res){
		var activity_id =  req.body.activity_id;
		var package_id = req.body.package_id;
		var businessOwner_id = '58f13a6ef286e74e0ecdadcb';

		var missingFields = businessOwner_id==null || businessOwner_id=='' || package_id==null || package_id=='' || activity_id==null || activity_id=='';
		if(missingFields){
			res.json({success:false, message: 'The fields: (businessOwner_id, activity_id, package_id) are required!'});
			return;
		}
		RepeatableActivity.findOne({_id:activity_id}, function(err, repeatableActivity){
			if(err){
				res.json({success:false, message: err});
			}else{
				if(!repeatableActivity){
					res.json({success:false, message: 'Activity with this id does not exist!'});
				}else{
					if(repeatableActivity.businessOwner_id!=businessOwner_id){
						res.json({success:false, message: 'You can only delete price packages from your own activity!'});
					}else{
						RepeatableActivityReservation.findOne({_id:activity_id}, function(err, repeatableActivityReservation){
							if(err){
								res.json({success:false, message: err});
							}else{
								if(repeatableActivityReservation){
									var people = repeatableActivityReservation.participants+1;
									res.json({success:false, message: 'This activity is currently reserved by '+people+' person(s), You can delete price packages from an activity only when it is not reserved!'});
									return;
								}
							}
						});
						repeatableActivity.pricePackages.pull({ _id: package_id});
						repeatableActivity.save(function(err) {
			                if (err) {
			                	res.json({success:false, message: err});
			                } 
			                else {
			                	res.json({success:true, message: 'Price Package has been deleted from the activity successfully.', packages:repeatableActivity.pricePackages});
			                }
	            		});
					}

				}
			}
		});	
	},

	addRepeatableActivitySlot: function(req,res){
		console.log('yelo maaaaaaaateeeee');
		var activity_id =  req.params.id;
		var businessOwner_id = '58f13a6ef286e74e0ecdadcb';
		var startTime = req.body.startTime;
		var endTime = req.body.endTime;
		console.log(startTime+" kaka"+endTime);
		var missingFields = businessOwner_id==null || businessOwner_id=='' || startTime==null || startTime=='' || endTime==null || endTime=='';
		if(missingFields){
			res.json({success:false, message: 'The fields: (businessOwner_id, startTime, endTime) are required!'});
			return;
		}
		RepeatableActivity.findOne({_id:activity_id}, function(err, repeatableActivity){
			if(err){
				res.json({success:false, message: err});
			}else{
				if(!repeatableActivity){
					res.json({success:false, message: 'Activity with this id does not exist!'});
				}else{
					if(repeatableActivity.businessOwner_id!=businessOwner_id){
						res.json({success:false, message: 'You can add slots to your own activity!'});
					}else{
						RepeatableActivityReservation.findOne({_id:activity_id}, function(err, repeatableActivityReservation){
							if(err){
								res.json({success:false, message: err});
							}else{
								if(repeatableActivityReservation){
									var people = repeatableActivityReservation.participants+1;
									res.json({success:false, message: 'This activity is currently reserved by '+people+' person(s), You can add slots to an activity only when it is not reserved!'});
									return;
								}
							}
						});
						repeatableActivity.slots.push({ startTime: startTime,  endTime: endTime });
						repeatableActivity.save(function(err) {
			                if (err) {
			                	res.json({success:false, message: err});
			                } 
			                else {
			                	res.json({success:true, message: 'Slot has been added to the activity successfully.', slots:repeatableActivity.slots});
			                }
	            		});
					}

				}
			}
		});	
	},


	deleteRepeatableActivitySlot: function(req,res){
		var activity_id =  req.body.activity_id;
		var slot_id =  req.body.slot_id;
		var businessOwner_id = '58f13a6ef286e74e0ecdadcb';

		var missingFields = businessOwner_id==null || businessOwner_id=='' || activity_id==null || activity_id=='' || slot_id==null || slot_id=='';
		if(missingFields){
			res.json({success:false, message: 'The fields: (businessOwner_id, activity_id, slot_id) are required!'});
			return;
		}
		RepeatableActivity.findOne({_id:activity_id}, function(err, repeatableActivity){
			if(err){
				res.json({success:false, message: err});
			}else{
				if(!repeatableActivity){
					res.json({success:false, message: 'Activity with this id does not exist!'});
				}else{
					if(repeatableActivity.businessOwner_id!=businessOwner_id){
						res.json({success:false, message: 'You can only delete time slots from your own activity!'});
					}else{
						RepeatableActivityReservation.findOne({_id:activity_id}, function(err, repeatableActivityReservation){
							if(err){
								res.json({success:false, message: err});
							}else{
								if(repeatableActivityReservation){
									var people = repeatableActivityReservation.participants+1;
									res.json({success:false, message: 'This activity is currently reserved by '+people+' person(s), You can delete time slots from an activity only when it is not reserved!'});
									return;
								}
							}
						});
						repeatableActivity.slots.pull({ _id: slot_id });
						repeatableActivity.save(function(err) {
			                if (err) {
			                	res.json({success:false, message: err});
			                } 
			                else {
			                	res.json({success:true, message: 'Slot has been deleted from the activity successfully.', slots:repeatableActivity.slots});
			                }
	            		});
					}

				}
			}
		});	
	},

	editActivityImage: function(req,res){

		//common attributes between RepeatableActivity and NonRepeatableActivity
		var activity_id =  req.body.activity_id;
		var businessOwner_id = '58f13a6ef286e74e0ecdadcb';
		var image = req.body.image;

		var missingFields = businessOwner_id==null || businessOwner_id=='' || image==null || image=='' || activity_id=='' || activity_id==null;
		if(missingFields){
			res.json({success:false, message: 'The fields: (activity_id, businessOwner_id, image) are required!'});
			return;
		}

		NonRepeatableActivity.findOne({_id:activity_id}, function(err, nonRepeatableActivity){
			if(err){
				res.json({success:false, message: err});
			}else{
				if(!nonRepeatableActivity){
					RepeatableActivity.findOne({_id:activity_id}, function(err, repeatableActivity){
						if(err){
							res.json({success:false, message: err});
						}else{
							if(!repeatableActivity){
								res.json({success:false, message: 'Activity with this id does not exist!'});
							}else{
								if(repeatableActivity.businessOwner_id!=businessOwner_id){
									res.json({success:false, message: 'You can only change the image of your own activity!'});
								}else{
									RepeatableActivityReservation.findOne({_id:activity_id}, function(err, repeatableActivityReservation){
										if(err){
											res.json({success:false, message: err});
										}else{
											if(repeatableActivityReservation){
												var people = repeatableActivityReservation.participants+1;
												res.json({success:false, message: 'This activity is currently reserved by '+people+' person(s), You can change the image of an activity only when it is not reserved!'});
												return;
											}
										}
									});
									repeatableActivity.image = (image==null||image=='')? repeatableActivity.image : image;
									repeatableActivity.save(function(err) {
						                if (err) {
						                	res.json({success:false, message: err});
						                } 
						                else {
						                	res.json({success:true, message: 'Activity\'s  image has been changed successfully.'});
						                }
				            		});
								}

							}
						}
					});		
				}else{
					if(nonRepeatableActivity.businessOwner_id!=businessOwner_id){
						res.json({success:false, message: 'You can only edit your own activity!'});
					}else{
						if(nonRepeatableActivity.currentParticipants>0){
							res.json({success:false, message: 'This activity is currently reserved by '+nonRepeatableActivity.currentParticipants+' person(s), You can change the image of an activity only when it is not reserved!'});
							return;
						}
						nonRepeatableActivity.image = (image==null||image=='')? nonRepeatableActivity.image : image;
						nonRepeatableActivity.save(function(err) {
			                if (err) {
			                	res.json({success:false, message: err});
			                } 
			                else {
			                	res.json({success:true, message: 'Activity\'s  image has been changed successfully.'});
			                }
	            		});
					}

				}
			}
		});		
	},

	/*	this function receives requests for editing activites, an activity has multiple attributes;
	the function gurantees to edit all parameters given, the request should include the BusinessOwner_id and at least one attrbute to be edited*/
	editActivity: function(req,res){

		//common attributes between RepeatableActivity and NonRepeatableActivity
		var activity_id =  req.params.id;
		console.log(activity_id);
		var businessOwner_id = '58f13a6ef286e74e0ecdadcb';
		var description = req.body.description;
		var cancellationWindow = req.body.cancellationWindow;

		//NonRepeatableActivity attributes 
		var travelingDate = req.body.travelingDate;
		var returnDate = req.body.returnDate;
		var destination = req.body.destination;
		var Accommodation = req.body.Accommodation;
		var transportation = req.body.transportation;
		var maxParticipants = req.body.maxParticipants;
		var pricePerPerson = req.body.pricePerPerson;
		
		//RepeatableActivity attributes
		var theme = req.body.theme;
		var pricePackages = req.body.pricePackages;
		var slots = req.body.slots;
		var dayOffs = req.body.dayOffs;

		var missingFields = businessOwner_id==null || businessOwner_id=='';
		if(missingFields){
			res.json({success:false, message: 'The field: (businessOwner_id) is required!'});
			return;
		}

		NonRepeatableActivity.findOne({_id:activity_id}, function(err, nonRepeatableActivity){
			if(err){
				res.json({success:false, message: err});
			}else{
				if(!nonRepeatableActivity){
					RepeatableActivity.findOne({_id:activity_id}, function(err, repeatableActivity){
						if(err){
							res.json({success:false, message: err});
						}else{
							if(!repeatableActivity){
								res.json({success:false, message: 'Activity with this id does not exist!'});
							}else{
								if(repeatableActivity.businessOwner_id!=businessOwner_id){
									res.json({success:false, message: 'You can only edit your own activity!'});
								}else{
									RepeatableActivityReservation.findOne({_id:activity_id}, function(err, repeatableActivityReservation){
										if(err){
											res.json({success:false, message: err});
										}else{
											if(repeatableActivityReservation){
												var people = repeatableActivityReservation.participants+1;
												res.json({success:false, message: 'This activity is currently reserved by '+people+' person(s), You can only edit an ectivity when it is not reserved!'});
												return;
											}
										}
									});
									repeatableActivity.description = (description==null||description=='')? repeatableActivity.description : description;
									repeatableActivity.cancellationWindow = (cancellationWindow==null||cancellationWindow=='')? repeatableActivity.cancellationWindow : cancellationWindow;
									repeatableActivity.theme = (theme==null||theme=='')? repeatableActivity.theme : theme;
									repeatableActivity.pricePackages = (pricePackages==null||pricePackages=='')? repeatableActivity.pricePackages : pricePackages;
									repeatableActivity.slots = (slots==null||slots=='')? repeatableActivity.slots : slots;
									repeatableActivity.dayOffs = (dayOffs==null||dayOffs=='')? repeatableActivity.dayOffs : dayOffs;
									repeatableActivity.save(function(err) {
						                if (err) {
						                	res.json({success:false, message: err});
						                } 
						                else {
						                	res.json({success:true, message: 'Activity has been updated successfully.'});
						                }
				            		});
								}

							}
						}
					});		
				}else{
					if(nonRepeatableActivity.businessOwner_id!=businessOwner_id){
						res.json({success:false, message: 'You can only edit your own activity!'});
					}else{
						if(nonRepeatableActivity.currentParticipants>0){
							res.json({success:false, message: 'This activity is currently reserved by '+nonRepeatableActivity.currentParticipants+' person(s), You can only edit an ectivity when it is not reserved!'});
							return;
						}
						nonRepeatableActivity.description = (description==null||description=='')? nonRepeatableActivity.description : description;
						nonRepeatableActivity.cancellationWindow = (cancellationWindow==null||cancellationWindow=='')? nonRepeatableActivity.cancellationWindow : cancellationWindow;
						nonRepeatableActivity.travelingDate = (travelingDate==null||travelingDate=='')? nonRepeatableActivity.travelingDate : travelingDate;
						nonRepeatableActivity.returnDate = (returnDate==null||returnDate=='')? nonRepeatableActivity.returnDate : returnDate;
						nonRepeatableActivity.destination = (destination==null||destination=='')? nonRepeatableActivity.destination : destination;
						nonRepeatableActivity.Accommodation = (Accommodation==null||Accommodation=='')? nonRepeatableActivity.Accommodation : Accommodation;
						nonRepeatableActivity.transportation = (transportation==null||transportation=='')? nonRepeatableActivity.transportation : transportation;
						nonRepeatableActivity.maxParticipants = (maxParticipants==null||maxParticipants=='')? nonRepeatableActivity.maxParticipants : maxParticipants;
						nonRepeatableActivity.pricePerPerson = (pricePerPerson==null||pricePerPerson=='')? nonRepeatableActivity.pricePerPerson : pricePerPerson;
						nonRepeatableActivity.save(function(err) {
			                if (err) {
			                	res.json({success:false, message: err});
			                } 
			                else {
			                	res.json({success:true, message: 'Activity has been updated successfully.'});
			                }
	            		});
					}

				}
			}
		});		
	}

};

module.exports = activityController;


