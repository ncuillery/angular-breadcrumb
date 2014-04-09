/*jshint undef: false */

angular.module('ncy-basic-conf', function() {}).config(function($stateProvider) {
    $stateProvider
        .state('A', {url: '/a', data: {ncyBreadcrumbLabel: 'State A'}})
        .state('A.B', {url: '/b', data: {ncyBreadcrumbLabel: 'State B'}})
        .state('A.B.C', {url: '/c', data: {ncyBreadcrumbLabel: 'State C'}})
        .state('D', {parent: 'A.B.C', url: '/d', data: {ncyBreadcrumbLabel: 'State D'}}); // Explicit parent
});
