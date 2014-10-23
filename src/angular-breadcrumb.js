function isAOlderThanB(scopeA, scopeB) {
    if(angular.equals(scopeA.length, scopeB.length)) {
        return scopeA > scopeB;
    } else {
        return scopeA.length > scopeB.length;
    }
}

function parseStateRef(ref) {
    var parsed = ref.replace(/\n/g, " ").match(/^([^(]+?)\s*(\((.*)\))?$/);
    if (!parsed || parsed.length !== 4) { throw new Error("Invalid state ref '" + ref + "'"); }
    return { state: parsed[1], paramExpr: parsed[3] || null };
}

function $Breadcrumb() {

    var $$options = {
        prefixStateName: null,
        template: 'bootstrap3',
        templateUrl: null,
        includeAbstract : false
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

        // Get the parent state
        var $$parentState = function(state) {
            // Check if state has explicit parent OR we try guess parent from its name
            var name = state.parent || (/^(.+)\.[^.]+$/.exec(state.name) || [])[1];
            // If we were able to figure out parent name then get this state
            return name;
        };

        // Add the state in the chain if not already in and if not abstract
        var $$addStateInChain = function(chain, stateRef) {
            var conf,
                parentParams,
                ref = parseStateRef(stateRef);

            for(var i=0, l=chain.length; i<l; i+=1) {
                if (chain[i].name === ref.state) {
                    return;
                }
            }

            conf = $state.get(ref.state);
            if((!conf.abstract || $$options.includeAbstract) && !(conf.ncyBreadcrumb && conf.ncyBreadcrumb.skip)) {
                if(ref.paramExpr) {
                    parentParams = $lastViewScope.$eval(ref.paramExpr);
                }

                conf.ncyBreadcrumbLink = $state.href(ref.state, parentParams || $stateParams || {});
                chain.unshift(conf);
            }
        };

        // Get the state for the parent step in the breadcrumb
        var $$breadcrumbParentState = function(stateRef) {
            var ref = parseStateRef(stateRef),
                conf = $state.get(ref.state);

            if(conf.ncyBreadcrumb && conf.ncyBreadcrumb.parent) {
                // Handle the "parent" property of the breadcrumb, override the parent/child relation of the state
                var isFunction = typeof conf.ncyBreadcrumb.parent === 'function';
                var parentStateRef = isFunction ? conf.ncyBreadcrumb.parent($lastViewScope) : conf.ncyBreadcrumb.parent;
                if(parentStateRef) {
                    return parentStateRef;
                }
            }

            return $$parentState(conf);
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
                for(var stateRef = $state.$current.self.name; stateRef; stateRef=$$breadcrumbParentState(stateRef)) {
                  $$addStateInChain(chain, stateRef);
                }

                // Prefix state treatment
                if($$options.prefixStateName) {
                    $$addStateInChain(chain, $$options.prefixStateName);
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
            '<li ng-repeat="step in steps" ng-switch="$last || !!step.abstract" ng-class="{active: $last}">' +
            '<a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a> ' +
            '<span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span>' +
            '<span class="divider" ng-hide="$last">/</span>' +
            '</li>' +
            '</ul>',
        bootstrap3: '<ol class="breadcrumb">' +
            '<li ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract">' +
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
                        if (step.ncyBreadcrumb && step.ncyBreadcrumb.label) {
                            var parseLabel = $interpolate(step.ncyBreadcrumb.label);
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
