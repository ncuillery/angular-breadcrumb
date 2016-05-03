/*jshint undef: false */

describe('Breadcrumb directive with basic conf', function () {

    var element, $rootScope;

    beforeEach(function () {
        module('ncy-basic-conf');
    });

    beforeEach(inject(function (_$rootScope_, $compile) {
        var elem = angular.element('<ncy-breadcrumb></ncy-breadcrumb><div ui-view></div>');
        $rootScope = _$rootScope_;
        element = $compile(elem)($rootScope.$new());
    }));

    it('renders the correct state chain', inject(function () {
        goToState('D');
        $rootScope.$digest();

        expect(element.text()).toContain('State A');
        expect(element.text()).toContain('State B');
        expect(element.text()).toContain('State C');
        expect(element.text()).toContain('State D');

        expect(element.children().length).toBe(4);
        expect(element.find('a').length).toBe(3);

        expect(element.find('a').eq(0).attr('href')).toBe('#/a');
        expect(element.find('a').eq(1).attr('href')).toBe('#/a/b');
        expect(element.find('a').eq(2).attr('href')).toBe('#/a/b/c');
    }));

    it('should work with one state', inject(function () {
        goToState('A');

        expect(element.text()).toContain('State A');

        expect(element.children().length).toBe(1);
        expect(element.find('a').length).toBe(0);
    }));

});
