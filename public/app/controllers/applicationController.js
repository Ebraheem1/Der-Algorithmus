	var app = angular.module('applicationController', ['applicationServices', 'authServices']);

	app.controller('applicationCtrl', function(Application, AuthenticationToken, $window, $location, $http, $scope, $routeParams){

		var controller = this;

		Application.getApplication($routeParams.id).then(function(application){
		
			if(application.data.success){

				$scope.currentApplication = application.data.application;
			
			}else{
				
				$scope.errMsg = application.data.message;
			
			}
		
		}, function(err){

				AuthenticationToken.setToken();
				AuthenticationToken.setType();
				AuthenticationToken.setUsername();
				AuthenticationToken.setId();
				$location.path('/');
				location.reload();
			
			});

		this.accept = function(id){

			Application.acceptApplication(id).then(function(application){
		
				if(application.data.success){

					$scope.successMsg = 'Business owner added to directory!'

					$window.location.href = '/applications';
				
				}else{
					
					$scope.errMsg = application.data.message;
				
				}
		
			}, function(err){

				AuthenticationToken.setToken();
				AuthenticationToken.setType();
				AuthenticationToken.setUsername();
				AuthenticationToken.setId();
				$location.path('/');
				location.reload();
			
			});

		};

		this.reject = function(id){

			console.log('a7a');

			Application.rejectApplication(id).then(function(application){
			
				if(application.data.success){

					$scope.successMsg = 'Application rejected!'

					$window.location.href = '/applications';
				
				}else{
					
					$scope.errMsg = application.data.message;
				
				}
		
			}, function(err){

				AuthenticationToken.setToken();
				AuthenticationToken.setType();
				AuthenticationToken.setUsername();
				AuthenticationToken.setId();
				$location.path('/');
				location.reload();
			
			});

		};

	});
