/*jshint undef: false */

describe('Ui-router\'s sample conf', function() {

    beforeEach(function() {
        module('ncy-ui-router-conf');
    });

    it('must have some states defined', inject(function($state) {
        expect($state.get('home').name).toBe('home');
        expect($state.get('contacts.list').name).toBe('contacts.list');
        expect($state.get('contacts.detail.item.edit').name).toBe('contacts.detail.item.edit');
    }));

    it('allows state transition in test', inject(function($state) {
        console.log('current : ', $state.current);

        var oldState = $state.current.name;
        goToStateAndFlush('contacts.list');
        var newState = $state.current.name;

        expect(newState).not.toBe(oldState);
        expect(newState).toBe('contacts.list');
    }));

});
