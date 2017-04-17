//the userApp is just a module, which contains as dependencies all other controllers
angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'ngAnimate', 'mainController', 'authServices', 'reviewController','businessController', 'reviewServices','businessOwnerServices', 'ui.bootstrap'])


.config(function($httpProvider){
	$httpProvider.interceptors.push('AuthInterceptors');
});