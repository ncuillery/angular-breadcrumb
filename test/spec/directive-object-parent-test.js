/*jshint undef: false */

describe('Breadcrumb directive with object parent conf', function() {

    var element;

    beforeEach(function() {
        module('ncy-object-parent-conf');
    });

    beforeEach(inject(function($rootScope, $compile) {
        var elem = angular.element('<ncy-breadcrumb></ncy-breadcrumb><div ui-view></div>');
        element = $compile(elem)($rootScope.$new());
    }));

    it('should handle parents provided by object reference', inject(function() {
        goToState('B');
        
        expect(element.text()).toContain('State A');
        expect(element.text()).toContain('State B');
    }));


});
