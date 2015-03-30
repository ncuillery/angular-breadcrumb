/*jshint undef: false */

describe('Breadcrumb directive with object parent conf', function() {

    var element, scope;

    beforeEach(function() {
        module('ncy-object-parent-conf');
    });

    beforeEach(inject(function($rootScope, $compile) {
        element = angular.element('<ncy-breadcrumb />');
        var compile = $compile(element);
        scope = $rootScope.$new();
        compile(scope);
        scope.$digest();
    }));

    it('should handle parents provided by object reference', inject(function() {
        goToState('B');
        scope.$emit('$viewContentLoaded');
        scope.$digest();

        console.info('Directive content : ' + element.text());
        expect(element.text()).toContain('State A');
        expect(element.text()).toContain('State B');
    }));


});
