/*jshint undef: false */

describe('Service $breadcrumb', function() {

    beforeEach(function() {
        module('ncy-angular-breadcrumb', 'ui.router.state', 'ngMock', 'ng');
    });

    it('should be defined', inject(function($breadcrumb) {
        expect($breadcrumb).toBeDefined();
    }));

});