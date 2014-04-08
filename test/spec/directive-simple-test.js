/*jshint undef: false */

describe('Directive', function() {

    var element, scope;

    beforeEach(function() {
        angular.module('ncy-directive-simple-test', function() {}).config(function($stateProvider) {
            $stateProvider
                .state('A', {url: '/a', data: {ncyBreadcrumbLabel: 'State A'}})
                .state('A.B', {url: '/b', data: {ncyBreadcrumbLabel: 'State B'}})
                .state('A.B.C', {url: '/c', data: {ncyBreadcrumbLabel: 'State C'}})
                .state('D', {parent: 'A.B.C', url: '/d', data: {ncyBreadcrumbLabel: 'State D'}}); // Explicit parent

            console.log('$stateProvider initialise');
        });

        // Order of arguments has importance here.
        module('ncy-directive-simple-test');
    });

    beforeEach(inject(function($rootScope, $compile) {
        element = angular.element('<div ncy-breadcrumb></div>');
        var compile = $compile(element);
        scope = $rootScope.$new();
        compile(scope);
        scope.$digest();

    }));

    it('works with simple conf', inject(function() {
        goToState('D');
        scope.$emit('$viewContentLoaded');
        scope.$digest();

        console.info('Directive content : ', element.text());
        expect(element.text()).toContain('State A');
        expect(element.text()).toContain('State B');
        expect(element.text()).toContain('State C');
        expect(element.text()).toContain('State D');
    }));

});