/*global describe, beforeEach, it, chai, inject, module */
'use strict';

var assert = chai.assert;

describe('Service $breadcrumb', function() {

    var _breadcrumb_;

    beforeEach(function() {
        module('ncy-angular-breadcrumb', 'ui.router.state', 'ngMock', 'ng');
    });

    beforeEach(inject(function($breadcrumb) {
        _breadcrumb_ = $breadcrumb;
    }));

    it('should be defined', function() {
        assert.isNotNull(_breadcrumb_);
    });
});