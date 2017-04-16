angular.module('businessOwnerServices', [])

.factory('BusinessOwner', function($http)
{
	businessOwnerFactory = {};
	var obj = null;
	var searchWord = false;
	businessOwnerFactory.search=function(keyword)
	{
		searchWord = keyword;
		//return $http.get('/search/'+keyword);
	};
	businessOwnerFactory.getResults = function(){
		console.log(searchWord);
		return $http.get('/search/'+searchWord);
	}

	return businessOwnerFactory;
})
