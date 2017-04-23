angular.module('userServices',[])


.factory('User',function($http){

	userFactory = {};
	userFactory.createUser = function(regData){
	// this service is responsible for send the registeration data of the user to the backend to the function responsible of 
		// creating the new user
		return $http.post('/api/register', regData);
	};

	userFactory.updateInfo=function(updateData){
		// this service is responsible for updating information of the logged in user it takes and forwards the updating 
		// data to the function responsible on updating the logged in user
		return $http.post('/api/update-Info',updateData);
	};

	userFactory.updateUsername=function(username){
		// this service is responsible for updating the username of the logged in user it takes the new username and 
		// forwards it to the backend function responsible for updating the username
		return $http.post('/api/change-username',username);
	};
	userFactory.updatePassword=function(passwords){
		// this service is responsible for updating the password of the logged in user it takes the old password,new password and the confirmation of the new password
		// and forwards it to the backend function responsible for updating the user's password
		return $http.post('/api/security/change-password',passwords);
	};
	return userFactory;
});
