/*jshint undef: false */

describe('Service with dynamic parent conf', function() {
    var $rootScope;

    beforeEach(function() {
        module('ncy-dynamic-parent-conf');
    });

    it('must be defined', inject(function($breadcrumb) {
        expect($breadcrumb).toBeDefined();
    }));

    beforeEach(inject(function (_$rootScope_) {
        $rootScope = _$rootScope_;
    }));

    it('should use the custom breadcrumb\'s parent property for D.E.F (a string)', inject(function($breadcrumb) {
        goToState('D.E.F');
        
        $breadcrumb.getStatesChain().then(function (statesChain) {
            expect(stringifyStateChain(statesChain)).toBe('A --> A.B --> D.E.F');
        });
        
        $rootScope.$digest();
    }));

    it('should use the custom breadcrumb\'s parent property for D.E.G (a function)', inject(function($breadcrumb) {
        goToState('D.E.G');
        
        $breadcrumb.getStatesChain().then(function (statesChain) {
            expect(stringifyStateChain(statesChain)).toBe('A --> D.E.G');
        });
        
        $rootScope.$digest();
    }));

    it('should deals with url params correctly', inject(function($breadcrumb) {
        goToState('J');
        
        $breadcrumb.getStatesChain().then(function (statesChain) {
            expect(stringifyStateChain(statesChain)).toBe('I --> J');
            expect(statesChain[0].name).toBe('I');
            expect(statesChain[0].ncyBreadcrumbLink).toBe('#/i/love/you');
            expect(statesChain[0].ncyBreadcrumbStateRef).toBe('I({x: \'love\', y: \'you\'})');
        });
        
        $rootScope.$digest();
    }));

});
