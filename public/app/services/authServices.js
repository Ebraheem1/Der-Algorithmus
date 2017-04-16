angular.module('authServices', [])

.factory('Authentication',function($http, AuthenticationToken, $q){

	authFactory = {};

	authFactory.loginUser=function(loginData){
		return $http.post('/login', loginData);
	};

	authFactory.isLoggedIn = function(){
		if(AuthenticationToken.getToken()){
			
			return true;
		}
		else{
			return false;
		}
	};
	authFactory.isAdmin = function(){
		if(AuthenticationToken.getType() == 0){
			return true;
		}
		else{
			return false;
		}
	};
	authFactory.isClient = function(){
		if(AuthenticationToken.getType() == 1){
			return true;
		}
		else{
			return false;
		}
	};
	authFactory.isBusinessOwner = function(){
		if(AuthenticationToken.getType() == 2){
			return true;
		}
		else{
			return false;
		}
	};

	authFactory.logoutUser = function(){
		AuthenticationToken.setToken();
		AuthenticationToken.setType();
		return $http.get('/logout');
	};

	return authFactory;
})


.factory('AuthenticationToken', function($window){

	var authTokenFactory = {};

	authTokenFactory.setToken = function(token)	{
		if(token){
			$window.localStorage.setItem('token', token);

		}
		else{
			$window.localStorage.removeItem('token');
		}
		
	};

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

	authTokenFactory.getType = function(){
		return $window.localStorage.getItem('type');
	}
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
			config.headers['x-access-token'] = token;
		}

		return config;
	};

	return authInterceptorsFactory;
});