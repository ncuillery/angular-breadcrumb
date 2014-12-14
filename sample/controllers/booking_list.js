angular.module('ncy-sample')
  .controller('BookingListCtrl', function($scope, $rootScope, $state, dateUtils, reservations) {

    // Some hardcoded data ;
    this.reservations = reservations;

    $scope.$watch(angular.bind(this, function (name) {
        return this.reservationDate;
    }), angular.bind(this, function(newValue, oldValue) {
        return this.dpModel = $rootScope.reservationDate;
    }));


    $scope.$watch(angular.bind(this, function (name) {
        return this.dpModel;
    }), function(newValue, oldValue) {
      if(newValue && !angular.equals(newValue, oldValue)) {
        $state.go('booking.day', {year: newValue.getFullYear(), month: newValue.getMonth() + 1, day: newValue.getDate()});
      }
    });

    this.between = function(date) {
      return _.filter(this.reservations, function(reservation) {
        var from = reservation.from;
        var to = dateUtils.addDays(reservation.nights, reservation.from);
        return from <= date && date < to;
      });
    };

  });
