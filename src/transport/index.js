var winston = require('winston');
var clock = require('./../clock');

var Transport = function(t) {
    this.filepath = t.filepath || t.filename;
    this.fileInfo = this.filepath.split('.');
    this.extension = t.extension;
    this.level = t.level;
    this.handle = null;
};

Transport.prototype.add = function(wInst) {
    try {
        this.handle = new winston.transports.File({
            filename: this.fileInfo[0] + '_' + clock.date('EST') + this.fileInfo[1],
            level: this.level
        });
        wInst.add(this.handle);
    } catch(e) {
        throw e;
    }
};

Transport.prototype.remove = function(wInst) {
    wInst.remove(this.handle);
};

module.exports = Transport;