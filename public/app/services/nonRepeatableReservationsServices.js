angular.module('nonRepeatableReservationsServices',[])


.factory('NonRepeatableReservations',function($http){

	nonRepeatableReservationsFactory = {};

	// Calls the appropriate backend function responsible for returning all the reservations of a non-repeatable 
	// activity (Trip, Safari)
	nonRepeatableReservationsFactory.get = function(activityId){
		
		return $http.get('/api/viewNonRepeatableReservations/'+activityId);
	};

	return nonRepeatableReservationsFactory;
});
