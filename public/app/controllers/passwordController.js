angular.module('passwordController', ['authServices','modalDialog'])
  .controller('passwordController',function(Authentication,$http, $scope, $location, $timeout, Reservation, $routeParams){
    var app = this ;
    $scope.done = false ;

    app.forgotPassword = function(params){
      console.log(params);
      var response = $http.post('/api/user/forgotPassword',params).then(function(data){
        $scope.success = data.data.success;
        $scope.message = data.data.message;
        $scope.done = true ; // TODO : redirect to login
      }, function(err){

  				if(err.data){
  					Authentication.handleError();
  				}
  			});

    }
  })
