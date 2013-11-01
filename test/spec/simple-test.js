/*jshint undef: false */

describe('Simple app', function() {

    beforeEach(function() {
        angular.module('ncy-simple-test', function() {}).config(function($stateProvider) {
            $stateProvider
                .state('A', {url: '/a'})
                .state('A.B', {url: '/b'})
                .state('A.B.C', {url: '/c'})
                .state('D', {parent: 'A.B.C', url: '/d'});
        });

        // Order of arguments has importance here.
        module('ncy-simple-test');
    });

    it('should have a $breadcrumb defined', inject(function($breadcrumb) {
        expect($breadcrumb).toBeDefined();
    }));

    it('must have some states defined', inject(function($state) {
        expect($state.get('A').name).toBe('A');
        expect($state.get('A.B').name).toBe('A.B');
    }));

    it('allow state transition in test', inject(function($state) {
        var oldState = $state.current.name;
        goToState('A.B');
        var newState = $state.current.name;

        expect(newState).not.toBe(oldState);
        expect(newState).toBe('A.B');
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

});