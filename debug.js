var Debug = function() {}; 

var clc = require('cli-color')
var error = clc.red.bold;
var debug = clc.white.bold;
var warn = clc.yellow.bold;
var info = clc.cyanBright.bold;

Object.defineProperty(global, '__line', {
  get: function(){
    return __stack[1].getLineNumber();
  }
});
Object.defineProperty(global, '__file', {
  get: function(){
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack){ return stack; };
    var err = new Error;
    Error.captureStackTrace(err, arguments.callee);
    var stack = err.stack;
    Error.prepareStackTrace = orig; 
    currentfile=err.stack.shift().getFileName();
	return currentfile
  }
});
Object.defineProperty(global, '__file_parent', {
  get: function(){
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack){ return stack; };
    var err = new Error;
    Error.captureStackTrace(err, arguments.callee);
    var stack = err.stack;
    Error.prepareStackTrace = orig; 
    currentfile=err.stack.shift().getFileName();
	while (err.stack.length) {
		callerfile = err.stack.shift().getFileName();
		if(currentfile!==callerfile) return callerfile;
	}
  }
});

Object.defineProperty(global, '__stack', {
  get: function(){
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack){ return stack; };
    var err = new Error;
    Error.captureStackTrace(err, arguments.callee);
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
  }
});
Object.defineProperty(global, '__stack_parent', {
  get: function(){
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack){ return stack; };
    var err = new Error;
    Error.captureStackTrace(err, arguments.callee.caller);
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
  }
});

Object.defineProperty(global, '__line_parent', {
  get: function(){
    return __stack_parent[2].getLineNumber();
  }
});

process.on('uncaughtException', function (err) {
	trace(err.stack,"ERROR");
	trace("It is recommended you RESET your current application, there has been a uncaughtexception!","ERROR");
}); 
function getDateTime() {
    var format = "";
    var date = new Date();
    var sec  = date.getSeconds(),
        min  = date.getMinutes(),
        hour = date.getHours(),
        year = date.getFullYear(),
        month = date.getMonth() + 1,
        day  = date.getDate();
    sec = (sec < 10 ? "0" : "") + sec;
    min = (min < 10 ? "0" : "") + min;
    hour = (hour < 10 ? "0" : "") + hour;
    day = (day < 10 ? "0" : "") + day;
    month = (month < 10 ? "0" : "") + month;
    format+=hour;
    format+=":"+min;
    format+=":"+sec;
    return format;
}

Debug.prototype.log = function (msg, type){
	trace(msg,"LOG");
};

Debug.prototype.debug = function (msg, type){
	trace(msg,"DEBUG");
};

Debug.prototype.warn = function (msg, type){
	trace(msg,"WARN");
};

Debug.prototype.info = function (msg, type){
	trace(msg,"INFO");
};

Debug.prototype.error = function (msg, type){
	trace(msg,"ERROR");
};

function _getCallerFile() {
	var err = new Error(),callerfile,currentfile;       
	Error.prepareStackTrace = function (err, stack) {return stack;};
	currentfile=err.stack.shift().getFileName();
	while (err.stack.length) {
		callerfile = err.stack.shift().getFileName();
		if(currentfile!==callerfile) return callerfile;
	}
}

function trace(msg,type){
	if(typeof(msg)=="object"){
        console.log(msg);
		return;
	}
	 var completeMessage = "";
    var format = getDateTime();

	var path = require('path'),
    appDir = path.dirname(require.main.filename);
	parentfile = __file_parent.split(appDir+"\\")[1];
	
    func = " @ "+parentfile+":"+__line_parent;
	
    if(type=="ERROR")
		func = "";
        typeF = error('ERROR');

    if(type=="WARN")
        typeF = warn('WARN');

    if(type=="DEBUG")
        typeF = debug('DEBUG');

    if(type=="LOG")
        typeF = debug('LOG');

    if(type=="INFO")
        typeF = info('INFO');

    completeMessage = completeMessage + "("+format+") ["+typeF+""+func+"] - "+msg;
    console.log(completeMessage);
}

exports.Debug = Debug;