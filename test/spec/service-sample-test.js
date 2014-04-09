/*jshint undef: false */

describe('Service with sample conf', function() {

    beforeEach(function() {
        module('ncy-sample-conf');
    });

    it('generate a unique step for the "home" state', inject(function($breadcrumb) {
        goToStateAndFlush('home');
        var statesChain = $breadcrumb.getStatesChain();

        expect(stringifyStateChain(statesChain)).toBe('home');
    }));

    it('generate two steps for the "room" state', inject(function($breadcrumb) {
        goToStateAndFlush('room');
        var statesChain = $breadcrumb.getStatesChain();

        expect(stringifyStateChain(statesChain)).toBe('home --> room');
    }));

    it('generate three steps for the "room.detail" state', inject(function($breadcrumb) {
        goToStateAndFlush('room.detail', {roomId: 1});
        var statesChain = $breadcrumb.getStatesChain();

        expect(stringifyStateChain(statesChain)).toBe('home --> room --> room.detail');
    }));

});