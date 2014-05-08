'use strict'

angular.module('ncy-sample', ['ui.router.state', 'ui.bootstrap', 'ncy-angular-breadcrumb'])
  .config(function($breadcrumbProvider) {
    $breadcrumbProvider.setOptions({
      prefixStateName: 'home',
      template: 'bootstrap2'
    });
  })
  .value('rooms', [
    {roomId: 1, roomNumber: 101, type: 'Double'},
    {roomId: 2, roomNumber: 102, type: 'Double'},
    {roomId: 3, roomNumber: 103, type: 'Single'},
    {roomId: 4, roomNumber: 104, type: 'Double'}
  ])
  .factory('dateUtils', function() {
    return {
      addDays: function(days, date) {
        if(!date) {
          var todayTime = new Date();
          todayTime.setHours(0,0,0,0);
          date = new Date(todayTime);
        }

        var newDate = new Date(date);
        newDate.setDate(date.getDate() + days);
        return newDate;
        }
    }
  })
  .factory('reservations', function(dateUtils) {
    return [
      {reservationId: 1, guestName: 'Robert Smith', roomId: '2', from: dateUtils.addDays(-1), nights: 3},
      {reservationId: 2, guestName: 'John Doe', roomId: '3', from: dateUtils.addDays(-8), nights: 5},
      {reservationId: 3, guestName: 'William Gordon', roomId: '1', from: dateUtils.addDays(3), nights: 6},
      {reservationId: 4, guestName: 'Michael Robinson', roomId: '2', from: dateUtils.addDays(6), nights: 2},
      {reservationId: 5, guestName: 'Tracy Marschall', roomId: '3', from: dateUtils.addDays(12), nights: 1}
    ];
  })
  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        data: {
          ncyBreadcrumbLabel: 'Home'
        }
      })
      .state('booking', {
        url: '/booking',
        templateUrl: 'views/booking_list.html',
        controller: 'BookingListCtrl',
        data: {
          ncyBreadcrumbLabel: 'Reservations'
        }
      })
      .state('booking.day', {
        url: '/:year-:month-:day',
        templateUrl: 'views/booking_day.html',
        controller: 'BookingDayCtrl',
        data: {
          ncyBreadcrumbLabel: 'Reservations for {{reservationDate | date:\'mediumDate\'}}'
        }
      })
      .state('booking.day.detail', {
        url: '/{reservationId}',
        onEnter: function($stateParams, $state, $modal) {
          $modal.open({
            templateUrl: "views/booking_detail.html",
            controller: 'BookingDetailCtrl'
          }).result.then(function(result) {
            return $state.go("^");
          }, function(result) {
            return $state.go("^");
          });
        },
        data: {
            ncyBreadcrumbSkip: true
        }
      })
      .state('room', {
        url: '/room',
        templateUrl: 'views/room_list.html',
        controller: 'RoomListCtrl',
        data: {
          ncyBreadcrumbLabel: 'Rooms'
        }
      })
      .state('room.detail', {
        url: '/{roomId}',
        views: {
          "@" : {
            templateUrl: 'views/room_detail.html',
            controller: 'RoomDetailCtrl'
          }
        },
        data: {
          ncyBreadcrumbLabel: 'Room {{room.roomNumber}}'
        }
      })
      .state('room.detail.edit', {
        url: '/edit',
        views: {
          "@" : {
            templateUrl: 'views/room_form.html',
            controller: 'RoomDetailCtrl'
          }
        },
        data: {
          ncyBreadcrumbLabel: 'Editing'
        }
      });

    $urlRouterProvider.otherwise('/home');

  });
