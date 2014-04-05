/*jshint undef: false */

describe('Directive', function() {

    var element, scope, controller, compile;

    beforeEach(function() {
        angular.module('ncy-directive-scoped-test', function() {}).config(function($stateProvider) {
            $stateProvider
                .state('A', {url: '/a', controller: 'ACtrl', template: '<div>View A</div>',data: {ncyBreadcrumbLabel: 'State A'}})
                .state('A.B', {url: '/b', controller: 'BCtrl', template: '<div>View B</div>', data: {ncyBreadcrumbLabel: 'State {{tripleB}}'}})
                .state('A.B.C', {url: '/c', data: {ncyBreadcrumbLabel: 'State C'}}) // no controller
                .state('A.B.D', {url: '/d', controller: function($scope) {$scope.tripleD='DDD';}, template: '<div>View D</div>', data: {ncyBreadcrumbLabel: 'State {{tripleD}}'}}); // inline controller
        }).controller('ACtrl', function($scope) {
                $scope.tripleA = 'AAA';
        }).controller('BCtrl', function($scope) {
            $scope.tripleB = 'BBB';           console.info('Scope loaded');
        });

        // Order of arguments has importance here.
        module('ncy-directive-scoped-test');
    });

    beforeEach(inject(function($rootScope, $compile, $controller) {
        element = angular.element('<div ncy-breadcrumb></div>');
        compile = $compile(element);
        scope = $rootScope.$new();
        controller = $controller;
    }));

    it('deals with scoped labels', inject(function() {
        goToState('A.B');

        controller('BCtrl', {'$scope' : scope} );
        compile(scope);

        expect(scope.tripleB).toBeDefined();

        scope.$emit('$viewContentLoaded');
        scope.$digest();

        console.info('Directive content : ', element.text());

        expect(element.text()).toContain('State BBB');
    }));

});