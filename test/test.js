var assert = require('assert');
var assert = require('assert-plus');
var Debug = require('../debug');


var consoleObject = new Debug({
	uncaughtExceptionCatch: true, // Do we want to catch uncaughtExceptions?
	consoleFilter: [], // Filter these console output types, Examples: 'LOG', 'WARN', 'ERROR', 'DEBUG', 'INFO'
	logToFile: true, // if true, will put console output in a log file folder called 'logs'
	logFilter: [], // Examples: Filter these types to not log to file, Examples: 'LOG', 'WARN', 'ERROR', 'DEBUG', 'INFO'
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
describe("Stack getters", function(){
	it('get_stack()', function(){
		assert.doesNotThrow(function(){
			consoleObject.get_stack();
		},Error);
	});
	it('get_stack_parent()', function(){
		assert.doesNotThrow(function(){
			consoleObject.get_stack_parent();
		},Error);
	});
	it('get_line_parent()', function(){
		assert.doesNotThrow(function(){
			consoleObject.get_line_parent();
		},Error);
	});
});

describe("Internal functions", function(){
	it('Log to file', function(done){
		consoleObject.logFile("test","test", function(result){
			assert.equal(result,true);
			done();
		});
	});
	it('Log function', function(){
		assert.equal(consoleObject.trace("test","LOG",true),"test");
	});
	it('Warn function', function(){
		assert.equal(consoleObject.trace("test","WARN",true),"test");
	});
	it('Error function', function(){
		assert.equal(consoleObject.trace("test","ERROR",true),"test");
	});
	it('Debug function', function(){
		assert.equal(consoleObject.trace("test","DEBUG",true),"test");
	});
	it('Info function', function(){
		assert.equal(consoleObject.trace("test","INFO",true),"test");
	});
	it('Displaying a object', function(){
		assert.object(consoleObject.trace({test1: [1,2,3,4],test2: ["ohai","there"],test3:true},"LOG",true));
	});
});

describe("Console object", function(){
	it('Log function', function(){
		assert.equal(consoleObject.log("test","LOG",true),true);
	});
	it('Warn function', function(){
		assert.equal(consoleObject.trace("test","WARN",true),"test");
	});
	it('Error function', function(){
		assert.equal(consoleObject.trace("test","ERROR",true),"test");
	});
	it('Debug function', function(){
		assert.equal(consoleObject.trace("test","DEBUG",true),"test");
	});
	it('Info function', function(){
		assert.equal(consoleObject.trace("test","INFO",true),"test");
	});
	it('Displaying a object', function(){
		assert.object(consoleObject.trace({test1: [1,2,3,4],test2: ["ohai","there"],test3:true},"LOG",true));
	});
});