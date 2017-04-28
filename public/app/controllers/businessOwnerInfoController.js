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
		$scope.isPhoneNumber = false;

		$scope.tidyForm = function(){

			if(!($scope.editName)){

				controller.info.name = null;
				$scope.data.name = null;

			}

			if(!($scope.editNumber)){

				controller.info.phoneNumber = null;
				$scope.data.phoneNumber = null;

			}

			if(!($scope.editEmail)){

				controller.info.email = null;
				$scope.data.email = null;

			}

			if(!($scope.editDescription)){

				controller.info.description = null;
				$scope.data.description = null;

			}
			
		};
		
		//retrieve current information of business owner on page load
		BusinessOwner.getInfo($routeParams.id).then(function(business){

			if(business.data.success){

				$scope.business = business.data.businessOwner;
				$scope.user = business.data.user;
			
			}else{
				
				$scope.errMsg = business.data.message;
				$scope.errors = business.data.errors;			
			}
		
		}, function(err){

				if(err.data){
				Authentication.handleError();
			}
			
			});


		
		//update information of business with supplied values.
		this.updateInfo = function(){

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

		          $route.reload();
		          controller.info = {};
		                  
		        }else{
			          
					$scope.errMsg = response.data.message;
					$scope.errors = response.data.errors;		        
		       
		        }
	  
	        }, function(err){

				if(err.data){
				Authentication.handleError();
				}
			
			});	

      	};

		//checking for email availability
		this.checkEmail = function(){

      		return $http.post('/api/applications/check/email', {email: controller.info.email}).then(function(response){        

        	$scope.emailAvailable = response.data.success;
    
    		}, function(err){

				if(err.data){
				Authentication.handleError();
				}
			
			});

      	};
	//validation of email format
      	$scope.isEmail = function(){

      		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    		return re.test(controller.info.email);

      	};
	//matching new email against old one
      	$scope.isOldEmail = function(){

    		return $scope.user.email == controller.info.email;

      	};

      	$scope.isPhoneNumber = function(){

      		$scope.isPhoneNumber = !isNaN(controller.info.phoneNumber)&&(controller.info.phoneNumber.length>4);

    	};

	});
