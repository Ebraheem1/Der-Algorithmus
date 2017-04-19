	var app = angular.module('businessOwnerInfoController', ['businessOwnerServices']);

	app.controller('businessOwnerInfoCtrl', function(BusinessOwner, $http, $scope, $routeParams){

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

		          console.log('a7a');

		          //$window.location.href = '/application/applications';
		          controller.info = {};
		                  
		        }else{
		          
		          console.log('fuck');        
		          $scope.errMsg = response.data.message;
		          console.log(response.data.message);
		        
		        }
	  
	        });	

      	};


		this.checkEmail = function(){

      		return $http.post('/applications/check/email', {email: controller.info.email}).then(function(response){        

        	$scope.emailAvailable = response.data.success;
        	console.log(emailAvailable);
    
    		});

      	};

      	this.isEmail = function(){

      		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    		return re.test(controller.info.email);

      	};

      	this.isOldEmail = function(){

    		return $scope.user.email == controller.info.email;

      	};
/*		
		this.accept = function(id){

			Application.acceptApplication(id).then(function(application){
		
				if(application.data.success){

					app.successMsg = 'Business owner added to directory!'

					$window.location.href = '/application/applications';
				
				}else{
					
					app.errMsg = application.data.message;
				
				}
		
			});

		};

		this.reject = function(id){

			console.log('a7a');

			Application.rejectApplication(id).then(function(application){
			
				if(application.data.success){

					app.successMsg = 'Application rejected!'

					$window.location.href = '/application/applications';
				
				}else{
					
					app.errMsg = application.data.message;
				
				}
		
			});

		};
	*/

	});
