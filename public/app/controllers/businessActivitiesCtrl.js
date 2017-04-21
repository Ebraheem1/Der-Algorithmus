angular.module('businessActivitiesController',['businessActivitiesServices','authServices'])

.controller('businessActivitiesCtrl',function($location,$scope,BusinessActivities,Authentication){

	$scope.loading=true;
	$scope.errorMsg=false;
	$scope.successMsg=false;
	$scope.deletingErrorMsg=false;
	$scope.nonRepeatableActivities={};
	$scope.repeatableActivities={};

	BusinessActivities.getActivities().then(function(data){

		if(data.data.success){

			$scope.nonRepeatableActivities=data.data.nonRepeatableActivities;
			$scope.repeatableActivities=data.data.repeatableActivities;
			$scope.loading=false;

		}
		else{

			$scope.nonRepeatableActivities=data.data.nonRepeatableActivities;
			$scope.repeatableActivities=data.data.repeatableActivities;
			$scope.errorMsg=data.data.message;
			$scope.loading=false;
		}

	},function(err)
		{	
			if(err.data){
				Authentication.handleError();
			}
		});

	$scope.activityForm = function() {

		var type=$scope.type;
		if(type=='Room-Escaping' || type=='Paintball Fight' || type=='Battlefield' || type=='Playground'){

			$location.path('/repeatableActivityForm/'+type);
		}
		else if(type=='Trip' || type=='Safari'){

			$location.path('/nonRepeatableActivityForm/'+type);
		}

	};

	$scope.deleteNonRepeatableActivity=function(activityId){

		$scope.loading=true;
		$scope.successMsg=false;
		$scope.errorMsg=false;
		$scope.deletingErrorMsg=false;
		

		BusinessActivities.deleteNonRepeatableActivity(activityId).then(function(data){
			
			if(data.data.success){
				
				$scope.deletingErrorMsg=false;
				$scope.successMsg='Activity has been deleted successfully !';
				$scope.loading=false;
				$scope.nonRepeatableActivities=data.data.nonRepeatableActivities;
				$scope.repeatableActivities=data.data.repeatableActivities;

			}
			else{

				$scope.deletingErrorMsg=data.data.message;
				$scope.loading=false;
				$scope.nonRepeatableActivities=data.data.nonRepeatableActivities;
				$scope.repeatableActivities=data.data.repeatableActivities;

			}

		},function(err)
		{	
			if(err.data){
				Authentication.handleError();
			}
		});

	};

	$scope.deleteRepeatableActivity=function(activityId){

		$scope.loading=true;
		$scope.successMsg=false;
		$scope.errorMsg=false;
		$scope.deletingErrorMsg=false;

		BusinessActivities.deleteRepeatableActivity(activityId).then(function(data){

			if(data.data.success){

				$scope.nonRepeatableActivities=data.data.nonRepeatableActivities;
				$scope.repeatableActivities=data.data.repeatableActivities;
				$scope.deletingErrorMsg=false;
				$scope.successMsg='Activity has been deleted successfully !';
				$scope.loading=false;

			}
			else{

				$scope.nonRepeatableActivities=data.data.nonRepeatableActivities;
				$scope.repeatableActivities=data.data.repeatableActivities;
				$scope.deletingErrorMsg=data.data.message;
				$scope.loading=false;
			}

		},function(err)
		{	
			if(err.data){
				Authentication.handleError();
			}
		});

	};

	$scope.viewNonRepeatableReservations = function(activityId) {

		$location.path('/viewNonRepeatableReservations/'+activityId);

	};

	$scope.viewRepeatableReservations = function(activityId) {

		$location.path('/viewRepeatableReservations/'+activityId);

	};	

	$scope.editNonRep = function(activityId) {

		$location.path('/activity/nonRepeatableActivityDetails/'+activityId);

	};

	$scope.editRep = function(activityId) {

		$location.path('/activity/repeatableActivityDetails/'+activityId);

	};	


});