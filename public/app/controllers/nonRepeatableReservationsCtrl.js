angular.module('nonRepeatableReservationsController',['nonRepeatableReservationsServices', 'authServices'])

.controller('nonRepeatableReservationsCtrl',function($scope, $route, $routeParams,NonRepeatableReservations,Authentication){

	$scope.currentPage=1;
	$scope.pageSize=10;
	
	$scope.loading=true
	$scope.errorMsg=false;

	NonRepeatableReservations.get($routeParams.activityId).then(function(data){

		if(data.data.success){

			$scope.reservations=data.data.reservations;
			$scope.loading=false;
		}
		else{

			$scope.errorMsg=data.data.message;
			$scope.loading=false;
		}


	},function(err)
	    { 
	      if(err.data){
	        Authentication.handleError();
	      }
	    }
	);

})

.filter('startFrom', function(){
	return function(data, start){
		if(data!=null){
			return data.slice(start);
		}		
	}
});