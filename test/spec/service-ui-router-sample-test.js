/*jshint undef: false */

describe('Service with ui-router\'s sample conf', function() {

    beforeEach(function() {
        module('ncy-ui-router-conf');
    });

    it('generate a unique step for the "home" state', inject(function($breadcrumb) {
        goToState('home');
        var statesChain = $breadcrumb.getStatesChain();

        expect(stringifyStateChain(statesChain)).toBe('home');

        var lastStep = $breadcrumb.getLastStep();
        expect(lastStep.name).toBe('home');
    }));

    it('generate two steps for the "contacts.list" state', inject(function($breadcrumb) {
        goToStateAndFlush('contacts.list');
        var statesChain = $breadcrumb.getStatesChain();

        expect(stringifyStateChain(statesChain)).toBe('home --> contacts.list');

        var lastStep = $breadcrumb.getLastStep();
        expect(lastStep.name).toBe('contacts.list');
    }));

    it('generate three steps for the "contacts.detail" state', inject(function($breadcrumb) {
        goToStateAndFlush('contacts.detail', {contactId: 42});
        var statesChain = $breadcrumb.getStatesChain();

        expect(stringifyStateChain(statesChain)).toBe('home --> contacts.list --> contacts.detail');

        var lastStep = $breadcrumb.getLastStep();
        expect(lastStep.name).toBe('contacts.detail');
    }));

    it('generate four steps for the "contacts.detail.item" state', inject(function($breadcrumb) {
        goToStateAndFlush('contacts.detail.item', {contactId: 42, itemId: "a"});
        var statesChain = $breadcrumb.getStatesChain();

        expect(stringifyStateChain(statesChain)).toBe('home --> contacts.list --> contacts.detail --> contacts.detail.item');


        var lastStep = $breadcrumb.getLastStep();
        expect(lastStep.name).toBe('contacts.detail.item');
    }));

    it('generate five steps for the "contacts.detail.item.edit" state with working links', inject(function($breadcrumb) {
        goToStateAndFlush('contacts.detail.item.edit', {contactId: 42, itemId: "a"});
        var statesChain = $breadcrumb.getStatesChain();

        expect(stringifyStateChain(statesChain)).toBe('home --> contacts.list --> contacts.detail --> contacts.detail.item --> contacts.detail.item.edit');
        expect(statesChain[2].ncyBreadcrumbLink).toBe('#/contacts/42');
        expect(statesChain[3].ncyBreadcrumbLink).toBe('#/contacts/42/item/a');
        expect(statesChain[4].ncyBreadcrumbLink).toBe('#/contacts/42/item/a'); // (state with no URL)
    }));

});
