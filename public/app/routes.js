

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
	  controllerAs:'register',
	  authenticated:false
	})
	.when('/updateInfo',{
	  templateUrl:'app/views/pages/UpdateInfo.html',
	  controller:'updateCtrl',
	  controllerAs:'update',
	  clientAuthenticated:true
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
	.when('/security/admin/derAlgorithmus',{
		templateUrl: 'app/views/pages/admin.html',
		controller: 'adminCtrl',
		controllerAs: 'admin',
		authenticated: false
	})
	 .when('/reserve/1/:activity_id',{
       templateUrl: 'app/views/pages/reservationPageNR.html',
       controller: "resCtrlNR",
       controllerAs:"resCtrl" ,
	   clientAuthenticated:true
    })
    .when('/reserve/0/:activity_id',{
       templateUrl: 'app/views/pages/reservationPageR.html',
       controller: "resCtrlR",
       controllerAs:"resCtrl",
	   clientAuthenticated:true
    })
    .when('/profile/reservations/',{
      templateUrl:'app/views/pages/yourReservations.html',
      controller:"yourReservations",
      controllerAs: "yrCtrl",
	  clientAuthenticated:true
    })

    .when('/login/forgotPassword',{
      templateUrl:'app/views/pages/forgotPasswordPage.html',
      controller:"passwordController",
      controllerAs:"Ctrl",
   	  authenticated:false
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

	.when('/gallery/gallery',{
		templateUrl:'app/views/pages/gallery.html',
		controller: 'businessCtrl',
		controllerAs : 'business',
		businessAuthenticated:true
	})

	.when('/review/newReview/:businessOwnerID', {
		templateUrl: 'app/views/pages/review/newReview.html',
		controller: 'reviewCtrl',
		controllerAs: 'review',
		clientAuthenticated: true
	})

	.when('/review/review/:reviewID',{
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

	.when('/viewBusinessActivities', {		
		templateUrl: 'app/views/pages/businessActivities.html',
		controller: 'businessActivitiesCtrl',
		controllerAs: 'businessActivities',
		businessAuthenticated:true
	})

	.when('/repeatableActivityForm/:activityType', {	
		templateUrl: 'app/views/pages/repeatableActivityForm.html',
		controller: 'repeatableActivityFormCtrl',
		businessAuthenticated:true
	})

	.when('/nonRepeatableActivityForm/:activityType', {	
		templateUrl: 'app/views/pages/nonRepeatableActivityForm.html',
		controller: 'nonRepeatableActivityFormCtrl',
		businessAuthenticated:true

	})

	.when('/viewNonRepeatableReservations/:activityId', {

		templateUrl: 'app/views/pages/nonRepeatableReservations.html',
		controller: 'nonRepeatableReservationsCtrl',
		businessAuthenticated:true

	})

	.when('/viewRepeatableReservations/:activityId', {

		templateUrl: 'app/views/pages/repeatableReservations.html',
		controller: 'repeatableReservationsCtrl',
		businessAuthenticated:true

	})

	.when('/activity/repeatableActivityDetails/:id',{
		templateUrl: 'app/views/pages/activity/repeatableActivityDetails.html',
		controller: 'activityCtrl',
		controllerAs: 'activity',
		businessAuthenticated: true
	})
	 .when('/reviews',{
		templateUrl:'app/views/pages/reviews.html',
		controller: 'commentCtrl',
		controllerAs : 'comment',
		businessAuthenticated: true
	})

	  .when('/offers/:activityId',{
		templateUrl:'app/views/pages/offer.html',
		controller: 'businessCtrl',
		controllerAs : 'business'
	})

  
  .when('/public/client/review/view/:businessownerID', {
  templateUrl: 'app/views/pages/review/clientViewReviews.html',
  controller: 'viewReviewCtrl',
  controllerAs: 'review'
  })

  .when('/public/client/rate/:businessownerID', {
    templateUrl: 'app/views/pages/client/rateBusiness.html',
    controller: 'ratingCtrl',
    controllerAs: 'rating',
    clientAuthenticated: true
  })

  
  .when('/public/client/review/myReviews', {
    templateUrl: 'app/views/pages/review/myReviews.html',
    controller: 'myReviewsCtrl',
    controllerAs: 'review',
    clientAuthenticated: true
  })

  .when('/public/admin/viewBusinesses', {
    templateUrl: 'app/views/pages/admin/adminViewBusiness.html',
    controller: 'adminBusinessCtrl',
    controllerAs: 'adminBusiness',
    adminAuthenticated: true
  })

	.when('/error404',{
		templateUrl: 'app/views/pages/error404.html'
	})

	.when('/applications/:id',{
	
		templateUrl: 'app/views/pages/application/application.html',
		controller: 'applicationCtrl',
		adminAuthenticated:true
	
	})

	.when('/applications',{
	
		templateUrl: 'app/views/pages/application/applications.html',
		controller: 'applicationsCtrl',
		adminAuthenticated:true
	
	})

	.when('/apply',{
	
		templateUrl: 'app/views/pages/application/applicationForm.html',
		controller: 'applicationFormCtrl',
		As: 'applicationForm',
		authenticated:false
	
	})

	.when('/business/update-info',{
	
		templateUrl: 'app/views/pages/businessOwner/edit-info.html',
		controller: 'businessOwnerInfoCtrl',
		businessAuthenticated:true
	
	})

	.when('/business/manage-locations',{
	
		templateUrl: 'app/views/pages/businessOwner/manage-locations.html',
		controller: 'locationsCtrl',
		businessAuthenticated:true
	
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
