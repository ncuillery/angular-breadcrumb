/*jshint undef: false */

describe('Text directive with sample conf', function() {

    var element, scope, controller, compile;

    beforeEach(function() {
        module('ncy-sample-conf');
    });

    beforeEach(inject(function($rootScope, $compile, $controller) {
        element = angular.element('<span ncy-breadcrumb-text="MyApp: {{ncyBreadcrumbChain}}"></span>');
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

        console.info('Directive content : ' + element.text());

        expect(element.text()).toBe('MyApp: Home / Sample / Rooms / Room 103');
    }));

});
