var winston = require('winston');
var clock = require('./../clock');

const generateFilename = function() {
    return this.fileInfo[0] + '_' + clock.date('EST') + '.' + this.fileInfo[1];
};

var Transport = function(t) {
    this.$$generateFilename = generateFilename.bind(this);

    Object.defineProperty(this, 'filepath', {
        value: t.filepath || t.filename,
        writeable: false,
        enumerable: true,
        configurable: false
    });

    Object.defineProperty(this, 'fileInfo', {
        value: this.filepath.split('.'),
        writeable: false,
        enumerable: true,
        configurable: false
    });

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

    this.handle = new winston.transports.File({
        filename: this.$$generateFilename(),
        level: this.level
    });

    // Object.defineProperty(this, 'handle', {
    //     value: new winston.transports.File({
    //         filename: this.$$generateFilename(),
    //         level: this.level
    //     }),
    //     writeable: true,
    //     enumerable: true,
    //     configurable: true
    // });
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