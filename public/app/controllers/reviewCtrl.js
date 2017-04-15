angular.module('reviewController', ['reviewServices', 'authServices'])

.controller('reviewCtrl', function($http, $location, $timeout, Review, Authentication){

	var app = this;

	app.addReview = function(regData){
		app.successMsg = false;
		app.errMsg = false;
		app.loading = true;
		app.revData = {};

		Authentication.getUser().then(function(data){
			app.user_id = data.data.user_id;
		});
		
		Review.newReview(app.revData).then(function(data){
			console.log(app.revData);
			
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