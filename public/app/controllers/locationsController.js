	var app = angular.module('locationsController', ['businessOwnerServices', 'authServices']);

	app.controller('locationsCtrl', function(BusinessOwner, Authentication, AuthenticationToken, $location, $route, $http, $scope, $routeParams){

		var controller = this;

		$scope.locationExists = false;

		BusinessOwner.getInfo($routeParams.id).then(function(business){

			if(business.data.success){

				$scope.business = business.data.businessOwner;
			
			}else{
				
				$scope.errMsg = application.data.message;
				$scope.errors = application.data.errors;

			}
		
		}, function(err){

				if(err.data){
				Authentication.handleError();
				}
			
			});

		this.addLocation = function(){

			BusinessOwner.addLocation($routeParams.id, {location: controller.location}).then(function(response){        
		        
		        if(response.data.success){

		          
		          controller.location = null;
		          $route.reload();
		                  
		        }else{
		            
				$scope.errMsg = application.data.message;
				$scope.errors = application.data.errors;
						      		        
		        }
	  
	        }, function(err){

				if(err.data){
				Authentication.handleError();
				}
			
			});	

      	};

      	this.removeLocation = function(location){

			BusinessOwner.removeLocation($routeParams.id, {location: location}).then(function(response){        
		        
		        if(response.data.success){

		          location = null;
		          $route.reload();
		                  
		        }else{
		               
				$scope.errMsg = application.data.message;
				$scope.errors = application.data.errors;
		      		        
		        }
	  
	        }, function(err){

				if(err.data){
				Authentication.handleError();
				}
			});	

      	};


		this.checkLocation = function(){

      		for (var i = 0; i<$scope.business.locations.length; i++){
      			
				if($scope.business.locations[i] == controller.location){

					$scope.locationExists = true;
					return;

				}
      		
      		}

      		$scope.locationExists = false;

      	};

      	this.isEmpty = function(){

      		if(controller.location != null && controller.location != ''){

      			return false;

      		}else{

      			return true;

      		}

      	};

	});
