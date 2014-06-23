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

    it('generate three steps for the "room" state', inject(function($breadcrumb) {
        goToStateAndFlush('room');
        var statesChain = $breadcrumb.getStatesChain();

        expect(stringifyStateChain(statesChain)).toBe('home --> sample --> room');
    }));

    it('generate four steps for the "room.detail" state', inject(function($breadcrumb) {
        goToStateAndFlush('room.detail', {roomId: 1});
        var statesChain = $breadcrumb.getStatesChain();

        expect(stringifyStateChain(statesChain)).toBe('home --> sample --> room --> room.detail');
    }));

    it('must build a correct link for each steps', inject(function($breadcrumb) {
        goToStateAndFlush('room');
        var statesChain = $breadcrumb.getStatesChain();
        expect(statesChain[0].ncyBreadcrumbLink).toBe('#/home');
        expect(statesChain[1].ncyBreadcrumbLink).toBe('#/sample');
    }));
});
