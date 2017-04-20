angular.module('reviewServices',[])


.factory('Review',function($http){

	reviewFactory = {};

	reviewFactory.newReview = function(revData){
		console.log(revData);
		return $http.post('/review/newReview', revData);
	};

	return reviewFactory;
});