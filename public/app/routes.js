//the frontend routes is an angular module, the config contains the directing
var app = angular.module('appRoutes', ['ngRoute'])


.config(function($routeProvider, $locationProvider){

	$routeProvider

	.when('/', {

		templateUrl: 'app/views/pages/home.html'
	
	})

	.when('/register', {
	
		templateUrl: 'app/views/pages/users/register.html',
		controller: 'regCtrl',
		controllerAs: 'register',
		loggedIn: false
	
	})

	.when('/login', {

		templateUrl: 'app/views/pages/users/login.html',
		loggedIn: false
	
	})

	.when('/application/applications/:id',{
	
		templateUrl: 'app/views/pages/application/application.html',
		controller: 'applicationCtrl'
	
	})

	.when('/application/applications',{
	
		templateUrl: 'app/views/pages/application/applications.html',
		controller: 'applicationsCtrl'
	
	})

	.when('/apply',{
	
		templateUrl: 'app/views/pages/application/applicationForm.html',
		controller: 'applicationFormCtrl',
		As: 'applicationForm'
	
	})

	.when('/business/:id/update-info',{
	
		templateUrl: 'app/views/pages/businessOwner/edit-info.html',
		controller: 'businessOwnerInfoCtrl'
	
	})

	.when('/business/:id/manage-locations',{
	
		templateUrl: 'app/views/pages/businessOwner/manage-locations.html',
		controller: 'locationsCtrl'
	
	})

	.otherwise({
		redirectTo: '/'
	})


	// to remove the hash
	$locationProvider.html5Mode({
        enabled: true,
        requiredBase: false
    });


});

/*app.run(['$rootScope', 'Authentication', '$location',function($rootScope, Authentication, $location){
	$rootScope.$on('$routeChangeStart', function(event, next, current){
		if(next.$$route.loggedIn!=undefined){
			if(next.$$route.loggedIn==true){
				console.log('User should be logged in.');
				if(!Authentication.isLoggedIn()){
					event.preventDefault();
					$location.path('/');
				}
			}
			else{
				if(next.$$route.loggedIn==false){
					console.log('User should not be logged in.');
					if(Authentication.isLoggedIn()){
						event.preventDefault();
						$location.path('/');
					}
				}
			}
		}
	});
}]);*/