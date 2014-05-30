angular.module('ncy-sample')
  .controller('BookingListCtrl', function($scope, $state, dateUtils, reservations) {

    // Some hardcoded data ;
    $scope.reservations = reservations;

    $scope.$watch('reservationDate', function(newValue) {
      if(newValue) {
        $state.go('booking.day', {year: newValue.getFullYear(), month: newValue.getMonth() + 1, day: newValue.getDate()});
      }
    });

    $scope.between = function(date) {
      return _.filter($scope.reservations, function(reservation) {
        var from = reservation.from;
        var to = dateUtils.addDays(reservation.nights, reservation.from);
        return from <= date && date < to;
      });
    };

  });
