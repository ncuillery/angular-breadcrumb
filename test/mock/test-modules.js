/*jshint undef: false */

/**
 * Module with minimalist configuration.
 */
angular.module('ncy-basic-conf', []).config(function($stateProvider) {
    $stateProvider
        .state('A', {url: '/a', data: {ncyBreadcrumbLabel: 'State A'}})
        .state('A.B', {url: '/b', data: {ncyBreadcrumbLabel: 'State B'}})
        .state('A.B.C', {url: '/c', data: {ncyBreadcrumbLabel: 'State C'}})
        .state('D', {parent: 'A.B.C', url: '/d', data: {ncyBreadcrumbLabel: 'State D'}}) // Explicit parent
        .state('D.E', {url: '/e', data: {ncyBreadcrumbLabel: 'State E', ncyBreadcrumbSkip: true}})
        .state('D.E.F', {url: '/f', data: {ncyBreadcrumbLabel: 'State F'}})
        .state('G', {url: '/g', data: {ncyBreadcrumbLabel: 'State G', ncyBreadcrumbSkip: true}})
        .state('G.H', {url: '/h', data: {ncyBreadcrumbLabel: 'State H'}});
});

/**
 * Module with angular expressions in ncyBreadcrumbLabel
 */
angular.module('ncy-interpolation-conf', []).config(function($stateProvider) {
    $stateProvider
        .state('A', {url: '/a', controller: 'ACtrl', template: '<div>View A</div>',data: {ncyBreadcrumbLabel: 'State A'}})
        .state('A.B', {url: '/b', controller: 'BCtrl', template: '<div>View B</div>', data: {ncyBreadcrumbLabel: 'State {{tripleB}}'}})
        .state('A.B.C', {url: '/c', data: {ncyBreadcrumbLabel: 'State C'}}) // no controller
        .state('A.B.D', {url: '/d', controller: function($scope) {$scope.tripleD='DDD';}, template: '<div>View D</div>', data: {ncyBreadcrumbLabel: 'State {{tripleD}}'}}); // inline controller
}).controller('ACtrl', function($scope) {
    $scope.tripleA = 'AAA';
}).controller('BCtrl', function($scope) {
    $scope.tripleB = 'BBB';
});

angular.module('ncy-sample-conf', ['ncy-sample', 'ngMock']).config(function($urlRouterProvider) {
    // New module to override the otherwise of the sample app.
    // (we don't want to deal with the location according to each state)
    $urlRouterProvider.otherwise(function() {
        return false;
    });
}).run(function($httpBackend) {
    // Due to templateUrl definitions in $state configuration,
    // httpBackend will try to load the view for each state asked.
    $httpBackend.when('GET', 'views/home.html').respond('dummy home view');
    $httpBackend.when('GET', 'views/sample.html').respond('dummy sample view');
    $httpBackend.when('GET', 'views/room_list.html').respond('dummy room_list view');
    $httpBackend.when('GET', 'views/room_detail.html').respond('dummy room_detail view');
    $httpBackend.when('GET', 'views/room_form.html').respond('dummy room_form view');
});