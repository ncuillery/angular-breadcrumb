/*jshint undef: false */

describe('Sample app', function() {

    /**
     * New module to override the otherwise of the sample app.
     * (we don't want to deal with location according to each state)
     */
    beforeEach(function() {
        angular.module('ncy-sample-test', function() {}).config(function($urlRouterProvider) {
            $urlRouterProvider.otherwise(function() {
                return false;
            });
        });

        // Order of arguments has importance here.
        module('ncy-sample', 'ncy-sample-test');
    });

    it('must have $state service defined', inject(function($state) {
        expect($state).toBeDefined();
    }));

    it('must have some states defined', inject(function($state) {
        expect($state.get('home').name).toBe('home');
        expect($state.get('room').name).toBe('room');
    }));

    it('allow state transition in test', inject(function($state) {
        var oldState = $state.current.name;
        goToState('room');
        var newState = $state.current.name;

        expect(newState).not.toBe(oldState);
        expect(newState).toBe('room');
    }));

    describe('The "home" state', function() {

        it('generate a unique step', inject(function($breadcrumb) {
            goToState('home');
            var statesChain = $breadcrumb.getStatesChain();

            expect(statesChain.length).toBe(1);
            expect(statesChain[0].name).toBe('home');
        }));

    });

    describe('The "room" state', function() {

        it('generate two steps', inject(function($breadcrumb) {
            goToState('room');
            var statesChain = $breadcrumb.getStatesChain();

            expect(statesChain.length).toBe(2);
            expect(statesChain[0].name).toBe('home');
            expect(statesChain[1].name).toBe('room');
        }));

    });

    describe('The "room.detail" state', function() {

        it('generate three steps', inject(function($breadcrumb) {
            goToState('room.detail', {roomId: 1});
            var statesChain = $breadcrumb.getStatesChain();

            expect(statesChain.length).toBe(3);
            expect(statesChain[0].name).toBe('home');
            expect(statesChain[1].name).toBe('room');
            expect(statesChain[2].name).toBe('room.detail');
        }));

    });

});