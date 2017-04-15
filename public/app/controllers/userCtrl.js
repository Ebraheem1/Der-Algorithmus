angular.module('userControllers', ['userServices','businessOwnerServices'])

/*.controller('regCtrl', function($http, $location, $timeout, User){

	var app = this;
	

	app.regUser = function(regData){
		app.successMsg = false;
		app.errMsg = false;
		app.loading = true;
		
		User.createUser(app.regData).then(function(data){
			
			if(data.data.success){
				app.successMsg = data.data.message+' Redirecting to homepage...';
				app.loading = false;
				$timeout(function() {
					$location.path('/');
				}, 1500);
			}
			else{
				app.errMsg = data.data.message;
				app.loading = false;
			}
		});
	};
});*/

.controller('searchCtrl',function($http,$location,BusinessOwner)
{	
	var app = this;
	
	app.searchVenues = function(searchData){
		app.errMsg = false;
		BusinessOwner.search(app.searchData).then(function(data)
		{
			console.log(app.searchData.keyword);
			console.log(data.data.businesses);
			if(data.data.success)
			{
				if(data.data.businesses.length == 0)
				{
					app.errMsg = data.data.message;
				}
				else{
					app.venues = [];
					app.venues = data.data.businesses;
					// $scope.pageSize = 10;
					// $scope.currentPage = 1;
				}
			}
			else{
				app.errMsg = data.data.message;
			}
			$location.path('/search/'+app.searchData.keyword);
		});
		};
});