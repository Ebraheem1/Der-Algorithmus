//the userApp is just a module, which contains as dependencies all other controllers
angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'ngAnimate', 'mainController', 'authServices', 'reviewController', 'reviewServices', 'activityController', 'activityServices'])


.config(function($httpProvider){
	$httpProvider.interceptors.push('AuthInterceptors');
});