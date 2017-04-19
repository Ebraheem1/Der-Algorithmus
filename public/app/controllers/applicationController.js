	var app = angular.module('applicationController', ['applicationServices']);

	app.controller('applicationCtrl', function(Application, $window, $http, $scope, $routeParams){

		var controller = this;

		Application.getApplication($routeParams.id).then(function(application){
		
			if(application.data.success){

				$scope.currentApplication = application.data.application;
			
			}else{
				
				app.errMsg = application.data.message;
			
			}
		
		});

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

	});

	/*app.directive('applicationsDirective', function(){

		return{

			restrict: 'E',
			templateUrl: 'app/views/application/applications.html',
			controller: 'applicationController',
			As: 'applicationCtrl'

		};

	});*/

