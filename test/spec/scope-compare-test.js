/*jshint undef: false */

describe('The scope', function() {

    beforeEach(function() {
        module('ncy-basic-conf');
    });

    it('00A is older than 001', function() {
        expect(isAOlderThanB('00A', '001')).toBe(true);
    });

    it('010 is older than 00Y', function() {
        expect(isAOlderThanB('010', '00Y')).toBe(true);
    });

    it('01P is older than 010', function() {
        expect(isAOlderThanB('01P', '010')).toBe(true);
    });

    it('FOO is older than BAR', function() {
        expect(isAOlderThanB('FOO', 'BAR')).toBe(true);
    });

    it('F00 is older than BAR', function() {
        expect(isAOlderThanB('F00', 'BAR')).toBe(true);
    });

    it('0000 is older than ZZZ', function() {
        expect(isAOlderThanB('0000', 'ZZZ')).toBe(true);
    });

    it('(newly created) is always older than the precedent one', inject(function($rootScope) {
        var scope = $rootScope.$new();
        for(var i = 0; i < 100000; i++) {
            var newScope = $rootScope.$new();
            var isOlder = isAOlderThanB(newScope.$id, scope.$id);
            expect(isOlder).toBe(true);
            if(!isOlder) {
                console.log(newScope.$id, scope.$id, isOlder, i);
                break;
            }
            scope = newScope;
        }
    }));

});
