/*jshint undef: false */

describe('Breadcrumb directive with ui-sref template', function() {

    var element;

    beforeEach(function() {
        module('ncy-ui-sref-template-conf');
    });

    beforeEach(inject(function($rootScope, $compile) {
        var elem = angular.element('<div ncy-breadcrumb></div><div ui-view></div>');
        element = $compile(elem)($rootScope.$new());
    }));

    it('should work correctly', inject(function() {
        goToState('A.B');
        
        expect(element.text()).toContain('State A');
        expect(element.text()).toContain('State B');
        expect(element.find('a').eq(0).attr('href')).toBe('#/a');
        expect(element.find('a').eq(1).attr('href')).toBe('#/a/b');
    }));

    it('should deal with url params correctly', inject(function() {
        goToState('J');

        expect(element.text()).toContain('State I');
        expect(element.text()).toContain('State J');

        expect(element.find('a').eq(0).attr('href')).toBe('#/i/love/you');
    }));


    it('should deal with url params correctly even with dynamic parent', inject(function() {
        goToState('K');

        expect(element.text()).toContain('State I');
        expect(element.text()).toContain('State K');

        expect(element.find('a').eq(0).attr('href')).toBe('#/i/love/you');
    }));

});
