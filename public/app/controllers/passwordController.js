angular.module('passwordController', ['modalDialog'])
  .controller('passwordController',function($http, $scope, $location, $timeout, Reservation, $routeParams){
    var app = this ;
    $scope.done = false ;

    app.forgotPassword = function(params){
      var response = $http.post('/user/forgotPassword',params).then(function(data){
        $scope.success = data.data.success;
        $scope.message = data.data.message;
        $scope.done = true ; // TODO : redirect to login
      });

    }
  })
