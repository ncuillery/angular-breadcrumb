/*jshint undef: false */

describe('Service with ui-router\'s sample conf', function() {

    beforeEach(function() {
        module('ncy-ui-router-conf');
    });

    it('generate a unique step for the "home" state', inject(function($breadcrumb) {
        goToState('home');
        var statesChain = $breadcrumb.getStatesChain();

        expect(stringifyStateChain(statesChain)).toBe('home');
    }));

    it('generate two steps for the "contacts.list" state', inject(function($breadcrumb) {
        goToStateAndFlush('contacts.list');
        var statesChain = $breadcrumb.getStatesChain();

        expect(stringifyStateChain(statesChain)).toBe('home --> contacts.list');
    }));

    it('generate two steps for the "contacts.detail" state', inject(function($breadcrumb) {
        goToStateAndFlush('contacts.detail', {contactId: 42});
        var statesChain = $breadcrumb.getStatesChain();

        expect(stringifyStateChain(statesChain)).toBe('home --> contacts.detail');
    }));

    it('generate three steps for the "contacts.detail.item" state', inject(function($breadcrumb) {
        goToStateAndFlush('contacts.detail.item', {contactId: 42, itemId: "a"});
        var statesChain = $breadcrumb.getStatesChain();

        expect(stringifyStateChain(statesChain)).toBe('home --> contacts.detail --> contacts.detail.item');
    }));

    it('generate three steps for the "contacts.detail.item.edit" state', inject(function($breadcrumb) {
        goToStateAndFlush('contacts.detail.item.edit', {contactId: 42, itemId: "a"});
        var statesChain = $breadcrumb.getStatesChain();

        expect(stringifyStateChain(statesChain)).toBe('home --> contacts.detail --> contacts.detail.item --> contacts.detail.item.edit');
    }));

});
