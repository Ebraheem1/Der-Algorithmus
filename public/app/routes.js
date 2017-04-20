//the frontend routes is an angular module, the config contains the directing

angular.module('appRoutes', ['ngRoute'])


.config(function($routeProvider, $locationProvider){

	$routeProvider

	.when('/', {
		templateUrl: 'app/views/pages/home.html',
		controller:'mainCtrl',
		controllerAs:'main'
	})
	
	//This returns the page used for searchResults
	//and assigns the controller to it
	.when('/search/search/:keyword',{
		templateUrl:'app/views/pages/search.html',
		controller: 'searchCtrl',
		controllerAs: 'search'
	})
	//This returns the page used for login
	//and assigns the controller to it
	.when('/loginPage',{
		templateUrl:'app/views/pages/clientorbusinesslogin.html',
		controller: 'mainCtrl',
		controllerAs: 'main',
		authenticated: false
	})

	.when('/review/newReview', {
		templateUrl: 'app/views/pages/review/newReview.html',
		controller: 'reviewCtrl',
		controllerAs: 'review',
		clientAuthenticated: true
	})

	.when('/review/review/:id',{
		templateUrl: 'app/views/pages/review/review.html',
		controller: 'reviewCtrl',
		controllerAs: 'review',
		clientAuthenticated: true
	})

	.when('/activity/nonRepeatableActivityDetails/:id',{
		templateUrl: 'app/views/pages/activity/nonRepeatableActivityDetails.html',
		controller: 'activityCtrl',
		controllerAs: 'activity',
		businessAuthenticated: true
	})

	.when('/activity/repeatableActivityDetails/:id',{
		templateUrl: 'app/views/pages/activity/repeatableActivityDetails.html',
		controller: 'activityCtrl',
		controllerAs: 'activity',
		businessAuthenticated: true
	})

	.when('/error404',{
		templateUrl: 'app/views/pages/error404.html'
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

