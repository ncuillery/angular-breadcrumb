/*jshint undef: false */

describe('Breadcrumb directive with ui-sref template', function() {

    var element, scope;

    beforeEach(function() {
        module('ncy-ui-sref-template-conf');
    });

    beforeEach(inject(function($rootScope, $compile) {
        element = angular.element('<div ncy-breadcrumb></div>');
        var compile = $compile(element);
        scope = $rootScope.$new();
        compile(scope);
        scope.$digest();
    }));

    it('should work correctly', inject(function() {
        goToState('A.B');
        scope.$emit('$viewContentLoaded');
        scope.$digest();

        console.info('Directive content : ' + element.text());
        expect(element.text()).toContain('State A');
        expect(element.text()).toContain('State B');
        expect(element.find('a').eq(0).attr('href')).toBe('#/a');
        expect(element.find('a').eq(1).attr('href')).toBe('#/a/b');
    }));

    it('should deal with url params correctly', inject(function() {
        goToState('J');
        scope.$emit('$viewContentLoaded');
        scope.$digest();

        console.info('Directive content : ' + element.text());

        expect(element.text()).toContain('State I');
        expect(element.text()).toContain('State J');

        expect(element.find('a').eq(0).attr('href')).toBe('#/i/love/you');
    }));


    it('should deal with url params correctly even with dynamic parent', inject(function() {
        goToState('K');
        scope.$emit('$viewContentLoaded');
        scope.$digest();

        console.info('Directive content : ' + element.text());

        expect(element.text()).toContain('State I');
        expect(element.text()).toContain('State K');

        expect(element.find('a').eq(0).attr('href')).toBe('#/i/love/you');
    }));

});
