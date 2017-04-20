angular.module('nonRepeatableReservationsController',['nonRepeatableReservationsServices'])

.controller('nonRepeatableReservationsCtrl',function($scope, $route, $routeParams,NonRepeatableReservations){

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


	});

})

.filter('startFrom', function(){
	return function(data, start){
		if(data!=null){
			return data.slice(start);
		}		
	}
});