angular.module('reviewController', ['reviewServices', 'authServices','pagingServices'])

	.controller('reviewCtrl', function ($http, $location, $timeout, Review, Pager , Authentication, $scope, $routeParams) {

		var app = this;
		app.revData = {};
		app.reviewExists = false;

		// Authentication.getUser().then(function (data) {
		// 	app.revData.user_id = data.data.user_id;
		// 	console.log(data.data.user_id);
		// });

		Review.getReview($routeParams.id).then(function (data) {
			if (data.data.success) {
				$scope.comment = data.data.review.comment;
				app.reviewExists = true;
			} else {
				app.errMsg = data.data.message;
				app.reviewExists = false;
			}
		});


		app.addReview = function (revData) {
			app.successMsg = false;
			app.errMsg = false;
			app.loading = true;

			console.log(app.revData);

			Review.newReview(app.revData).then(function (data) {

				if (data.data.success) {
					app.successMsg = data.data.message;
					app.loading = false;
				} else {
					app.errMsg = data.data.message;
					app.loading = false;
				}
			});
		};


		app.editReview = function (revData) {
			app.successMsg = false;
			app.errMsg = false;
			app.loading = true;

			Review.editReview($routeParams.id, app.revData).then(function (data) {
				if (data.data.success) {
					app.successMsg = data.data.message;
					app.loading = false;
				} else {
					app.errMsg = data.data.message;
					app.loading = false;
				}
			});
		};


		app.deleteReview = function (revData) {
			app.successMsg = false;
			app.errMsg = false;
			app.loading = true;

			console.log(app.revData);

			Review.deleteReview($routeParams.id, app.revData).then(function (data) {

				console.log(app.revData);
				if (data.data.success) {
					app.successMsg = data.data.message;
					app.loading = false;
				} else {
					app.errMsg = data.data.message;
					app.loading = false;
				}
			});
		};


		Review.clientGetReviews($routeParams.businessownerID).then(function (data) {
			app.successMsg = false;
			app.errMsg = false;
			app.loading = true;

			console.log('data.data.reviews = ' + data.data.reviews[0].comment);

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