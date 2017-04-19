angular.module('userApp', ['appRoutes','reservationController','reservationServices','authServices','pagingServices','passwordController','modalDialog'])

.config(function($httpProvider){
	$httpProvider.interceptors.push('AuthInterceptors');
});
