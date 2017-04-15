angular.module('authServices', [])

.factory('Authentication',function($http, AuthenticationToken, $q){

	authFactory = {};

	authFactory.loginUser = function(loginData){
		return $http.post('/login', loginData).then(function(data){
			AuthenticationToken.setToken(data.data.token);
			return data;
		});
	};

	authFactory.isLoggedIn = function(){
		if(AuthenticationToken.getToken()){
			return true;
		}
		else{
			return false;
		}
	}

	authFactory.getUser = function(){
		if(AuthenticationToken.getToken()){
			return $http.post('/loggedIn');
		}
		else{
			$q.reject({message:'User has no token!'});
		}
	}

	authFactory.logoutUser = function(){
		AuthenticationToken.setToken();
	}

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
	}

	//call format: AuthToken.getToken()
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