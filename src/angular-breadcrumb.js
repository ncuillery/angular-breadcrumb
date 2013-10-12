/*
 * angular-breadcrumb
 * https://github.com/ncuillery/angular-breadcrumb
 *
 * Copyright (c) 2013 Nicolas Cuillery
 * Licensed under the MIT license.
 */

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
            }
        }];

    })
    .directive('ncyBreadcrumb', function($state, $breadcrumb) {
        return function(scope, element, attrs) {

            scope.$watch(function() { return $state.current; }, function(newValue, oldValue) {
                var chain = $breadcrumb.getStatesChain();
                var stateNames = [];
                angular.forEach(chain, function(value) {
                    stateNames.push(value.name);
                });
                element.text(stateNames.join(' / '));
            }, true);

        }
});
