angular.module('ncy-sample')
  .controller('BookingDayCtrl', function($scope, $stateParams, rooms) {
    $scope.reservationDate = new Date($stateParams.year, $stateParams.month - 1, $stateParams.day);

    $scope.getRoom = function(id) {
        return _.findWhere(rooms, {roomId: parseInt(id)});
    }
  });
