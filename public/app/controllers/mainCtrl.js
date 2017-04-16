//the main controller is responsible for logged-in users, so it will be in the index page, not the routes
angular.module('mainController', ['authServices','businessOwnerServices'])

.controller('mainCtrl', function(Authentication, AuthenticationToken,$location, $rootScope,BusinessOwner){

	var app = this;
	
	app.dataReady = false;
	// AuthenticationToken.setToken();
	// AuthenticationToken.setType();
	app.isClient = Authentication.isClient();
	app.isBusinessOwner = Authentication.isBusinessOwner();
	app.isAdmin = Authentication.isAdmin();
	app.isLoggedIn= Authentication.isLoggedIn();
	app.doLogin = function(loginData){
		app.successMsg = false;
		app.errMsg = false;
		
		Authentication.loginUser(app.loginData).then(function(data){
			AuthenticationToken.setToken(data.data.token);
			if(data.data.success){
				AuthenticationToken.setType(data.data.type);
				app.successMsg = data.data.message;
				if(data.data.type == 1){
					$location.path('/');
					location.reload();
				}
				app.loginData = {};
			}
			else{
				app.errMsg = data.data.message;
			}
		});
	};

	app.doLogout = function(){
		Authentication.logoutUser();
		$location.path('/');
		location.reload();
	};

	app.searchVenues = function(searchData)
	{
		
		if(!app.searchData)
		{
			$location.path('/');
		}
		else{
			BusinessOwner.search(app.searchData.keyword);
			$location.path('/search/search/'+app.searchData.keyword);
			app.searchData={};
		}

	}


});