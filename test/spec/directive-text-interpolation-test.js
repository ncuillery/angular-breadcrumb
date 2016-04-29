/*jshint undef: false */

describe('Text directive with interpolation conf', function() {
    var element, $rootScope;

    beforeEach(function() {
        module('ncy-interpolation-conf');
    });

    beforeEach(inject(function(_$rootScope_, $compile) {
        var elem = angular.element('<span ncy-breadcrumb-text="test|{{ncyBreadcrumbChain}}"></span><div ui-view></div>');
        $rootScope = _$rootScope_;
        element = $compile(elem)($rootScope.$new());
    }));

    it('interpolates labels correctly', inject(function() {
        goToState('A.B');

        expect(element.text()).toBe('test|State A / State BBB');
    }));

    it('deals with further updates of the scope', inject(function($state) {
        goToState('A.B');

        expect(element.text()).toBe('test|State A / State BBB');

        $state.$current.locals['@A'].$scope.tripleB = 'HACKED';
        $rootScope.$digest();

        expect(element.text()).toBe('test|State A / State HACKED');
    }));
});
