
angular.module('businessOwnerServices', [])

.factory('BusinessOwner', function($http,$routeParams)
{
	//This function calls the backend function that performs the search
	//then it returns the results to the controller.
	businessOwnerFactory = {};
	
	businessOwnerFactory.getResults = function(){
		
		return $http.get('/api/search/'+$routeParams.keyword);
	};
	
	//This function calls the backend function that show  the reviews of the logged-in businessowner
	//then it returns the results to the controller.
	businessOwnerFactory.getReviews = function(id){
		
		return $http.get('/api/showReview/'+id);
	};
	
	//This function calls the backend function that uploads an image in the gallery of the logged-in businessowner
	

	businessOwnerFactory.uploadMedia = function(image){
                    
		return $http.post('/api/gallery',image);
	};
	
	//This function calls the backend function that used to reply on a specific review by the logged-in businessowner
	businessOwnerFactory.reply = function(replyData,reviewID){

		return $http.post('/api/reply/'+reviewID,replyData);
	};
	
	//This function calls the backend function that used for adding an offer on a specific activity.

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
