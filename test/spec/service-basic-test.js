/*jshint undef: false */

describe('Service with basic conf', function() {
    var $rootScope;

    beforeEach(function() {
        module('ncy-basic-conf');
    });

    it('must be defined', inject(function($breadcrumb) {
        expect($breadcrumb).toBeDefined();
    }));

    beforeEach(inject(function (_$rootScope_) {
        $rootScope = _$rootScope_;
    }));

    it('should have a 3-step route to C state', inject(function($breadcrumb) {
        goToState('A.B.C');
        $breadcrumb.getStatesChain().then(function (statesChain) {
            expect(stringifyStateChain(statesChain)).toBe('A --> A.B --> A.B.C');
        });

        $breadcrumb.getLastStep().then(function (lastStep) {
            expect(lastStep.name).toBe('A.B.C');
        });

        $rootScope.$digest();
    }));

    it('should work also with "parent" state\'s property', inject(function($breadcrumb) {
        goToState('D');
        $breadcrumb.getStatesChain().then(function (statesChain) {
            expect(stringifyStateChain(statesChain)).toBe('A --> A.B --> A.B.C --> D');
        });

        $breadcrumb.getLastStep().then(function (lastStep) {
            expect(lastStep.name).toBe('D');
        });

        $rootScope.$digest();
    }));

    it('must build a correct link for each steps', inject(function($breadcrumb) {
        goToState('D');

        $breadcrumb.getStatesChain().then(function (statesChain) {
            expect(statesChain[0].ncyBreadcrumbLink).toBe('#/a');
            expect(statesChain[1].ncyBreadcrumbLink).toBe('#/a/b');
            expect(statesChain[2].ncyBreadcrumbLink).toBe('#/a/b/c');
            expect(statesChain[3].ncyBreadcrumbLink).toBe('#/a/b/c/d');
        });

        $rootScope.$digest();
    }));

    it('should expose the state conf', inject(function($breadcrumb) {
        goToState('A.B');

        $breadcrumb.getLastStep().then(function (lastStep) {
            expect(lastStep.ncyBreadcrumbStateRef).toBe('A.B');
        });

        $rootScope.$digest();
    }));

    it('should not return the step for E state', inject(function($breadcrumb) {
        goToState('D.E');
        $breadcrumb.getStatesChain().then(function (statesChain) {
            expect(stringifyStateChain(statesChain)).toBe('A --> A.B --> A.B.C --> D');
        });

        $breadcrumb.getLastStep().then(function (lastStep) {
            expect(lastStep.name).toBe('D');
        });

        $rootScope.$digest();
    }));

    it('should have a 5-step route to F state (E skipped)', inject(function($breadcrumb) {
        goToState('D.E.F');

        $breadcrumb.getStatesChain().then(function (statesChain) {
            expect(stringifyStateChain(statesChain)).toBe('A --> A.B --> A.B.C --> D --> D.E.F');
        });

        $rootScope.$digest();
    }));

    it('should return an empty array for skipped G', inject(function($breadcrumb) {
        goToState('G');
        $breadcrumb.getStatesChain().then(function (statesChain) {
            expect(stringifyStateChain(statesChain)).toBe('');
        });

        $breadcrumb.getLastStep().then(function (lastStep) {
            expect(lastStep).toBeUndefined();
        });

        $rootScope.$digest();
    }));

    it('should return a one step chain to G.H', inject(function($breadcrumb) {
        goToState('G.H');
        $breadcrumb.getStatesChain().then(function (statesChain) {
            expect(stringifyStateChain(statesChain)).toBe('G.H');
        });

        $breadcrumb.getLastStep().then(function (lastStep) {
            expect(lastStep.name).toBe('G.H');
        });

        $rootScope.$digest();
    }));

});
