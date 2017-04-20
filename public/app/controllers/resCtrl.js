angular.module('reservationController', ['authServices','reservationServices', 'pagingServices','modalDialog'])

    .controller('resCtrlNR', function(AuthenticationToken,$http, $scope, $location, $timeout, Reservation, $routeParams) {
        var app = this; //TODO : handle negative number for participants // ADD cancelation window warning // Display to USer the price


        Reservation.getActivity($routeParams.activity_id, 1).then(function(data) {
            $scope.Activity = data.data.activity;

            $scope.seatsLeft = data.data.activity.maxParticipants - data.data.activity.currentParticipants;
            $scope.travelDate = data.data.activity.travelingDate.substr(0, 10);
            $scope.returnDate = data.data.activity.returnDate.substr(0, 10);
            $scope.Output = false;

        });
        app.ReserveNR = function(reservationData) {

            var price = reservationData * $scope.Activity.pricePerPerson;
            var client_id = "58f24bf50a785f677525f8f1" // TODO : to be changed to authentication id
            Reservation.ReserveNR($routeParams.activity_id, price, reservationData, client_id).then(function(data) {
                if (!data.data.success) {
                    $scope.Output = true;
                    $scope.Successful = false;
                    $scope.errorMessage = data.data.message;
                } else {
                    $scope.Output = true;
                    $scope.Successful = true;
                    $scope.reservation = data.data.reservation;
                    $scope.price = data.data.reservation.price * 100;

                }
            },function(err){
              AuthenticationToken.setToken();
        			AuthenticationToken.setType();
        			AuthenticationToken.setUsername();
        			AuthenticationToken.setId();
        			$location.path('/');
        			location.reload();
            });
        }


    })


    .controller('resCtrlR', function(AuthenticationToken,$http, $scope, $location, $timeout, Reservation, $routeParams) { //TODO : Logic of MAX day ;
        var app = this;


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
            $scope.Output = false;

            $scope.today = yyyy + '-' + mm + '-' + dd;



        },function(err){
          AuthenticationToken.setToken();
    			AuthenticationToken.setType();
    			AuthenticationToken.setUsername();
    			AuthenticationToken.setId();
    			$location.path('/');
    			location.reload();
        });
        app.ReserveR = function(res) {
            var client_id = "58f24bf50a785f677525f8f1" // TODO : to be changed to authentication id


            var package_id = res.selectedPackage;
            var activity_id = $routeParams.activity_id;
            var slot_id = res.selectedSlot;
            var date = res.selectedDate;
            Reservation.ReserveR(activity_id, client_id, package_id, slot_id, date).then(function(data) {
                if (!data.data.success) {
                    $scope.Output = true;
                    $scope.Successful = false;
                    $scope.errorMessage = data.data.message;

                } else {
                    $scope.Output = true;
                    $scope.Successful = true;

                    $scope.reservation = data.data.reservation;
                    $scope.price = data.data.reservation.price * 100;
                }
            },function(err){
              AuthenticationToken.setToken();
        			AuthenticationToken.setType();
        			AuthenticationToken.setUsername();
        			AuthenticationToken.setId();
        			$location.path('/');
        			location.reload();
            });
        }
    })


    //Your Reservations controller
    .controller('yourReservations', function(AuthenticationToken,Pager, $http, $scope, $location, $timeout, Reservation, $routeParams, $window) {
        var app = this;
        $scope.success = true;
        $scope.errorMessage = "You have no reservations currently !";
        var client_id = "58f24bf50a785f677525f8f1" // TODO : to be changed to authentication id

        $scope.currentPage = 1;
        $scope.itemsPerPage = 6;

        $scope.modalShown = false ;
        $scope.toggleModal = function (){
          $scope.modalShown = !$scope.modalShown;
        }

        Reservation.getAllReservation(client_id).then(function(data) {

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
          AuthenticationToken.setToken();
    			AuthenticationToken.setType();
    			AuthenticationToken.setUsername();
    			AuthenticationToken.setId();
    			$location.path('/');
    			location.reload();
        });




        $scope.Delete = function(type, reservation_id) {
            var cancelReservation = $window.confirm('Are you sure you want to cancel this Reservation ? ');
            if (cancelReservation) {

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
                      AuthenticationToken.setToken();
                			AuthenticationToken.setType();
                			AuthenticationToken.setUsername();
                			AuthenticationToken.setId();
                			$location.path('/');
                			location.reload();
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
                      AuthenticationToken.setToken();
                			AuthenticationToken.setType();
                			AuthenticationToken.setUsername();
                			AuthenticationToken.setId();
                			$location.path('/');
                			location.reload();
                    });
                }
            }
        }

    })
