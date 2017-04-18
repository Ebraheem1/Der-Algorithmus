angular.module('adminServices', [])


    .factory('Admin', function ($http) {

        adminFactory = {};

        adminFactory.getBusiness= function(){
            return $http.get('/viewBusinesses');
        };

        adminFactory.deleteBusiness= function(id){
            return $http.get('/removeBusiness/'+id);
        };

        return adminFactory;
    });