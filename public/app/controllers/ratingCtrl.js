angular.module('ratingController', ['reviewServices'])

	.controller('ratingCtrl', function (Review, $scope, $routeParams,Authentication) {

		var app = this;
		app.successMsg = false;
		app.errMsg = false;


		app.rateBusiness = function (rating) {

			Review.rateBusiness($routeParams.businessownerID, rating).then(function (data) {
				if (data.data.success) {
					app.successMsg = data.data.message;
				
				} else {
					app.errMsg = data.data.message;
				}

			},function(err)
			{	
			if(err.data){
				Authentication.handleError();
			}
			});

		};

	});