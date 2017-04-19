


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
	app.username = AuthenticationToken.getUsername();

	//This function does the login logic in the front-end
	//It first calls the authServices to call the backend to check
	//the entered credentials, then it sets some of the returned results
	//in the window localStorage to be used later in the interface of the website
	//The information saved in the localStorage are not very critical to be more
	//secure they are only the token, the username and the type.
	app.doLogin = function(loginData){
		
		app.errMsg = false;
		
		Authentication.loginUser(app.loginData).then(function(data){
			AuthenticationToken.setToken(data.data.token);
			AuthenticationToken.setUsername(data.data.username);
			if(data.data.success){
				AuthenticationToken.setType(data.data.type);
				
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
	//This function also calls the authServices to make the logout logic in
	//both front-end and backend.
	app.doLogout = function(){
		Authentication.logoutUser();
		$location.path('/');
		location.reload();
	};
	//This function checks whether the user has entered a nonempty search keyword
	//then it redirects the user to the page that contains the page results of
	//his/her search keyword.
	app.searchVenues = function(searchData)
	{
		
		if(!app.searchData)
		{
			$location.path('/');
		}
		else{
			$location.path('/search/search/'+app.searchData.keyword);
			app.searchData={};
		}

	};
	//This function only redirects the user to the page that handles
	//forget password issue.
	app.forgetPassword = function(){
		$location.path('/');
	}


});