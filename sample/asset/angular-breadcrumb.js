/*! angular-breadcrumb - v0.1.0 - 2014-04-09
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
                            var prefixStep = angular.extend(prefixState, {ncyBreadcrumbLink: $state.href(prefixState)});
                            _pushNonexistentState(chain, prefixStep);
                        } else {
                            throw 'Bad configuration : prefixState "' + options.prefixStateName + '" unknown';
                        }
                    }

                    angular.forEach($state.$current.path, function(value) {
                        var step = angular.extend(value.self, {ncyBreadcrumbLink: $state.href(value)});
                        _pushNonexistentState(chain, step);
                    });

                    return chain;
                }
            };
        }];

    })
    .directive('ncyBreadcrumb', ['$state', '$interpolate', '$breadcrumb', '$rootScope', function ($state, $interpolate, $breadcrumb, $rootScope) {
        return {
            replace: true,
            scope: {},
            template:
                '<ul class="breadcrumb">' +
                '<li ng-repeat="step in steps | limitTo:(steps.length-1)">' +
                '<a href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a> ' +
                '<span class="divider">/</span>' +
                '</li>' +
                '<li ng-repeat="step in steps | limitTo:-1" class="active">' +
                '<span>{{step.ncyBreadcrumbLabel}}</span>' +
                '</li>' +
                '</ul>',
            link: {
                post: function postLink(scope) {
                    $rootScope.$on('$viewContentLoaded', function (event) {
                        scope.steps = $breadcrumb.getStatesChain();
                        angular.forEach(scope.steps, function (value) {
                            if (value.data && value.data.ncyBreadcrumbLabel) {
                                var parseLabel = $interpolate(value.data.ncyBreadcrumbLabel);
                                value.ncyBreadcrumbLabel = parseLabel(event.targetScope);
                            } else {
                                value.ncyBreadcrumbLabel = value.name;
                            }
                        });
                    });
                }
            }
        };
    }]);
