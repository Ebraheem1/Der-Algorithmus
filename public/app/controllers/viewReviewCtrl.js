angular.module('viewReviewController', ['reviewServices', 'authServices','pagingServices'])

	.controller('viewReviewCtrl', function ($http, $location, $timeout, Review, Pager , Authentication, $scope, $routeParams) {

		var app = this;
		
		Review.clientGetReviews($routeParams.businessownerID).then(function (data) {
			app.successMsg = false;
			app.errMsg = false;
			app.loading = true;

			if (data.data.success) {
				app.successMsg = data.data.message;
				app.loading = false;

				if ((data.data.reviews || []).length == 0) { //if the business has no reviews yet
					app.reviewsFound = false;
				} else {
					app.reviewsFound = true;
					$scope.businessReviews = data.data.reviews;
				}

				app.Items = $scope.businessReviews; //array of items to be paged
                app.pager = {};

                app.setPage = function (page) {

                    if (page < 1 || page > app.pager.totalPages) {

                        return;

                    }
                    // get pager object from service
                    app.pager = Pager.getPager(app.Items.length, page);
                    // get current page of items
                    app.items = app.Items.slice(app.pager.startIndex, app.pager.endIndex + 1);

                };
                // initialize to page 1
                app.setPage(1);
                //end of pagination logic for controller			


			} else {
				app.errMsg = data.data.message;
				app.loading = false;
			}

		});
        
	});