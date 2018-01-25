const assert = require('chai').assert;
const lolex = require('lolex');
var logger = require('./../index.js');
const logFiles = {
	info: 'test.log'
};

describe.skip('overtop.logger require statement', function() {
	it('should return a function', function() {
		assert.isFunction(logger, 'logger is a function!');
	});
});

describe.skip('overtop.logger constructor', function() {
	it('should throw an error if an object is not passed in as an argument [number]', function() {
		assert.throws(() => {
			var x = new logger(123);
		}, Error);
	});

	it('should throw an error if an object is not passed in as an argument [string]', function() {
		assert.throws(() => {
			var x = new logger('Hello, World');
		}, Error);
	});

	it('should throw an error if an object is not passed in as an argument [array]', function() {
		assert.throws(() => {
			var x = new logger(['H', 'A', 'P', 'P', 'Y']);
		}, Error);
	});

	it('should throw an error if an object is not passed in as an argument [boolean]', function() {
		assert.throws(() => {
			var x = new logger(true);
		}, Error);
	});

	it('should throw an error if an object does not contain the appropriate properties', function() {
		assert.throws(() => {
			var x = new logger({});
		}, Error);
	});

	it('should be able to return a handle to the winston instance if all went well', function() {
		var log = new logger({
			level: 'info',
			format: 'json',
			transports: [
				{type: 'file', filepath: logFiles.info, level: 'info'}
			]
		}), x = log.handle();
		assert.isOk(x);
	});
});

describe.skip('Writing to the logs', function() {
	var log = null, 
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
		log = new logger({
			level: 'info',
			format: 'json',
			transports: [
				{type: 'file', filepath: logFiles.info, level: 'info'}
			]
		});
	});

	afterEach(function() {
		log = null;
	});

	it('should be successful', function() {
		assert.isOk(log.log('info', 200, req, details));
	});

	it('should succeed even with a lack of details', function() {
		assert.isOk(log.log('info', 200, req));
	});

	it('should write to a new log file when a day has passed.', function() {
		var clock = null, currentTime = Date.now(); 

		clock = lolex.install({
			now: currentTime
		});

		log.log('info', 200, req);
		clock.setSystemTime(currentTime + (1000*60*60*24));
		clock.uninstall();
		assert.isOk(log.log('info', 200, req));
	});
});