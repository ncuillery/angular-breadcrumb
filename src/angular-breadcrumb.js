angular.module('ncy-angular-breadcrumb', ['ui.router.state'])
    .provider('$breadcrumb', function() {

        var $$options = {
            prefixStateName: null,
            template: 'bootstrap3',
            templateUrl: null
        };

        this.setOptions = function(options) {
            angular.extend($$options, options);
        };

        this.$get = ['$state', function($state) {

            // Add the state in the array if not already in and if not abstract
            var $$addStateInChain = function(array, state, prefixStateInserted) {
                var stateAlreadyInArray = false;
                angular.forEach(array, function(value) {
                    if(!stateAlreadyInArray && angular.equals(value, state)) {
                        stateAlreadyInArray = true;
                    }
                });
                if(!stateAlreadyInArray && !state.abstract) {
                    // Insert at first or second index.
                    if(prefixStateInserted) {
                        array.splice(1, 0, state);
                    } else {
                        array.unshift(state);
                    }
                    return true;
                }
                return false;
            };

            // Get the parent of a state
            var $$breadcrumbParentState = function(state) {

                if (angular.isDefined(state.parent)) {
                    return $state.get(state.parent);
                }

                var compositeName = /^(.+)\.[^.]+$/.exec(state.name);
                if(compositeName) {
                    return $state.get(compositeName[1]);
                }

                return null;
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
                }
            };
        }];

    })
    .directive('ncyBreadcrumb', ['$state', '$interpolate', '$breadcrumb', '$rootScope', function ($state, $interpolate, $breadcrumb, $rootScope) {
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
                    '<li ng-repeat="step in steps | limitTo:(steps.length-1)">' +
                        '<a href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a> ' +
                    '</li>' +
                    '<li ng-repeat="step in steps | limitTo:-1" class="active">' +
                        '<span>{{step.ncyBreadcrumbLabel}}</span>' +
                    '</li>' +
                '</ol>'
        };

        return {
            replace: true,
            scope: {},
            template: $breadcrumb.getTemplate(this.$$templates),
            templateUrl: $breadcrumb.getTemplateUrl(),
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

