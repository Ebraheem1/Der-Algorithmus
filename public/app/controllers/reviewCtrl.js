angular.module('reviewController', ['reviewServices', 'authServices'])

.controller('reviewCtrl', function($http, $location, $timeout, Review, Authentication, $scope, $routeParams){

	var app = this;
	app.revData = {};
	app.reviewExists = false;

	Authentication.getUser().then(function(data){
		app.revData.user_id = data.data.user_id;
		console.log(data.data.user_id);
	});

	Review.getReview($routeParams.id).then(function(data){
		if(data.data.success){
			$scope.comment =data.data.review.comment;
			app.reviewExists = true;
		}
		else{
			app.errMsg = data.data.message;
			app.reviewExists = false;
		}
	});


	app.addReview = function(revData){
		app.successMsg = false;
		app.errMsg = false;
		app.loading = true;

		console.log(app.revData);

		Review.newReview(app.revData).then(function(data){
			
			if(data.data.success){
				app.successMsg = data.data.message;
				app.loading = false;
			}
			else{
				app.errMsg = data.data.message;
				app.loading = false;
			}
		});
	};


	app.editReview = function(revData){
		app.successMsg = false;
		app.errMsg = false;
		app.loading = true;

		Review.editReview($routeParams.id, app.revData).then(function(data){
			if(data.data.success){
				app.successMsg = data.data.message;
				app.loading = false;
			}
			else{
				app.errMsg = data.data.message;
				app.loading = false;
			}
		});
	};


	app.deleteReview = function(revData){
		app.successMsg = false;
		app.errMsg = false;
		app.loading = true;
		
		console.log(app.revData);

		Review.deleteReview($routeParams.id, app.revData).then(function(data){
			
			console.log( app.revData);
			if(data.data.success){
				app.successMsg = data.data.message;
				app.loading = false;
			}
			else{
				app.errMsg = data.data.message;
				app.loading = false;
			}
		});
	};

});