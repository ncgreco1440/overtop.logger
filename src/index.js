var winston = require('winston');
const Clock = require('./clock');
const Transport = require('./transport');
const Handler = require('./handler');

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

const setTransportHandle = function(transport) {
	switch(transport.level) {
		case 'info': {
			this.infoTransport = new Transport(transport);
			break;
		}
		case 'error': {
			this.errorTransport = new Transport(transport);
			break;
		}
		case 'warn': {}
		case 'warning': {
			this.warningTransport =	new Transport(transport);
			break;
		}
		default: {}
	}
};

const addTransports = function() {
	if(this.infoTransport) this.infoTransport.add(this.winstonHandle);
	if(this.errorTransport) this.errorTransport.add(this.winstonHandle);
	if(this.warningTransport) this.warningTransport.add(this.winstonHandle);
};

const removeTransports = function() {
	this.winstonHandle.remove(this.infoTransport);
	this.winstonHandle.remove(this.errorTransport);
	this.winstonHandle.remove(this.warningTransport);
};

const updateTransports = function() {
	this.$$removeTransports();
	this.infoTransport.update(this.winstonHandle);
	this.errorTransport.update(this.winstonHandle);
	this.warningTransport.update(this.winstonHandle);
	this.$$addTransports();
};

const winstonParseConfig = function(config) {
	var obj = {
		level: config.level,
		format: (config.format == 'json' || config.format == 'JSON') ? winston.format.json() : null,
		transports: []
	};

	config.transports.forEach((transport) => {
		(setTransportHandle.bind(this, transport))();
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

var Logger = function(config) {
	var $$runConfiguration = winstonParseConfig.bind(this, config);

	if(!validate.typeOfObject(config))
		throw new Error('\'config\' was not an object.');
	if(!validate.containsRequiredProperties(config))
		throw new Error('\'config\' was missing one or more of the mandatory properties. \'level\', \'format\', \'transports\'');

	this.winstonHandle = null;
	this.dailyThreshold = null;
	this.twentyFourHourExt = 1000 * 60 * 60 * 24;
	this.infoTransport = null;
	this.errorTransport = null;
	this.warningTransport = null;
	this.$$updateTransports = updateTransports.bind(this);
	this.$$removeTransports = removeTransports.bind(this);
	this.$$addTransports = addTransports.bind(this);

	try {
		this.winstonHandle = winston.createLogger($$runConfiguration());
		this.$$addTransports();
		this.dailyThreshold = Clock.eod();
	}catch(e) {
		throw e;
	}
};

Logger.prototype.handle = function() {
	return this.winstonHandle;
};

Logger.prototype.log = function(lvl, req, status, details) {
	if(Date.now() > this.dailyThreshold) {
		this.dailyThreshold += this.twentyFourHourExt;
		this.$$updateTransports();
	}

	// Handler(details, (x) => {
	// 	console.log(x);
	// });

	return this.winstonHandle.log({
		'level': lvl,
		'protocol': req.protocol,
		'secure': req.secure,
		'status': status,
		'method': req.method,
		'ip': req.ip,
		'timestamp': Clock.timestamp(),
		'url': req.baseUrl,
		'originalUrl': req.originalUrl,
		'params': req.params,
		'query': req.query,
		'details': (!details) ? false : details 
	});
};

// Logger.prototype.attach = function(err, req, res, next) {
// 	next();
// };

module.exports = Logger;