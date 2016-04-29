/*jshint undef: false */

describe('Breadcrumb directive with interpolation conf', function () {
    var element, $rootScope;

    beforeEach(function () {
        module('ncy-interpolation-conf');
    });

    beforeEach(inject(function (_$rootScope_, $compile) {
        var elem = angular.element('<div ncy-breadcrumb></div><div ui-view></div>');
        $rootScope = _$rootScope_;
        element = $compile(elem)($rootScope.$new());
    }));

    it('interpolates labels correctly', inject(function () {
        goToState('A.B');

        expect(element.text()).toContain('State BBB');

        expect(element.find('a').eq(0).attr('href')).toBe('#/a');
    }));

    it('deals with further updates of the scope', inject(function ($state) {
        goToState('A.B');

        expect(element.text()).toContain('State BBB');

        $state.$current.locals['@A'].$scope.tripleB = 'HACKED';
        $rootScope.$digest();

        expect(element.text()).toContain('State HACKED');
    }));
});
