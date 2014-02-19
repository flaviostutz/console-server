var Debug = function() {};

var clc = require('cli-color'),
    error = clc.red.bold,
    debug = clc.white.bold,
    warn = clc.yellow.bold,
    info = clc.cyanBright.bold;


Debug.prototype.get_file_parent = function() {
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack){ return stack; };
    var err = new Error, s = this.get_stack_parent();
    Error.captureStackTrace(err, arguments.callee);
    Error.prepareStackTrace = orig;
    if (s && s.length) {
        var currentfile=s.shift();
        while (s.length) {
            if (!s) return;
            var callerfile = s.shift();
            if(currentfile.getFileName() !== callerfile.getFileName()) {
                return callerfile.getFileName();
            }
        }
    }
};

Debug.prototype.get_stack = function(){
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack) { return stack; };
    var err = new Error;
    Error.captureStackTrace(err, arguments.callee);
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
};

Debug.prototype.get_stack_parent = function(){
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack){ return stack; };
    var err = new Error;
    Error.captureStackTrace(err, arguments.callee.caller);
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
};

Debug.prototype.get_line_parent = function(){
    var sp = this.get_stack_parent();
    if (sp && sp.length) {
        for (var i=0;i<sp.length;i++) {
            return sp[1].getLineNumber();
        }
    }
};

process.on('uncaughtException', function (err) {
	Debug.prototype.trace(err.stack,"ERROR");
	Debug.prototype.trace("It is recommended you RESET your current application, there has been a uncaughtexception!","ERROR");
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

Debug.prototype.trace = function(msg, type) {
    var completeMessage = "";
    var format = getDateTime(), func = undefined;

	var path = require('path'),
        appDir = path.dirname(require.main.filename),
        p = this.get_file_parent();

    if (p) {
        var parentfile = p.split(appDir+"\\")[0];
        func = " @ "+parentfile+":"+this.get_line_parent();
    } else {
        return;
    }

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
};

Debug.prototype.log = function (msg){
	this.trace(msg,"LOG");
};

Debug.prototype.debug = function (msg){
	this.trace(msg,"DEBUG");
};

Debug.prototype.warn = function (msg){
	this.trace(msg,"WARN");
};

Debug.prototype.info = function (msg){
	this.trace(msg,"INFO");
};

Debug.prototype.error = function (msg){
	this.trace(msg,"ERROR");
};

module.exports = Debug;
