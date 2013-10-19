/*global describe, it, chai, angular */
'use strict';

var assert = chai.assert;

//var moduleBc = angular.module(['ncy-angular-breadcrumb']);
var injector = angular.injector(['ncy-angular-breadcrumb', 'ui.router.state', 'ng', 'ngMock']);

describe('Service $breadcrumb', function() {
    it('should be defined', function() {
        var $breadcrumb = injector.get('$breadcrumb');
        assert.isDefined($breadcrumb);
        assert.isDefined($breadcrumb.getStatesChain);
    });
});