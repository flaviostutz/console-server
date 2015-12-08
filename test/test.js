var assert = require('assert');
var assert = require('assert-plus');
var Debug = require('../debug');


var console = new Debug({
	uncaughtExceptionCatch: true, // Do we want to catch uncaughtExceptions?
	consoleFilter: [], // Filter these console output types, Examples: 'LOG', 'WARN', 'ERROR', 'DEBUG', 'INFO'
	logToFile: true, // if true, will put console output in a log file folder called 'logs'
	logFilter: ['LOG','DEBUG','INFO','WARN'], // Examples: Filter these types to not log to file, Examples: 'LOG', 'WARN', 'ERROR', 'DEBUG', 'INFO'
	colors: true // do we want pretty pony colors in our console output?
}); 

obj = {
	test1: [1,2,3,4],
	test2: ["ohai","there"],
	test3:true
};

/**
console.log("I am a log!");
console.log(obj); // can also display objects
console.warn("I am a warn!");
console.error("I am a error!");
console.debug("I am a debug!");
console.info("I am a info!");
*/


describe("Console object", function(){
	it('Log function', function(){
		//assert.equal(console.log("I am a log!"),"kappa");
	});
});