angular.module('ncy-angular-breadcrumb', ['ui.router.state'])
    .provider('$breadcrumb', function() {

        var options = {};

        this.setPrefixState = function(prefixStateName) {
            options.prefixStateName = prefixStateName;
        };

        var _pushNonexistentState = function(array, state) {
            var stateAlreadyInArray = false;
            angular.forEach(array, function(value) {
                if(!stateAlreadyInArray && angular.equals(value, state)) {
                    stateAlreadyInArray = true;
                }
            });
            if(!stateAlreadyInArray) {
                array.push(state);
            }
            return stateAlreadyInArray;
        };

        this.$get = ['$state', function($state) {

            return {
                getStatesChain : function() {
                    var chain = [];

                    // Prefix state
                    if(options.prefixStateName) {
                        var prefixState = $state.get(options.prefixStateName);
                        if(prefixState) {
                            _pushNonexistentState(chain, prefixState);
                        } else {
                            throw 'Bad configuration : prefixState "' + options.prefixStateName + '" unknown';
                        }
                    }

                    angular.forEach($state.$current.path, function(value) {
                        _pushNonexistentState(chain, value.self);
                    });

                    return chain;
                }
            };
        }];

    })
    .directive('ncyBreadcrumb', function($state, $compile, $breadcrumb, $rootScope) {
        return function(scope, element) {

            $rootScope.$on('$viewContentLoaded', function(event){
               var chain = $breadcrumb.getStatesChain();
                var stateNames = [];
                angular.forEach(chain, function(value) {
                    if(value.data && value.data.ncyBreadcrumbLabel) {
                        stateNames.push(value.data.ncyBreadcrumbLabel);
                    } else {
                        stateNames.push(value.name);
                    }
                });
                element.text(stateNames.join(' / '));
                console.log('Scope : ', event.targetScope);
                $compile(element.contents())(event.targetScope);
            });

        };
    });
