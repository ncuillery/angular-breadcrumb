/*jshint undef: false */

describe('Directive', function() {

    var element;

    beforeEach(function() {
        angular.module('ncy-directive-simple-test', function() {}).config(function($stateProvider) {
            $stateProvider
                .state('A', {url: '/a', data: {ncyBreadcrumbLabel: 'State A'}})
                .state('A.B', {url: '/b', data: {ncyBreadcrumbLabel: 'State B'}})
                .state('A.B.C', {url: '/c', data: {ncyBreadcrumbLabel: 'State C'}})
                .state('D', {parent: 'A.B.C', url: '/d', data: {ncyBreadcrumbLabel: 'State D'}}); // Explicit parent
        });

        // Order of arguments has importance here.
        module('ncy-directive-simple-test');
    });

    beforeEach(inject(function($rootScope, $compile) {
        element = angular.element('<div ncy-breadcrumb></div>');
        var compile = $compile(element);
        //var scope = $rootScope.$new();
        compile($rootScope);
        $rootScope.$digest();
    }));

    it('works with simple conf', inject(function() {
        goToState('D');
        console.info('Directive content : ', element.text());
        expect(element.text()).toContain('State A');
        expect(element.text()).toContain('State B');
        expect(element.text()).toContain('State C');
        expect(element.text()).toContain('State D');
    }));

});