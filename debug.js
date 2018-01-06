var  fs = require('fs')
var clc = require('cli-color')
var path = require('path')
var dateFormat = require('dateformat')
var rightpad = require('right-pad')
var error = clc.red.bold
var debug = clc.white.bold
var log = clc.white.bold
var warn = clc.yellow.bold
var info = clc.cyanBright.bold

var rootDir = __dirname
var logDir = path.join(rootDir, 'logs')
var noLogsFolder = false
var options = {
  filter: null,
  colors: true
}

var Debug = function(_options) {
  if(_options!=null) {
    options = Object.assign(options,_options);
  }
  if (!options.filter || options.filter=='') {
    options.filter = null;
  }
  if (!options.colors) {
    options.colors = true;
  }
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

Debug.prototype.trace = function(msg, type, test) {
  var completeMessage = ''
  var format = new Date().toISOString() + ' '
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

  if (options.colors)
    typeF = rightpad(eval(type.toLowerCase() + '(type)'), 25)
  if (!options.colors)
    typeF = rightpad(type.toUpperCase(), 6)


  if (options.filter && options.filter.toLowerCase().indexOf(type.toLowerCase())==-1) {
    return true;
  }

  func = rightpad(func, 30) + ' '
  completeMessage  = completeMessage   +   format  +  typeF  +   func  +  msg

  if (typeof(msg) == 'object') {
    console.log(format  +  typeF  +  func)
    try {
      completeMessage = util.inspect(msg);
    } catch (e) {
      completeMessage = msg
    }
  }

  console.log(completeMessage)
  return msg
}

Debug.prototype.log = function(msg, test) {
  this.trace(msg, 'LOG', test)
  return true
}

Debug.prototype.debug = function(msg, test) {
  this.trace(msg, 'DEBUG', test)
  return true
}

Debug.prototype.warn = function(msg, test) {
  this.trace(msg, 'WARN', test)
  return true
}

Debug.prototype.info = function(msg, test) {
  this.trace(msg, 'INFO', test)
  return true
}

Debug.prototype.error = function(msg, test) {
  this.trace(msg, 'ERROR', test)
  return true
}

module.exports = Debug
