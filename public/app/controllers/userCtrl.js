
angular.module('userControllers', ['userServices','clientServices','businessOwnerServices', 'authServices'])
.controller('regCtrl', function($http, $location, $timeout, User){

	var app = this;

	app.regUser = function(regData){
		app.successMsg = false;
		app.errors = false;
		User.createUser(app.regData).then(function(data){

			if(data.data.success){
				app.successMsg = data.data.message+' Redirecting to homepage...';
				$location.path('/');
				app.sucessMsg=false;
			}
			else{
				if(data.data.errors){
					app.errors=data.data.errors;
				}
			}
		},function(err)
		{
			if(err.data){
				Authentication.handleError();
			}
		});
	};

})

.controller('updateCtrl',function($http,$location,$timeout,User, Authentication, AuthenticationToken){
	var app=this;

	app.updateUser=function(updateData){
		app.successMsg = false;
		app.errMsg = false;
				User.updateInfo(app.updateData).then(function(data){
			if(data.data.success){
				app.successMsg=data.data.message;
				$location.path('/');
				app.sucessMsg=false;

			}else {
				app.errMsg=data.data.message;

			}




		},function(err)
		{
			if(err.data){
			Authentication.handleError();
			}
		});
	}

	app.updateUsername=function(Edata){
		app.successMsg = false;
		app.errMsg = false;


		User.updateUsername(app.Edata).then(function(data){
			if(data.data.success){
				app.successMsg=data.data.message;
				app.sucessMsg=false;
				AuthenticationToken.setUsername(app.Edata.username);
				$timeout(function() {
					$location.path('/');
					location.reload();
				}, 150);

			}else {
				app.errMsg=data.data.message;

			}
		},function(err)
		{
			if(err.data){
			Authentication.handleError();
			}
		});
	}

	app.updatePassword=function(Edata){
		app.successMsg = false;
		app.errMsg = false;

		User.updatePassword(app.Edata).then(function(data){
			if(data.data.success){
				app.successMsg=data.data.message;
				$location.path('/');
				app.sucessMsg=false;

			}else {
				app.errMsg=data.data.message;

			}
		},function(err)
		{
			if(err.data){
			Authentication.handleError();
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
.controller('viewDetailedCtrl',function($http,$location,$timeout,Client,$routeParams, AuthenticationToken, Authentication){
	var app=this;
	app.errAMsg=false;
	app.errMsg=false;
	app.activities=[];
	app.client = Authentication.isClient();
	app.id=$routeParams.id;
	Client.viewDetailed(app.id).then(function(data){
		if(data.data.success){
			app.businessOwner=data.data.businessOwner;
			if(!data.data.activities)
			{
				app.errAMsg='No activities';
			}else{
			app.activities=data.data.activities;
		}
		}
		else {
			app.errMsg=data.data.message;
		}
	},function(err)
		{
			if(err.data){
			Authentication.handleError();
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
	},function(err)
		{
			if(err.data){
			Authentication.handleError();
			}
		});


})
.controller('viewActivityCtrl',function($http,AuthenticationToken,Client,$routeParams,Authentication){
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
	},function(err)
		{
			if(err.data){
			Authentication.handleError();
			}
		});


})
.controller('searchCtrl',function($http,BusinessOwner)
{	//This Contoller calles businessOwnerServices to perform the search query
	//based on the keyword entered by the user which is now found in the url of the
	//page then it takes the returned results and put them in properties of the 
	//controller to be used in the HTML file accordingly.
	var app = this;
	BusinessOwner.getResults().then(function(data)
	{
		app.errMsg = false;
		app.venues=[];
		if(data.data.success)
		{
			if(data.data.businesses.length == 0)
			{
				app.errMsg = data.data.message;
			}
			else{
				app.venues = data.data.businesses;
			}
		}
		else{
			app.errMsg = data.data.message;
		}
	});
	

})
.controller('adminCtrl',function($http,Admin,$location)
{	//This controller ensures that the admin of the website is created only once
	//Its link is known only by the team members and anyone tries to hack it
	//It will be give him/her access denied
	var app = this;
	
	app.doReg=function(regData){
		app.errMsg = false;
		Admin.addAdmin(app.regData).then(function(data)
		{
			if(data.data.success)
			{
				
				$location.path('/');
			}
			else{
				app.errMsg = data.data.message;
				app.regData={};
			}
		});
	}

});


