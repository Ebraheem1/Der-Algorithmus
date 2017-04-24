angular.module('businessActivitiesServices',[])


.factory('BusinessActivities',function($http){

	businessActivitiesFactory = {};

	// Calls the appropriate backend function responsible for returning all the acitivities of the logged In business Owner
	businessActivitiesFactory.getActivities = function(){
		
		return $http.get('/api/viewBusinessActivities');
	};
	
	// Calls the appropriate backend function responsible for adding a new activity to the logged In business Owner
	businessActivitiesFactory.create=function(activityData){

		return $http.post('/api/addActivity',activityData);

	};

	// Calls the appropriate backend function responsible for deleting a non-repeatable activity (Trip, Safari)
	businessActivitiesFactory.deleteNonRepeatableActivity=function(activityId){

		return $http.get('/api/deleteNonRepeatableActivity/'+activityId);
	};

	// Calls the appropriate backend function responsible for deleting a repeatable activity (Room-esacping, BattleField, Paintball fighting, Playground)
	businessActivitiesFactory.deleteRepeatableActivity=function(activityId){

		return $http.get('/api/deleteRepeatableActivity/'+activityId);
	};




	return businessActivitiesFactory;
});
