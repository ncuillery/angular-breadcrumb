/*jshint undef: false */

describe('Breadcrumb directive with sample conf', function() {

    var element, scope, controller, compile;

    beforeEach(function() {
        module('ncy-sample-conf');
    });

    beforeEach(inject(function($rootScope, $compile, $controller) {
        element = angular.element('<div ncy-breadcrumb></div>');
        compile = $compile(element);
        scope = $rootScope.$new();
        controller = $controller;
    }));

    it('interpolates "room.detail" label correctly', inject(function() {
        goToStateAndFlush('room.detail.edit', {roomId: 3});

        controller('RoomDetailCtrl', {'$scope' : scope} );
        compile(scope);

        expect(scope.room).toBeDefined();

        scope.$emit('$viewContentLoaded');
        scope.$digest();

        console.info('Directive content : ' + element.text());

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
