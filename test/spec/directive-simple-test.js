/*jshint undef: false */

describe('Directive', function() {

    var element;

    beforeEach(function() {
        angular.module('ncy-directive-simple-test', function() {}).config(function($stateProvider) {
            $stateProvider
                .state('A', {url: '/a'})
                .state('A.B', {url: '/b'})
                .state('A.B.C', {url: '/c'})
                .state('D', {parent: 'A.B.C', url: '/d'});
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
        goToState('A.B');
        console.info('Directive content : ', element.text());
        expect(element.text()).toContain('A.B');
    }));


});