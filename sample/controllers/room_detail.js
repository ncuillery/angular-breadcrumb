angular.module('ncy-sample')
  .controller('RoomDetailCtrl', function($scope, $state, $stateParams, rooms) {
    $scope.rooms = rooms;

    if($stateParams.roomId) {
      $scope.room = _.findWhere(rooms, {roomId: parseInt($stateParams.roomId)});
      if($scope.room) {
        $scope.model = angular.copy($scope.room);
      } else {
        $state.go('^');
      }

    }

    $scope.save = function() {
      if($scope.model.roomId) {
        angular.extend($scope.room, $scope.model);
      } else {
        var ids = _.map(rooms, function(room) { return room.roomId; });
        $scope.model.roomId = _.max(ids) + 1;
        rooms.push($scope.model);
      }
      $state.go('^');
    }

  });
