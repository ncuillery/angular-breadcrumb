/*jshint undef: false */

describe('Text directive with interpolation conf', function() {

    var element, scope, controller, compile;

    beforeEach(function() {
        module('ncy-interpolation-conf');
    });

    beforeEach(inject(function($rootScope, $compile, $controller) {
        element = angular.element('<span ncy-breadcrumb-text="test|{{ncyBreadcrumbChain}}"></span>');
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

        expect(element.text()).toBe('test|State A / State BBB');
    }));

    it('deals with further updates of the scope', inject(function() {
        goToState('A.B');

        controller('BCtrl', {'$scope' : scope} );
        compile(scope);

        scope.$emit('$viewContentLoaded');
        scope.$digest();

        console.info('Directive content : ' + element.text());

        expect(element.text()).toBe('test|State A / State BBB');

        scope.tripleB = 'HACKED';
        scope.$digest();

        expect(element.text()).toBe('test|State A / State HACKED');

    }));



});
