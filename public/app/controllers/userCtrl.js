angular.module('userControllers', ['userServices','clientServices'])
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

		User.updatePassword(app.Edata).then(function(data){
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

.controller('viewCtrl',function($http,$location,$timeout,Client){
		var app=this;
		app.BusinessOwners=[];
		app.errMsg=false;
		Client.viewSummaries().then(function(data){
			if(data.data.success){
				app.BusinessOwners=data.data.BusinessOwners;
			}
			else {
					app.errMsg=data.data.message;
			}
		});
})
.controller('viewDetailedCtrl',function($http,$location,$timeout,Client,$routeParams){
	var app=this;
	app.errMsg=false;
	app.activities=[];
	app.id=$routeParams.id;
	Client.viewDetailed(app.id).then(function(data){
		if(data.data.success){
			app.businessOwner=data.data.businessOwner;
			app.activities=data.data.activities;
		}
		else {
			app.errMsg=data.data.message;
		}
	});
})
.controller('ViewBOhomepageCtrl',function($http,Client,AuthenticationToken){
	var app=this;
	app.id=AuthenticationToken.getId();

	Client.viewDetailed(app.id).then(function(data){
		if(data.data.success){
			app.businessOwner=data.data.businessOwner;
			app.activities=data.data.activities;
			app.reviews=data.data.reviews;
		}
		else {
			app.errMsg=data.data.message;
		}
	});


})
