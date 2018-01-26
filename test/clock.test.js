var assert = require('chai').assert;
var lolex = require('lolex');
const clock = require('./../src/clock');
var moment = require('moment');

describe('clock tests', function() {

    it('should return the time at the end of the day', function() {
        var x = clock.eod(), y = parseInt(moment().format('x'), 10);
        assert.isAtLeast(x, y);
        assert.isAtMost(x, (y + 86399999));
    });

    it('should return today\'s date', function() {
        var clk = lolex.install({now: 0}),
            t = clock.date('EST');
        clk.uninstall();
        assert.equal('1969_12_31_Wed', t);
    });

});