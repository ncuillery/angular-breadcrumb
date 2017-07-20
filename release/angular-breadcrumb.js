/*! angular-breadcrumb - v0.5.5
* http://ncuillery.github.io/angular-breadcrumb
* Copyright (c) 2016 Nicolas Cuillery; Licensed MIT */

(function (window, angular, undefined) {
'use strict';

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

var $registeredListeners = {};
function registerListenerOnce(tag, $rootScope, event, fn) {
    var deregisterListenerFn = $registeredListeners[tag];
    if ( deregisterListenerFn !== undefined ) {
        deregisterListenerFn();
    }
    deregisterListenerFn = $rootScope.$on(event, fn);
    $registeredListeners[tag] = deregisterListenerFn;
}

function $Breadcrumb() {

    var $$options = {
        prefixStateName: null,
        template: 'bootstrap3',
        templateUrl: null,
        templateLast: 'default',
        templateLastUrl: null,
        includeAbstract: false,
        useRootParams: false
    };

    this.setOptions = function(options) {
        angular.extend($$options, options);
    };

    this.$get = ['$state', '$stateParams', '$rootScope', function($state, $stateParams, $rootScope) {

        var $lastViewScope = $rootScope;

        // Early catch of $viewContentLoaded event
        registerListenerOnce('$Breadcrumb.$viewContentLoaded', $rootScope, '$viewContentLoaded', function (event) {
            // With nested views, the event occur several times, in "wrong" order
            if(!event.targetScope.ncyBreadcrumbIgnore &&
                isAOlderThanB(event.targetScope.$id, $lastViewScope.$id)) {
                $lastViewScope = event.targetScope;
            }
        });

        // Get the parent state
        var $$parentState = function(state) {
            // Check if state has explicit parent OR we try guess parent from its name
            var parent = state.parent || (/^(.+)\.[^.]+$/.exec(state.name) || [])[1];
            var isObjectParent = typeof parent === "object";
            // if parent is a object reference, then extract the name
            return isObjectParent ? parent.name : parent;
        };

        // Add the state in the chain if not already in and if not abstract
        var $$addStateInChain = function(chain, stateRef) {
            var conf,
                parentParams,
                ref = parseStateRef(stateRef),
                force = false,
                skip = false;

            for(var i=0, l=chain.length; i<l; i+=1) {
                if (chain[i].name === ref.state) {
                    return;
                }
            }

            conf = $state.get(ref.state);
            // Get breadcrumb options
            if(conf.ncyBreadcrumb) {
                if(conf.ncyBreadcrumb.force){ force = true; }
                if(conf.ncyBreadcrumb.skip){ skip = true; }
            }
            if((!conf.abstract || $$options.includeAbstract || force) && !skip) {
                if(ref.paramExpr) {
                    parentParams = $lastViewScope.$eval(ref.paramExpr);
                }

                conf.ncyBreadcrumbLink = $state.href(ref.state, parentParams || $stateParams || {});
                conf.ncyBreadcrumbStateRef = stateRef;
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

            getTemplateLast: function(templates) {
                if($$options.templateLastUrl) {
                    // templateUrl takes precedence over template
                    return null;
                } else if(templates[$$options.templateLast]) {
                    // Predefined templates (default)
                    return templates[$$options.templateLast];
                } else {
                    return $$options.templateLast;
                }
            },

            getTemplateLastUrl: function() {
                return $$options.templateLastUrl;
            },

            getStatesChain: function (exitOnFirst, $routeParams) { // Deliberately undocumented param, see getLastStep
                var chain = [];

                //Ensuring that nesting only starts from current navigated to id
                var startInsertingChain = false;

                // From current state to the root
                for (var stateRef = $state.$current.self.name; stateRef; stateRef = $$breadcrumbParentState(stateRef)) {
                    
                    if ($routeParams && $routeParams.id && $$options.useRootParams && !$routeParams.external) {

                        //Ensuring that nesting only starts from current navigated to id

                        var ref = parseStateRef(stateRef),
                            conf = $state.get(ref.state);
                        
                        var getCurrentURLState = $state.get('myReportsNew.' + $routeParams.id);
                        
                        if (conf) {
                            if (conf.ncyBreadcrumb && conf.ncyBreadcrumb.parent) {

                                if (conf.ncyBreadcrumb.parent == getCurrentURLState.ncyBreadcrumb.parent) {
                                    startInsertingChain = true;
                                }

                                if (startInsertingChain) {
                                    $$addStateInChain(chain, stateRef);
                                }
                            }
                            else {
                                $$addStateInChain(chain, stateRef);
                            }
                        }
                        else {
                            $$addStateInChain(chain, stateRef);
                        }
                    }
                    else {
                        $$addStateInChain(chain, stateRef);
                    }
                    
                    if(exitOnFirst && chain.length) {
                        return chain;
                    }
                }

                // Prefix state treatment
                if($$options.prefixStateName) {
                    $$addStateInChain(chain, $$options.prefixStateName);
                }

                return chain;
            },

            getLastStep: function() {
                var chain = this.getStatesChain(true, $routeParams);
                return chain.length ? chain[0] : undefined;
            },

            $getLastViewScope: function() {
                return $lastViewScope;
            }
        };
    }];
}

var getExpression = function(interpolationFunction) {
    if(interpolationFunction.expressions) {
        return interpolationFunction.expressions;
    } else {
        // Workaround for Angular 1.2.x
        var expressions = [];
        angular.forEach(interpolationFunction.parts, function(part) {
            if(angular.isFunction(part)) {
                expressions.push(part.exp);
            }
        });
        return expressions;
    }
};

var registerWatchers = function(labelWatcherArray, interpolationFunction, viewScope, step) {
    angular.forEach(getExpression(interpolationFunction), function(expression) {
        var watcher = viewScope.$watch(expression, function() {
            step.ncyBreadcrumbLabel = interpolationFunction(viewScope);
        });
        labelWatcherArray.push(watcher);
    });

};

var deregisterWatchers = function(labelWatcherArray) {
    angular.forEach(labelWatcherArray, function(deregisterWatch) {
        deregisterWatch();
    });
};

function BreadcrumbDirective($interpolate, $breadcrumb, $rootScope, $routeParams) {
    var $$templates = {
        bootstrap2: '<ul class="breadcrumb">' +
            '<li ng-repeat="step in steps" ng-switch="$last || !!step.abstract" ng-class="{active: $last}">' +
            '<a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a>' +
            '<span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span>' +
            '<span class="divider" ng-hide="$last">/</span>' +
            '</li>' +
            '</ul>',
        bootstrap3: '<ol class="breadcrumb">' +
            '<li ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract">' +
            '<a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a>' +
            '<span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span>' +
            '</li>' +
            '</ol>'
    };

    return {
        restrict: 'AE',
        replace: true,
        scope: {},
        template: $breadcrumb.getTemplate($$templates),
        templateUrl: $breadcrumb.getTemplateUrl(),
        link: {
            post: function postLink(scope) {
                var labelWatchers = [];

                var renderBreadcrumb = function() {
                    deregisterWatchers(labelWatchers);
                    labelWatchers = [];

                    var viewScope = $breadcrumb.$getLastViewScope();

                    scope.steps = $breadcrumb.getStatesChain(false, $routeParams);
                    angular.forEach(scope.steps, function (step) {
                        if (step.ncyBreadcrumb && step.ncyBreadcrumb.label) {
                            var parseLabel = $interpolate(step.ncyBreadcrumb.label);
                            step.ncyBreadcrumbLabel = parseLabel(viewScope);
                            // Watcher for further viewScope updates
                            registerWatchers(labelWatchers, parseLabel, viewScope, step);
                        } else {
                            step.ncyBreadcrumbLabel = step.name;
                        }
                    });
                };

                registerListenerOnce('BreadcrumbDirective.$viewContentLoaded', $rootScope, '$viewContentLoaded', function (event) {
                    if(!event.targetScope.ncyBreadcrumbIgnore) {
                        renderBreadcrumb();
                    }
                });

                // View(s) may be already loaded while the directive's linking
                renderBreadcrumb();
            }
        }
    };
}

BreadcrumbDirective.$inject = ['$interpolate', '$breadcrumb', '$rootScope', '$routeParams'];

function BreadcrumbLastDirective($interpolate, $breadcrumb, $rootScope, $routeParams) {
    var $$templates = {
      'default': '{{ncyBreadcrumbLabel}}'
    };

    return {
        restrict: 'A',
        scope: {},
        template: $breadcrumb.getTemplateLast($$templates),
        templateUrl: $breadcrumb.getTemplateLastUrl(),
        compile: function(cElement, cAttrs) {

            // Override the default template if ncyBreadcrumbLast has a value
            // This should likely be removed in a future version since global
            // templating is now available for ncyBreadcrumbLast
            var template = cElement.attr(cAttrs.$attr.ncyBreadcrumbLast);
            if(template) {
                cElement.html(template);
            }

            return {
                post: function postLink(scope) {
                    var labelWatchers = [];

                    var renderLabel = function() {
                        deregisterWatchers(labelWatchers);
                        labelWatchers = [];

                        var viewScope = $breadcrumb.$getLastViewScope();
                        var lastStep = $breadcrumb.getLastStep();
                        if(lastStep) {
                            scope.ncyBreadcrumbLink = lastStep.ncyBreadcrumbLink;
                            if (lastStep.ncyBreadcrumb && lastStep.ncyBreadcrumb.label) {
                                var parseLabel = $interpolate(lastStep.ncyBreadcrumb.label);
                                scope.ncyBreadcrumbLabel = parseLabel(viewScope);
                                // Watcher for further viewScope updates
                                // Tricky last arg: the last step is the entire scope of the directive !
                                registerWatchers(labelWatchers, parseLabel, viewScope, scope);
                            } else {
                                scope.ncyBreadcrumbLabel = lastStep.name;
                            }
                        }
                    };

                    registerListenerOnce('BreadcrumbLastDirective.$viewContentLoaded', $rootScope, '$viewContentLoaded', function (event) {
                        if(!event.targetScope.ncyBreadcrumbIgnore) {
                            renderLabel();
                        }
                    });

                    // View(s) may be already loaded while the directive's linking
                    renderLabel();
                }
            };

        }
    };
}
BreadcrumbLastDirective.$inject = ['$interpolate', '$breadcrumb', '$rootScope', '$routeParams'];

function BreadcrumbTextDirective($interpolate, $breadcrumb, $rootScope, $routeParams) {

    return {
        restrict: 'A',
        scope: {},
        template: '{{ncyBreadcrumbChain}}',

        compile: function(cElement, cAttrs) {
            // Override the default template if ncyBreadcrumbText has a value
            var template = cElement.attr(cAttrs.$attr.ncyBreadcrumbText);
            if(template) {
                cElement.html(template);
            }

            var separator = cElement.attr(cAttrs.$attr.ncyBreadcrumbTextSeparator) || ' / ';

            return {
                post: function postLink(scope) {
                    var labelWatchers = [];

                    var registerWatchersText = function(labelWatcherArray, interpolationFunction, viewScope) {
                        angular.forEach(getExpression(interpolationFunction), function(expression) {
                            var watcher = viewScope.$watch(expression, function(newValue, oldValue) {
                                if (newValue !== oldValue) {
                                    renderLabel();
                                }
                            });
                            labelWatcherArray.push(watcher);
                        });
                    };

                    var renderLabel = function() {
                        deregisterWatchers(labelWatchers);
                        labelWatchers = [];

                        var viewScope = $breadcrumb.$getLastViewScope();
                        var steps = $breadcrumb.getStatesChain(false, $routeParams);
                        var combinedLabels = [];
                        angular.forEach(steps, function (step) {
                            if (step.ncyBreadcrumb && step.ncyBreadcrumb.label) {
                                var parseLabel = $interpolate(step.ncyBreadcrumb.label);
                                combinedLabels.push(parseLabel(viewScope));
                                // Watcher for further viewScope updates
                                registerWatchersText(labelWatchers, parseLabel, viewScope);
                            } else {
                                combinedLabels.push(step.name);
                            }
                        });

                        scope.ncyBreadcrumbChain = combinedLabels.join(separator);
                    };

                    registerListenerOnce('BreadcrumbTextDirective.$viewContentLoaded', $rootScope, '$viewContentLoaded', function (event) {
                        if(!event.targetScope.ncyBreadcrumbIgnore) {
                            renderLabel();
                        }
                    });

                    // View(s) may be already loaded while the directive's linking
                    renderLabel();
                }
            };

        }
    };
}
BreadcrumbTextDirective.$inject = ['$interpolate', '$breadcrumb', '$rootScope', '$routeParams'];

angular.module('ncy-angular-breadcrumb', ['ui.router.state'])
    .provider('$breadcrumb', $Breadcrumb)
    .directive('ncyBreadcrumb', BreadcrumbDirective)
    .directive('ncyBreadcrumbLast', BreadcrumbLastDirective)
    .directive('ncyBreadcrumbText', BreadcrumbTextDirective);
})(window, window.angular);
