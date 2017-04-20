angular.module('nonRepeatableActivityFormController',['businessActivitiesServices','fileModelDirective', 'fileUploadService'])

.controller('nonRepeatableActivityFormCtrl',function($location,$scope,$route, $routeParams,BusinessActivities,fileUpload){

	$scope.file = {};
	$scope.activityData={};

	$scope.addActivity = function() {


		$scope.loading=true;
		$scope.successMsg=false;
		$scope.errorMsg=false;
		$scope.activityData.type=$routeParams.activityType;
		
        fileUpload.upload($scope.file).then(function(data) {
            if (data.data.success) {
                
                $scope.activityData.image='gallery/'+data.data.name;
                BusinessActivities.create({data: $scope.activityData}).then(function(data){

					if(data.data.success){

						$scope.successMsg=data.data.message;
						$scope.loading=false;
						$scope.file = {};
						$scope.activityData={};
					}
					else
					{
						
						$scope.errorMsg=data.data.message;
						$scope.loading=false;
						$scope.activityData={};
						
					}

				});

            } 
            else 
            {
            	
                $scope.errorMsg = data.data.message;
                $scope.loading=false;
                $scope.file = {};
                $scope.activityData={};
                
            }

        });

	}

}) ;