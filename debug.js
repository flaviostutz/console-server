(function() {
	var	fs = require('fs'),
		clc = require('cli-color'),
		path = require('path'),
		dateFormat = require('dateformat'),
		error = clc.red.bold,
		debug = clc.white.bold,
		log = clc.white.bold,
		warn = clc.yellow.bold,
		info = clc.cyanBright.bold,
		rootDir = __dirname,
		logDir = path.join(rootDir,"logs");
		logToFile = false,
		noLogsFolder = false,
		colors = true;
		consoleFilter = new Array,
		logFilter = new Array;
		
	var Debug = function(set) {
		// uncaughtException Setting
		if(set["uncaughtExceptionCatch"]){
			process.on('uncaughtException', function(err){this.uncaughtException(err)});	
		}
		
		// Filter Settings
		consoleFilter = set["consoleFilter"];
		
		logFilter = set["logFilter"];
		
		// logToFile Setting
		logToFile = set["logToFile"]
		
		// Colors Setting
		colors = set["colors"];
	};
	
	Debug.prototype.uncaughtException = function(err){
		Debug.prototype.trace(err.stack,"ERROR");
		Debug.prototype.trace("Exception caught, program continuing.","WARN");
	}

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
				return sp[2].getLineNumber();
			}
		}
	};

	Debug.prototype.trace = function(msg, type, test) {
		var completeMessage = "",
			format = dateFormat(new Date(), 'HH:MM:ss'),
			func = undefined,
			appDir = path.dirname(require.main.filename),
			p = this.get_file_parent();
		
			if (p) {
				if(p.split(appDir)[1]){
					var parentfile = p.split(appDir)[1].substring(1);
					func = " @ "+parentfile+":"+this.get_line_parent();
				}else{
					func = "";
				}
			} else {
				return;
			}
		
		if(colors) typeF = eval(type.toLowerCase()+"(type)")
		if(!colors) typeF = type;
		
			
		// Filter process
		for(i=0;i<consoleFilter.length;i++){
			if(type==consoleFilter[i]) return;
		}
		
		if(type=="ERROR") completeMessage = completeMessage + "("+format+" "+typeF+""+func+") - "+msg;
		if(type=="LOG") completeMessage =   completeMessage + "("+format+" "+typeF+""+func+") - "+msg;
		if(type=="DEBUG") completeMessage = completeMessage + "("+format+" "+typeF+""+func+") - "+msg;
		if(type=="INFO") completeMessage =  completeMessage + "("+format+" "+typeF+" "+func+") - "+msg;
		if(type=="WARN") completeMessage =  completeMessage + "("+format+" "+typeF+" "+func+") - "+msg;
		logMessage = "("+format+") ["+type+""+func+"] - "+msg;
		
		
		// Special display for objects
		if(typeof(msg)=="object"){
			console.log("("+format+" "+typeF+""+func+") - Object: ");
			completeMessage = JSON.stringify(msg, null, 4);
		}
		console.log(completeMessage);
		if(logToFile) this.logFile(logMessage,type);
		return msg;
	};

	Debug.prototype.logFile = function (msg,type,cb){
		// Filter process
		if(!cb) cb = false;
		for(i=0;i<logFilter.length;i++){
			if(type==logFilter[i]) return;
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
}).call(this);