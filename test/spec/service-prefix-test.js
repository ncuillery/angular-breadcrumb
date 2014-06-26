/*jshint undef: false */

describe('Service with basic conf', function() {

    describe('and prefix option setted to a root state', function() {
        beforeEach(function() {
            angular.module('ncy-basic-conf')
                .config(function($breadcrumbProvider) {
                    $breadcrumbProvider.setOptions({
                        prefixStateName: 'A'
                    });
                });
            module('ncy-basic-conf');
        });

        it('should have a 3-step route to C state', inject(function($breadcrumb) {
            goToState('A.B.C');
            var statesChain = $breadcrumb.getStatesChain();
            expect(stringifyStateChain(statesChain)).toBe('A --> A.B --> A.B.C');
        }));

        it('should return only the prefix state for skipped G', inject(function($breadcrumb) {
            goToState('G');
            var statesChain = $breadcrumb.getStatesChain();
            expect(stringifyStateChain(statesChain)).toBe('A');
        }));

        it('should return a 2-step chain to G.H', inject(function($breadcrumb) {
            goToState('G.H');
            var statesChain = $breadcrumb.getStatesChain();
            expect(stringifyStateChain(statesChain)).toBe('A --> G.H');
        }));
    });

    describe('and prefix option setted to an intermediate state', function() {
        beforeEach(function() {
            angular.module('ncy-basic-conf')
                .config(function($breadcrumbProvider) {
                    $breadcrumbProvider.setOptions({
                        prefixStateName: 'A.B'
                    });
                });
            module('ncy-basic-conf');
        });

        it('should have a 3-step route to C state', inject(function($breadcrumb) {
            goToState('A.B.C');
            var statesChain = $breadcrumb.getStatesChain();
            expect(stringifyStateChain(statesChain)).toBe('A.B --> A --> A.B.C');
        }));

        it('should return only the prefix state for skipped G', inject(function($breadcrumb) {
            goToState('G');
            var statesChain = $breadcrumb.getStatesChain();
            expect(stringifyStateChain(statesChain)).toBe('A.B');
        }));

        it('should return a 2-step chain to G.H', inject(function($breadcrumb) {
            goToState('G.H');
            var statesChain = $breadcrumb.getStatesChain();
            expect(stringifyStateChain(statesChain)).toBe('A.B --> G.H');
        }));
    });



});