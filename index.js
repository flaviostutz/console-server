const Debug = require('./debug.js');
var tty = require('tty');

console.log('@@@@@ ' + process.env.LOGGER_LEVEL);
console.log('***** ' + process.env.LOGGER_USE_COLORS);

let useColors = tty.isatty(process.stdout.fd);

const envUseColors = process.env.LOGGER_USE_COLORS;
if (envUseColors != null && envUseColors!='') {
    useColors = (envUseColors.toLowerCase()=='true')
}

const logger = new Debug({
    colors: useColors,
    level: process.env.LOGGER_LEVEL
});

module.exports = logger;
