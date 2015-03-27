/*jshint undef: false */

describe('Service with abstract conf', function() {

    describe('with default options', function() {

        beforeEach(function() {
            module('ncy-abstract-conf');
        });

        it('should have a 2-step route to C state', inject(function($breadcrumb) {
            goToState('A.B.C');
            var statesChain = $breadcrumb.getStatesChain();
            expect(stringifyStateChain(statesChain)).toBe('A.B --> A.B.C');
        }));

        it('should have a 2-step route to F state', inject(function($breadcrumb) {
            goToState('D.E.F');
            var statesChain = $breadcrumb.getStatesChain();
            expect(stringifyStateChain(statesChain)).toBe('D --> D.E.F');
        }));

        it('should return a one step chain to G.H', inject(function($breadcrumb) {
            goToState('G.H');
            var statesChain = $breadcrumb.getStatesChain();
            expect(stringifyStateChain(statesChain)).toBe('G.H');
        }));

        it('should return a two step route to I.J', inject(function($breadcrumb) {
            goToState('I.J');
            var statesChain = $breadcrumb.getStatesChain();
            expect(stringifyStateChain(statesChain)).toBe('I --> I.J');
        }));

        it('should return a one step chain to K.L', inject(function($breadcrumb) {
            goToState('K.L');
            var statesChain = $breadcrumb.getStatesChain();
            expect(stringifyStateChain(statesChain)).toBe('K.L');
        }));
    });

    describe('with abstract state inclusion', function() {

        beforeEach(function() {
            angular.module('ncy-abstract-conf')
                .config(function($breadcrumbProvider) {
                    $breadcrumbProvider.setOptions({
                        includeAbstract: true
                    });
                });
            module('ncy-abstract-conf');
        });

        it('should have a 3-step route to C state', inject(function($breadcrumb) {
            goToState('A.B.C');
            var statesChain = $breadcrumb.getStatesChain();
            expect(stringifyStateChain(statesChain)).toBe('A --> A.B --> A.B.C');
        }));

        it('should have a 3-step route to F state', inject(function($breadcrumb) {
            goToState('D.E.F');
            var statesChain = $breadcrumb.getStatesChain();
            expect(stringifyStateChain(statesChain)).toBe('D --> D.E --> D.E.F');
        }));

        it('should still return a one step chain to G.H (state-level option skip is priority)', inject(function($breadcrumb) {
            goToState('G.H');
            var statesChain = $breadcrumb.getStatesChain();
            expect(stringifyStateChain(statesChain)).toBe('G.H');
        }));
    });





});
