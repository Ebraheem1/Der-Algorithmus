
//the frontend routes is an angular module, the config contains the directing
angular.module('appRoutes', ['ngRoute'])


.config(function($routeProvider, $locationProvider){

	$routeProvider

	.when('/', {
		templateUrl: 'app/views/pages/home.html',
		controller:'mainCtrl',
		controllerAs:'main'
	})
  .when('/businessOwnerHP',{
  templateUrl: 'app/views/pages/BusinessOwnerHomePage.html'
})

.when('/register',{
  templateUrl:'app/views/pages/RegisterationPage.html',
  controller:'regCtrl',
  controllerAs:'register'
})
.when('/updateInfo',{
  templateUrl:'app/views/pages/UpdateInfo.html',
  controller:'updateCtrl',
  controllerAs:'update'
})
.when('/viewSummaries',{
  templateUrl:'app/views/pages/BOsummaries.html',
  controller:'viewCtrl',
  controllerAs:'view'
})
.when('/viewDetailed/:id',{
  templateUrl:'app/views/pages/detailedBO.html',
  controller:'viewDetailedCtrl',
  controllerAs:'viewDetailed'
})
.when('/viewDetailedActivities/:id',{
  templateUrl:'app/views/pages/activities.html',
  controller:'viewDetailedCtrl',
  controllerAs:'viewDetailed'
})
.when('/BOhomepage',{
  templateUrl:'app/views/pages/BusinessOwnerHomePage.html',
  controller:'ViewBOhomepageCtrl',
  controllerAs:'ViewBOhomepage'
})
.when('/viewDetailedActivity/:id',{
  templateUrl:'app/views/pages/DetailedActivity.html',
  controller:'viewActivityCtrl',
  controllerAs:'viewActivity'
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
  
  .when('/public/client/review/view/:businessownerID', {
  templateUrl: 'app/views/pages/review/clientViewReviews.html',
  controller: 'viewReviewCtrl',
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
