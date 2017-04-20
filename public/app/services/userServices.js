angular.module('userServices',[])


.factory('User',function($http){

	userFactory = {};

	userFactory.createUser = function(regData){
		return $http.post('/api/register', regData);
	};

	return userFactory;
});