/*! angular-breadcrumb - v0.1.0 - 2014-04-08
* https://github.com/ncuillery/angular-breadcrumb
* Copyright (c) 2014 Nicolas Cuillery; Licensed MIT */
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
    .directive('ncyBreadcrumb', ['$state', '$interpolate', '$breadcrumb', '$rootScope', function ($state, $interpolate, $breadcrumb, $rootScope) {
        return {
            replace: true,
            template:
                '<ul class="breadcrumb">' +
                '   <li ng-repeat="step in steps">' +
                '       {{step.label}} ' +
                '       <span class="divider" ng-hide="$last">/</span>' +
                '   </li>' +
                '</ul>',
            link: {
                post: function postLink(scope) {
                    $rootScope.$on('$viewContentLoaded', function (event) {
                        scope.steps = [];
                        var stateNames = $breadcrumb.getStatesChain();
                        angular.forEach(stateNames, function (value) {
                            var step = {};
                            if (value.data && value.data.ncyBreadcrumbLabel) {
                                var parseLabel = $interpolate(value.data.ncyBreadcrumbLabel);
                                step.label = parseLabel(event.targetScope);
                            } else {
                                step.label = value.name;
                            }
                            scope.steps.push(step);
                        });
                    });
                }
            }
        };
    }]);

