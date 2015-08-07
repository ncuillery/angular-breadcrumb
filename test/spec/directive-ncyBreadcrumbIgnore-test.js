/*jshint undef: false */


var element, scope;

describe('Breadcrumb directive with multiple-interpolation conf', function() {

    beforeEach(function () {
        module('ncy-multiple-interpolation-conf');
    });

    describe('when ncyBreadcrumbIgnore is undefined on parent view scope', function () {
        describe('when the parent view located before child view ', function () {
            beforeEach(inject(function ($rootScope, $compile) {
                element = angular.element('<div><div ncy-breadcrumb=""></div><div ui-view="a"></div><div ui-view="b"></div></div>');
                var compile = $compile(element);
                scope = $rootScope.$new();
                compile(scope);
                scope.$digest();
            }));

            it('renders the correct state chain and views content', inject(function () {
                goToState('A.B');
                scope.$emit('$viewContentLoaded');
                scope.$digest();

                console.info('Directive content : ' + element.text());

                expect(element.text()).toContain('AState BBBView AView B');
            }));
        });

        describe('when the parent view located after child view ', function () {
            beforeEach(inject(function ($rootScope, $compile) {
                element = angular.element('<div><div ncy-breadcrumb=""></div><div ui-view="b"></div><div ui-view="a"></div></div>');
                var compile = $compile(element);
                scope = $rootScope.$new();
                compile(scope);
                scope.$digest();
            }));

            it('renders the incorrect state chain', inject(function () {
                goToState('A.B');
                scope.$emit('$viewContentLoaded');
                scope.$digest();

                console.info('Directive content : ' + element.text());

                expect(element.text()).not.toContain('State BBB');
            }));
        });
    });
});

describe('Breadcrumb directive with multiple-interpolation conf', function() {
    beforeEach(function () {
        module('ncy-multiple-interpolation-conf', function ($controllerProvider) {
            $controllerProvider.register('ACtrl', function ($scope) {
                $scope.ncyBreadcrumbIgnore = true;
            });
        });
    });

    describe('when ncyBreadcrumbIgnore property equals true on parent view scope', function () {
        describe('when the parent view located before child view ', function () {
            beforeEach(inject(function ($rootScope, $compile) {
                element = angular.element('<div><div ncy-breadcrumb=""></div><div ui-view="a"></div><div ui-view="b"></div></div>');
                var compile = $compile(element);
                scope = $rootScope.$new();

                compile(scope);
                scope.$digest();
            }));

            it('renders the correct state chain and views content', inject(function () {
                goToState('A.B');
                scope.$emit('$viewContentLoaded');
                scope.$digest();

                console.info('Directive content : ' + element.text());

                expect(element.text()).toContain('AState BBBView AView B');
            }));
        });

        describe('when the parent view located after child view ', function () {
            beforeEach(inject(function ($rootScope, $compile) {
                element = angular.element('<div><div ncy-breadcrumb=""></div><div ui-view="b"></div><div ui-view="a"></div></div>');
                var compile = $compile(element);
                scope = $rootScope.$new();

                compile(scope);
                scope.$digest();
            }));

            it('renders the correct state chain and views content', inject(function () {
                goToState('A.B');
                scope.$emit('$viewContentLoaded');
                scope.$digest();

                console.info('Directive content : ' + element.text());

                expect(element.text()).toContain('AState BBBView BView A');
            }));
        });
    });

});
