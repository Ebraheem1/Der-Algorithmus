	var app = angular.module('businessOwnerServices', []);

	app.factory('BusinessOwner', function($http){

		businessOwnerFactory = {};

		businessOwnerFactory.getInfo = function(id){
		
			return $http.get('/api/business');
		
		};

		businessOwnerFactory.updateInfo = function(id, info){
		
			console.log(info);
			return $http.post('/api/business/update-info', info);
		
		};

		businessOwnerFactory.addLocation = function(id, location){
		
			console.log(location);
			return $http.post('/api/business/'+id+'/locations/add', location);
		
		};

		businessOwnerFactory.removeLocation = function(id, location){
		
			console.log(location);
			return $http.post('/api/business/'+id+'/locations/remove', location);
		
		};

		
		return businessOwnerFactory;

	});

