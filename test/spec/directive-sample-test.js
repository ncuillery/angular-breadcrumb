/*jshint undef: false */

describe('Directive', function() {

    var element;

    beforeEach(function() {
        angular.module('ncy-sample-test', function() {}).config(function($urlRouterProvider) {
            $urlRouterProvider.otherwise(function() {
                return false;
            });
        });

        // Order of arguments has importance here.
        module('ncy-sample', 'ncy-sample-test');
    });

    /**
     * Due to templateUrl definitions in $state configuration,
     * httpBackend will try to load the view for each state asked.
     */
    beforeEach(module(function() {
        return function($httpBackend, $state) {
            // httpBackend return something for each view (no status 404).
            $httpBackend.when('GET', 'views/home.html').respond('dummy home view');
            $httpBackend.when('GET', 'views/room_list.html').respond('dummy room_list view');
            $httpBackend.when('GET', 'views/room_detail.html').respond('dummy room_detail view');
            $httpBackend.when('GET', 'views/room_form.html').respond('dummy room_form view');

            // Helpful function for navigate within states.
            goToStateAndFlush = function(state, stateParams) {
                $state.transitionTo(state, stateParams);
                $httpBackend.flush();
            };
        };
    }));

    beforeEach(inject(function($rootScope, $compile) {
        element = angular.element('<div ncy-breadcrumb></div>');
        var compile = $compile(element);
        //var scope = $rootScope.$new();
        compile($rootScope);
        $rootScope.$digest();
    }));

    it('works with sample conf', inject(function() {
        goToStateAndFlush('room.detail', {roomId: 3});
        console.info('Directive content : ', element.text());
        expect(element.text()).toContain('Home');
        expect(element.text()).toContain('Rooms');
        expect(element.text()).toContain('Room TODO');
    }));

});