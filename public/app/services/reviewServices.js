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
	};

	reviewFactory.deleteReview = function(id, revData){
		console.log(revData);
		return $http.post('/review/deleteReview/'+id, revData);
	};

	reviewFactory.clientGetReviews = function(id){
		return $http.get('/client/review/view/'+id);
	};
	
	reviewFactory.rateBusiness = function(id,rating){
	
		return $http.post('/client/rate/'+id, rating);
	
		// return $http({
        // url : '/client/rate/'+id,
        // method : 'post',
        // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        // data : {sample_id : 100, sample_name: 'Abin John'}
		// });

	};

	return reviewFactory;
});