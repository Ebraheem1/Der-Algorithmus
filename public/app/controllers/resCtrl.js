angular.module('reservationController', ['authServices','reservationServices', 'pagingServices','modalDialog'])
    // This is the controller for non repeatable activites
    .controller('resCtrlNR', function(AuthenticationToken,Authentication,$http, $scope, $location, $timeout, Reservation, $routeParams) {
        var app = this; //TODO : handle negative number for participants // ADD cancelation window warning // Display to USer the price

        $scope.discount =0 ;
        // this function is used to get an activity through it;d ID .
        Reservation.getActivity($routeParams.activity_id, 1).then(function(data) {
            $scope.Activity = data.data.activity;
            if($scope.Activity){
              $scope.load = true ;
            }else{
              $scope.load = false ;
            }
            if($scope.Activity.offer)
            $scope.discount = $scope.Activity.offer.discount/100;
            $scope.seatsLeft = data.data.activity.maxParticipants - data.data.activity.currentParticipants;
            $scope.travelDate = data.data.activity.travelingDate.substr(0, 10);
            $scope.returnDate = data.data.activity.returnDate.substr(0, 10);
            $scope.Output = false;

        });
        // This function is used to reserve in a non repeatable activity . it calculates the price and sends it back to the front end upon
        // reserving
        app.ReserveNR = function(reservationData) {

            var price = reservationData * $scope.Activity.pricePerPerson;

            Reservation.ReserveNR($routeParams.activity_id, price, reservationData).then(function(data) {

                if (!data.data.success) {
                    $scope.Output = true;
                    $scope.Successful = false;
                    $scope.errorMessage = data.data.message;
                } else {
                    $scope.Output = true;
                    $scope.Successful = true;
                    $scope.reservation = data.data.reservation;
                    $scope.price = (data.data.reservation.price-data.data.reservation.price*$scope.discount) * 100;


                }
            },function(err){
             if(err.data){
                Authentication.handleError();
                }
            });
        }


    })

    // This is the controller of repeatable activites
    .controller('resCtrlR', function(AuthenticationToken,$http, $scope, $location, $timeout, Reservation, $routeParams) { //TODO : Logic of MAX day ;
        var app = this;
        $scope.offer = false ;
        $scope.discount = 0 ;
    //This function is used to get a repeatable activity through it's id
        Reservation.getActivity($routeParams.activity_id, 0).then(function(data) {

            var d = new Date();
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            $scope.Activity = data.data.activity;
            if($scope.Activity.offer){
              $scope.offer = true ;
              $scope.discount = $scope.Activity.offer.discount/100;
            }

            if($scope.Activity){
              $scope.load = true ;

            }else{
              $scope.load = false ;
            }
            $scope.Output = false;

            $scope.today = yyyy + '-' + mm + '-' + dd;



        },function(err){
           if(err.data){
                Authentication.handleError();
                }
        });
        //This function is used to reserve a repeatable activity . upon reserving . the output message,and the price is sent back to the view
        app.ReserveR = function(res) {

            var package_id = res.selectedPackage;
            var activity_id = $routeParams.activity_id;
            var slot_id = res.selectedSlot;
            var date = res.selectedDate;
            Reservation.ReserveR(activity_id, package_id, slot_id, date).then(function(data) {

                if (!data.data.success) {
                    $scope.Output = true;
                    $scope.Successful = false;
                    $scope.errorMessage = data.data.message;

                } else {
                    $scope.Output = true;
                    $scope.Successful = true;

                    $scope.reservation = data.data.reservation;
                    $scope.price = (data.data.reservation.price-data.data.reservation.price*$scope.discount) * 100;

                  }

            },function(err){
                    if(err.data){
                        Authentication.handleError();
                    }
            });
        }
    })


    //This is the controller for the reservatinos of the user
    .controller('yourReservations', function(AuthenticationToken,Pager, $http, $scope, $location, $timeout, Reservation, $routeParams, $window) {
        var app = this;
        $scope.success = true;
        $scope.errorMessage = "You have no reservations currently !";

        $scope.currentPage = 1;
        $scope.itemsPerPage = 6;
        $scope.dateNow = new Date();

        $scope.modalShown = false ;
        // A function to toggle the modal . which is to be implemented later
        $scope.toggleModal = function (){
          $scope.modalShown = !$scope.modalShown;
        }
        // A function in the scope to check if the given date is in the past

        $scope.dateGreater = function (date){
          var x = new Date();
          var g =  new Date(date);
          if(g>=x){
            return true ;
          }
          if(g<x){

            return false ;
          }
        }
            // This function is used to get all the repeatable , non repeatable activites of one user . concatenates the both and send
            // them back to the front end along with any errors that might come up
        Reservation.getAllReservation().then(function(data) {

            if (data.data.success && (data.data.repeatable.length > 0 || data.data.nonRepeatable.length > 0)) {
                $scope.success = true;
                $scope.allReservations = data.data.repeatable.concat(data.data.nonRepeatable);
                $scope.Items = $scope.allReservations;
                app.pager = {};
                app.setPage = function(page) {

                    if (page < 1 || page > app.pager.totalPages) {

                        return;

                    }

                    // get pager object from service
                    app.pager = Pager.getPager($scope.Items.length, page, $scope.itemsPerPage);
                    // get current page of items

                    $scope.items = $scope.Items.slice(app.pager.startIndex, app.pager.endIndex + 1);

                };
                // initialize to page 1
                app.setPage(1);
                //end of pagination logic for controller
            } else {
                $scope.success = false;

            }
        },function(err){
           if(err.data){
                Authentication.handleError();
                }
        });



        // this function is used for confirmation of deletion of a certain reservation
        $scope.Delete = function(type, reservation_id) {
            var cancelReservation = $window.confirm('Are you sure you want to cancel this Reservation ? ');
            if (cancelReservation) {
                 // upon acceptance of a removal . we check if the activity is repeatable or not and we cancel it accordingly
                if (type == 0) {

                    Reservation.cancelReservationR(reservation_id).then(function(data) {

                        if (data.data.success) {
                            $window.alert(data.data.message);
                            $timeout(function() {
                                location.reload();
                                $location.path('/profile/reservations/');
                            }, 1000)
                        } else {

                            $window.alert(data.data.message);
                        }

                    },function(err){
                      if(err.data){
                        Authentication.handleError();
                     }
                    });
                } else {
                    Reservation.cancelReservationNR(reservation_id).then(function(data) {
                        if (data.data.success) {
                            $window.alert(data.data.message);
                            $timeout(function() {
                                location.reload();
                                $location.path('/profile/reservations/');
                            }, 1000)
                        } else {
                            $window.alert(data.data.message);
                        }
                    },function(err){
                       if(err.data){
                        Authentication.handleError();
                        }
                    });
                }
            }
        }

    })
