angular.module('ncy-sample')
  .controller('BookingListCtrl', function($scope, $state) {

    // Some hardcoded data ;
    $scope.reservations = [
      {reservationId: 1, guestName: 'Robert Smith', roomId: '2', from: new Date(2013, 09, 04), nights: 3},
      {reservationId: 2, guestName: 'John Doe', roomId: '3', from: new Date(2013, 08, 14), nights: 5},
      {reservationId: 3, guestName: 'William Gordon', roomId: '1', from: new Date(2013, 08, 16), nights: 6},
      {reservationId: 4, guestName: 'Michael Robinson', roomId: '2', from: new Date(2013, 08, 31), nights: 2}
    ];

    $scope.$watch('reservationFilter', function(newValue) {
      if(newValue) {
        $state.go('booking.day', {year: newValue.getFullYear(), month: newValue.getMonth() + 1, day: newValue.getDate()});
      }
    });

  });
