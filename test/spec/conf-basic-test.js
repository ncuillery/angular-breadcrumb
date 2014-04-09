/*jshint undef: false */

describe('Simple conf', function() {

    beforeEach(function() {
        module('ncy-basic-conf');
    });

    it('must have some states defined', inject(function($state) {
        expect($state.get('A').name).toBe('A');
        expect($state.get('A.B').name).toBe('A.B');
    }));

    it('allows state transition in test', inject(function($state) {
        var oldState = $state.current.name;
        goToState('A.B');
        var newState = $state.current.name;

        expect(newState).not.toBe(oldState);
        expect(newState).toBe('A.B');
    }));

});