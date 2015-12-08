var assert = require('assert');
var assert = require('assert-plus');
var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
var Debug = require('../debug');

logDir = path.join(__dirname,"..","logs");

rimraf(logDir, function(result){
	console.log(result);
})

var consoleObject = new Debug({
	uncaughtExceptionCatch: true, // Do we want to catch uncaughtExceptions?
	consoleFilter: [], // Filter these console output types, Examples: 'LOG', 'WARN', 'ERROR', 'DEBUG', 'INFO'
	logToFile: true, // if true, will put console output in a log file folder called 'logs'
	logFilter: [], // Examples: Filter these types to not log to file, Examples: 'LOG', 'WARN', 'ERROR', 'DEBUG', 'INFO'
	colors: true // do we want pretty pony colors in our console output?
}); 

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
	it('Displaying a object', function(){
		assert.object(consoleObject.trace({test1: [1,2,3,4],test2: ["ohai","there"],test3:true},"LOG",true));
	});
	it('Trigger a uncaught exception', function(){
		assert.throws(function(){
			consoleObject.uncaughtException();
		},Error);
	});
});

describe("Console object", function(){
	it('Log function', function(){
		assert.equal(consoleObject.log("test","LOG",true),true);
	});
	it('Warn function', function(){
		assert.equal(consoleObject.warn("test","WARN",true),true);
	});
	it('Error function', function(){
		assert.equal(consoleObject.error("test","ERROR",true),true);
	});
	it('Debug function', function(){
		assert.equal(consoleObject.debug("test","DEBUG",true),true);
	});
	it('Info function', function(){
		assert.equal(consoleObject.info("test","INFO",true),true);
	});
	it('Displaying a object', function(){
		assert.object(consoleObject.trace({test1: [1,2,3,4],test2: ["ohai","there"],test3:true},"LOG",true));
	});
});