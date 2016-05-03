/*jshint undef: false */

describe('Service with ui-router\'s sample conf', function() {
    var $rootScope;

    beforeEach(function() {
        module('ncy-ui-router-conf');
    });

    beforeEach(inject(function (_$rootScope_) {
        $rootScope = _$rootScope_;
    }));

    it('generate a unique step for the "home" state', inject(function($breadcrumb) {
        goToState('home');
        $breadcrumb.getStatesChain().then(function (statesChain) {
            expect(stringifyStateChain(statesChain)).toBe('home');
        });

        $breadcrumb.getLastStep().then(function (lastStep) {
            expect(lastStep.name).toBe('home');
        });

        $rootScope.$digest();
    }));

    it('generate two steps for the "contacts.list" state', inject(function($breadcrumb) {
        goToStateAndFlush('contacts.list');
        $breadcrumb.getStatesChain().then(function (statesChain) {
            expect(stringifyStateChain(statesChain)).toBe('home --> contacts.list');
        });

        $breadcrumb.getLastStep().then(function (lastStep) {
            expect(lastStep.name).toBe('contacts.list');
        });
        
        $rootScope.$digest();
    }));

    it('generate three steps for the "contacts.detail" state', inject(function($breadcrumb) {
        goToStateAndFlush('contacts.detail', {contactId: 42});
        $breadcrumb.getStatesChain().then(function (statesChain) {
            expect(stringifyStateChain(statesChain)).toBe('home --> contacts.list --> contacts.detail');
        });

        $breadcrumb.getLastStep().then(function (lastStep) {
            expect(lastStep.name).toBe('contacts.detail');
        });
        
        $rootScope.$digest();
    }));

    it('generate four steps for the "contacts.detail.item" state', inject(function($breadcrumb) {
        goToStateAndFlush('contacts.detail.item', {contactId: 42, itemId: "a"});
        $breadcrumb.getStatesChain().then(function (statesChain) {
            expect(stringifyStateChain(statesChain)).toBe('home --> contacts.list --> contacts.detail --> contacts.detail.item');
        });

        $breadcrumb.getLastStep().then(function (lastStep) {
            expect(lastStep.name).toBe('contacts.detail.item');
        });
        
        $rootScope.$digest();
    }));

    it('generate five steps for the "contacts.detail.item.edit" state with working links', inject(function($breadcrumb) {
        goToStateAndFlush('contacts.detail.item.edit', {contactId: 42, itemId: "a"});
        $breadcrumb.getStatesChain().then(function (statesChain) {
            expect(stringifyStateChain(statesChain)).toBe('home --> contacts.list --> contacts.detail --> contacts.detail.item --> contacts.detail.item.edit');
            expect(statesChain[2].ncyBreadcrumbLink).toBe('#/contacts/42');
            expect(statesChain[3].ncyBreadcrumbLink).toBe('#/contacts/42/item/a');
            expect(statesChain[4].ncyBreadcrumbLink).toBe('#/contacts/42/item/a'); // (state with no URL)
        });
        
        $rootScope.$digest();
    }));
});
