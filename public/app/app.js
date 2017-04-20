//the userApp is just a module, which contains as dependencies all other controllers
angular.module('userApp', ['appRoutes','passwordController', 'reservationController','userControllers','reservationServices', 'userServices', 'ngAnimate', 'mainController', 'authServices', 'reviewController', 'reviewServices','businessOwnerServices','pagingServices', 'ui.bootstrap','modalDialog'])

.config(function($httpProvider){
	$httpProvider.interceptors.push('AuthInterceptors');
});
