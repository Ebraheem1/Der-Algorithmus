angular.module('searchServices', [])



.factory('Search', function($http){

	searchfactory = {};

		searchfactory.doSearch = function(keyword){
			return $http.get('/search/'+keyword);
		}

	return searchfactory;


});