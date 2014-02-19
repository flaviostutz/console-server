var Debug = require('./debug');
var console = new Debug({
	uncaughtExceptionCatch: true, // Do we want to catch uncaughtExceptions?
	filter: [] // Examples: 'LOG', 'WARN', 'ERROR', 'DEBUG', 'INFO'
}); 

console.log("I am a log!");
console.warn("I am a warn!");
console.error("I am a error!");
console.debug("I am a debug!");
console.info("I am a info!");