/*jshint undef: false */

describe('Breadcrumb directive with basic conf', function() {

    var element, scope;

    beforeEach(function() {
        module('ncy-basic-conf');
    });

    beforeEach(inject(function($rootScope, $compile) {
        element = angular.element('<ncy-breadcrumb />');
        var compile = $compile(element);
        scope = $rootScope.$new();
        compile(scope);
        scope.$digest();
    }));

    it('renders the correct state chain', inject(function() {
        goToState('D');
        scope.$emit('$viewContentLoaded');
        scope.$digest();

        console.info('Directive content : ' + element.text());
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

    it('should work with one state', inject(function() {
        goToState('A');
        scope.$emit('$viewContentLoaded');
        scope.$digest();

        console.info('Directive content : ' + element.text());
        expect(element.text()).toContain('State A');

        expect(element.children().length).toBe(1);
        expect(element.find('a').length).toBe(0);
    }));

});
