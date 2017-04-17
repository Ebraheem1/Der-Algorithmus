angular.module('searchController', ['searchServices'])



.controller('searchCtrl',function(Search, $routeParams){

	var app = this;

	app.successMsg = false;
	app.errMsg = false;
	app.loading = true;

	Search.doSearch($routeParams.keyword).then(function(data){
		
		if(data.data.success){
			app.successMsg = data.data.message;
			app.loading = false;
		}
		else{
			app.errMsg = data.data.message;
			app.loading = false;
		}
	});



});