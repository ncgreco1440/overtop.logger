var winston = require('winston');
const clock = require('./clock');

const validate = {
	typeOfObject: function(arg) {
		return (typeof arg === 'object' && !arg.isArray);
	},
	containsRequiredProperties: function(arg) {
		return arg.hasOwnProperty('level') &&
			arg.hasOwnProperty('format') && 
			arg.hasOwnProperty('transports');
	}
};

const winstonParseConfig = function(arg) {
	var obj = {
		level: arg.leve,
		format: (arg.format == 'json' || arg.format == 'JSON') ? winston.format.json() : null,
		transports: []
	};

	arg.transports.forEach((transport) => {
		obj.transports.push(new winston.transports.File({
			filename: appendDate(transport.filepath), 
			level: transport.level
		}));
	});

	return obj;
};

const validateLogParams = function(arg) {
	var success = typeof arg.level === 'string' &&
		arg.req.hasOwnProperty('protocol') &&
		arg.req.hasOwnProperty('secure') &&
		arg.req.hasOwnProperty('method') &&
		arg.req.hasOwnProperty('url');

	return  
};

const appendDate = function(filename) {
	var f = filename.split('.');
	return f[0]+'_'+clock.date('EST')+'.'+f[1];
};

var logger = function(config) {
	if(!validate.typeOfObject(config))
		throw new Error('\'config\' was not an object.');
	if(!validate.containsRequiredProperties(config))
		throw new Error('\'config\' was missing one or many of the mandatory properties. \'level\', \'format\', \'transports\'');

	this.winstonHandle = null;
	this.dailyTimer = null;
	this.currentTime = null;
	// Time, in milliseconds, until Midnight
	this.timeTilMidnight = null;
	this.dailyThreshold = null;
	// Time, in milliseconds, within 24 hours;
	this.twentyFourHourExt = 1000 * 60 * 60 * 24;

	try {
		this.winstonHandle = winston.createLogger(winstonParseConfig(config));
		this.currentTime = Date.now();
		this.dailyThreshold = clock.eod();
	}catch(e) {
		throw e;
	}
};

logger.prototype.handle = function() {
	return this.winstonHandle;
};

logger.prototype.log = function(lvl, req, status, details) {
	if(Date.now() > this.dailyThreshold) {
		this.dailyThreshold += this.twentyFourHourExt;
		//TODO...update the transports.
	}
	return this.winstonHandle.log({
		'level': lvl,
		'protocol': req.protocol,
		'secure': req.secure,
		'status': status,
		'method': req.method,
		'ip': req.ip,
		'timestamp': clock.timestamp(),
		'url': req.baseUrl,
		'originalUrl': req.originalUrl,
		'params': req.params,
		'query': req.query,
		'details': (!details) ? false : details 
	});
};

module.exports = logger;