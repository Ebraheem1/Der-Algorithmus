
angular.module('businessOwnerServices', [])

.factory('BusinessOwner', function($http,$routeParams)
{
	//This function calls the backend function that performs the search
	//then it returns the results to the controller.
	businessOwnerFactory = {};
	
	businessOwnerFactory.getResults = function(){
		
		return $http.get('/api/search/'+$routeParams.keyword);
	};
	businessOwnerFactory.getReviews = function(id){
		
		return $http.get('/api/showReview/'+id);
	};

	businessOwnerFactory.uploadMedia = function(image){
                    
		return $http.post('/api/gallery',image);
	};
	businessOwnerFactory.reply = function(replyData,reviewID){

		return $http.post('/api/reply/'+reviewID,replyData);
	};

    businessOwnerFactory.addOffer = function(offerData,activityID){


		return $http.post('/api/offer/'+activityID,offerData);

	};

	businessOwnerFactory.getInfo = function(id){
	
		return $http.get('/api/business');
	
	};

	businessOwnerFactory.updateInfo = function(id, info){
	
		return $http.post('/api/business/update-info', info);
	
	};

	businessOwnerFactory.addLocation = function(id, location){
	
		return $http.post('/api/business/locations/add', location);
	
	};

	businessOwnerFactory.removeLocation = function(id, location){
	
		return $http.post('/api/business/locations/remove', location);
	
	};


	return businessOwnerFactory;
})
