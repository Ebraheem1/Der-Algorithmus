//the userApp is just a module, which contains as dependencies all other controllers
angular.module('userApp', ['appRoutes', 'locationsController', 'businessOwnerInfoController', 'businessOwnerServices', 'applicationFormController', 'applicationsController', 'applicationController', 'applicationServices', 'userControllers', 'userServices', 'ngAnimate', 'mainController', 'authServices'])


.config(function($httpProvider){
	$httpProvider.interceptors.push('AuthInterceptors');
});