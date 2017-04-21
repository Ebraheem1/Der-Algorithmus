angular.module('userServices',[])


.factory('User',function($http){

	userFactory = {};

	userFactory.createUser = function(regData){

		return $http.post('/api/register', regData);
	};

	userFactory.updateInfo=function(updateData){
		return $http.post('/api/update-Info',updateData);
	};

	userFactory.updateUsername=function(username){
		return $http.post('/api/change-username',username);
	};
	userFactory.updatePassword=function(passwords){
		return $http.post('/api/security/change-password',passwords);
	};
	return userFactory;
});
