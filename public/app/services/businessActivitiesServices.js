angular.module('businessActivitiesServices',[])


.factory('BusinessActivities',function($http){

	businessActivitiesFactory = {};

	businessActivitiesFactory.getActivities = function(){
		
		return $http.get('/api/viewBusinessActivities');
	};

	businessActivitiesFactory.create=function(activityData){

		return $http.post('/api/addActivity',activityData);

	};

	businessActivitiesFactory.deleteNonRepeatableActivity=function(activityId){

		return $http.get('/api/deleteNonRepeatableActivity/'+activityId);
	};

	businessActivitiesFactory.deleteRepeatableActivity=function(activityId){

		return $http.get('/api/deleteRepeatableActivity/'+activityId);
	};




	return businessActivitiesFactory;
});