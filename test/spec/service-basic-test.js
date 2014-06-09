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

    it('builds correct link for nested views', inject(function($breadcrumb) {
      goToState('X.Y', {x: 'x', y: 'y'});
      var statesChain = $breadcrumb.getStatesChain();
      expect(statesChain[0].ncyBreadcrumbLink).toBe('#/x');
      expect(statesChain[1].ncyBreadcrumbLink).toBe('#/x/y');
    }));

    it('should not return the step for E state', inject(function($breadcrumb) {
        goToState('D.E');
        var statesChain = $breadcrumb.getStatesChain();
        expect(stringifyStateChain(statesChain)).toBe('A --> A.B --> A.B.C --> D');
    }));

    it('should have a 5-step route to F state (E skipped)', inject(function($breadcrumb) {
        goToState('D.E.F');
        var statesChain = $breadcrumb.getStatesChain();
        expect(stringifyStateChain(statesChain)).toBe('A --> A.B --> A.B.C --> D --> D.E.F');
    }));

    it('should return an empty array for skipped G', inject(function($breadcrumb) {
        goToState('G');
        var statesChain = $breadcrumb.getStatesChain();
        expect(stringifyStateChain(statesChain)).toBe('');
    }));

    it('should return a one step chain to G.H', inject(function($breadcrumb) {
        goToState('G.H');
        var statesChain = $breadcrumb.getStatesChain();
        expect(stringifyStateChain(statesChain)).toBe('G.H');
    }));

});
