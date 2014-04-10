/*jshint undef: false */

describe('Directive', function() {

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

});