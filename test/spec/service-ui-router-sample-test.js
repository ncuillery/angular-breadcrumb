/*jshint undef: false */

describe('Service with sample conf', function() {

    beforeEach(function() {
        module('ncy-ui-router-conf');
    });

    it('generate a unique step for the "home" state', inject(function($breadcrumb) {
        goToState('home');
        var statesChain = $breadcrumb.getStatesChain();

        expect(stringifyStateChain(statesChain)).toBe('home');
    }));

    xit('generate two steps for the "contacts.list" state', inject(function($breadcrumb) {
        goToStateAndFlush('contacts.list');
        var statesChain = $breadcrumb.getStatesChain();

        expect(stringifyStateChain(statesChain)).toBe('home --> contacts.list');
    }));

    xit('generate two steps for the "contacts.detail" state', inject(function($breadcrumb) {
        goToStateAndFlush('contacts.detail', {contactId: 42});
        var statesChain = $breadcrumb.getStatesChain();

        expect(stringifyStateChain(statesChain)).toBe('home --> contacts.detail');
    }));

    xit('generate three steps for the "contacts.detail.item" state', inject(function($breadcrumb) {
        goToStateAndFlush('contacts.detail.item', {contactId: 42, itemId: "a"});
        var statesChain = $breadcrumb.getStatesChain();

        expect(stringifyStateChain(statesChain)).toBe('home --> contacts.detail --> contacts.detail.item');
    }));

    xit('generate three steps for the "contacts.detail.item.edit" state', inject(function($breadcrumb) {
        goToStateAndFlush('contacts.detail.item.edit', {contactId: 42, itemId: "a"});
        var statesChain = $breadcrumb.getStatesChain();

        expect(stringifyStateChain(statesChain)).toBe('home --> contacts.detail --> contacts.detail.item --> contacts.detail.item.edit');
    }));

});
