var assert = require('chai').assert;
var lolex = require('lolex');
var Transport = require('./../src/transport');

describe('Transport constructor', function() {
    it('should create a new instance of a Transport object.', function() {
        var t = new Transport({
            level: 'info',
            filename: 'test.log',
            extension: '.log'
        });

        assert.isOk(t);
        assert.property(t, 'filepath')
        assert.property(t, 'extension');
        assert.property(t, 'fileInfo');
        assert.deepEqual(['test', 'log'], t.fileInfo);
        assert.property(t, 'level');
        assert.property(t, 'handle');
    });
});