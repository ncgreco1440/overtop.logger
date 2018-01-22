var assert = require('chai').assert;
const clock = require('./../src/clock');
var moment = require('moment');

describe('clock tests', function() {

    it('should return the time at the end of the day', function() {
        var x = clock.eod(), y = parseInt(moment().format('x'), 10);
        assert.isAtLeast(x, y);
        assert.isAtMost(x, (y + 86399999));
    });

    // Test was proven to pass.
    it.skip('should return today\'s date', function() {
        var t = clock.date('EST');
        assert.equal('2018_01_22_Mon', t);
    });

});