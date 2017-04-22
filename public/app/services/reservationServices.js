angular.module('reservationServices', [])
    .factory('Reservation', function($http) {
        reservationFactory = {};
        reservationFactory.getActivity = function(activity_id, activity_type) { //$routeParams.activity_id in controller; TODO : remove actiity type and zbtha .

            return $http.get('api/reserve/activity/' + activity_type + '/' + activity_id);

        }

        reservationFactory.ReserveNR = function(activity_id, price, reservationData) {
            var parameters = JSON.stringify({
                activity_id: activity_id,
                participants: reservationData,
                price: price
            });
            return $http.post('api/reserve/1/' + activity_id, parameters);
        }


        reservationFactory.ReserveR = function(activity_id , package_id, slot_id, date) {


            var parameters = JSON.stringify({
                activity_id: activity_id,
                package_id: package_id,
                slot_id: slot_id,
                date: date
            });
            return $http.post('api/reserve/0/' + activity_id, parameters);
        }

        reservationFactory.getAllReservation = function() {

            return $http.get('api/getReservations/');
        }
        reservationFactory.cancelReservationR = function(reservation_id) {
            return $http.get('api/cancelReservation/0/' + reservation_id);
        }
        reservationFactory.cancelReservationNR = function(reservation_id) {
            return $http.get('api/cancelReservation/1/' + reservation_id);
        }

        return reservationFactory;
    })
