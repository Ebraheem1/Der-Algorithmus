angular.module('activityServices',[])

.factory('Activity',function($http){

	activityFactory = {};

	activityFactory.editActivity = function(id, activityData){
		return $http.post('/api/activity/editActivity/'+id, activityData);
	}

	activityFactory.changeActivityImage = function(activityData){
		return $http.post('/api/activity/changeActivityImage', activityData);
	}

	activityFactory.getActivity = function(id){
		return $http.get('/api/activity/getActivity/'+id);
	}

	activityFactory.addTimeSlot = function(id, activityData){
		return $http.post('/api/activity/addRepeatableActivitySlot/'+id, activityData);
	}

	activityFactory.deleteTimeSlot = function(activityData){
		return $http.post('/api/activity/deleteRepeatableActivitySlot', activityData);
	}

	activityFactory.addPricePackage = function(id, activityData){
		return $http.post('/api/activity/addRepeatableActivityPricePackage/'+id, activityData);
	}

	activityFactory.deletePricePackage = function(activityData){;
		return $http.post('/api/activity/deleteRepeatableActivityPricePackage', activityData);
	}

	return activityFactory;

});
