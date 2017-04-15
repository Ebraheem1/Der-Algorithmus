angular.module('reviewController', ['reviewServices', 'authServices'])

.controller('reviewCtrl', function($http, $location, $timeout, Review, Authentication,$scope){

	var app = this;

	app.addReview = function(revData){
		app.successMsg = false;
		app.errMsg = false;
		app.loading = true;

		Authentication.getUser().then(function(data){
			app.revData.user_id = data.data.user_id;
		});

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

		Authentication.getUser().then(function(data){
			app.user_id = data.data.user_id;
		});
		
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

});