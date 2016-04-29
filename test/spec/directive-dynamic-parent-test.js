/*jshint undef: false */

describe('Breadcrumb directive with dynamic parent conf', function () {
    var element, $rootScope;

    beforeEach(function () {
        module('ncy-dynamic-parent-conf');
    });

    beforeEach(inject(function (_$rootScope_, $compile) {
        var elem = angular.element('<div ncy-breadcrumb></div><div ui-view></div>');
        $rootScope = _$rootScope_;
        element = $compile(elem)($rootScope.$new());
    }));

    it('should use the custom breadcrumb\'s parent property referencing a variable of the scope', inject(function () {
        goToState('D.E.H');
        $rootScope.$digest();

        expect(element.text()).toContain('State C');
        expect(element.text()).toContain('State H');
        expect(element.text()).not.toContain('State E');
    }));

    it('should ignore the custom breadcrumb\'s parent property if it is a function returning undefined', inject(function () {
        goToState('D.E.K');
        $rootScope.$digest();

        expect(element.text()).toContain('State D');
        expect(element.text()).toContain('State E');
        expect(element.text()).toContain('State K');
    }));

    it('deals with url params correctly', inject(function () {
        goToState('J');
        $rootScope.$digest();
        
        expect(element.text()).toContain('State I');
        expect(element.text()).toContain('State J');

        expect(element.find('a').attr('href')).toBe('#/i/love/you');
    }));

});
