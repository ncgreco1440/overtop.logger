var chai = require('chai');
chai.use(require('chai-fs'));
var assert = chai.assert;
var lolex = require('lolex');
var Transport = require('./../src/transport');

describe('Transport', function() {

    describe('constructor', function() {

        it('should create a new instance of a Transport object.', function() {
            var clk = lolex.install({now: 0}), 
                t = new Transport({
                    level: 'info',
                    dirname: './logs/info/',
                    filename: 'test.log',
                    extension: '.log'
                });

            assert.isOk(t);
            assert.property(t, 'filepath')
            assert.property(t, 'ext');
            assert.property(t, 'fileInfo');
            assert.deepEqual(['test', 'log'], t.fileInfo);
            assert.property(t, 'level');
            assert.property(t, 'handle');
            //assert.pathExists(__dirname + '/../test_1969_12_31_Wed.log');
        });

    });

    describe('update', function() {

        it('should create a new transport with an updated date', function() {
            var clk = lolex.install({now: 0}), 
                t = new Transport({
                    level: 'info',
                    dirname: './logs/info/',
                    filename: 'test.log',
                    ext: '.log'
                });

            clk.setSystemTime(0 + (1000*60*60*24));
            t.update();
            clk.uninstall();
            assert.equal(t.handle.filename, 'test_1970_01_01_Thur.log');
        }); 

    });

});

