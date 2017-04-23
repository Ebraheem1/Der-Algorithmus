angular.module('reviewServices',[])


.factory('Review',function($http){

	reviewFactory = {};
	
	//sending an HTTP request for the route responsible for adding a new review
	reviewFactory.newReview = function(revData){
		return $http.post('/api/review/newReview', revData);
	};

	//sending an HTTP request for the route responsible for getting a review instance
	reviewFactory.getReview = function(id){
		return $http.get('/api/review/getReview/'+id);
	};
	
	//sending an HTTP request for the route responsible for editing a review
	reviewFactory.editReview = function(id, revData){
		return $http.post('/api/review/editReview/'+id, revData);
	};
	
	//sending an HTTP request for the route responsible for deleting a review
	reviewFactory.deleteReview = function(id, revData){
		return $http.post('/api/review/deleteReview/'+id, revData);
	};

	reviewFactory.clientGetReviews = function(id){
		return $http.get('/api/client/review/view/'+id);
	};

	reviewFactory.rateBusiness = function(id,rating){
		return $http.post('/api/client/rate/'+id, rating);
	};

	reviewFactory.getMyReviews = function(){
		return $http.get('/api/client/review/myReviews');
	};

	return reviewFactory;
});
