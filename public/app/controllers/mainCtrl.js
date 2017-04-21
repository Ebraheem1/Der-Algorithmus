


//the main controller is responsible for logged-in users, so it will be in the index page, not the routes
var app = angular.module('mainController', ['authServices','businessOwnerServices'])

.controller('mainCtrl', function(Authentication, AuthenticationToken,$location, $rootScope,BusinessOwner, $timeout){

	var app = this;

	app.dataReady = false;
	//AuthenticationToken.setToken();
	//AuthenticationToken.setType();
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

			if(data.data.success){
				AuthenticationToken.setType(data.data.type);
				AuthenticationToken.setToken(data.data.token);
				AuthenticationToken.setUsername(data.data.username);
				AuthenticationToken.setId(data.data.id);
				if(data.data.type == 1){
					$location.path('/');
					location.reload();
				}
				else if(data.data.type == 2){
					$location.path('/reviews');
					location.reload();
				}
				else if(data.data.type == 0){
					console.log(data.data.type);
					$location.path('/applications');
					$timeout(function() {
						location.reload();
					}, 150);
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
		Authentication.logoutUser().then(function(data){
			if(data.data.success)
			{
				$location.path('/');
				location.reload();
			}else{
				location.reload();
			}
			AuthenticationToken.setToken();
			AuthenticationToken.setType();
			AuthenticationToken.setUsername();
			AuthenticationToken.setId();
		},function(err)
		{	console.log(err.data);
			if(err.data){
				Authentication.handleError();
			}
		});

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

//to prevent logged in user from going to register or login pages
app.run(['$rootScope', 'Authentication','$location', function($rootScope, Authentication, $location){

	$rootScope.$on('$routeChangeStart', function(event, next, current){
		if (next.$$route !== undefined) {
			if(next.$$route.clientAuthenticated == true){
				if(!Authentication.isClient()){
					event.preventDefault();
					$location.path('/loginPage');
				}
			}
			else if (next.$$route.businessAuthenticated == true)
			{
				if(!Authentication.isBusinessOwner()){
					event.preventDefault();
					$location.path('/loginPage');
				}
			}
			else if(next.$$route.adminAuthenticated == true)
			{
				if(!Authentication.isAdmin()){
					event.preventDefault();
					$location.path('/loginPage');
				}
			}
			else if(next.$$route.authenticated == false){
				if(Authentication.isLoggedIn()){
					event.preventDefault();
					$location.path('/');
				}
			}
		}
	});

}]);
