/*jshint undef: false */

describe('Breadcrumb directive with interpolation conf', function() {

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

        scope.$emit('$stateChangeSuccess');
        scope.$digest();

        console.info('Directive content : ' + element.text());

        expect(element.text()).toContain('State BBB');

        expect(element.find('a').eq(0).attr('href')).toBe('#/a');
    }));

    it('deals with further updates of the scope', inject(function() {
        goToState('A.B');

        controller('BCtrl', {'$scope' : scope} );
        compile(scope);

        scope.$emit('$stateChangeSuccess');
        scope.$digest();

        console.info('Directive content : ' + element.text());

        expect(element.text()).toContain('State BBB');

        scope.tripleB = 'HACKED';
        scope.$digest();

        expect(element.text()).toContain('State HACKED');

    }));

});
