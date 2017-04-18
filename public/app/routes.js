//the frontend routes is an angular module, the config contains the directing
var app = angular.module('appRoutes', ['ngRoute'])


	.config(function ($routeProvider, $locationProvider) {

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
				loggedIn: false
			})

			.when('/review/review/:id', {
				templateUrl: 'app/views/pages/review/review.html',
				controller: 'reviewCtrl',
				controllerAs: 'review',
				loggedIn: true
			})

			.when('/public/client/review/view/:businessownerID', {
				templateUrl: 'app/views/pages/review/clientViewReviews.html',
				controller: 'reviewCtrl',
				controllerAs: 'review',
				loggedIn: false
			})

			.when('/public/client/rate/:businessownerID', {
				templateUrl: 'app/views/pages/client/rateBusiness.html',
				controller: 'ratingCtrl',
				controllerAs: 'rating',
				loggedIn: false
			})

			.when('/public/admin/viewBusinesses', {
				templateUrl: 'app/views/pages/admin/adminViewBusiness.html',
				controller: 'adminBusinessCtrl',
				controllerAs: 'adminBusiness',
				loggedIn: false
			})

			.when('/activity/activity/:id', {
				templateUrl: 'app/views/pages/activity/activity.html',
				controller: 'activityCtrl',
				controllerAs: 'activity',
				loggedIn: true
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

app.run(['$rootScope', 'Authentication', '$location', function ($rootScope, Authentication, $location) {
	$rootScope.$on('$routeChangeStart', function (event, next, current) {
		if (next.$$route.loggedIn != undefined) {
			if (next.$$route.loggedIn == true) {
				console.log('User should be logged in.');
				if (!Authentication.isLoggedIn()) {
					event.preventDefault();
					$location.path('/');
				}
			} else {
				if (next.$$route.loggedIn == false) {
					console.log('User should not be logged in.');
					if (Authentication.isLoggedIn()) {
						event.preventDefault();
						$location.path('/');
					}
				}
			}
		}
	});
}]);