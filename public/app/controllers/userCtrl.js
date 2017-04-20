angular.module('userControllers', ['userServices','clientServices'])
.controller('regCtrl', function($http, $location, $timeout, User){

	var app = this;

	app.regUser = function(regData){
		app.successMsg = false;
		app.errors = false;
		User.createUser(app.regData).then(function(data){

			if(data.data.success){
				app.successMsg = data.data.message+' Redirecting to homepage...';
				$timeout(function () {
			$location.path('/');
			app.sucessMsg=false;

			}, 2000);


			}
			else{
				if(data.data.errors){
					app.errors=data.data.errors;
				}
			}
		},function(err)
		{
			AuthenticationToken.setToken();
			AuthenticationToken.setType();
			AuthenticationToken.setUsername();
			AuthenticationToken.setId();
			$location.path('/');
			location.reload();
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




		},function(err)
		{
			AuthenticationToken.setToken();
			AuthenticationToken.setType();
			AuthenticationToken.setUsername();
			AuthenticationToken.setId();
			$location.path('/');
			location.reload();
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
		},function(err)
		{
			AuthenticationToken.setToken();
			AuthenticationToken.setType();
			AuthenticationToken.setUsername();
			AuthenticationToken.setId();
			$location.path('/');
			location.reload();
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
		},function(err)
		{
			AuthenticationToken.setToken();
			AuthenticationToken.setType();
			AuthenticationToken.setUsername();
			AuthenticationToken.setId();
			$location.path('/');
			location.reload();
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
		},function(err)
		{
			AuthenticationToken.setToken();
			AuthenticationToken.setType();
			AuthenticationToken.setUsername();
			AuthenticationToken.setId();
			$location.path('/');
			location.reload();
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
	},function(err)
		{
			AuthenticationToken.setToken();
			AuthenticationToken.setType();
			AuthenticationToken.setUsername();
			AuthenticationToken.setId();
			$location.path('/');
			location.reload();
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
	},function(err)
		{
			AuthenticationToken.setToken();
			AuthenticationToken.setType();
			AuthenticationToken.setUsername();
			AuthenticationToken.setId();
			$location.path('/');
			location.reload();
		});


})
.controller('viewActivityCtrl',function($http,AuthenticationToken,Client,$routeParams){
	var app=this;
	app.activityID=$routeParams.id;
	app.errMsg=false;
	Client.viewActivity(app.activityID).then(function(data){
		if(data.data.success){
			app.activity=data.data.activity;
			app.offer=data.data.activity.offer;
			if(data.data.type=='N'){
				app.type=false;
			}
			else {
				app.type=true;
			}
		}else {
			app.errMsg=data.data.message;
		}
	});


})
