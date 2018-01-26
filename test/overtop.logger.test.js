const assert = require('chai').assert;
const lolex = require('lolex');
var Logger = require('./../index.js');
const logFiles = {
	info: 'test.log'
};

describe('overtop.logger require statement', function() {
	it('should return a function', function() {
		assert.isFunction(Logger, 'logger is a function!');
	});
});

describe('overtop.logger constructor', function() {
	it('should throw an error if an object is not passed in as an argument [number]', function() {
		assert.throws(() => {
			var x = new Logger(123);
		}, Error);
	});

	it('should throw an error if an object is not passed in as an argument [string]', function() {
		assert.throws(() => {
			var x = new Logger('Hello, World');
		}, Error);
	});

	it('should throw an error if an object is not passed in as an argument [array]', function() {
		assert.throws(() => {
			var x = new Logger(['H', 'A', 'P', 'P', 'Y']);
		}, Error);
	});

	it('should throw an error if an object is not passed in as an argument [boolean]', function() {
		assert.throws(() => {
			var x = new Logger(true);
		}, Error);
	});

	it('should throw an error if an object does not contain the appropriate properties', function() {
		assert.throws(() => {
			var x = new Logger({});
		}, Error);
	});

	it('should be able to return a handle to the winston instance if all went well', function() {
		var log = new Logger({
			level: 'info',
			format: 'json',
			transports: [
				{type: 'file', filepath: logFiles.info, level: 'info'}
			]
		}), x = log.handle();
		assert.isOk(x);
	});
});

describe('Writing to the logs', function() {
	var log = null, 
		lolexClock = null,
		req = {
			protocol: 'HTTP',
			secure: false,
			method: 'GET',
			ip: '127.0.0.1',
			url: '/test-url',
			originalUrl: '/test-url',
			params: {},
			query: {}
		},
		details = {
			msg: 'test details'
		};

	beforeEach(function() {
		lolexClock = lolex.install({now: 0});
		log = new Logger({
			level: 'info',
			format: 'json',
			transports: [
				{type: 'file', filepath: logFiles.info, level: 'info'}
			]
		});
	});

	afterEach(function() {
		log = null;
		lolexClock.uninstall();
		lolexClock = null;
	});

	it('should be successful', function() {
		assert.isOk(log.log('info', 200, req, details));
	});

	it('should succeed even with a lack of details', function() {
		assert.isOk(log.log('info', 200, req));
	});

	it('should write to a new log file when a day has passed.', function(done) {
		var fs = require('fs'); 

		log.log('info', 200, req);
		lolexClock.setSystemTime(Date.now() + (1000*60*60*24));
		log.log('info', 200, req);
		fs.open('./test_1969_12_31_Wed.log', 'r', (err, fd) => {
			if(err) {
				done(err);
			}else{
				var fd1 = fd;
				fs.open('./test_1970_01_01_Thur.log', 'r', (err, fd) => {
					if(err) {
						done(err);
					}else{
						assert.isOk(fd1);
						assert.isOk(fd);
						done();
					}
				});
			}
		});
	});
});