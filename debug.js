(function() {
	var clc = require('cli-color'),
		dateFormat = require('dateformat'),
		error = clc.red.bold,
		debug = clc.white.bold,
		log = clc.white.bold,
		warn = clc.yellow.bold,
		info = clc.cyanBright.bold,
		debugFilter = new Array;
		
	var Debug = function(set) {
		if(set["uncaughtExceptionCatch"]){
			process.on('uncaughtException', function (err) {
				Debug.prototype.trace(err.stack,"ERROR");
				Debug.prototype.trace("It is recommended you RESET your current application, there has been a uncaughtexception!","ERROR");
			});	
		}
		for(i=0;i<set["filter"].length;i++){
			debugFilter.push(set["filter"][i])
		}
	};


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

	Debug.prototype.trace = function(msg, type) {
		var completeMessage = "";
		var format = dateFormat(new Date(), 'HH:MM:ss'), func = undefined;

		var path = require('path'),
			appDir = path.dirname(require.main.filename),
			p = this.get_file_parent();
		if(type != "ERROR"){
			if (p) {
				var parentfile = p.split(appDir)[1].substring(1);
				func = " @ "+parentfile+":"+this.get_line_parent();
			} else {
				return;
			}
		}
		
		typeF = eval(type.toLowerCase()+"(type)")
		if(type == "ERROR") func = "";
			
		for(i=0;i<debugFilter.length;i++){
			if(type==debugFilter[i]) return;
		}
		
		completeMessage = completeMessage + "("+format+") ["+typeF+""+func+"] - "+msg;
		if(typeof(msg)=="object"){
			console.log("("+format+") ["+typeF+""+func+"] - Object: ");
			completeMessage = JSON.stringify(msg, null, 4);
		}
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
}).call(this);