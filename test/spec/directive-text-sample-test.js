/*jshint undef: false */

describe('Text directive with sample conf', function() {
    var element;

    beforeEach(function() {
        module('ncy-sample-conf');
    });

    beforeEach(inject(function($rootScope, $compile) {
        var elem = angular.element('<span ncy-breadcrumb-text="MyApp: {{ncyBreadcrumbChain}}"></span><div ui-view></div>');
        element = $compile(elem)($rootScope.$new());
    }));

    it('interpolates "room.detail" label correctly', inject(function() {
        goToStateAndFlush('room.detail', {roomId: 3});

        expect(element.text()).toBe('MyApp: Home / Sample / Rooms / Room 103');
    }));
});
