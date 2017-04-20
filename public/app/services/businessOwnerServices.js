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
	
		return $http.post('/api/business/'+id+'/locations/add', location);
	
	};

	businessOwnerFactory.removeLocation = function(id, location){
	
		console.log(location);
		return $http.post('/api/business/'+id+'/locations/remove', location);
	
	};

	
	

businessOwnerFactory.getResults = function(){
	
	return $http.get('/search/'+$routeParams.keyword);
};
businessOwnerFactory.getReviews = function(){
	
	return $http.get('/showReview/58f8bf88f355f721fe207bf8');
};

businessOwnerFactory.uploadMedia = function(image){
                 console.log(image);
	return $http.post('/gallery/58f4eb666bcaf119ca23f201',image);
};
businessOwnerFactory.reply = function(replyData,reviewID){

	return $http.post('/reply/'+reviewID,replyData);
};

businessOwnerFactory.addOffer = function(offerData){

	return $http.post('/offer/58f8c200c2dfe324dda73f14',offerData);
};

return businessOwnerFactory;

});


