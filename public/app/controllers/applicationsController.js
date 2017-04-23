

var app = angular.module('applicationsController', ['applicationServices', 'pagingServices', 'authServices']);

app.controller('applicationsCtrl', function(Application, AuthenticationToken, Pager, $location, $scope, $routeParams){

	var controller = this;

	//retrieve all application on page load
	Application.getAllApplications().then(function(applications){
		
		
		if(applications.data.authenticated){

			if(applications.data.success){
				
				$scope.applications = applications.data.applications;

				//start of pagination logic for controller
				controller.Items = $scope.applications; //array of applications to be paged
			    controller.pager = {};
			    
			    controller.setPage = function(page){

			        if(page < 1 || page > controller.pager.totalPages){
			          
			            return;
			        
			        }
			        // get pager object from service
			        controller.pager = Pager.getPager(controller.Items.length, page);
			        // get current page of applications
			        controller.items = controller.Items.slice(controller.pager.startIndex, controller.pager.endIndex + 1);
			    
			    };
			    // initialize to page 1
			    controller.setPage(1);
			    //end of pagination logic for controller			

			}else{

				$scope.errMsg = applications.data.message;
				$scope.errors = applications.data.errors;			
			}

		}else{


		}	
	
	}, function(err){

		if(err.data){
          Authentication.handleError();
        }
	
	});

});
