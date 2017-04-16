angular.module('userControllers', ['userServices','businessOwnerServices'])
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
	

});
