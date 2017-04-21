angular.module('clientServices',[])

.factory('Client',function($http){
  clientFactory={};

clientFactory.viewSummaries=function(){
  return $http.get('/api/view-summary');
};

clientFactory.viewDetailed=function(id){
  return $http.get('/api/businessOwner/'+id);
}
clientFactory.viewActivity=function(id){
  return $http.get('/api/view-activity/'+id);
}
  return clientFactory;

});
