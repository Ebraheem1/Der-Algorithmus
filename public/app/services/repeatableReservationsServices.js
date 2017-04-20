angular.module('repeatableReservationsServices',[])


.factory('RepeatableReservations',function($http){

	repeatableReservationsFactory = {};

	repeatableReservationsFactory.get = function(activityId){
		
		return $http.get('/api/viewRepeatableReservations/'+activityId);
	};

	return repeatableReservationsFactory;
});