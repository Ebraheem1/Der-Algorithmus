
angular.module('userControllers', ['ngAnimate','ngTouch','userServices','clientServices','businessOwnerServices', 'authServices'])
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
				else {
					app.errMsg=data.data.message;
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

})

.controller('usernameCtrl',function($http,$location,User, Authentication, AuthenticationToken){
	var app=this;
	app.updateUsername=function(Edata){
		app.successMsg = false;
		app.errMsg = false;

		User.updateUsername(app.Edata).then(function(data){
			if(data.data.success){
				app.successMsg=data.data.message;
				app.sucessMsg=false;
				AuthenticationToken.setUsername(app.Edata.username);
					$location.path('/updateInfo');

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
.controller('PasswordCtrl',function($http,$location,User, Authentication, AuthenticationToken){
	var app=this;
	app.updatePassword=function(Edata){
		app.successMsg = false;
		app.errMsg = false;

		User.updatePassword(app.Edata).then(function(data){
			if(data.data.success){
				app.successMsg=data.data.message;
				if(Authentication.isClient()){
				$location.path('/updateInfo');
				}
					else {
						$location.path('/business/update-info');

					}
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
.controller('viewDetailedCtrl',function($scope,$http,$location,$timeout,Client,$routeParams, AuthenticationToken, Authentication){
	var app=this;
	app.errMsg=false;
	app.errAMsg=false;

	app.activities=[];
	app.client = Authentication.isClient();
	app.id=$routeParams.id;
	Client.viewDetailed(app.id).then(function(data){
		if(data.data.success){
			app.businessOwner=data.data.businessOwner;
			console.log(app.businessOwner.images);


		$scope.photos = app.businessOwner.images;
		// initial image index
		$scope._Index = 0;
		// if a current image is the same as requested image
		$scope.isActive = function (index) {
		return $scope._Index === index;
		};
		// show prev image
		$scope.showPrev = function () {
		$scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.photos.length - 1;
		};
		// show next image
		$scope.showNext = function () {
		$scope._Index = ($scope._Index < $scope.photos.length - 1) ? ++$scope._Index : 0;
		};
		// show a certain image
		$scope.showPhoto = function (index) {
		$scope._Index = index;
		};







			if(data.data.activities)
			{
				app.activities=data.data.activities;

			}else{
				app.errAMsg=data.data.message;
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


