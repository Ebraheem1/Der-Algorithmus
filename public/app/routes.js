angular.module('appRoutes',['ngRoute'])

.config(function($routeProvider,$locationProvider){

$routeProvider

.when('/',{
templateUrl: 'app/views/pages/home.html'
})

.when('/businessOwnerHP',{
  templateUrl: 'app/views/pages/BusinessOwnerHomePage.html'
})

.when('/register',{
  templateUrl:'app/views/pages/RegisterationPage.html',
  controller:'regCtrl',
  controllerAs:'register'
})
.when('/updateInfo',{
  templateUrl:'app/views/pages/UpdateInfo.html',
  controller:'updateCtrl',
  controllerAs:'update'
})



.otherwise({redirectTo :'/'});
$locationProvider.html5Mode({
  enabled: true,
  requireBase: false
});


});
