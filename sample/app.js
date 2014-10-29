'use strict'

angular.module('ncy-sample', ['ui.router.state', 'ui.bootstrap', 'ncy-angular-breadcrumb'])
  .config(function($breadcrumbProvider) {
    $breadcrumbProvider.setOptions({
      prefixStateName: 'home',
      template: 'bootstrap2'
    });
  })
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'views/home.html',
        ncyBreadcrumb: {
          label: 'Home'
        }
      })
      .state('sample', {
        url: '/sample',
        templateUrl: 'views/sample.html',
        ncyBreadcrumb: {
          label: 'Sample'
        }
      })
      .state('booking', {
        url: '/booking',
        templateUrl: 'views/booking_list.html',
        controller: 'BookingListCtrl',
        ncyBreadcrumb: {
          label: 'Reservations',
          parent: 'sample'
        }
      })
      .state('booking.day', {
        url: '/:year-:month-:day',
        templateUrl: 'views/booking_day.html',
        controller: 'BookingDayCtrl',
        onExit: function($rootScope) {
          $rootScope.reservationDate = undefined;
        },
        ncyBreadcrumb: {
          label: 'Reservations for {{reservationDate | date:\'mediumDate\'}}'
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
        ncyBreadcrumb: {
          skip: true
        }
      })
      .state('room', {
        url: '/room',
        templateUrl: 'views/room_list.html',
        controller: 'RoomListCtrl',
        ncyBreadcrumb: {
          label: 'Rooms',
          parent: 'sample'
        }
      })
      .state('room.new', {
        url: '/new',
        views: {
          "@" : {
            templateUrl: 'views/room_form.html',
            controller: 'RoomDetailCtrl'
          }
        },
        ncyBreadcrumb: {
          label: 'New room'
        }
      })
      .state('room.detail', {
        url: '/{roomId}?from',
        views: {
          "@" : {
            templateUrl: 'views/room_detail.html',
            controller: 'RoomDetailCtrl'
          }
        },
        ncyBreadcrumb: {
          label: 'Room {{room.roomNumber}}',
          parent: function ($scope) {
            return $scope.from || 'room';
          }
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
        ncyBreadcrumb: {
          label: 'Editing'
        }
      });

    $urlRouterProvider.otherwise('/home');

  })
  .value('rooms', [
    {roomId: 1, roomNumber: 101, type: 'Double'},
    {roomId: 2, roomNumber: 102, type: 'Double'},
    {roomId: 3, roomNumber: 103, type: 'Single'},
    {roomId: 4, roomNumber: 104, type: 'Double'}
  ])
  .factory('reservations', function(dateUtils) {
    return [
      {reservationId: 1, guestName: 'Robert Smith', roomId: '2', from: dateUtils.addDays(-1), nights: 3},
      {reservationId: 2, guestName: 'John Doe', roomId: '3', from: dateUtils.addDays(-8), nights: 5},
      {reservationId: 3, guestName: 'William Gordon', roomId: '1', from: dateUtils.addDays(3), nights: 6},
      {reservationId: 4, guestName: 'Michael Robinson', roomId: '2', from: dateUtils.addDays(6), nights: 2},
      {reservationId: 5, guestName: 'Tracy Marschall', roomId: '3', from: dateUtils.addDays(12), nights: 1}
    ];
  })
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
  .run(function($rootScope, $state, $breadcrumb) {
    $rootScope.isActive = function(stateName) {
      return $state.includes(stateName);
    }
  });
