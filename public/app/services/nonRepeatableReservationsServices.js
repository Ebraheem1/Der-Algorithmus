angular.module('nonRepeatableReservationsServices',[])


.factory('NonRepeatableReservations',function($http){

	nonRepeatableReservationsFactory = {};

	nonRepeatableReservationsFactory.get = function(activityId){
		
		return $http.get('/api/viewNonRepeatableReservations/'+activityId);
	};

	return nonRepeatableReservationsFactory;
});