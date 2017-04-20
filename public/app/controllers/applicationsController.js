

var app = angular.module('applicationsController', ['applicationServices', 'pagingServices', 'authServices']);

app.controller('applicationsCtrl', function(Application, AuthenticationToken, Pager, $location, $scope, $routeParams){

	var controller = this;


	Application.getAllApplications().then(function(applications){
		
		
		if(applications.data.authenticated){

			if(applications.data.success){
				
				$scope.applications = applications.data.applications;

				//start of pagination logic for controller
				controller.Items = $scope.applications; //array of items to be paged
			    controller.pager = {};
			    
			    controller.setPage = function(page){

			        if(page < 1 || page > controller.pager.totalPages){
			          
			            return;
			        
			        }
			        // get pager object from service
			        controller.pager = Pager.getPager(controller.Items.length, page);
			        // get current page of items
			        controller.items = controller.Items.slice(controller.pager.startIndex, controller.pager.endIndex + 1);
			    
			    };
			    // initialize to page 1
			    controller.setPage(1);
			    //end of pagination logic for controller			

			}else{

				console.log('a7a');
				$scope.errMsg = applications.data.message;
			
			}

		}else{

			console.log(applications.data.message);

		}	
	
	}, function(err){

		AuthenticationToken.setToken();
		AuthenticationToken.setType();
		AuthenticationToken.setUsername();
		AuthenticationToken.setId();
		$location.path('/');
		location.reload();
	
	});

});