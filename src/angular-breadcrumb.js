'use strict';

function parseStateRef(ref) {
    var parsed = ref.replace(/\n/g, " ").match(/^([^(]+?)\s*(\((.*)\))?$/);
    if (!parsed || parsed.length !== 4) {
        throw new Error("Invalid state ref '" + ref + "'");
    }
    return {state: parsed[1], paramExpr: parsed[3] || null};
}

function countKeys(obj) {
    var keys = 0;
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            keys++;
        }
    }
    return keys;
}

var $registeredListeners = {};
function registerListenerOnce(tag, $rootScope, event, fn) {
    var deregisterListenerFn = $registeredListeners[tag];
    if (deregisterListenerFn !== undefined) {
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
        includeAbstract: false
    };

    this.setOptions = function (options) {
        angular.extend($$options, options);
    };

    this.$get = ['$state', '$stateParams', '$rootScope', '$injector', '$q', function ($state, $stateParams, $rootScope, $injector, $q) {
        // Get the parent state
        var $$parentState = function (state) {
            // Check if state has explicit parent OR we try guess parent from its name
            var parent = state.parent || (/^(.+)\.[^.]+$/.exec(state.name) || [])[1];
            var isObjectParent = typeof parent === "object";
            // if parent is a object reference, then extract the name
            return isObjectParent ? parent.name : parent;
        };

        // Add the state in the chain if not already in and if not abstract
        var $$addStateInChain = function (chain, stateRef) {
            var conf,
                parentParams,
                ref = parseStateRef(stateRef),
                force = false,
                skip = false;

            conf = angular.copy($state.get(ref.state));
            // Get breadcrumb options
            if (conf.ncyBreadcrumb) {
                if (conf.ncyBreadcrumb.force) {
                    force = true;
                }
                if (conf.ncyBreadcrumb.skip) {
                    skip = true;
                }
            }
            if ((!conf.abstract || $$options.includeAbstract || force) && !skip) {
                if (ref.paramExpr) {
                    parentParams = getLastViewScope().$eval(ref.paramExpr);
                }

                conf.ncyBreadcrumbLink = $state.href(ref.state, parentParams || $stateParams || {});
                conf.ncyBreadcrumbStateRef = stateRef;
                chain.unshift(conf);
            }
        };

        // Get the state for the parent step in the breadcrumb
        var $$breadcrumbParentState = function (stateRef) {
            var ref = parseStateRef(stateRef),
                conf = $state.get(ref.state);

            if (conf.ncyBreadcrumb && conf.ncyBreadcrumb.parent) {
                var parentStateRef,
                    locals,
                    type = Object.prototype.toString.call(conf.ncyBreadcrumb.parent);
                if (type === '[object Function]' ||
                    type === '[object Array]') {
                    locals = getLastViewLocals();
                    parentStateRef = $injector.invoke(conf.ncyBreadcrumb.parent, null, locals);
                } else {
                    parentStateRef = conf.ncyBreadcrumb.parent;
                }

                if (parentStateRef) {
                    return $q.when(parentStateRef);
                }
            }

            return $q.when($$parentState(conf));
        };

        function getLastViewLocals() {
            var state = $state.$current,
                views = countKeys(state.views);

            if (!views) {
                return;
            }

            if (state.ncyBreadcrumb && state.ncyBreadcrumb.mainView) {
                return state.locals[state.ncyBreadcrumb.mainView];
            }

            if (views === 1) {
                for (var key in state.views) {
                    if (state.views.hasOwnProperty(key)) {
                        return state.locals[key];
                    }
                }
            } else if (state.views['@']) {
                return state.locals['@'];
            }

            throw new Error('Multiple views found and mainView was not defined');
        }

        function getLastViewScope() {
            var lastView = getLastViewLocals();
            if (!lastView) {
                return $rootScope;
            }
            return lastView.$scope || $rootScope;
        }

        function buildChain(chain, stateRef, exitOnFirst) {
            return $$breadcrumbParentState(stateRef).then(function (parent) {
                if (!parent || (exitOnFirst && chain.length)) {
                    return chain;
                }
                $$addStateInChain(chain, parent);
                return buildChain(chain, parent, exitOnFirst);
            });
        }

        function addPrefixState(chain) {
            if ($$options.prefixStateName && (!chain.length || $$options.prefixStateName !== chain[0].name)) {
                $$addStateInChain(chain, $$options.prefixStateName);
            }
        }

        return {
            getTemplate: function (templates) {
                if ($$options.templateUrl) {
                    // templateUrl takes precedence over template
                    return null;
                } else if (templates[$$options.template]) {
                    // Predefined templates (bootstrap, ...)
                    return templates[$$options.template];
                } else {
                    return $$options.template;
                }
            },

            getTemplateUrl: function () {
                return $$options.templateUrl;
            },

            getTemplateLast: function (templates) {
                if ($$options.templateLastUrl) {
                    // templateUrl takes precedence over template
                    return null;
                } else if (templates[$$options.templateLast]) {
                    // Predefined templates (default)
                    return templates[$$options.templateLast];
                } else {
                    return $$options.templateLast;
                }
            },

            getTemplateLastUrl: function () {
                return $$options.templateLastUrl;
            },

            getStatesChain: function (exitOnFirst) { // Deliberately undocumented param, see getLastStep
                var chain = [];

                if (!$state.$current.self.name) {
                    addPrefixState(chain);
                    return $q.when(chain);
                }

                $$addStateInChain(chain, $state.$current.self.name);
                if (exitOnFirst && chain.length) {
                    return $q.when(chain);
                }

                var getChainPromise = buildChain(chain, $state.$current.self.name, exitOnFirst);

                return $q.when(getChainPromise).then(function () {
                    addPrefixState(chain);
                    return chain;
                });
            },

            getLastStep: function () {
                return this.getStatesChain(true).then(function (chain) {
                    return chain.length ? chain[0] : undefined;
                });
            },

            $getLastViewScope: getLastViewScope,

            $getLastViewLocals: getLastViewLocals
        };
    }];
}

var getExpression = function (interpolationFunction) {
    if (interpolationFunction.expressions) {
        return interpolationFunction.expressions;
    } else {
        // Workaround for Angular 1.2.x
        var expressions = [];
        angular.forEach(interpolationFunction.parts, function (part) {
            if (angular.isFunction(part)) {
                expressions.push(part.exp);
            }
        });
        return expressions;
    }
};

var registerWatchers = function (labelWatcherArray, interpolationFunction, viewScope, step) {
    angular.forEach(getExpression(interpolationFunction), function (expression) {
        var watcher = viewScope.$watch(expression, function () {
            step.ncyBreadcrumbLabel = interpolationFunction(viewScope);
        });
        labelWatcherArray.push(watcher);
    });

};

var deregisterWatchers = function (labelWatcherArray) {
    angular.forEach(labelWatcherArray, function (deregisterWatch) {
        deregisterWatch();
    });
};

function BreadcrumbDirective($interpolate, $breadcrumb, $rootScope, $injector, $q) {
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

                var renderBreadcrumb = function () {
                    deregisterWatchers(labelWatchers);
                    labelWatchers = [];

                    var viewScope = $breadcrumb.$getLastViewScope();
                    var locals = $breadcrumb.$getLastViewLocals();
                    $breadcrumb.getStatesChain().then(function (chain) {
                        scope.steps = chain;
                        angular.forEach(scope.steps, function (step) {
                            if (step.ncyBreadcrumb && step.ncyBreadcrumb.label) {
                                var type = Object.prototype.toString.call(step.ncyBreadcrumb.label);
                                if (type === '[object Function]' ||
                                    type === '[object Array]') {
                                    $q.when($injector.invoke(step.ncyBreadcrumb.label, null, locals)).then(function (label) {
                                        step.ncyBreadcrumbLabel = label;
                                    });
                                } else {
                                    var parseLabel = $interpolate(step.ncyBreadcrumb.label);
                                    step.ncyBreadcrumbLabel = parseLabel(viewScope);
                                    // Watcher for further viewScope updates
                                    registerWatchers(labelWatchers, parseLabel, viewScope, step);
                                }
                            } else {
                                step.ncyBreadcrumbLabel = step.name;
                            }
                        });
                    });
                };

                registerListenerOnce('BreadcrumbDirective.$viewContentLoaded', $rootScope, '$viewContentLoaded', function () {
                    renderBreadcrumb();
                });

                // View(s) may be already loaded while the directive's linking
                renderBreadcrumb();
            }
        }
    };
}
BreadcrumbDirective.$inject = ['$interpolate', '$breadcrumb', '$rootScope', '$injector', '$q'];

function BreadcrumbLastDirective($interpolate, $breadcrumb, $rootScope, $injector, $q) {
    var $$templates = {
        'default': '{{ncyBreadcrumbLabel}}'
    };

    return {
        restrict: 'A',
        scope: {},
        template: $breadcrumb.getTemplateLast($$templates),
        templateUrl: $breadcrumb.getTemplateLastUrl(),
        compile: function (cElement, cAttrs) {

            // Override the default template if ncyBreadcrumbLast has a value
            // This should likely be removed in a future version since global
            // templating is now available for ncyBreadcrumbLast
            var template = cElement.attr(cAttrs.$attr.ncyBreadcrumbLast);
            if (template) {
                cElement.html(template);
            }

            return {
                post: function postLink(scope) {
                    var labelWatchers = [];

                    var renderLabel = function () {
                        deregisterWatchers(labelWatchers);
                        labelWatchers = [];

                        var viewScope = $breadcrumb.$getLastViewScope();
                        var locals = $breadcrumb.$getLastViewLocals();
                        $breadcrumb.getLastStep().then(function (lastStep) {
                            if (!lastStep) {
                                return;
                            }
                            scope.ncyBreadcrumbLink = lastStep.ncyBreadcrumbLink;
                            if (lastStep.ncyBreadcrumb && lastStep.ncyBreadcrumb.label) {
                                var type = Object.prototype.toString.call(lastStep.ncyBreadcrumb.label);
                                if (type === '[object Function]' ||
                                    type === '[object Array]') {
                                    $q.when($injector.invoke(lastStep.ncyBreadcrumb.label, null, locals)).then(function (label) {
                                        scope.ncyBreadcrumbLabel = label;
                                    });
                                } else {
                                    var parseLabel = $interpolate(lastStep.ncyBreadcrumb.label);
                                    scope.ncyBreadcrumbLabel = parseLabel(viewScope);
                                    // Watcher for further viewScope updates
                                    // Tricky last arg: the last step is the entire scope of the directive !
                                    registerWatchers(labelWatchers, parseLabel, viewScope, scope);
                                }
                            } else {
                                scope.ncyBreadcrumbLabel = lastStep.name;
                            }
                        });
                    };

                    registerListenerOnce('BreadcrumbLastDirective.$viewContentLoaded', $rootScope, '$viewContentLoaded', function () {
                        renderLabel();
                    });

                    // View(s) may be already loaded while the directive's linking
                    renderLabel();
                }
            };

        }
    };
}
BreadcrumbLastDirective.$inject = ['$interpolate', '$breadcrumb', '$rootScope', '$injector', '$q'];

function BreadcrumbTextDirective($interpolate, $breadcrumb, $rootScope, $injector, $q) {

    return {
        restrict: 'A',
        scope: {},
        template: '{{ncyBreadcrumbChain}}',

        compile: function (cElement, cAttrs) {
            // Override the default template if ncyBreadcrumbText has a value
            var template = cElement.attr(cAttrs.$attr.ncyBreadcrumbText);
            if (template) {
                cElement.html(template);
            }

            var separator = cElement.attr(cAttrs.$attr.ncyBreadcrumbTextSeparator) || ' / ';

            return {
                post: function postLink(scope) {
                    var labelWatchers = [];

                    var registerWatchersText = function (labelWatcherArray, interpolationFunction, viewScope) {
                        angular.forEach(getExpression(interpolationFunction), function (expression) {
                            var watcher = viewScope.$watch(expression, function (newValue, oldValue) {
                                if (newValue !== oldValue) {
                                    renderLabel();
                                }
                            });
                            labelWatcherArray.push(watcher);
                        });
                    };

                    var renderLabel = function () {
                        deregisterWatchers(labelWatchers);
                        labelWatchers = [];

                        var viewScope = $breadcrumb.$getLastViewScope();
                        var locals = $breadcrumb.$getLastViewLocals();
                        $breadcrumb.getStatesChain().then(function (steps) {
                            var combinedLabels = [];
                            angular.forEach(steps, function (step) {
                                if (step.ncyBreadcrumb && step.ncyBreadcrumb.label) {
                                    var type = Object.prototype.toString.call(step.ncyBreadcrumb.label);
                                    if (type === '[object Function]' ||
                                        type === '[object Array]') {
                                        combinedLabels.push($q.when($injector.invoke(step.ncyBreadcrumb.label, null, locals)));
                                    } else {
                                        var parseLabel = $interpolate(step.ncyBreadcrumb.label);
                                        combinedLabels.push($q.when(parseLabel(viewScope)));
                                        // Watcher for further viewScope updates
                                        registerWatchersText(labelWatchers, parseLabel, viewScope);
                                    }
                                } else {
                                    combinedLabels.push($q.when(step.name));
                                }
                            });

                            scope.ncyBreadcrumbChain = [];
                            $q.all(combinedLabels).then(function (labels) {
                                scope.ncyBreadcrumbChain = labels.join(separator);
                            });
                        });
                    };

                    registerListenerOnce('BreadcrumbTextDirective.$viewContentLoaded', $rootScope, '$viewContentLoaded', function () {
                        renderLabel();
                    });

                    // View(s) may be already loaded while the directive's linking
                    renderLabel();
                }
            };

        }
    };
}
BreadcrumbTextDirective.$inject = ['$interpolate', '$breadcrumb', '$rootScope', '$injector', '$q'];

angular.module('ncy-angular-breadcrumb', ['ui.router.state'])
    .provider('$breadcrumb', $Breadcrumb)
    .directive('ncyBreadcrumb', BreadcrumbDirective)
    .directive('ncyBreadcrumbLast', BreadcrumbLastDirective)
    .directive('ncyBreadcrumbText', BreadcrumbTextDirective);
