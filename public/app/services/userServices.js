angular.module('userServices',[])


.factory('User',function($http){

	userFactory = {};

	userFactory.createUser = function(regData){
		return $http.post('/register', regData);
	};

	userFactory.updateInfo=function(updateData){
		return $http.post('/update-Info',updateData);
	};

	userFactory.updateUsername=function(username){
		return $http.post('/change-username',username);
	};
	userFactory.updatePassword=function(passwords){
		return $http.post('/security/change-password',passwords);
	};
	return userFactory;
});
