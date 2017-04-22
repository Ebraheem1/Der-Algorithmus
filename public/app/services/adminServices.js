angular.module('adminServices', [])


    .factory('Admin', function ($http) {

        adminFactory = {};

        adminFactory.getBusiness= function(){
            return $http.get('/api/viewBusinesses');
        };

        adminFactory.deleteBusiness= function(id){
            return $http.get('/api/removeBusiness/'+id);
        };
        adminFactory.addAdmin = function(data){
            //It calls the backend function that creates the admin
            return $http.post('/api/createAdmin',data);
        };

        return adminFactory;
    });