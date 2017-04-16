 angular.module('appRoutes', ['ngRoute'])

     .config(function($routeProvider, $locationProvider) {

         $routeProvider


             .when('/', {
                 templateUrl: 'app/views/pages/home.html'
             })
             .when('/register', {
                 templateUrl: 'app/views/pages/RegisterationPage.html'
             })
             .when('/reserve/1/:activity_id',{
                templateUrl: 'app/views/pages/reservationPageNR.html',
                controller: "resCtrlNR",
                controllerAs:"resCtrl"
             })
             .when('/reserve/0/:activity_id',{
                templateUrl: 'app/views/pages/reservationPageR.html',
                controller: "resCtrlR",
                controllerAs:"resCtrl"
             })
             .otherwise({
                 redirectTo: '/'
             });
         $locationProvider.html5Mode({
             enabled: true,
             requireBase: false
         });


     });
