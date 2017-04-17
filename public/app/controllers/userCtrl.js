angular.module('userControllers', ['userServices'])

.controller('regCtrl', function($http, $location, $timeout, User){

	var app = this;

	app.regUser = function(regData){
		app.successMsg = false;
		app.errMsg = false;
		console.log('sssss');
		User.createUser(app.regData).then(function(data){

			if(data.data.success){
				app.successMsg = data.data.message+' Redirecting to homepage...';
				$timeout(function () {
			$location.path('/');
			app.sucessMsg=false;

	}, 2000);
				//$location.path('/');

			}
			else{
				app.errMsg = data.data.message;
			}
		});
	};

})

.controller('updateCtrl',function($http,$location,$timeout,User){
	var app=this;

	app.updateUser=function(updateData){
		app.successMsg = false;
		app.errMsg = false;
		console.log('ss');
		User.updateInfo(app.updateData).then(function(data){
			if(data.data.success){
				app.successMsg=data.data.message;
				console.log(data.data.message);
				$timeout(function () {
					$location.path('/');
					app.sucessMsg=false;
			}, 2000);

			}else {
				app.errMsg=data.data.message;

			}




		});
	}

	app.updateUsername=function(Edata){
		app.successMsg = false;
		app.errMsg = false;

		User.updateUsername(app.Edata).then(function(data){
			if(data.data.success){
				app.successMsg=data.data.message;
				$timeout(function () {
					$location.path('/');
					app.sucessMsg=false;
			}, 2000);

			}else {
				app.errMsg=data.data.message;

			}
		});
	}

	app.updatePassword=function(Edata){
		app.successMsg = false;
		app.errMsg = false;

		User.updatePassword(Edata).then(function(data){
			if(data.data.success){
				app.successMsg=data.data.message;
				$timeout(function () {
					$location.path('/');
					app.sucessMsg=false;
			}, 2000);

			}else {
				app.errMsg=data.data.message;

			}
		});
	}


})
