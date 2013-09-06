angular.module('sample')
  .controller('RoomDetailCtrl', function($scope, $stateParams, rooms) {
    $scope.rooms = rooms.value;
    $scope.room = _.findWhere(rooms.value, {roomId: parseInt($stateParams.roomId)});
  });
