//the userApp is just a module, which contains as dependencies all other controllers
angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'ngAnimate', 'mainController', 'authServices', 'reviewController', 'reviewServices','businessOwnerServices','businessOwnerController','commentController' ,'ui.bootstrap'])


.config(function($httpProvider){
	$httpProvider.interceptors.push('AuthInterceptors');
});