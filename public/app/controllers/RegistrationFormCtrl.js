angular.module('RegisterationFormCtrl',['userServices'])

.controller('RegisterationPageCtrl',function($http, $location,$scope,$timeout,User){
  this.regData={};
  var app=this;

  app.checkUsername=function(){

    return $http.post('/api/applications/check/username',
      {username: app.regData.username}).then(function(data){

      $scope.usernameAvailable = data.data.success;

    },function(err){

      if(err.data){
        Authentication.handleError();
      }
    });
  };


	app.regUser = function(){
		app.successMsg = false;
		app.errors = false;
		User.createUser(app.regData).then(function(data){

			if(data.data.success){
				app.successMsg = data.data.message+' Redirecting to homepage...';
        $timeout(function () {
          $location.path('/');
          app.sucessMsg=false;
        }, 1000);
			}
			else{
				if(data.data.errors){
					app.errors=data.data.errors;
				}
				else {
					app.errMsg=data.data.message;
				}
			}
		},function(err)
		{
			if(err.data){
				Authentication.handleError();
			}
		});
	};


app.checkEmail=function(){
  return $http.post('/api/applications/check/email', {email: app.regData.email}).then(function(data){

    $scope.emailAvailable = data.data.success;
  },function(err){

    if(err.data){
      Authentication.handleError();
    }
  });


};


$scope.isPhoneNumber=function(){
  var lenFlag=false;
  if(app.regData.phoneNumber==null || app.regData.phoneNumber.length<5){
    lenFlag=false;
  }
  else {

      lenFlag=true;
      if(!(isNaN(app.regData.phoneNumber)))
      {
        $scope.phoneNumbercheck=true;
      }
      else {
        $scope.phoneNumbercheck=false;
      }
    }

};


$scope.isEmail=function(){
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(app.regData.email);
};

app.isEmpty =function(data){

  if(data.$viewValue != null && data.$viewValue != ''){

    return false;

  }else{

    return true;

  }
};

app.checkPassword=function(){
  var reg=/^(?=(.*\d){1})(?=.*[a-zA-Z])(?=.*[!@#$%])[0-9a-zA-Z!@#$%]{8,20}$/;
  if(reg.test(app.regData.password)){
    $scope.passwordAvailable = true;
  }
  else {
    $scope.passwordAvailable=false;
  }
};

app.equalPasswords=function(){
  if(app.regData.password==app.regData.confirmPassword)
  {

    $scope.matchPasswords=true;
  }
  else {
    $scope.matchPasswords=false;

  }
}


})
