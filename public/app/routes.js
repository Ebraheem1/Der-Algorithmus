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
.when('/viewSummaries',{
  templateUrl:'app/views/pages/BOsummaries.html',
  controller:'viewCtrl',
  controllerAs:'view'
})
.when('/viewDetailed/:id',{
  templateUrl:'app/views/pages/detailedBO.html',
  controller:'viewDetailedCtrl',
  controllerAs:'viewDetailed'
})
.when('/viewDetailedActivities/:id',{
  templateUrl:'app/views/pages/activities.html',
  controller:'viewDetailedCtrl',
  controllerAs:'viewDetailed'
})
.when('/BOhomepage',{
  templateUrl:'app/views/pages/BusinessOwnerHomePage.html',
  controller:'ViewBOhomepageCtrl',
  controllerAs:'ViewBOhomepage'
})
.when('/viewDetailedActivity/:id',{
  templateUrl:'app/views/pages/DetailedActivity.html',
  controller:'viewActivityCtrl',
  controllerAs:'viewActivity'
})
.otherwise({redirectTo :'/'});
$locationProvider.html5Mode({
  enabled: true,
  requireBase: false
});


});
