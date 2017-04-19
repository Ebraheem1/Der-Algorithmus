	var app = angular.module('locationsController', ['businessOwnerServices']);

	app.controller('locationsCtrl', function(BusinessOwner, $route, $http, $scope, $routeParams){

		var controller = this;

		$scope.locationExists = false;

		BusinessOwner.getInfo($routeParams.id).then(function(business){

			if(business.data.success){

				$scope.business = business.data.businessOwner;
			
			}else{
				
				$scope.errMsg = business.data.message;
			
			}
		
		});

		this.addLocation = function(){

			console.log(controller.location);

			BusinessOwner.addLocation($routeParams.id, {location: controller.location}).then(function(response){        
		        
		        if(response.data.success){

		          console.log('a7a');
		          controller.location = null;
		          $route.reload();
		                  
		        }else{
		          
		          console.log('fuck');        
		          $scope.errMsg = response.data.message;
		      		        
		        }
	  
	        });	

      	};

      	this.removeLocation = function(location){

			console.log(location);

			BusinessOwner.removeLocation($routeParams.id, {location: location}).then(function(response){        
		        
		        if(response.data.success){

		          console.log('a7a');
		          location = null;
		          $route.reload();
		                  
		        }else{
		          
		          console.log('fuck');        
		          $scope.errMsg = response.data.message;
		      		        
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
