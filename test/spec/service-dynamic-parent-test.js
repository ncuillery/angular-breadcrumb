/*jshint undef: false */

describe('Service with dynamic parent conf', function() {

    beforeEach(function() {
        module('ncy-dynamic-parent-conf');
    });

    it('must be defined', inject(function($breadcrumb) {
        expect($breadcrumb).toBeDefined();
    }));

    it('should use the custom breadcrumb\'s parent property for D.E.F (a string)', inject(function($breadcrumb) {
        goToState('D.E.F');
        var statesChain = $breadcrumb.getStatesChain();
        expect(stringifyStateChain(statesChain)).toBe('A --> A.B --> D.E.F');
    }));

    it('should use the custom breadcrumb\'s parent property for D.E.G (a function)', inject(function($breadcrumb) {
        goToState('D.E.G');
        var statesChain = $breadcrumb.getStatesChain();
        expect(stringifyStateChain(statesChain)).toBe('A --> D.E.G');
    }));

});
