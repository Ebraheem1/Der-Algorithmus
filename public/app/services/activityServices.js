angular.module('activityServices',[])

.factory('Activity',function($http){

	activityFactory = {};

	activityFactory.editActivity = function(id, activityData){
		console.log('activityData: ' + activityData+', '+'id: '+id);
		return $http.post('/activity/editActivity/'+id, activityData);
	}

	activityFactory.getActivity = function(id){
		console.log('activity id: '+id);
		return $http.get('/activity/getActivity/'+id);
	}

	activityFactory.addTimeSlot = function(id, activityData){
		console.log(activityData+"yoooooo");
		return $http.post('/activity/addRepeatableActivitySlot/'+id, activityData);
	}

	activityFactory.deleteTimeSlot = function(activityData){
		return $http.post('/activity/deleteRepeatableActivitySlot', activityData);
	}

	activityFactory.addPricePackage = function(id, activityData){
		return $http.post('/activity/addRepeatableActivityPricePackage/'+id, activityData);
	}

	activityFactory.deletePricePackage = function(activityData){;
		return $http.post('/activity/deleteRepeatableActivityPricePackage', activityData);
	}

	
	return activityFactory;

});
