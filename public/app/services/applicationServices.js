	var app = angular.module('applicationServices', []);

	app.factory('Application',function($http){

		applicationFactory = {};
		
		//provides backend with given applicant's info to create an application.
		applicationFactory.createApplication = function(application){

			console.log(application);
		
			return $http.post('/api/business/apply', application);
		
		};
		
		//request a given applicant's info from backend
		applicationFactory.getApplication = function(id){
		
			return $http.get('/api/applications/'+id);
		
		};
		//signaling back end about an acceptance of application to initiate
		//process of removing application and creating corresponding
		//account and notifying user's email
		applicationFactory.acceptApplication = function(id){
		
			return $http.get('/api/application/'+id+'/accept');
		
		};
		//signaling back end about a rejection of application to initiate
		//process of removing application and notifying user's email
		applicationFactory.rejectApplication = function(id){
		
			return $http.get('/api/application/'+id+'/reject');
		
		};
		//request all applications from backend
		applicationFactory.getAllApplications = function(){
		
			return $http.get('/api/applications');
		
		};
			
		return applicationFactory;

	});

