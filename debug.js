var  fs = require('fs')
var clc = require('cli-color')
var path = require('path')
var dateFormat = require('dateformat')
var rightpad = require('right-pad')
var util = require('util');
var error = clc.red.bold
var debug = clc.white.bold
var log = clc.white.bold
var warn = clc.yellow.bold
var info = clc.cyanBright.bold

var rootDir = __dirname
var logDir = path.join(rootDir, 'logs')
var noLogsFolder = false

const DEBUG = 5;
const INFO = 4;
const WARN = 3;
const ERROR = 2;

var Debug = function(_options) {
  this.options = {
    level: 'all',
    colors: true
  }
  if(_options!=null) {
    if (_options.level!=null && _options.level != '') {
      this.options.level = _options.level
    }
    if (_options.colors != null && (_options.colors + '') != '') {
      this.options.colors = _options.colors
    }
  }
  this.options.leveln = this.numberFromLevel(this.options.level.trim());
}

Debug.prototype.get_file_parent = function() {
  var orig = Error.prepareStackTrace
  var err = new Error
  var s = this.get_stack_parent()
  Error.captureStackTrace(err, arguments.callee)
  Error.prepareStackTrace = orig
  if (s && s.length) {
    var currentfile = s.shift()
    while (s.length) {
      if (s) {
        var callerfile = s.shift()
        if (currentfile.getFileName() !==  callerfile.getFileName())
          return callerfile.getFileName()
      }
    }
  }
}

Debug.prototype.get_stack = function() {
  var orig = Error.prepareStackTrace
  Error.prepareStackTrace = function(_, stack) { return stack }
  var err = new Error
  Error.captureStackTrace(err, arguments.callee)
  var stack = err.stack
  Error.prepareStackTrace = orig
  return stack
}

Debug.prototype.get_stack_parent = function() {
  var orig = Error.prepareStackTrace
  Error.prepareStackTrace = function(_, stack) {
    return stack
  }

  var err = new Error
  Error.captureStackTrace(err, arguments.callee.caller)
  var stack = err.stack
  Error.prepareStackTrace = orig
  return stack
}

Debug.prototype.get_line_parent = function() {
  var sp = this.get_stack_parent()
  if (sp && sp.length) {
    for (var i = 0; i < sp.length; i++) {
      return sp[2].getLineNumber()
    }
  }
}

Debug.prototype.trace = function(msg, type) {
  if (!type) {
    type = 'debug';
  }
  var format = new Date().toISOString() + ' '
  if (this.options.colors) {
    format = eval(type.toLowerCase() + '(format)')
  }

  var appDir = path.dirname(require.main.filename)

  var sepArray = appDir.split(path.sep)
  var l = sepArray.length
  if (sepArray[parseInt(l) - 1] == 'bin')
  appDir = path.dirname(__dirname)

  var p = this.get_file_parent()
  func = ''

  if (p) {
    if (p.split(appDir)[1]) {
      var parentfile = p.split(appDir)[1].substring(1)
      func = parentfile + ':' + this.get_line_parent()
    }
  }

  if (this.options.colors) {
    typeF = rightpad(eval(type.toLowerCase() + '(type.toUpperCase())'), 25)
  } else {
    typeF = rightpad(type.toUpperCase(), 6)
  }


  //verify log level configuration
  const leveln = this.numberFromLevel(type);
  if (leveln > this.options.leveln) {
      return false;
  }

  func = rightpad(func, 30) + ' '

  let msg0 = msg;
  if (typeof (msg) == 'object') {
    // console.log(format + typeF + func)
    try {
      msg0 = '\n' + util.inspect(msg);
    } catch (e) {
      //dont do anything
    }
  }
  
  var completeMessage  = format  +  typeF  +   func  +  msg0
  console.log(completeMessage)
  return true
}

Debug.prototype.log = function() {
  return this.trace(util.format.apply(util, arguments), 'LOG')
}

Debug.prototype.debug = function() {
  return this.trace(util.format.apply(util, arguments), 'DEBUG')
}

Debug.prototype.warn = function() {
  return this.trace(util.format.apply(util, arguments), 'WARN')
}

Debug.prototype.info = function() {
  return this.trace(util.format.apply(util, arguments), 'INFO')
}

Debug.prototype.error = function() {
  return this.trace(util.format.apply(util, arguments), 'ERROR')
}

Debug.prototype.numberFromLevel = function(level) {
  level = level.toLowerCase();
  if (level == 'debug' || level == 'all') {
    return DEBUG;
  } else if (level == 'info') {
    return  INFO;
  } else if (level == 'warn') {
    return  WARN;
  } else if (level == 'error') {
    return  ERROR;
  }
}

module.exports = Debug
