angular.module('nonRepeatableActivityFormController',['businessActivitiesServices','fileModelDirective', 'fileUploadService'])

.controller('nonRepeatableActivityFormCtrl',function($scope,$route, $routeParams,BusinessActivities,fileUpload){

	$scope.file = {};

	$scope.addActivity = function() {

		$scope.loading=true;
		$scope.successMsg=false;
		$scope.errorMsg=false;
		$scope.activityData.type=$routeParams.activityType;
		
        fileUpload.upload($scope.file).then(function(data) {
            if (data.data.success) {
                $scope.file = {};
                $scope.activityData.image='gallery/'+data.data.name;
                BusinessActivities.create({data: $scope.activityData}).then(function(data){

					if(data.data.success){

						$scope.successMsg=data.data.message;
						$scope.loading=false;
					}
					else
					{
						$scope.errorMsg=data.data.message;
						$scope.loading=false;
						$scope.file = {};
					}

				});

            } 
            else 
            {
                $scope.errorMsg = data.data.message;
                $scope.loading=false;
                $scope.file = {};
            }

        });

	}

}) ;