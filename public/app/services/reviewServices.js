angular.module('reviewServices',[])


.factory('Review',function($http){

	reviewFactory = {};

	reviewFactory.newReview = function(revData){
		return $http.post('/api/review/newReview', revData);
	};


	reviewFactory.getReview = function(id){
		return $http.get('/api/review/getReview/'+id);
	};

	reviewFactory.editReview = function(id, revData){
		return $http.post('/api/review/editReview/'+id, revData);
	}

	reviewFactory.deleteReview = function(id, revData){
		return $http.post('/api/review/deleteReview/'+id, revData);
	}
  
	return reviewFactory;
  
});