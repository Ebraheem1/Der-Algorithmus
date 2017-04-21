
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
                    
		return $http.post('/api/gallery/58f4eb666bcaf119ca23f201',image);
	};
	businessOwnerFactory.reply = function(replyData,reviewID){

		return $http.post('/api/reply/'+reviewID,replyData);
	};

    businessOwnerFactory.addOffer = function(offerData){

		return $http.post('/api/offer/58f8c200c2dfe324dda73f14',offerData);
	};

	businessOwnerFactory.getInfo = function(id){
	
		return $http.get('/api/business');
	
	};

	businessOwnerFactory.updateInfo = function(id, info){
	
		console.log(info);
		return $http.post('/api/business/update-info', info);
	
	};

	businessOwnerFactory.addLocation = function(id, location){
	
		console.log(location);
		return $http.post('/api/business/locations/add', location);
	
	};

	businessOwnerFactory.removeLocation = function(id, location){
	
		console.log(location);
		return $http.post('/api/business/locations/remove', location);
	
	};


	return businessOwnerFactory;
})
