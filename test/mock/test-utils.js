/*jshint undef: false */

var goToState, stringifyStateChain;

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

stringifyStateChain = function(states) {
    var names = [];
    angular.forEach(states, function(state) {
        names.push(state.name);
    });
    return names.join(' --> ');
};