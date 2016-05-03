/*jshint undef: false */

describe('Breadcrumb directive with sample conf', function() {

    var element;

    beforeEach(function() {
        module('ncy-sample-conf');
    });

    beforeEach(inject(function($rootScope, $compile) {
        var elem = angular.element('<div ncy-breadcrumb></div><div ui-view></div>');
        element = $compile(elem)($rootScope.$new());
    }));

    it('interpolates "room.detail" label correctly', inject(function() {
        goToStateAndFlush('room.detail.edit', {roomId: 3});

        expect(element.text()).toContain('Home');
        expect(element.text()).toContain('Sample');
        expect(element.text()).toContain('Rooms');
        expect(element.text()).toContain('Room 103');
        expect(element.text()).toContain('Editing');

        expect(element.find('a').eq(0).attr('href')).toBe('#/home');
        expect(element.find('a').eq(1).attr('href')).toBe('#/sample');
        expect(element.find('a').eq(2).attr('href')).toBe('#/room');
        expect(element.find('a').eq(3).attr('href')).toBe('#/room/3');
    }));

});
