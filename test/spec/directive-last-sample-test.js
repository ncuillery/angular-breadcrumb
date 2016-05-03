/*jshint undef: false */

describe('Last step directive with sample conf', function() {

    var element, $rootScope;

    beforeEach(function() {
        module('ncy-sample-conf');
    });

    beforeEach(inject(function(_$rootScope_, $compile) {
        var elem = angular.element('<span ncy-breadcrumb-last="<a href=\'{{ncyBreadcrumbLink}}\'>{{ncyBreadcrumbLabel}}</a>"></span><div ui-view></div>');
        $rootScope = _$rootScope_;
        element = $compile(elem)($rootScope.$new());
    }));

    it('interpolates "room.detail" label correctly', inject(function() {
        goToStateAndFlush('room.detail', {roomId: 3});

        expect(element.find('a').text()).toBe('Room 103');
        expect(element.find('a').attr("href")).toBe('#/room/3');
    }));

});
