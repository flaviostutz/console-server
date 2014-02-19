var Debug = require('./debug');
var console = new Debug({
	uncaughtExceptionCatch: false, // Do we want to catch uncaughtExceptions?
	filter: [], // Examples: 'LOG', 'WARN', 'ERROR', 'DEBUG', 'INFO'
	logToFile: true, // if true, will put console output in a log file folder called 'logs'
	colors: true // do we want pretty pony colors in our console output?
}); 

obj = {
	test1:true,
	test2:true
};
console.log("I am a log!");
console.log(obj); // can also display objects
console.warn("I am a warn!");
console.error("I am a error!");
console.debug("I am a debug!");
console.info("I am a info!");