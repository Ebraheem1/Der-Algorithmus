angular.module('adminServices', [])


    .factory('Admin', function ($http) {

        adminFactory = {};

        adminFactory.getBusiness= function(){
            return $http.get('/api/viewBusinesses');
        };

        adminFactory.deleteBusiness= function(id){
            return $http.get('/api/removeBusiness/'+id);
        };

        return adminFactory;
    });