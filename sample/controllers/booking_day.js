angular.module('ncy-sample')
  .controller('BookingDayCtrl', function($scope, $rootScope, $state, $stateParams, rooms) {
    $rootScope.reservationDate = new Date($stateParams.year, $stateParams.month - 1, $stateParams.day);

    if(!$scope.between($rootScope.reservationDate).length) {
        $state.go('^');
    }

    $scope.getRoom = function(id) {
        return _.findWhere(rooms, {roomId: parseInt(id)});
    }
  });
