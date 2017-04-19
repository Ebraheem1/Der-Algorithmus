angular.module('reviewServices',[])


.factory('Review',function($http){

	reviewFactory = {};

	reviewFactory.newReview = function(revData){
		console.log(revData);
		return $http.post('/review/newReview', revData);
	};


	reviewFactory.getReview = function(id){
		return $http.get('/review/getReview/'+id);
	};

	reviewFactory.editReview = function(id, revData){
		console.log(revData);
		return $http.post('/review/editReview/'+id, revData);
	}

	reviewFactory.deleteReview = function(id, revData){
		console.log(revData);
		return $http.post('/review/deleteReview/'+id, revData);
	}

	return reviewFactory;
});