angular.module('ncy-sample')
  .controller('RoomDetailCtrl', function($state, $stateParams, rooms) {
    this.rooms = rooms;
    if($stateParams.from) {
        this.from = $stateParams.from.split('|')[0];
        this.reservationDate = new Date(parseInt($stateParams.from.split('|')[1]));
    }

    if($stateParams.roomId) {
      this.room = _.findWhere(rooms, {roomId: parseInt($stateParams.roomId)});
      if(this.room) {
        this.model = angular.copy(this.room);
      } else {
        $state.go('^');
      }

    }

    this.save = function() {
      if(this.model.roomId) {
        angular.extend(this.room, this.model);
      } else {
        var ids = _.map(rooms, function(room) { return room.roomId; });
        this.model.roomId = _.max(ids) + 1;
        rooms.push(this.model);
      }
      $state.go('^');
    }

  });
