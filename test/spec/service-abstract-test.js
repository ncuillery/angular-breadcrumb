/*jshint undef: false */

describe('Service with abstract conf', function () {

    describe('with default options', function () {
        var $rootScope;
        
        beforeEach(function () {
            module('ncy-abstract-conf');
        });
        
        beforeEach(inject(function (_$rootScope_) {
            $rootScope = _$rootScope_;
        }));

        it('should have a 2-step route to C state', inject(function ($breadcrumb) {
            goToState('A.B.C');
            $breadcrumb.getStatesChain().then(function (statesChain) {
                expect(stringifyStateChain(statesChain)).toBe('A.B --> A.B.C');
            });
            $rootScope.$digest();
        }));

        it('should have a 2-step route to F state', inject(function ($breadcrumb) {
            goToState('D.E.F');
            $breadcrumb.getStatesChain().then(function (statesChain) {
                expect(stringifyStateChain(statesChain)).toBe('D --> D.E.F');
            });
            $rootScope.$digest();
        }));

        it('should return a one step chain to G.H', inject(function ($breadcrumb) {
            goToState('G.H');
            $breadcrumb.getStatesChain().then(function (statesChain) {
                expect(stringifyStateChain(statesChain)).toBe('G.H');
            });
            $rootScope.$digest();
        }));

        it('should return a two step route to I.J', inject(function ($breadcrumb) {
            goToState('I.J');
            $breadcrumb.getStatesChain().then(function (statesChain) {
                expect(stringifyStateChain(statesChain)).toBe('I --> I.J');
            });
            $rootScope.$digest();
        }));

        it('should return a one step chain to K.L', inject(function ($breadcrumb) {
            goToState('K.L');
            $breadcrumb.getStatesChain().then(function (statesChain) {
                expect(stringifyStateChain(statesChain)).toBe('K.L');
            });
            $rootScope.$digest();
        }));
    });

    describe('with abstract state inclusion', function () {
        var $rootScope;

        beforeEach(function () {
            angular.module('ncy-abstract-conf')
                .config(function ($breadcrumbProvider) {
                    $breadcrumbProvider.setOptions({
                        includeAbstract: true
                    });
                });
            module('ncy-abstract-conf');
        });
        
        beforeEach(inject(function (_$rootScope_) {
            $rootScope = _$rootScope_;
        }));

        it('should have a 3-step route to C state', inject(function ($breadcrumb) {
            goToState('A.B.C');
            $breadcrumb.getStatesChain().then(function (statesChain) {
                expect(stringifyStateChain(statesChain)).toBe('A --> A.B --> A.B.C');
            });
            $rootScope.$digest();
        }));

        it('should have a 3-step route to F state', inject(function ($breadcrumb) {
            goToState('D.E.F');
            $breadcrumb.getStatesChain().then(function (statesChain) {
                expect(stringifyStateChain(statesChain)).toBe('D --> D.E --> D.E.F');
            });
            $rootScope.$digest();
        }));

        it('should still return a one step chain to G.H (state-level option skip is priority)', inject(function ($breadcrumb) {
            goToState('G.H');
            $breadcrumb.getStatesChain().then(function (statesChain) {
                expect(stringifyStateChain(statesChain)).toBe('G.H');
            });
            $rootScope.$digest();
        }));
    });
});
