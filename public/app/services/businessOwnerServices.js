angular.module('businessOwnerServices', [])

.factory('BusinessOwner', function($http)
{
	businessOwnerFactory = {};

	businessOwnerFactory.search=function(keyword)
	{
		return $http.get('/search/'+keyword);
	};

	return businessOwnerFactory;
})
