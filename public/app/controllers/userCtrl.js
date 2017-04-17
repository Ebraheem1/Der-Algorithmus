angular.module('userControllers', ['userServices'])

.controller('regCtrl', function($http, $location, $timeout, User){

	var app = this;

	app.regUser = function(regData){
		app.successMsg = false;
		app.errMsg = false;
		app.loading = true;
		
		User.createUser(app.regData).then(function(data){
			if(data.data.success){
				app.successMsg = data.data.message+' Redirecting to homepage...';
				app.loading = false;
				$location.path('/');
			}
			else{
				app.errMsg = data.data.message;
				app.loading = false;
			}
		});
	};

});