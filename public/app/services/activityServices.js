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
	
	return activityFactory;

});