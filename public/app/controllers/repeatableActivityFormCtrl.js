angular.module('repeatableActivityFormController',['businessActivitiesServices'])

.controller('repeatableActivityFormCtrl',function($scope,BusinessActivities){


   $scope.choices = [{id: 'choice1'}];

   $scope.addNewChoice = function() {
     var newItemNo = $scope.choices.length+1;
     $scope.choices.push({'id' : 'choice' + newItemNo});
   };
   
   $scope.removeNewChoice = function() {
     var newItemNo = $scope.choices.length-1;
     if ( newItemNo !== 0 ) {
      $scope.choices.pop();
     }
   };
   
   $scope.showAddChoice = function(choice) {
     return choice.id === $scope.choices[$scope.choices.length-1].id;
   };

    $scope.addActivity = function() {

		$scope.loading=true;
		$scope.successMsg=false;
		$scope.errorMsg=false;

		BusinessActivities.create({slots: $scope.choices, data: $scope.activityData}).then(function(data){

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



}) ;