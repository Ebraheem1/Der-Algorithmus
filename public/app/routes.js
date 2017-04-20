angular.module('appRoutes', ['ngRoute'])


.config(function($routeProvider, $locationProvider){

	$routeProvider
	.when('/', {
		templateUrl: 'app/views/pages/home.html',
		controller:'mainCtrl',
		controllerAs:'main'
	})
   .when('/register', {
      templateUrl: 'app/views/pages/RegisterationPage.html'
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
      controllerAs:"Ctrl"
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
