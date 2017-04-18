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

	.when('/review/newReview', {
		templateUrl: 'app/views/pages/review/newReview.html',
		controller: 'reviewCtrl',
		controllerAs: 'review',
		loggedIn: true
	})

	.when('/review/review/:id',{
		templateUrl: 'app/views/pages/review/review.html',
		controller: 'reviewCtrl',
		controllerAs: 'review',
		loggedIn: true
	})

	.when('/activity/nonRepeatableActivityDetails/:id',{
		templateUrl: 'app/views/pages/activity/nonRepeatableActivityDetails.html',
		controller: 'activityCtrl',
		controllerAs: 'activity',
		loggedIn: true
	})

	.when('/activity/repeatableActivityDetails/:id',{
		templateUrl: 'app/views/pages/activity/repeatableActivityDetails.html',
		controller: 'activityCtrl',
		controllerAs: 'activity',
		loggedIn: true
	})

	.when('/error404',{
		templateUrl: 'app/views/pages/error404.html',
		controller: 'activityCtrl',
		controllerAs: 'activity',
		loggedIn: true
	})
	
	.otherwise({
		redirectTo: '/error404'
	})


	// to remove the hash
	$locationProvider.html5Mode({
        enabled: true,
        requiredBase: false
    });


});

app.run(['$rootScope', 'Authentication', '$location',function($rootScope, Authentication, $location){
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
}]);