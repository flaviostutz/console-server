const Debug = require('./debug.js');

const logger = new Debug({
    colors: process.env.LOGGER_USE_COLORS,
    filter: process.env.LOGGER_FILTER
});

module.exports = logger;