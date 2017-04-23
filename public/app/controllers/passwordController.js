angular.module('passwordController', ['authServices','modalDialog'])
  // This simple controller is used to manage the forgeting password function for the user . it takes the parameters from the view 
  // and calls an http post request ('/api/user/forgotPassword') for checking the mail with the username  and sending a password accordingly to his mail 
  // it then sends and error message or a success message accordingly
  .controller('passwordController',function(Authentication,$http, $scope, $location, $timeout, Reservation, $routeParams){
    var app = this ;
    $scope.done = false ;

    app.forgotPassword = function(params){
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
