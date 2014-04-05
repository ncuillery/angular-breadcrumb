angular.module('ncy-sample')
  .controller('RoomListCtrl', function($scope, rooms) {
    $scope.rooms = rooms;
  });
