/*jshint undef: false */

var disableStateChangeStartLogging = true;
var disableStateChangeSuccessLogging = true;
var disableStateChangeErrorLogging = false;

beforeEach(module(function() {
    return function($rootScope) {

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
            if(!disableStateChangeErrorLogging) {
                console.error('$stateChangeError', fromState.name, toState.name, error);
            }
        });

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState){
            if(!disableStateChangeSuccessLogging) {
                console.info('$stateChangeSuccess', fromState.name, toState.name);
            }
        });

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState){
            if(!disableStateChangeStartLogging) {
                console.info('$stateChangeStart', fromState.name, toState.name);
            }
        });

    };
}));
