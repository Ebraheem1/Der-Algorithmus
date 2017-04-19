angular.module('nonRepeatableActivityFormController',['businessActivitiesServices'])

.controller('nonRepeatableActivityFormCtrl',function($scope,BusinessActivities){

	$scope.addActivity = function() {

		if($scope.activityData!=undefined)
		{
			$scope.loading=true;
			$scope.successMsg=false;
			$scope.errorMsg=false;

			BusinessActivities.create($scope.activityData).then(function(data){

				if(data.data.success){

					$scope.successMsg=data.data.message;
					$scope.loading=false;
				}
				else
				{
					$scope.errorMsg=data.data.message;
					$scope.loading=false;
				}

			});
		}
	}

}) ;