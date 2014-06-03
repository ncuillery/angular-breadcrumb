angular.module('ncy-sample')
  .controller('BookingListCtrl', function($scope, $rootScope, $state, dateUtils, reservations) {

    // Some hardcoded data ;
    $scope.reservations = reservations;

    $scope.$watch('reservationDate', function(newValue, oldValue) {
        $scope.dpModel = $rootScope.reservationDate;
    });


    $scope.$watch('dpModel', function(newValue, oldValue) {
      if(newValue && !angular.equals(newValue, oldValue)) {
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
