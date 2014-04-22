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

        // Add the state in the array if not already in and if not abstract
        var $$pushState = function(array, state) {
            var stateAlreadyInArray = false;
            angular.forEach(array, function(value) {
                if(!stateAlreadyInArray && angular.equals(value, state)) {
                    stateAlreadyInArray = true;
                }
            });
            if(!stateAlreadyInArray && !state.abstract) {
                array.push(state);
                return true;
            }
            return false;
        };

        this.$get = ['$state', function($state) {

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

                    // Prefix state treatment
                    if($$options.prefixStateName) {
                        var prefixState = $state.get($$options.prefixStateName);
                        if(prefixState) {
                            var prefixStep = angular.extend(prefixState, {ncyBreadcrumbLink: $state.href(prefixState)});
                            $$pushState(chain, prefixStep);
                        } else {
                            throw 'Bad configuration : prefixState "' + $$options.prefixStateName + '" unknown';
                        }
                    }

                    angular.forEach($state.$current.path, function(value) {
                        var step = angular.extend(value.self, {ncyBreadcrumbLink: $state.href(value)});
                        $$pushState(chain, step);
                    });

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

