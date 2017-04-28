angular.module('clientServices',[])

.factory('Client',function($http){
  clientFactory={};

clientFactory.viewSummaries=function(){
  // this service is responsible to view summaries of all business owners on the website, it just go to the back end and gets them all
  return $http.get('/api/view-summary');
};

clientFactory.viewDetailed=function(id){
  //this service is responsible to view the detailed information of the business owner corresponding to the id passed as a parameter
  // in the get request to the backend
  return $http.get('/api/businessOwner/'+id);
};
clientFactory.viewActivity=function(id){
  //this service is responsible to view the detailed information of an activity corresponding to the id passed as a parameter
  // in the get request to the backend
  return $http.get('/api/view-activity/'+id);
};
clientFactory.getRelatedActivities=function(type){
  return $http.get('/api/view-relatedActivities',type);
}
  return clientFactory;

});
