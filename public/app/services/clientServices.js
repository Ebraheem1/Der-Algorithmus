angular.module('clientServices',[])

.factory('Client',function($http){
  clientFactory={};

clientFactory.viewSummaries=function(){
  return $http.get('/view-summary');
};

clientFactory.viewDetailed=function(id){
  return $http.get('/businessOwner/'+id);
}
clientFactory.viewActivity=function(id){
  return $http.get('/view-activity/'+id);
}
  return clientFactory;

});
