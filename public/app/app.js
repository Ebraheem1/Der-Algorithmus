//the userApp is just a module, which contains as dependencies all other controllers
angular.module('userApp', ['appRoutes', 'adminBusinessController' , 'adminServices' , 'pagingServices' , 'userControllers', 'userServices', 'ngAnimate', 'mainController', 'authServices', 'reviewController', 'ratingController', 'reviewServices', 'activityController', 'activityServices'])


.config(function($httpProvider){
	$httpProvider.interceptors.push('AuthInterceptors');
});