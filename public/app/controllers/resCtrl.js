angular.module('reservationController',['reservationServices'])

.controller( 'resCtrlNR',function($http,$scope,$location,$timeout,Reservation,$routeParams){
  var app=this; //TODO : handle negative number for participants // ADD cancelation window warning // Display to USer the price


    Reservation.getActivity($routeParams.activity_id,1).then(function(data){
      $scope.Activity = data.data.activity;
        console.log($scope.Activity.cancellationWindow);
      $scope.seatsLeft = data.data.activity.maxParticipants-data.data.activity.currentParticipants;
      $scope.travelDate = data.data.activity.travelingDate.substr(0,10);
      $scope.returnDate = data.data.activity.returnDate.substr(0,10);
      $scope.Output = false ;

    });
    app.ReserveNR=function(reservationData){

      var price = reservationData*$scope.Activity.pricePerPerson;
      var client_id = "58f24bf50a785f677525f8f1" // TODO : to be changed to authentication id
      Reservation.ReserveNR($routeParams.activity_id,price,reservationData,client_id).then(function(data){
        if(!data.data.success){
          $scope.Output = true ;
          $scope.Successful = false ;
          $scope.errorMessage = data.data.message;
        }else{
          $scope.Output= true ;
            $scope.Successful = true ;
          $scope.reservation = data.data.reservation;
          $scope.price = data.data.reservation.price*100;
          console.log($scope.price);
        }
      } );
    }


})


.controller('resCtrlR',function($http,$scope,$location,$timeout,Reservation,$routeParams){ //TODO : Logic of MAX day ;
  var app = this ;


  Reservation.getActivity($routeParams.activity_id,0).then(function(data){
    var d  = new Date();
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd;
    }
    if(mm<10){
        mm='0'+mm;
    }
    $scope.Activity = data.data.activity;
    $scope.Output = false ;

    $scope.today = yyyy+'-'+mm+'-'+dd;



  });
  app.ReserveR=function(res){
    var client_id = "58f24bf50a785f677525f8f1" // TODO : to be changed to authentication id


    var package_id = res.selectedPackage;
    var activity_id = $routeParams.activity_id;
    var slot_id = res.selectedSlot;
    var date = res.selectedDate;
    Reservation.ReserveR(activity_id,client_id,package_id,slot_id,date).then(function(data){
      if(!data.data.success){
        $scope.Output = true ;
        $scope.Successful = false ;
        $scope.errorMessage = data.data.message;

      }else{
        $scope.Output= true ;
          $scope.Successful = true ;
          console.log(data.data.reservation);
          $scope.reservation = data.data.reservation;
          $scope.price =data.data.reservation.price*100;
          console.log($scope.price);
    //       $timeout(function(){
    //   $location.path('/');
    // }, 1500);
      }
    });
  }
})
