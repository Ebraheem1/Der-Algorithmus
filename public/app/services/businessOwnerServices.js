angular.module('businessOwnerServices', [])

.factory('BusinessOwner', function($http,$routeParams)
{
	//This function calls the backend function that performs the search
	//then it returns the results to the controller.
	businessOwnerFactory = {};
	
	businessOwnerFactory.getResults = function(){
		
		return $http.get('/search/'+$routeParams.keyword);
	};
	businessOwnerFactory.getReviews = function(){
		
		return $http.get('/showReview/58f4eb666bcaf119ca23f201');
	};

	businessOwnerFactory.uploadMedia = function(image){
                     console.log(image);
		return $http.post('/gallery/58f4eb666bcaf119ca23f201',image);
	};
	businessOwnerFactory.reply = function(replyData,reviewID){

		return $http.post('/reply/'+reviewID,replyData);
	};

    businessOwnerFactory.addOffer = function(offerData){

		return $http.post('/offer/554545415451515',offerData);
	};

	return businessOwnerFactory;
})
