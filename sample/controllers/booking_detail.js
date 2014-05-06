angular.module('ncy-sample')
  .controller('BookingDetailCtrl', function($scope, $stateParams, dateUtils, reservations, rooms) {
    $scope.addDays = dateUtils.addDays;
    $scope.reservation = _.findWhere(reservations, {reservationId: parseInt($stateParams.reservationId)});
    $scope.room = _.findWhere(rooms, {roomId: parseInt($scope.reservation.roomId)});
    $scope.dismiss = function() {
      $scope.$dismiss();
    };
  });
