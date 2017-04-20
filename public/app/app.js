
//the userApp is just a module, which contains as dependencies all other controllers
angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'ngAnimate', 'mainController', 'authServices', 'reviewController', 'reviewServices','businessOwnerServices','pagingServices', 'ui.bootstrap', 'activityController', 'activityServices', 'ratingController', 'adminBusinessController' , 'adminServices', 'viewReviewController'])

.config(function($httpProvider){
	$httpProvider.interceptors.push('AuthInterceptors');
});
