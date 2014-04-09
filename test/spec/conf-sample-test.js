/*jshint undef: false */

describe('Sample conf', function() {

    beforeEach(function() {
        module('ncy-sample-conf');
    });

    it('must have some states defined', inject(function($state) {
        expect($state.get('home').name).toBe('home');
        expect($state.get('room').name).toBe('room');
    }));

    it('allows state transition in test', inject(function($state) {
        var oldState = $state.current.name;
        goToStateAndFlush('room');
        var newState = $state.current.name;

        expect(newState).not.toBe(oldState);
        expect(newState).toBe('room');
    }));

});