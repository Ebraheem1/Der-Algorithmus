angular.module('authServices', [])

.factory('Authentication',function($http, $location,AuthenticationToken, $q){

	authFactory = {};
	//this function calls the login function in the backe-end
	//and passes to it the required data it needs.
	authFactory.loginUser=function(loginData){
		return $http.post('/api/login', loginData);
	};
	authFactory.handleError = function(){
		AuthenticationToken.setToken();
		AuthenticationToken.setType();
		AuthenticationToken.setUsername();
		AuthenticationToken.setId();
		//$location.path('/loginPage');
		location.reload();
	};
	//This function checks whether there is a logged In user in
	//the session
	authFactory.isLoggedIn = function(){
		if(AuthenticationToken.getToken()){

			return true;
		}
		else{
			return false;
		}
	};
	//This function checks whether the loggedIn user is admin
	authFactory.isAdmin = function(){
		if(AuthenticationToken.getType() == 0){
			return true;
		}
		else{
			return false;
		}
	};
	//This function checks whether the loggedIn user is client
	authFactory.isClient = function(){
		if(AuthenticationToken.getType() == 1){
			return true;
		}
		else{
			return false;
		}
	};
	//This function checks whether the loggedIn user is businessOwner
	authFactory.isBusinessOwner = function(){
		if(AuthenticationToken.getType() == 2){
			return true;
		}
		else{
			return false;
		}
	};
	//This function sets the token, type and username which are the variables saved
	//in the window localStorage to null (remove them), then it calls
	//the functions that performs the logout actions in the back-end.
	authFactory.logoutUser = function(){
		return $http.get('/api/logout');
	};

	return authFactory;
})


.factory('AuthenticationToken', function($window){

	var authTokenFactory = {};

	

//This functions sets/remove the token in/from a variable in the windowLocalStorage
	authTokenFactory.setToken = function(token)	{
		if(token){
			$window.localStorage.setItem('token', token);
		}
		else{
			$window.localStorage.removeItem('token');
		}

	};

//This functions sets/remove the username in/from a variable in the windowLocalStorage
	authTokenFactory.setUsername = function(username){
		if(username){
			$window.localStorage.setItem('username', username);
		}
		else{
			$window.localStorage.removeItem('username');
		}
	};
//This functions sets/remove the id of the user in/from a variable in the windowLocalStorage
	authTokenFactory.setId = function(id){
		if(id){
			$window.localStorage.setItem('id', id);
		}
		else{
			$window.localStorage.removeItem('id');
		}
	};
//This functions sets/remove the type of the user in/from a variable in the windowLocalStorage
	authTokenFactory.setType = function(type){
		if(type==0)
		{
			$window.localStorage.setItem('type', type);

			
		}else if(type == 1){
			
			$window.localStorage.setItem('type', type);
			
		}else if(type==2)
		{
			$window.localStorage.setItem('type', type);
			
		}else{
			$window.localStorage.removeItem('type');
			
		}
		

	};

//This function gets the Username item stored in the window LocalStorage
	authTokenFactory.getUsername = function(){
		return $window.localStorage.getItem('username');
	};
//This function gets the Username item stored in the window LocalStorage
	authTokenFactory.getId = function(){
		return $window.localStorage.getItem('id');
	};

//This function gets the Type item stored in the window LocalStorage
	authTokenFactory.getType = function(){
		return $window.localStorage.getItem('type');
	};
//This function gets the Token item stored in the window LocalStorage
	authTokenFactory.getToken = function(){
		return $window.localStorage.getItem('token');
	};


	return authTokenFactory;
})


.factory('AuthInterceptors', function(AuthenticationToken){
	var authInterceptorsFactory = {};

	authInterceptorsFactory.request = function(config){
		var token = AuthenticationToken.getToken();

		if(token){
			config.headers['Authorization'] = token;
		}

		return config;
	};

	return authInterceptorsFactory;

});

