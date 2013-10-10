/*
 * angular-breadcrumb
 * https://github.com/ncuillery/angular-breadcrumb
 *
 * Copyright (c) 2013 Nicolas Cuillery
 * Licensed under the MIT license.
 */

angular.module('ncy-angular-breadcrumb', ['ui.router.state'])
    .directive('ncyBreadcrumb', function($state) {
        return function(scope, element, attrs) {

            scope.$watch(function() { return $state.current; }, function(newValue, oldValue) {
                element.text(newValue.name);
            }, true);

        }
});
