angular.module('clientServices',[])

.factory('Client',function($http){
  clientFactory={};

clientFactory.viewSummaries=function(){
  return $http.get('/view-summary');
};

clientFactory.viewDetailed=function(id){
  return $http.get('/businessOwner/'+id);
}
  return clientFactory;

});
