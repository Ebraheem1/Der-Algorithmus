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

	.when('/applications/:id',{
	
		templateUrl: 'app/views/pages/application/application.html',
		controller: 'applicationCtrl'
	
	})

	.when('/applications',{
	
		templateUrl: 'app/views/pages/application/applications.html',
		controller: 'applicationsCtrl'
	
	})

	.when('/apply',{
	
		templateUrl: 'app/views/pages/application/applicationForm.html',
		controller: 'applicationFormCtrl',
		As: 'applicationForm'
	
	})

	.when('/business/update-info',{
	
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