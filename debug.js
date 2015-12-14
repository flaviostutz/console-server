var	fs = require('fs');
var clc = require('cli-color');
var path = require('path');
var dateFormat = require('dateformat');
var error = clc.red.bold;
var debug = clc.white.bold;
var log = clc.white.bold;
var warn = clc.yellow.bold;
var info = clc.cyanBright.bold;


var rootDir = __dirname;
var logDir = path.join(rootDir,"logs");
var logToFile = false;
var noLogsFolder = false;
var colors = true;
var consoleFilter = new Array;
var logFilter = new Array;
		
var Debug = function(set) {
	consoleFilter = set["consoleFilter"];
	logFilter = set["logFilter"];
	logToFile = set["logToFile"];
	colors = set["colors"];
};

Debug.prototype.get_file_parent = function() {
	var orig = Error.prepareStackTrace;
	var err = new Error, s = this.get_stack_parent();
	Error.captureStackTrace(err, arguments.callee);
	Error.prepareStackTrace = orig;
	if (s && s.length) {
		var currentfile=s.shift();
		while (s.length) {
			if (s){
				var callerfile = s.shift();
				if(currentfile.getFileName() !== callerfile.getFileName()) return callerfile.getFileName();
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
			return sp[2].getLineNumber();
		}
	}
};

Debug.prototype.trace = function(msg, type, test) {
	var completeMessage = "";
	var format = dateFormat(new Date(), 'HH:MM:ss');
	var appDir = path.dirname(require.main.filename);
	
	var sepArray = appDir.split(path.sep);
	var l = sepArray.length;
	if(sepArray[parseInt(l) - 1]=="bin") appDir = path.dirname(__dirname);
	
	var p = this.get_file_parent();
	func = "";
	
	if (p) {
		if(p.split(appDir)[1]){
			var parentfile = p.split(appDir)[1].substring(1);
			func = " @ "+parentfile+":"+this.get_line_parent();
		}
	}
	
	if(colors) typeF = eval(type.toLowerCase()+"(type)")
	if(!colors) typeF = type;
	
		
	for(i=0;i<consoleFilter.length;i++){
		if(type==consoleFilter[i]) return true;
	}
	
	if(type=="ERROR") completeMessage = completeMessage + "("+format+" "+typeF+""+func+") - "+msg;
	if(type=="LOG") completeMessage =   completeMessage + "("+format+" "+typeF+"  "+func+") - "+msg;
	if(type=="DEBUG") completeMessage = completeMessage + "("+format+" "+typeF+""+func+") - "+msg;
	if(type=="INFO") completeMessage =  completeMessage + "("+format+" "+typeF+" "+func+") - "+msg;
	if(type=="WARN") completeMessage =  completeMessage + "("+format+" "+typeF+" "+func+") - "+msg;
	logMessage = "("+format+") ["+type+""+func+"] - "+msg;
	
	
	if(typeof(msg)=="object"){
		console.log("("+format+" "+typeF+"  "+func+") - Object: ");
    try {
      completeMessage = JSON.stringify(msg, null, 4);
    } catch (e) {
      completeMessage = msg;
    }
	}
	console.log(completeMessage);
	if(logToFile) this.logFile(logMessage,type);
	return msg;
};

Debug.prototype.logFile = function (msg,type,cb){
	if(!cb) cb = false;
	for(i=0;i<logFilter.length;i++){
		if(type==logFilter[i]) if(cb) cb(true);
	}
	fs.appendFile(path.join(logDir,dateFormat(new Date(), 'dd-mm-yyyy') + " - "+type)+".txt", msg+"\n", function (err) {
	  if (err){
		if (!fs.existsSync(logDir) && !noLogsFolder) {
			console.error(error("no logs folder found (or no access) in '"+rootDir+"'. Trying to creating a logs folder at '"+logDir+"'"));
			fs.mkdir(logDir,0755,function(e){
				if(e) throw new Error(e);
				console.log("logs folder created, the next logs will be saved to file.");
				if(cb) cb(true);
			});
		}
	  }else{
		if(cb) cb(true);
	  }
	});
};

Debug.prototype.log = function (msg,test){
	this.trace(msg,"LOG",test);return true;
};

Debug.prototype.debug = function (msg,test){
	this.trace(msg,"DEBUG",test);return true;
};

Debug.prototype.warn = function (msg,test){
	this.trace(msg,"WARN",test);return true;
};

Debug.prototype.info = function (msg,test){
	this.trace(msg,"INFO",test);return true;
};

Debug.prototype.error = function (msg,test){
	this.trace(msg,"ERROR",test);return true;
};

module.exports = Debug;