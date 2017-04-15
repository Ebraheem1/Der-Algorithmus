angular.module('appRoutes',['ngRoute'])

.config(function($routeProvider,$locationProvider){

$routeProvider

.when('/',{
templateUrl: 'app/views/pages/home.html'
})

.otherwise({redirectTo :'/'});
$locationProvider.html5Mode({
  enabled: true,
  requireBase: false
});


});
