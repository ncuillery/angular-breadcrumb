angular.module('ncy-sample')
  .controller('HomeCtrl', function($scope, $state) {
     $scope.title = 'Home';

     $scope.moveToState = function() {
         $state.go('room.detail', {roomId: 1});
     }
  });
