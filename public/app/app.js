//the userApp is just a module, which contains as dependencies all other controllers
angular.module('userApp', ['appRoutes', 'userControllers', 'userServices', 'ngAnimate', 'mainController', 'authServices', 'reviewController', 'reviewServices','businessOwnerServices', 'ui.bootstrap','businessActivitiesController','businessActivitiesServices','nonRepeatableActivityFormController','repeatableActivityFormController','nonRepeatableReservationsController','nonRepeatableReservationsServices','repeatableReservationsController','repeatableReservationsServices'])


.config(function($httpProvider){
	$httpProvider.interceptors.push('AuthInterceptors');
});