/*jshint undef: false */

describe('Directive with sample conf', function() {

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
        goToStateAndFlush('room.detail', {roomId: 3});

        controller('RoomDetailCtrl', {'$scope' : scope} );
        compile(scope);

        expect(scope.room).toBeDefined();

        scope.$emit('$viewContentLoaded');
        scope.$digest();

        console.info('Directive content : ', element.text());

        expect(element.text()).toContain('Home');
        expect(element.text()).toContain('Rooms');
        expect(element.text()).toContain('Room 103');
    }));

});