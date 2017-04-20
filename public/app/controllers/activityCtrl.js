angular.module('activityController', ['authServices', 'activityServices', 'fileModelDirective', 'fileUploadService'])


.controller('activityCtrl', function(Activity, Authentication, $scope, $routeParams, $timeout, fileUpload){

	var app = this;
	app.activityData = {};
	app.activityExists = false;

	Authentication.getUser().then(function(data){
		app.activityData.user_id = data.data.user_id;
	});


	Activity.getActivity($routeParams.id).then(function(data){
		if(data.data.success){
			var travelingDateNotAvailable = data.data.activity.travelingDate==null||data.data.activity.travelingDate=='';
			var returnDateNotAvailable = data.data.activity.returnDate==null||data.data.activity.returnDate=='';

			//common attributes between RepeatableActivity and NonRepeatableActivity
			app.activityData.activity_id = data.data.activity._id;
			app.activityData.image = data.data.activity.image;
			app.activityData.description = data.data.activity.description;
			app.activityData.cancellationWindow = data.data.activity.cancellationWindow;

			//NonRepeatableActivity attributes 

			app.activityData.travelingDate = (travelingDateNotAvailable)? new Date(data.data.activity.travelingDate) : new Date(data.data.activity.travelingDate.substring(0, 10));
			app.activityData.returnDate = (returnDateNotAvailable)? new Date(data.data.activity.returnDate) : new Date(data.data.activity.returnDate.substring(0, 10));
			app.activityData.destination = data.data.activity.destination;
			app.activityData.Accommodation = data.data.activity.Accommodation;
			app.activityData.transportation = data.data.activity.transportation;
			app.activityData.maxParticipants = data.data.activity.maxParticipants;
			app.activityData.pricePerPerson = data.data.activity.pricePerPerson;

			//RepeatableActivity attributes

			app.activityData.theme = data.data.activity.theme;
			app.activityData.pricePackages = data.data.activity.pricePackages;
			app.activityData.slots = data.data.activity.slots;
			app.activityData.dayOffs = data.data.activity.dayOffs;
			app.activityExists = true;
		}
		else{
			app.errMsg = data.data.message;
			app.activityExists = false;
		}
	});



	app.editActivity = function(activityData){
		app.successMsg = false;
		app.errMsg = false;
		app.loading = true;

		Activity.editActivity($routeParams.id, app.activityData).then(function(data){
			if(data.data.success){
				app.successMsg = data.data.message;
				app.loading = false;
			}
			else{
				app.errMsg = data.data.message;
				app.loading = false;
			}
		});
	};

	app.addSlot = function(startTime, endTime){
		app.slotSuccessMsg = false;
		app.slotErrMsg = false;
		app.slotLoading = true;
		var slotData = {};
		slotData.startTime = startTime;
		slotData.endTime = endTime;

		Activity.addTimeSlot($routeParams.id,slotData).then(function(data){
			if(data.data.success){
				app.slotSuccessMsg = data.data.message;
				app.slotLoading = false;
				app.activityData.slots = data.data.slots;
			}
			else{
				app.slotErrMsg = data.data.message;
				app.slotLoading = false;
			}
		});
	};

	app.deleteSlot = function(activity_id, slot_id){
		app.slotSuccessMsg = false;
		app.slotErrMsg = false;
		app.slotLoading = true;
		var slotData = {};
		slotData.activity_id = activity_id;
		slotData.slot_id = slot_id;


		Activity.deleteTimeSlot(slotData).then(function(data){
			if(data.data.success){
				app.slotSuccessMsg = data.data.message;
				app.slotLoading = false;
				app.activityData.slots = data.data.slots;
			}
			else{
				app.slotErrMsg = data.data.message;
				app.slotLoading = false;
			}
		});
	};

	app.addPackage = function(participants, price){
		app.packageSuccessMsg = false;
		app.packageErrMsg = false;
		app.packageLoading = true;
		var packageData = {};
		packageData.participants = participants;
		packageData.price = price;

		if(isNaN(participants) || isNaN(price)){
    		app.packageErrMsg = 'Participants and Price should be numbers!'
			app.packageLoading = false;
			return;
		}

		Activity.addPricePackage($routeParams.id,packageData).then(function(data){
			if(data.data.success){
				app.packageSuccessMsg = data.data.message;
				app.packageLoading = false;
				app.activityData.pricePackages = data.data.packages;
			}
			else{
				app.packageErrMsg = data.data.message;
				app.packageLoading = false;
			}
		});
	};

	app.deletePackage = function(activity_id, package_id){
		app.packageSuccessMsg = false;
		app.packageErrMsg = false;
		app.packageLoading = true;
		var packageData = {};
		packageData.activity_id = activity_id;
		packageData.package_id = package_id;

		Activity.deletePricePackage(packageData).then(function(data){
			if(data.data.success){
				app.packageSuccessMsg = data.data.message;
				app.packageLoading = false;
				app.activityData.pricePackages = data.data.packages;
			}
			else{
				app.packageErrMsg = data.data.message;
				app.packageLoading = false;
			}
		});
	};

	$scope.file = {};
    $scope.message = false;
    $scope.alert = '';

    $scope.Submit = function(activity_id) {
        $scope.uploading = true;
        fileUpload.upload($scope.file).then(function(data) {
            if (data.data.success) {
                $scope.file = {};
                var imageData = {};
                imageData.activity_id = activity_id
                imageData.image = 'gallery/'+data.data.name;
                Activity.changeActivityImage(imageData).then(function(data){
	                if(data.data.success){
	                	$scope.alert = 'alert alert-success fade in alert-dismissable';
						$scope.message = data.data.message;
						$scope.uploading = false;
						app.activityData.image = imageData.image;
					}
					else{
						$scope.uploading = false;
                		$scope.alert = 'alert alert-danger fade in alert-dismissable';
                		$scope.message = data.data.message;
                		$scope.file = {};
					}
                });
            } else {
                $scope.uploading = false;
                $scope.alert = 'alert alert-danger';
                $scope.message = data.data.message;
                $scope.file = {};
            }
        });
    };

});