/*jshint undef: false */

describe('Directive with interpolation conf', function() {

    var element, scope, controller, compile;

    beforeEach(function() {
        module('ncy-interpolation-conf');
    });

    beforeEach(inject(function($rootScope, $compile, $controller) {
        element = angular.element('<div ncy-breadcrumb></div>');
        compile = $compile(element);
        scope = $rootScope.$new();
        controller = $controller;
    }));

    it('interpolates labels correctly', inject(function() {
        goToState('A.B');

        controller('BCtrl', {'$scope' : scope} );
        compile(scope);

        expect(scope.tripleB).toBeDefined();

        scope.$emit('$viewContentLoaded');
        scope.$digest();

        console.info('Directive content : ' + element.text());

        expect(element.text()).toContain('State BBB');
    }));

});