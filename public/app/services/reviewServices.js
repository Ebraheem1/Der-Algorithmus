angular.module('reviewServices',[])


.factory('Review',function($http){

	reviewFactory = {};

	reviewFactory.newReview = function(revData){
		return $http.post('/review/newReview', revData);
	};

	return reviewFactory;
});