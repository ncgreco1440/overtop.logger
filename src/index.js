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

const setTransportHandle = function(transport) {
	switch(transport.level) {
		case 'info': {
			this.infoTransport = new winston.transports.File({
				filename: appendDate(transport.filepath), 
				level: transport.level
			});
			break;
		}
		case 'error': {
			this.errorTransport = new winston.transports.File({
				filename: appendDate(transport.filepath), 
				level: transport.level
			});
			break;
		}
		case 'warn': {}
		case 'warning': {
			this.warningTransport =	new winston.transports.File({
				filename: appendDate(transport.filepath), 
				level: transport.level
			});
			break;
		}
		default: {}
	}
};

const addTransports = function() {
	if(this.infoTransport) this.winstonHandle.add(this.infoTransport);
	if(this.errorTransport) this.winstonHandle.add(this.errorTransport);
	if(this.warningTransport) this.winstonHandle.add(this.warningTransport);
};

const updateTransports = function() {
	debugger;
	var info = this.infoTransport.filename,	
		error = this.errorTransport.filename,
		warning = this.warningTransport.filename;
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

const appendDate = function(filename) {
	var f = filename.split('.');
	return f[0]+'_'+clock.date('EST')+'.'+f[1];
};

var logger = function(config) {
	var runConfiguration = winstonParseConfig.bind(this, config),
		addLoggingTransports = addTransports.bind(this);

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
	this.updateTransports = updateTransports.bind(this);

	try {
		this.winstonHandle = winston.createLogger(runConfiguration());
		addLoggingTransports();
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
		this.updateTransports();
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