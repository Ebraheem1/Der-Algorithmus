angular.module('repeatableReservationsServices',[])


.factory('RepeatableReservations',function($http){

	repeatableReservationsFactory = {};

	// Calls the appropriate backend function responsible for returning all the reservations of a repeatable 
	// activity (Room-escaping, Paintball fight, Battlefield, Playground)
	repeatableReservationsFactory.get = function(activityId){
		
		return $http.get('/api/viewRepeatableReservations/'+activityId);
	};

	return repeatableReservationsFactory;
});
