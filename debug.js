var fs = require('fs')
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

var Debug = function (_options) {
  this.options = {
    level: 'all',
    colors: true
  }
  if (_options != null) {
    if (_options.level != null && _options.level != '') {
      this.options.level = _options.level
    }
    if (_options.colors != null && (_options.colors + '') != '') {
      this.options.colors = _options.colors
    }
  }
  this.options.leveln = this.numberFromLevel(this.options.level.trim());
}

Debug.prototype.getCallerReference = function () {
  let insideModule = false;
  let callerRef = null;
  e = new Error();
  const stacks = e.stack.split('\n');
  stacks.every(function (line) {
    console.log('>>>>> ' + line);
    if (!insideModule && line.indexOf('/console-server/debug.js') != -1) {
      insideModule = true;
    } else if (insideModule && line.indexOf('/console-server/debug.js') == -1) {
      let folder = line.match(/.*\/(.*)\//);
      if (folder != null && folder.length > 1) {
        folder = folder[1];
        let fn = line.match(/(\w+.\w+\:\w+)/);
        if (fn != null && fn.length > 1) {
          callerRef = folder + '/' + fn[1];
          return false;
        }
      }
    }
    return true;
  });
  return callerRef;
}

Debug.prototype.trace = function (msg, type) {
  if (!type) {
    type = 'debug';
  }
  var format = new Date().toISOString() + ' '
  if (this.options.colors) {
    format = eval(type.toLowerCase() + '(format)')
  }

  let func = this.getCallerReference();
  if (func != null) {
    func = rightpad(func, 24) + ' '
  } else {
    func = '-- ';
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

  let msg0 = msg;
  if (typeof (msg) == 'object') {
    // console.log(format + typeF + func)
    try {
      msg0 = '\n' + util.inspect(msg);
    } catch (e) {
      //dont do anything
    }
  }

  var completeMessage = format + typeF + func + msg0
  console.log(completeMessage)
  return true
}

Debug.prototype.log = function () {
  return this.trace(util.format.apply(util, arguments), 'LOG')
}

Debug.prototype.debug = function () {
  return this.trace(util.format.apply(util, arguments), 'DEBUG')
}

Debug.prototype.warn = function () {
  return this.trace(util.format.apply(util, arguments), 'WARN')
}

Debug.prototype.info = function () {
  return this.trace(util.format.apply(util, arguments), 'INFO')
}

Debug.prototype.error = function () {
  return this.trace(util.format.apply(util, arguments), 'ERROR')
}

Debug.prototype.numberFromLevel = function (level) {
  level = level.toLowerCase();
  if (level == 'debug' || level == 'all') {
    return DEBUG;
  } else if (level == 'info') {
    return INFO;
  } else if (level == 'warn') {
    return WARN;
  } else if (level == 'error') {
    return ERROR;
  }
}

module.exports = Debug
