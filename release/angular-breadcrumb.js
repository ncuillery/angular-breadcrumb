/*! angular-breadcrumb - v0.2.3
* https://github.com/ncuillery/angular-breadcrumb
* Copyright (c) 2014 Nicolas Cuillery; Licensed MIT */

(function (window, angular, undefined) {
function isAOlderThanB(scopeA, scopeB) {
    if(angular.equals(scopeA.length, scopeB.length)) {
        return scopeA > scopeB;
    } else {
        return scopeA.length > scopeB.length;
    }
}

function $Breadcrumb() {

    var $$options = {
        prefixStateName: null,
        template: 'bootstrap3',
        templateUrl: null
    };

    this.setOptions = function(options) {
        angular.extend($$options, options);
    };

    this.$get = ['$state', '$stateParams', '$rootScope', function($state, $stateParams, $rootScope) {

        var $lastViewScope = $rootScope;

        // Early catch of $viewContentLoaded event
        $rootScope.$on('$viewContentLoaded', function (event) {
            // With nested views, the event occur several times, in "wrong" order
            if(isAOlderThanB(event.targetScope.$id, $lastViewScope.$id)) {
                $lastViewScope = event.targetScope;
            }
        });

        // Check if a property in state's data is its own
        var $$isStateDataProperty = function(state, property) {
            if(!state.data || !state.data[property]) {
                return false;
            }

            var parentState = $$parentState(state);
            return !(parentState && parentState.data && parentState.data[property] && state.data[property] === parentState.data[property]);
        };

        // Get the parent state
        var $$parentState = function(state) {
            // Check if state has explicit parent OR we try guess parent from its name
            var name = state.parent || (/^(.+)\.[^.]+$/.exec(state.name) || [])[1];
            // If we were able to figure out parent name then get this state
            return name && $state.get(name);
        };

        // Add the state in the chain if not already in and if not abstract
        var $$addStateInChain = function(chain, state) {
            for(var i=0, l=chain.length; i<l; i+=1) {
              if (chain[i].name === state.name) {
                return;
              }
            }

            if(!state.abstract && !$$isStateDataProperty(state, 'ncyBreadcrumbSkip')) {
                state.ncyBreadcrumbLink = $state.href(state.name, $stateParams || {});
                chain.unshift(state);
            }
        };

        // Get the state for the parent step in the breadcrumb
        var $$breadcrumbParentState = function(state) {
            if($$isStateDataProperty(state, 'ncyBreadcrumbParent')) {
                return $state.get(state.data.ncyBreadcrumbParent);
            }

            return $$parentState(state);
        };

        return {

            getTemplate: function(templates) {
                if($$options.templateUrl) {
                    // templateUrl takes precedence over template
                    return null;
                } else if(templates[$$options.template]) {
                    // Predefined templates (bootstrap, ...)
                    return templates[$$options.template];
                } else {
                    return $$options.template;
                }
            },

            getTemplateUrl: function() {
                return $$options.templateUrl;
            },

            getStatesChain: function() {
                var chain = [];

                // From current state to the root
                for(var state = $state.$current.self; state && state.name !== ''; state=$$breadcrumbParentState(state)) {
                  $$addStateInChain(chain, state);
                }

                // Prefix state treatment
                if($$options.prefixStateName) {
                    var prefixState = $state.get($$options.prefixStateName);
                    if(!prefixState) {
                        throw 'Bad configuration : prefixState "' + $$options.prefixStateName + '" unknown';
                    }

                    $$addStateInChain(chain, prefixState);
                }

                return chain;
            },

            $getLastViewScope: function() {
                return $lastViewScope;
            }
        };
    }];
}

function BreadcrumbDirective($interpolate, $breadcrumb, $rootScope) {
    this.$$templates = {
        bootstrap2: '<ul class="breadcrumb">' +
            '<li ng-repeat="step in steps | limitTo:(steps.length-1)">' +
            '<a href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a> ' +
            '<span class="divider">/</span>' +
            '</li>' +
            '<li ng-repeat="step in steps | limitTo:-1" class="active">' +
            '<span>{{step.ncyBreadcrumbLabel}}</span>' +
            '</li>' +
            '</ul>',
        bootstrap3: '<ol class="breadcrumb">' +
            '<li ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last">' +
            '<a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a> ' +
            '<span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span>' +
            '</li>' +
            '</ol>'
    };

    return {
        restrict: 'AE',
        replace: true,
        scope: {},
        template: $breadcrumb.getTemplate(this.$$templates),
        templateUrl: $breadcrumb.getTemplateUrl(),
        link: {
            post: function postLink(scope) {
                var labelWatchers = [];

                var getExpression = function(interpolationFunction) {
                    if(interpolationFunction.expressions) {
                        return interpolationFunction.expressions;
                    } else {
                        var expressions = [];
                        angular.forEach(interpolationFunction.parts, function(part) {
                            if(angular.isFunction(part)) {
                                expressions.push(part.exp);
                            }
                        });
                        return expressions;
                    }
                };

                var registerWatchers = function(interpolationFunction, scope, step) {
                    angular.forEach(getExpression(interpolationFunction), function(expression) {
                        var watcher = scope.$watch(expression, function() {
                            step.ncyBreadcrumbLabel = interpolationFunction(scope);
                        });
                        labelWatchers.push(watcher);
                    });

                };

                var deregisterWatchers = function() {
                    angular.forEach(labelWatchers, function(deregisterWatch) {
                        deregisterWatch();
                    });
                    labelWatchers = [];
                };

                var renderBreadcrumb = function() {
                    deregisterWatchers();
                    var viewScope = $breadcrumb.$getLastViewScope();
                    scope.steps = $breadcrumb.getStatesChain();
                    angular.forEach(scope.steps, function (step) {
                        if (step.data && step.data.ncyBreadcrumbLabel) {
                            var parseLabel = $interpolate(step.data.ncyBreadcrumbLabel);
                            step.ncyBreadcrumbLabel = parseLabel(viewScope);
                            // Watcher for further viewScope updates
                            registerWatchers(parseLabel, viewScope, step);
                        } else {
                            step.ncyBreadcrumbLabel = step.name;
                        }
                    });
                };

                $rootScope.$on('$viewContentLoaded', function () {
                    renderBreadcrumb();
                });

                // View(s) may be already loaded while the directive's linking
                renderBreadcrumb();
            }
        }
    };
}
BreadcrumbDirective.$inject = ['$interpolate', '$breadcrumb', '$rootScope'];

angular.module('ncy-angular-breadcrumb', ['ui.router.state'])
    .provider('$breadcrumb', $Breadcrumb)
    .directive('ncyBreadcrumb', BreadcrumbDirective);
})(window, window.angular);
