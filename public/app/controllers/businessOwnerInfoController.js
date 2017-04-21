	var app = angular.module('businessOwnerInfoController', ['businessOwnerServices', 'authServices']);

	app.controller('businessOwnerInfoCtrl', function(BusinessOwner, Authentication, $location, $http, $scope, $route, $routeParams){

		var controller = this;

		this.info = {};

		$scope.editName =false;
		$scope.editEmail =false;
		$scope.editNumber =false;
		$scope.editDescription =false;
		$scope.emailAvailable = false;
		$scope.manageLocations = false;

		BusinessOwner.getInfo($routeParams.id).then(function(business){

			if(business.data.success){

				$scope.business = business.data.businessOwner;
				$scope.user = business.data.user;
			
			}else{
				
				$scope.errMsg = business.data.message;
			
			}
		
		}, function(err){

				if(err.data){
				Authentication.handleError();
			}
			
			});

		this.updateInfo = function(){

			console.log(controller.info);

			if(!($scope.editName)){

				delete controller.info.name;

			}

			if(!($scope.editNumber)){

				delete controller.info.phoneNumber;

			}

			if(!($scope.editEmail)){

				delete controller.info.Email;

			}

			if(!($scope.editDescription)){

				delete controller.info.description;

			}

			BusinessOwner.updateInfo($routeParams.id, controller.info).then(function(response){        
		        
		        if(response.data.success){

		          //$window.location.href = '/application/applications';
		          $route.reload();
		          controller.info = {};
		                  
		        }else{
		          
		          $scope.errMsg = response.data.message;
		          console.log(response.data.message);
		        
		        }
	  
	        }, function(err){

				if(err.data){
				Authentication.handleError();
				}
			
			});	

      	};


		this.checkEmail = function(){

      		return $http.post('/api/applications/check/email', {email: controller.info.email}).then(function(response){        

        	$scope.emailAvailable = response.data.success;
    
    		}, function(err){

				if(err.data){
				Authentication.handleError();
				}
			
			});

      	};

      	this.isEmail = function(){

      		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    		return re.test(controller.info.email);

      	};

      	this.isOldEmail = function(){

    		return $scope.user.email == controller.info.email;

      	};

	});
