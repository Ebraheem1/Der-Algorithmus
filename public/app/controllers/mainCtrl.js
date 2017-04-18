//the main controller is responsible for logged-in users, so it will be in the index page, not the routes
angular.module('mainController', ['authServices'])

.controller('mainCtrl', function(Authentication, $location, $rootScope){

	var app = this;

	app.dataReady = false;
	//to be done everytime the url changes
	$rootScope.$on('$routeChangeStart', function(){
		if(Authentication.isLoggedIn()){
			Authentication.getUser().then(function(data){
				app.username = data.data.username;
				app.user_id = data.data.user_id;
				console.log(data);
				app.isLoggedIn = true;
				app.dataReady = true;
			});
		}
		else{
			app.username = '';
			app.isLoggedIn = false;
			app.dataReady = true;
		}

	});

	app.doLogin = function(loginData){
		app.successMsg = false;
		app.errMsg = false;
		app.loading = true;
		
		Authentication.loginUser(app.loginData).then(function(data){
			
			if(data.data.success){
				app.successMsg = data.data.message+' Redirecting to your profile...';
				app.loading = false;
				$location.path('/');
				app.loginData = {};
				app.successMsg = false;
			}
			else{
				app.errMsg = data.data.message;
				app.loading = false;
			}
		});
	};

	app.doLogout = function(){
		Authentication.logoutUser();
		$location.path('/');
		location.reload();
	}

});