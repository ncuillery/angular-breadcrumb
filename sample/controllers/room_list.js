angular.module('sample')
  .controller('RoomListCtrl', function($scope, rooms) {
    $scope.rooms = rooms.value;
  });
