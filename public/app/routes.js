angular.module('appRoutes',['ngRoute'])

.config(function($routeProvider,$locationProvider){

$routeProvider

.when('/',{
templateUrl: 'app/views/pages/home.html'
})

.when('/businessOwnerHP',{
  templateUrl: 'app/views/pages/BusinessOwnerHomePage.html'
})

.when('/Register',{
  templateUrl:'app/views/pages/RegisterationPage.html'
})
.when('/updateInfo',{
  templateUrl:'app/views/pages/UpdateInfo.html'
})



.otherwise({redirectTo :'/'});
$locationProvider.html5Mode({
  enabled: true,
  requireBase: false
});


});
