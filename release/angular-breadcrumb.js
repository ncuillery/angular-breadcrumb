/*! angular-breadcrumb - v0.2.2
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

    this.$get = ['$state', '$rootScope', function($state, $rootScope) {

        var $lastViewScope = $rootScope;

        // Early catch of $viewContentLoaded event
        $rootScope.$on('$viewContentLoaded', function (event) {
            // With nested views, the event occur several times, in "wrong" order
            if(isAOlderThanB(event.targetScope.$id, $lastViewScope.$id)) {
                $lastViewScope = event.targetScope;
            }
        });

        // Check if a property in state's data is inherited from the parent state
        var $$isInherited = function(state, dataProperty) {
            var parentState = $$parentState(state);
            return angular.isDefined(parentState) &&
                angular.isDefined(parentState.data) &&
                angular.isDefined(parentState.data[dataProperty]) &&
                angular.equals(state.data[dataProperty], parentState.data[dataProperty]);
        };

        // Get the parent state
        var $$parentState = function(state) {
            if (angular.isDefined(state.parent)) {
                return $state.get(state.parent);
            }

            var compositeName = /^(.+)\.[^.]+$/.exec(state.name);
            if(compositeName) {
                return $state.get(compositeName[1]);
            }
            return undefined;
        };

        // Add the state in the chain if not already in and if not abstract
        var $$addStateInChain = function(chain, state, prefixStateInserted) {
            var stateAlreadyInChain = false;
            angular.forEach(chain, function(value) {
                if(!stateAlreadyInChain && angular.equals(value, state)) {
                    stateAlreadyInChain = true;
                }
            });

            var skipStep = angular.isDefined(state.data) &&
                state.data.ncyBreadcrumbSkip &&
                !$$isInherited(state, 'ncyBreadcrumbSkip');

            if(!stateAlreadyInChain && !state.abstract && !skipStep) {
                // Insert at first or second index.
                if(prefixStateInserted) {
                    chain.splice(1, 0, state);
                } else {
                    chain.unshift(state);
                }
                return true;
            }
            return false;
        };

        // Get the state for the parent step in the breadcrumb
        var $$breadcrumbParentState = function(state) {

            if(angular.isDefined(state.data) &&
                angular.isDefined(state.data.ncyBreadcrumbParent) &&
                !$$isInherited(state, 'ncyBreadcrumbParent')) {
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
                var prefixStateInserted = false;

                // Prefix state treatment
                if($$options.prefixStateName) {
                    var prefixState = $state.get($$options.prefixStateName);
                    if(prefixState) {
                        var prefixStep = angular.extend(prefixState, {ncyBreadcrumbLink: $state.href(prefixState)});
                        prefixStateInserted = $$addStateInChain(chain, prefixStep, prefixStateInserted);
                    } else {
                        throw 'Bad configuration : prefixState "' + $$options.prefixStateName + '" unknown';
                    }
                }

                // From current state to the root
                var state = $state.$current.self;
                do {
                    var step = angular.extend(state, {ncyBreadcrumbLink: $state.href(state.name)});
                    $$addStateInChain(chain, step, prefixStateInserted);
                    state = $$breadcrumbParentState(state);
                }
                while(state && state.name !== '');

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
