angular.module('activityController', ['authServices', 'activityServices'])


.controller('activityCtrl', function(Activity, Authentication, $scope, $routeParams){

	var app = this;
	app.activityData = {};
	app.activityExists = false;

	Authentication.getUser().then(function(data){
		app.activityData.user_id = data.data.user_id;
		console.log(data.data.user_id);
	});


	Activity.getActivity($routeParams.id).then(function(data){
		if(data.data.success){
			$scope.price = data.data.activity.price;
			$scope.description = data.data.activity.description;
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

});