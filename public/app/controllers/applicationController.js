	var app = angular.module('applicationController', ['applicationServices', 'authServices']);

	app.controller('applicationCtrl', function(Application, Authentication ,AuthenticationToken, $window, $location, $http, $scope, $routeParams){

		var controller = this;

		Application.getApplication($routeParams.id).then(function(application){
		
			if(application.data.success){

				$scope.currentApplication = application.data.application;
			
			}else{
				
				$scope.errMsg = application.data.message;
				$scope.errors = application.data.errors;
			
			}
		
		}, function(err){

				if(err.data){

					Authentication.handleError();
				
				}
			
			});

		this.accept = function(id){

			Application.acceptApplication(id).then(function(application){
		
				if(application.data.success){

					$scope.successMsg = 'Business owner added to directory!'
					$window.location.href = '/applications';
				
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

		this.reject = function(id){

			Application.rejectApplication(id).then(function(application){
			
				if(application.data.success){

					$scope.successMsg = 'Application rejected!'
					$window.location.href = '/applications';
				
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

	});
