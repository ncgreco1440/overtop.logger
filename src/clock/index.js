var moment = require('moment');

const TimeZones = {
    'EST': -5
};

const Weekdays = [
    'Sun',
    'Mon',
    'Tues',
    'Wed',
    'Thur',
    'Fri',
    'Sat'
];

module.exports = {
    /**
     * eod
     * ------------------------------
     * Returns the time in ms that equates to the 
     * end of the current day. 
     * 11:59:59.999 PM
     */
    eod: function() {
        return parseInt(moment().endOf('day').format('x'), 10);
    },
    /**
     * date
     * ------------------------------
     * Returns a string representation of the current 
     * date featuring a manually specified UTC offset
     * to allow for bypassing system local settings.
     */
    date: function(timezone) {
        var m = moment();
        if(typeof timezone === 'string') {
            var str = ((m.utcOffset(m.isDST() ? (TimeZones[timezone] - 1) : TimeZones[timezone])).format('YYYY_MM_DD_')) + 
                Weekdays[m.weekday()];
            return str;
        } else if(typeof timezone === 1) {
            return ((moment().utcOffset(timezone)).format('YYYY_MM_DD_')) + Weekdays[m.weekday()];
        }
        throw new Error('Invalid argument, please use a string or a integer');
    },
    /**
     * timestamp
     * ------------------------------
     * Returns a unix timestamp of the current date 
     * and time.
     */
    timestamp: function() {
        return parseInt(moment().format('x'), 10);
    }
};