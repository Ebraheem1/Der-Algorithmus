angular.module('userControllers', ['userServices','businessOwnerServices'])
.controller('searchCtrl',function($http,BusinessOwner)
{	
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
		}else{
			app.errMsg = data.data.message;
		}
	});

});
