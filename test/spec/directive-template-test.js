/*jshint undef: false */

describe('Breadcrumb directive', function() {

    var element, scope;

    describe('uses default template (bootstrap3)', function() {
        beforeEach(function() {
            module('ncy-basic-conf');
        });

        beforeEach(inject(function($rootScope, $compile) {
            element = angular.element('<div ncy-breadcrumb></div>');
            var compile = $compile(element);
            scope = $rootScope.$new();
            compile(scope);
            scope.$digest();
        }));

        it('correctly', inject(function() {
            goToState('D');
            scope.$emit('$viewContentLoaded');
            scope.$digest();

            console.info('Directive content : ' + element.text());
            expect(element[0].tagName.toLowerCase()).toBe('ol');

            expect(element.children().length).toBe(4);
            expect(element.find('a').length).toBe(3);
        }));

    });

    describe('uses bootstrap2 template', function() {
        beforeEach(function() {
            angular.module('ncy-basic-conf')
                .config(function($breadcrumbProvider) {
                    $breadcrumbProvider.setOptions({
                        template: 'bootstrap2'
                    });
                });
            module('ncy-basic-conf');
        });

        beforeEach(inject(function($rootScope, $compile) {
            element = angular.element('<div ncy-breadcrumb></div>');
            var compile = $compile(element);
            scope = $rootScope.$new();
            compile(scope);
            scope.$digest();
        }));

        it('correctly', inject(function() {
            goToState('D');
            scope.$emit('$viewContentLoaded');
            scope.$digest();

            console.info('Directive content : ' + element.text());
            expect(element[0].tagName.toLowerCase()).toBe('ul');

            expect(element.children().length).toBe(4);
            expect(element.find('a').length).toBe(3);
        }));
    });

    describe('uses custom template', function() {
        beforeEach(function() {
            angular.module('ncy-basic-conf')
                .config(function($breadcrumbProvider) {
                    $breadcrumbProvider.setOptions({
                        template: '<table>' +
                                '<tr ng-repeat="step in steps">' +
                                    '<td>{{step.ncyBreadcrumbLabel}}</td>' +
                                    '<td>{{step.ncyBreadcrumbLink}}</td>' +
                                '</tr>' +
                            '</table>'
                    });
                });
            module('ncy-basic-conf');
        });

        beforeEach(inject(function($rootScope, $compile) {
            element = angular.element('<div ncy-breadcrumb></div>');
            var compile = $compile(element);
            scope = $rootScope.$new();
            compile(scope);
            scope.$digest();
        }));

        it('correctly', inject(function() {
            goToState('D');
            scope.$emit('$viewContentLoaded');
            scope.$digest();

            console.info('Directive content : ' + element.html());
            expect(element[0].tagName.toLowerCase()).toBe('table');

            expect(element.find('tr').length).toBe(4);
            expect(element.find('td').length).toBe(8);
        }));
    });

    describe('uses custom template with html binding', function() {
        beforeEach(function() {
            angular.module('ncy-html-conf')
                .config(function($breadcrumbProvider) {
                    $breadcrumbProvider.setOptions({
                        template: '<div><div ng-repeat="step in steps">' +
                                '<span ng-bind="step.ncyBreadcrumbLabel"></span>' +
                                '<span ng-bind-html="step.ncyBreadcrumbLabel"></span>' +
                            '</div></div>'
                    });
                });
            module('ncy-html-conf');
        });

        beforeEach(inject(function($rootScope, $compile) {
            element = angular.element('<div ncy-breadcrumb></div>');
            var compile = $compile(element);
            scope = $rootScope.$new();
            compile(scope);
            scope.$digest();
        }));

        it('correctly', inject(function() {
            goToState('html');
            scope.$emit('$viewContentLoaded');
            scope.$digest();

            console.info('Directive content : ' + element.html());
            expect(element[0].tagName.toLowerCase()).toBe('div');

            expect(element.find('span').length).toBe(2);
            expect(element.find('span').eq(0).text()).toBe('Html is <b>interpreted</b>');
            expect(element.find('span').eq(1).text()).toBe('Html is interpreted');
        }));
    });

});
