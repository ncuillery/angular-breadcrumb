angular.module('ncy-sample')
  .controller('RoomDetailCtrl', function($scope, $stateParams, rooms) {
    $scope.rooms = rooms;
    $scope.room = _.findWhere(rooms, {roomId: parseInt($stateParams.roomId)});
  });
