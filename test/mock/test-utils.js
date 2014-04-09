/*jshint undef: false */

var goToState, goToStateAndFlush, stringifyStateChain;

beforeEach(function() {
    module('ncy-angular-breadcrumb', 'ui.router.state', 'ngMock', 'ng');
});

// Helpful function for tests : navigate to a state
beforeEach(module(function() {
    return function($state, $rootScope) {
        goToState = function(state, stateParams) {
            $state.transitionTo(state, stateParams);
            $rootScope.$digest();
        };
    };
}));

/**
 * Due to templateUrl definitions in $state configuration,
 * httpBackend will try to load the view for each state asked.
 */
beforeEach(module(function() {
    return function($httpBackend, $state) {

        // Helpful function for navigate within states.
        goToStateAndFlush = function(state, stateParams) {
            $state.transitionTo(state, stateParams);
            $httpBackend.flush();
        };
    };
}));

stringifyStateChain = function(states) {
    var names = [];
    angular.forEach(states, function(state) {
        names.push(state.name);
    });
    return names.join(' --> ');
};