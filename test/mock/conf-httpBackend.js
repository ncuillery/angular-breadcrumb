/*jshint undef: false */

var httpBackend;
var goToState;

beforeEach(function() {
    module('ncy-angular-breadcrumb', 'ui.router.state', 'ngMock', 'ng');
});

beforeEach(module(function() {
    return function($httpBackend) {
        httpBackend = $httpBackend;
        $httpBackend.when('GET', 'views/home.html').respond('dummmy home view');
        $httpBackend.when('GET', 'views/room_list.html').respond('dummmy room_list view');
        $httpBackend.when('GET', 'views/room_detail.html').respond('dummmy room_detail view');
        $httpBackend.when('GET', 'views/room_form.html').respond('dummmy room_form view');
    };
}));

beforeEach(module(function() {
    return function($state) {
        goToState = function(state, stateParams) {
            $state.transitionTo(state, stateParams);
            httpBackend.flush();
        };
    };
}));

