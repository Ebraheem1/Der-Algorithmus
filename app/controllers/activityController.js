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
		var businessOwner_id = req.user._id;
		var participants = req.body.participants;
		var price = req.body.price;

		var missingFields = businessOwner_id==null || businessOwner_id=='' || participants==null || participants=='' || price==null || price=='';
		if(missingFields){
			//The fields: (businessOwner_id, participants, price) are required!
			res.json({success:false, message: 'You should include participants and price in the price package!'});
			return;
		}

		if(isNaN(participants) || isNaN(price)){
			res.json({success:false, message: 'Participants and price should be numbers!'});
			return;
		}

		RepeatableActivity.findOne({_id:activity_id}, function(err, repeatableActivity){
			if(err){
				res.json({success:false, message: err});
			}else{
				if(!repeatableActivity){
					res.json({success:false, message: 'Activity with this id does not exist!'});
				}else{
					if(!repeatableActivity.businessOwner_id.equals(businessOwner_id)){
						res.json({success:false, message: 'You can only add price packages to your own activity!'});
					}else{
						RepeatableActivityReservation.findOne({repeatableActivity_id:activity_id}, function(err, repeatableActivityReservation){
							if(err){
								res.json({success:false, message: err});
							}else{
								if(repeatableActivityReservation){
									var reservationDate = new Date(repeatableActivityReservation.date);
									reservationDate.setUTCHours(0);
									reservationDate.setUTCMinutes(0);
									reservationDate.setUTCSeconds(0);
									var dateNow = new Date();
									dateNow.setUTCHours(0);
									dateNow.setUTCMinutes(0);
									dateNow.setUTCSeconds(0);
									dateNow.setUTCMilliseconds(0);
									if(reservationDate>=dateNow){
										res.json({success:false, message: 'This activity is currently reserved. You can only edit an ectivity when it is not reserved!'});
										return;
									}
								}
								else{
					                for(var i=0;i< repeatableActivity.pricePackages.length;i++){
					                        var currentParticipants=repeatableActivity.pricePackages[i].participants;
					                        if(currentParticipants==participants){
					                            res.json({ success:false, message: 'You can not have 2 different price packages with the same number of participants!'} );
					                            return;
					                        }

					                }
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
						});
					}
				}
			}
		});	
	},

	deleteRepeatableActivityPricePackage: function(req,res){
		var activity_id =  req.body.activity_id;
		var package_id = req.body.package_id;
		var businessOwner_id = req.user._id;

		var missingFields = businessOwner_id==null || businessOwner_id=='' || package_id==null || package_id=='' || activity_id==null || activity_id=='';
		if(missingFields){
			//The fields: (businessOwner_id, activity_id, package_id) are required!
			res.json({success:false, message: 'Contact Development Team!'});
			return;
		}
		RepeatableActivity.findOne({_id:activity_id}, function(err, repeatableActivity){
			if(err){
				res.json({success:false, message: err});
			}else{
				if(!repeatableActivity){
					res.json({success:false, message: 'Activity with this id does not exist!'});
				}else{
					if(!repeatableActivity.businessOwner_id.equals(businessOwner_id)){
						res.json({success:false, message: 'You can only delete price packages from your own activity!'});
					}else{
						RepeatableActivityReservation.findOne({repeatableActivity_id:activity_id}, function(err, repeatableActivityReservation){
							if(err){
								res.json({success:false, message: err});
							}else{
								if(repeatableActivityReservation){
									var reservationDate = new Date(repeatableActivityReservation.date);
									reservationDate.setUTCHours(0);
									reservationDate.setUTCMinutes(0);
									reservationDate.setUTCSeconds(0);
									var dateNow = new Date();
									dateNow.setUTCHours(0);
									dateNow.setUTCMinutes(0);
									dateNow.setUTCSeconds(0);
									dateNow.setUTCMilliseconds(0);
									if(reservationDate>=dateNow){
										res.json({success:false, message: 'This activity is currently reserved. You can only edit an ectivity when it is not reserved!'});
										return;
									}
								}
								else{
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
						});
					}

				}
			}
		});	
	},

	addRepeatableActivitySlot: function(req,res){
		var activity_id =  req.params.id;
		var businessOwner_id = req.user._id;
		var startTime = req.body.startTime;
		var endTime = req.body.endTime;

		var missingFields = businessOwner_id==null || businessOwner_id=='' || startTime==null || startTime=='' || endTime==null || endTime=='';
		if(missingFields){
			//The fields: (businessOwner_id, startTime, endTime) are required!
			res.json({success:false, message: 'You should include start time and end time in the time slot!'});
			return;
		}

		var startDate = new Date(startTime);
		var endDate = new Date(endTime);
		var startDateHours = (startDate.getHours()<10)? '0'+startDate.getHours(): startDate.getHours();
		var startDateMins =	(startDate.getMinutes()<10)? '0'+startDate.getMinutes(): startDate.getMinutes();
		var endDateHours = (endDate.getHours()<10)? '0'+endDate.getHours(): endDate.getHours();
		var endDateMins =  (endDate.getMinutes()<10)? '0'+endDate.getMinutes(): endDate.getMinutes();
		startTimeString = startDateHours+':'+startDateMins;
		endTimeString =  endDateHours+':'+endDateMins;

		RepeatableActivity.findOne({_id:activity_id}, function(err, repeatableActivity){
			if(err){
				res.json({success:false, message: err});
			}else{
				if(!repeatableActivity){
					res.json({success:false, message: 'Activity with this id does not exist!'});
				}else{
					if(!repeatableActivity.businessOwner_id.equals(businessOwner_id)){
						res.json({success:false, message: 'You can add slots to your own activity!'});
					}else{
						RepeatableActivityReservation.findOne({repeatableActivity_id:activity_id}, function(err, repeatableActivityReservation){
							if(err){
								res.json({success:false, message: err});
							}else{
								if(repeatableActivityReservation){
									var reservationDate = new Date(repeatableActivityReservation.date);
									reservationDate.setUTCHours(0);
									reservationDate.setUTCMinutes(0);
									reservationDate.setUTCSeconds(0);
									var dateNow = new Date();
									dateNow.setUTCHours(0);
									dateNow.setUTCMinutes(0);
									dateNow.setUTCSeconds(0);
									dateNow.setUTCMilliseconds(0);
									if(reservationDate>=dateNow){
										res.json({success:false, message: 'This activity is currently reserved. You can only edit an ectivity when it is not reserved!'});
										return;
									}
								}
								else{
							        if(endTime <= startTime){
							            res.json({ success: false, message: 'End Time should be greater than Start Time!'});
							           return;
							        }
									var start1 = startTimeString;
									var end1 = endTimeString;

									for(var i=0; i<repeatableActivity.slots.length;i++){

									    var start2 = repeatableActivity.slots[i].startTime;
									    var end2 = repeatableActivity.slots[i].endTime;

									    if( (start1>=start2 && start1<end2) || (end1>start2 && end1<=end2) ){
									        res.json({ success: false, message: 'There must be no overlapping slots!'});
									        return; 
									    }
									}
									repeatableActivity.slots.push({ startTime: startTimeString,  endTime: endTimeString });
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
						});

					}

				}
			}
		});	
	},


	deleteRepeatableActivitySlot: function(req,res){
		var activity_id =  req.body.activity_id;
		var slot_id =  req.body.slot_id;
		var businessOwner_id = req.user._id;

		var missingFields = businessOwner_id==null || businessOwner_id=='' || activity_id==null || activity_id=='' || slot_id==null || slot_id=='';
		if(missingFields){
			//The fields: (businessOwner_id, activity_id, slot_id) are required!
			res.json({success:false, message: 'Contact Development Team!'});
			return;
		}
		RepeatableActivity.findOne({_id:activity_id}, function(err, repeatableActivity){
			if(err){
				res.json({success:false, message: err});
			}else{
				if(!repeatableActivity){
					res.json({success:false, message: 'Activity with this id does not exist!'});
				}else{
					if(!repeatableActivity.businessOwner_id.equals(businessOwner_id)){
						res.json({success:false, message: 'You can only delete time slots from your own activity!'});
					}else{
						RepeatableActivityReservation.findOne({repeatableActivity_id:activity_id}, function(err, repeatableActivityReservation){
							if(err){
								res.json({success:false, message: err});
							}else{
								if(repeatableActivityReservation){
									var reservationDate = new Date(repeatableActivityReservation.date);
									reservationDate.setUTCHours(0);
									reservationDate.setUTCMinutes(0);
									reservationDate.setUTCSeconds(0);
									var dateNow = new Date();
									dateNow.setUTCHours(0);
									dateNow.setUTCMinutes(0);
									dateNow.setUTCSeconds(0);
									dateNow.setUTCMilliseconds(0);
									if(reservationDate>=dateNow){
										res.json({success:false, message: 'This activity is currently reserved. You can only edit an ectivity when it is not reserved!'});
										return;
									}
								}
								else{
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
						});

					}

				}
			}
		});	
	},

	editActivityImage: function(req,res){

		//common attributes between RepeatableActivity and NonRepeatableActivity
		var activity_id =  req.body.activity_id;
		var businessOwner_id = req.user._id;
		var image = req.body.image;

		var missingFields = businessOwner_id==null || businessOwner_id=='' || image==null || image=='' || activity_id=='' || activity_id==null;
		if(missingFields){
			//The fields: (activity_id, businessOwner_id, image) are required!
			res.json({success:false, message: 'Contact Development Team'});
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
								if(!repeatableActivity.businessOwner_id.equals(businessOwner_id)){
									res.json({success:false, message: 'You can only change the image of your own activity!'});
								}else{
									RepeatableActivityReservation.findOne({repeatableActivity_id:activity_id}, function(err, repeatableActivityReservation){
										if(err){
											res.json({success:false, message: err});
										}else{
											if(repeatableActivityReservation){
												var reservationDate = new Date(repeatableActivityReservation.date);
												reservationDate.setUTCHours(0);
												reservationDate.setUTCMinutes(0);
												reservationDate.setUTCSeconds(0);
												var dateNow = new Date();
												dateNow.setUTCHours(0);
												dateNow.setUTCMinutes(0);
												dateNow.setUTCSeconds(0);
												dateNow.setUTCMilliseconds(0);
												if(reservationDate>=dateNow){
													res.json({success:false, message: 'This activity is currently reserved. You can only edit an ectivity when it is not reserved!'});
													return;
												}
											}
											else{
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
									});

								}

							}
						}
					});		
				}else{
					if(!nonRepeatableActivity.businessOwner_id.equals(businessOwner_id)){
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
		var businessOwner_id = req.user._id;
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
		var dayOffsNames = req.body.dayOffsNames;
		var None = req.body.None;

		var missingFields = businessOwner_id==null || businessOwner_id=='';
		if(missingFields){
			//The field: (businessOwner_id) is required!
			res.json({success:false, message: 'Contact Development Team'});
			return;
		}

		if(cancellationWindow!=null && cancellationWindow!='' && isNaN(cancellationWindow)){
			res.json({success:false, message: 'Cancellation Window should be a number!'});
			return;
		}

		if(maxParticipants!=null && maxParticipants!='' && isNaN(maxParticipants)){
			res.json({success:false, message: 'Max Participants should be a number!'});
			return;
		}

		if(pricePerPerson!=null && pricePerPerson!='' && isNaN(pricePerPerson)){
			res.json({success:false, message: 'Price Per Person should be a number!'});
			return;
		}

		if(travelingDate!=null && travelingDate!=''){
			var dateNow = new Date();
			dateNow.setUTCHours(0);
			dateNow.setUTCMinutes(0);
			dateNow.setUTCSeconds(0);
			dateNow.setUTCMilliseconds(0);
			var travelingDateObject = new Date(travelingDate);
			if(travelingDateObject<dateNow){
				res.json({success:false, message: 'Traveling Date should be today or later!'});
				return;
			}
		}

		if(returnDate!=null && returnDate!=''){
			var dateNow = new Date();
			dateNow.setUTCHours(0);
			dateNow.setUTCMinutes(0);
			dateNow.setUTCSeconds(0);
			dateNow.setUTCMilliseconds(0);
			var returnDateObject = new Date(returnDate);
			if(returnDateObject<dateNow){
				res.json({success:false, message: 'Return Date should be today or later!'});
				return;
			}
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
								if(!repeatableActivity.businessOwner_id.equals(businessOwner_id)){
									res.json({success:false, message: 'You can only edit your own activity!'});
								}else{
									RepeatableActivityReservation.findOne({repeatableActivity_id:activity_id}, function(err, repeatableActivityReservation){
										if(err){
											res.json({success:false, message: err});
										}else{
											if(repeatableActivityReservation){
												var reservationDate = new Date(repeatableActivityReservation.date);
												reservationDate.setUTCHours(0);
												reservationDate.setUTCMinutes(0);
												reservationDate.setUTCSeconds(0);
												var dateNow = new Date();
												dateNow.setUTCHours(0);
												dateNow.setUTCMinutes(0);
												dateNow.setUTCSeconds(0);
												dateNow.setUTCMilliseconds(0);
												if(reservationDate>=dateNow){
													res.json({success:false, message: 'This activity is currently reserved. You can only edit an ectivity when it is not reserved!'});
													return;
												}
											}
											else{
												repeatableActivity.description = (description==null||description=='')? repeatableActivity.description : description;
												repeatableActivity.cancellationWindow = (cancellationWindow==null||cancellationWindow=='')? repeatableActivity.cancellationWindow : cancellationWindow;
												repeatableActivity.theme = (theme==null||theme=='')? repeatableActivity.theme : theme;
												repeatableActivity.dayOffsNames = (dayOffsNames==null||dayOffsNames=='')? repeatableActivity.dayOffsNames : dayOffsNames;


												if(None==true){
													repeatableActivity.dayOffsNames = [];
												}


												if(dayOffsNames!=null&&dayOffsNames!=''){
													repeatableActivity.dayOffs = [];
													if(None!=true){
														if(dayOffsNames.indexOf("Sunday")!=-1){
															repeatableActivity.dayOffs.push(0);
														}
														if(dayOffsNames.indexOf("Monday")!=-1){
															repeatableActivity.dayOffs.push(1);
														}
														if(dayOffsNames.indexOf("Tuesday")!=-1){
															repeatableActivity.dayOffs.push(2);
														}
														if(dayOffsNames.indexOf("Wednesday")!=-1){
															repeatableActivity.dayOffs.push(3);
														}
														if(dayOffsNames.indexOf("Thursday")!=-1){
															repeatableActivity.dayOffs.push(4);
														}
														if(dayOffsNames.indexOf("Friday")!=-1){
															repeatableActivity.dayOffs.push(5);
														}
														if(dayOffsNames.indexOf("Saturday")!=-1){
															repeatableActivity.dayOffs.push(6);
														}
													}


												}

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
									});
									
								}

							}
						}
					});		
				}else{
					if(!nonRepeatableActivity.businessOwner_id.equals(businessOwner_id)){
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


