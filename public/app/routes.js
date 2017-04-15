//the frontend routes is an angular module, the config contains the directing
angular.module('appRoutes', ['ngRoute'])


.config(function($routeProvider, $locationProvider){

	$routeProvider

	.when('/', {
		templateUrl: 'app/views/pages/home.html'
	})

	.when('/register', {
		templateUrl: 'app/views/pages/users/register.html',
		controller: 'regCtrl',
		controllerAs: 'register'
	})

	.when('/login', {
		templateUrl: 'app/views/pages/users/login.html',
	})

	.when('/review', {
		templateUrl: 'app/views/pages/users/review.html',
		controller: 'reviewCtrl',
		controllerAs: 'review'
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