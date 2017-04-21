angular.module('reviewController', ['reviewServices', 'authServices','businessOwnerServices'])


.controller('reviewCtrl', function($http,BusinessOwner, $location, $timeout, Review, Authentication, $scope, $routeParams, AuthenticationToken){

	var app = this;
	app.revData = {};
	app.reviewExists = false;
	app.revData.user_id = AuthenticationToken.getId();

	if($routeParams.reviewID){
		Review.getReview($routeParams.reviewID).then(function(data){
				if(data.data.success){
					$scope.comment =data.data.review.comment;
					app.reviewExists = true;
				}
				else{
					app.errMsg = data.data.message;
					app.reviewExists = false;
				}
		},function(err)
			{	
				if(err.data){
                        Authentication.handleError();
                }
			}
		);
	}


	app.addReview = function(revData){
		app.successMsg = false;
		app.errMsg = false;
		app.loading = true;
		app.revData.business_id = $routeParams.businessOwnerID;

		Review.newReview(app.revData).then(function(data){
			if(data.data.success){
				app.successMsg = data.data.message;
				app.loading = false;
				$location.path('/viewDetailed/'+app.revData.business_id);
			}
			else{
				app.errMsg = data.data.message;
				app.loading = false;
			}
		},function(err)
			{	
				if(err.data){
					Authentication.handleError();
				}
			}
		);
	};


	app.editReview = function(revData, comment){
		app.successMsg = false;
		app.errMsg = false;
		app.loading = true;

		var reviewData = {};
		reviewData.comment = $scope.comment;
		reviewData.user_id = app.revData.user_id;

		Review.editReview($routeParams.reviewID, reviewData).then(function(data){
			if(data.data.success){
				app.successMsg = data.data.message;
				app.loading = false;
			}
			else{
				app.errMsg = data.data.message;
				app.loading = false;
			}
		},function(err)
			{	
				if(err.data){
					Authentication.handleError();
				}
			}
		);
	};


	app.deleteReview = function(revData){

		app.successMsg = false;
		app.errMsg = false;
		app.loading = true;

		Review.deleteReview($routeParams.reviewID, app.revData).then(function(data){
			if(data.data.success){
				app.successMsg = data.data.message;
				app.loading = false;
				$location.path('/public/client/review/myReviews');
			}
			else{
				app.errMsg = data.data.message;
				app.loading = false;
			}
		},function(err)
			{	
				if(err.data){
					Authentication.handleError();
				}
			}
		);
	};


});

