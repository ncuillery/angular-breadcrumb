/*jshint undef: false */

describe('Last step directive with basic conf', function() {

    var element, scope;

    beforeEach(function() {
        module('ncy-basic-conf');
    });

    describe('without template', function() {

        beforeEach(inject(function($rootScope, $compile) {
            element = angular.element('<span ncy-breadcrumb-last></span>');
            var compile = $compile(element);
            scope = $rootScope.$new();
            compile(scope);
            scope.$digest();
        }));

        it('renders the last step label correctly', inject(function() {
            goToState('D');
            scope.$emit('$viewContentLoaded');
            scope.$digest();

            console.info('Directive content : ' + element.text());
            expect(element.text()).toBe('State D');
        }));

    });

    describe('with template', function() {

        beforeEach(inject(function($rootScope, $compile) {
            element = angular.element('<span ncy-breadcrumb-last="{{ncyBreadcrumbLabel}}|{{ncyBreadcrumbLink}}"></span>');
            var compile = $compile(element);
            scope = $rootScope.$new();
            compile(scope);
            scope.$digest();
        }));

        it('renders the template correctly', inject(function() {
            goToState('D');
            scope.$emit('$viewContentLoaded');
            scope.$digest();

            console.info('Directive content : ' + element.text());
            expect(element.text()).toBe('State D|#/a/b/c/d');
        }));

    });

    describe('with custom template', function() {
        beforeEach(function() {
            angular.module('ncy-basic-conf')
                .config(function($breadcrumbProvider) {
                    $breadcrumbProvider.setOptions({
                        templateLast: '<i>{{ncyBreadcrumbLabel}}</i>'
                    });
                });
            module('ncy-basic-conf');
        });

        beforeEach(inject(function($rootScope, $compile) {
            element = angular.element('<span ncy-breadcrumb-last></span>');
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
            expect(element[0].tagName.toLowerCase()).toBe('span');
            expect(element.find('i').length).toBe(1);
        }));
    });

    describe('uses custom template with html binding', function() {
        beforeEach(function() {
            angular.module('ncy-html-conf')
                .config(function($breadcrumbProvider) {
                    $breadcrumbProvider.setOptions({
                        templateLast: '<i ng-bind="ncyBreadcrumbLabel"></i><i ng-bind-html="ncyBreadcrumbLabel"></i>'
                    });
                });
            module('ncy-html-conf');
        });

        beforeEach(inject(function($rootScope, $compile) {
            element = angular.element('<span ncy-breadcrumb-last></span>');
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
            expect(element[0].tagName.toLowerCase()).toBe('span');

            expect(element.find('i').length).toBe(2);
            expect(element.find('i').eq(0).text()).toBe('Html is <b>interpreted</b>');
            expect(element.find('i').eq(1).text()).toBe('Html is interpreted');
        }));
    });
});
