angular.module('ncy-sample')
  .controller('BookingDayCtrl', function($scope, $stateParams) {
    $scope.reservationDate = new Date($stateParams.year, $stateParams.month - 1, $stateParams.day);
  });
