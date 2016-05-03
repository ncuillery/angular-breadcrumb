/*jshint undef: false */

describe('Text directive with separator with basic conf', function() {
    var element;

    beforeEach(function() {
        module('ncy-basic-conf');
    });

    describe('without template', function() {

        beforeEach(inject(function($rootScope, $compile) {
            var elem = angular.element('<span ncy-breadcrumb-text ncy-breadcrumb-text-separator=">"></span><div ui-view></div>');
            element = $compile(elem)($rootScope.$new());
        }));

        it('renders the text label correctly', inject(function() {
            goToState('D');
            
            expect(element.text()).toBe('State A>State B>State C>State D');
        }));

    });

    describe('with template', function() {

        beforeEach(inject(function($rootScope, $compile) {
            var elem = angular.element('<span ncy-breadcrumb-text="{{ncyBreadcrumbChain}} - MyApp" ncy-breadcrumb-text-separator=">"></span><div ui-view></div>');
            element = $compile(elem)($rootScope.$new());
        }));

        it('renders the template correctly', inject(function() {
            goToState('D');
            
            expect(element.text()).toBe('State A>State B>State C>State D - MyApp');
        }));

    });

});
