/*jshint undef: false */

var disableStateChangeErrorLogging = false; // state change error could be desirable during tests

beforeEach(module(function() {
    return function($rootScope) {

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
            if(!disableStateChangeErrorLogging) {
                console.error('$stateChangeError', fromState.name, toState.name, error);
            }
        });

    };
}));
