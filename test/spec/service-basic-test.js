/*jshint undef: false */

describe('Service with basic conf', function() {

    beforeEach(function() {
        module('ncy-basic-conf');
    });

    it('must be defined', inject(function($breadcrumb) {
        expect($breadcrumb).toBeDefined();
    }));

    it('should have a 3-step route to C state', inject(function($breadcrumb) {
        goToState('A.B.C');
        var statesChain = $breadcrumb.getStatesChain();
        expect(stringifyStateChain(statesChain)).toBe('A --> A.B --> A.B.C');
    }));

    it('should work also with "parent" state\'s property', inject(function($breadcrumb) {
        goToState('D');
        var statesChain = $breadcrumb.getStatesChain();
        expect(stringifyStateChain(statesChain)).toBe('A --> A.B --> A.B.C --> D');
    }));

    it('must build a correct link for each steps', inject(function($breadcrumb) {
        goToState('D');
        var statesChain = $breadcrumb.getStatesChain();
        expect(statesChain[0].ncyBreadcrumbLink).toBe('#/a');
        expect(statesChain[1].ncyBreadcrumbLink).toBe('#/a/b');
        expect(statesChain[2].ncyBreadcrumbLink).toBe('#/a/b/c');
        expect(statesChain[3].ncyBreadcrumbLink).toBe('#/a/b/c/d');
    }));
});