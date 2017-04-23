angular.module('activityServices',[])

.factory('Activity',function($http){

	activityFactory = {};
	
	//sending an HTTP request for the route responsible for editing an activity
	activityFactory.editActivity = function(id, activityData){
		return $http.post('/api/activity/editActivity/'+id, activityData);
	}
	
	//sending an HTTP request for the route responsible for changing an activity's image
	activityFactory.changeActivityImage = function(activityData){
		return $http.post('/api/activity/changeActivityImage', activityData);
	}
	
	//sending an HTTP request for the route responsible for geting an activity instance
	activityFactory.getActivity = function(id){
		return $http.get('/api/activity/getActivity/'+id);
	}
	
	//sending an HTTP request for the route responsible for adding a time slot to an activity
	activityFactory.addTimeSlot = function(id, activityData){
		return $http.post('/api/activity/addRepeatableActivitySlot/'+id, activityData);
	}
	
	//sending an HTTP request for the route responsible for deleting a time slot from an activity
	activityFactory.deleteTimeSlot = function(activityData){
		return $http.post('/api/activity/deleteRepeatableActivitySlot', activityData);
	}
	
	//sending an HTTP request for the route responsible for adding a price package to an activity
	activityFactory.addPricePackage = function(id, activityData){
		return $http.post('/api/activity/addRepeatableActivityPricePackage/'+id, activityData);
	}
	
	//sending an HTTP request for the route responsible for deleting a price package from an activity
	activityFactory.deletePricePackage = function(activityData){;
		return $http.post('/api/activity/deleteRepeatableActivityPricePackage', activityData);
	}

	return activityFactory;

});
