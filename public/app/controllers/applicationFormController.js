var app = angular.module('applicationFormController', ['applicationServices']);

  app.controller('applicationFormCtrl', function(Application, $http, $window, $scope) {

    this.application = {};

    var controller = this;

    $scope.choices = [{id: 'choice1', location: ''}];
    
    $scope.addNewChoice = function() {

      var newItemNo = $scope.choices.length+1;
      $scope.choices.push({'id':'choice'+newItemNo, location: ''});
    
    };
      
    $scope.removeChoice = function() {
    
      var lastItem = $scope.choices.length-1;
      $scope.choices.splice(lastItem);
    
    };

    this.apply = function(){

      controller.application.locations = [];

      for(var i = 0; i<$scope.choices.length; i++){

        controller.application.locations[i] = $scope.choices[i].location;

      }

      Application.createApplication(controller.application).then(function(response){        

        console.log(response);
        if(response.data.success){

          console.log('a7a');

          $window.location.href = '/application/applications';
          controller.application = {};
                  
        }else{
          
          console.log('fuck');          
          app.errMsg = response.data.message;
        
        }
    
      });

    };

    this.checkUsername = function(){

      return $http.post('/applications/check/username', {username: controller.application.username}).then(function(response){        

        $scope.usernameAvailable = response.data.success;
    
      });

    };

    this.checkEmail = function(){

      return $http.post('/applications/check/email', {email: controller.application.email}).then(function(response){        

        $scope.emailAvailable = response.data.success;
    
      });

    };
  
});