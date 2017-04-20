	var app = angular.module('applicationServices', []);

	app.factory('Application',function($http){

		applicationFactory = {};

		applicationFactory.createApplication = function(application){

			console.log(application);
		
			return $http.post('/api/business/apply', application);
		
		};

		applicationFactory.getApplication = function(id){
		
			return $http.get('/api/applications/'+id);
		
		};

		applicationFactory.acceptApplication = function(id){
		
			return $http.get('/api/application/'+id+'/accept');
		
		};

		applicationFactory.rejectApplication = function(id){
		
			return $http.get('/api/application/'+id+'/reject');
		
		};

		applicationFactory.getAllApplications = function(){
		
			return $http.get('/api/applications');
		
		};
		
		return applicationFactory;

	});

