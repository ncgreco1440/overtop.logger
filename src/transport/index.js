var winston = require('winston');
var clock = require('./../clock');
var mkdirp = require('mkdirp');

const generateFilename = function() {
    return this.dirname + 
        this.fileInfo[0] + 
        '_' + 
        clock.date('EST') + 
        '.' + 
        this.fileInfo[1];
};

var Transport = function(t) {
    this.$$generateFilename = generateFilename.bind(this);

    this.filepath = t.filename;
    this.fileInfo = t.filename.split('.');

    Object.defineProperty(this, 'ext', {
        value: t.extension || t.ext,
        writeable: false,
        enumerable: true,
        configurable: false
    });

    Object.defineProperty(this, 'level', {
        value: t.level,
        writeable: false,
        enumerable: true,
        configurable: false
    });

    mkdirp.sync(t.dirname, 0o666);
    this.dirname = t.dirname;
    this.handle = new winston.transports.File({
        filename: this.$$generateFilename(),
        level: this.level
    });
};

Transport.prototype.add = function(wInst) {
    try {
        wInst.add(this.handle);
    } catch(e) {
        throw e;
    }
};

Transport.prototype.remove = function(wInst) {
    wInst.remove(this.handle);
};

Transport.prototype.update = function() {
    this.handle = null;
    this.handle = new winston.transports.File({
        filename: this.$$generateFilename(),
        level: this.level
    });
};

module.exports = Transport;