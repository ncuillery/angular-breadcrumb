/*jshint undef: false */

describe('Service with sample conf', function () {
    var $rootScope;

    beforeEach(function () {
        module('ncy-sample-conf');
    });

    beforeEach(inject(function (_$rootScope_, $compile) {
        var elem = angular.element('<div ui-view></div>');
        $rootScope = _$rootScope_;
        $compile(elem)($rootScope.$new());
    }));

    it('generate a unique step for the "home" state', inject(function ($breadcrumb) {
        goToStateAndFlush('home');
        $breadcrumb.getStatesChain().then(function (statesChain) {
            expect(stringifyStateChain(statesChain)).toBe('home');
        });

        $breadcrumb.getLastStep().then(function (lastStep) {
            expect(lastStep.name).toBe('home');
        });

        $rootScope.$digest();
    }));

    it('generate three steps for the "room" state', inject(function ($breadcrumb) {
        goToStateAndFlush('room');
        
        $breadcrumb.getStatesChain().then(function (statesChain) {
            expect(stringifyStateChain(statesChain)).toBe('home --> sample --> room');
        });

        $breadcrumb.getLastStep().then(function (lastStep) {
            expect(lastStep.name).toBe('room');
        });

        $rootScope.$digest();
    }));

    it('generate four steps for the "room.detail" state', inject(function ($breadcrumb) {
        goToStateAndFlush('room.detail', {roomId: 1});
        $breadcrumb.getStatesChain().then(function (statesChain) {
            expect(stringifyStateChain(statesChain)).toBe('home --> sample --> room --> room.detail');
        });

        $breadcrumb.getLastStep().then(function (lastStep) {
            expect(lastStep.name).toBe('room.detail');
        });

        $rootScope.$digest();
    }));

    it('generate four steps for the "room.detail.edit" state with working links', inject(function ($breadcrumb) {
        goToStateAndFlush('room.detail.edit', {roomId: 1});
        $breadcrumb.getStatesChain().then(function (statesChain) {
            expect(stringifyStateChain(statesChain)).toBe('home --> sample --> room --> room.detail --> room.detail.edit');
            expect(statesChain[3].ncyBreadcrumbLink).toBe('#/room/1');
            expect(statesChain[4].ncyBreadcrumbLink).toBe('#/room/1/edit');
        });

        $rootScope.$digest();
    }));

    it('must build a correct link for each steps', inject(function ($breadcrumb) {
        goToStateAndFlush('room');
        $breadcrumb.getStatesChain().then(function (statesChain) {
            expect(statesChain[0].ncyBreadcrumbLink).toBe('#/home');
            expect(statesChain[1].ncyBreadcrumbLink).toBe('#/sample');
        });

        $rootScope.$digest();
    }));
});
