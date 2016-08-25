'use strict'

var assert = require('assert')
var assert = require('assert-plus')
var path   = require('path')
var fs     = require('fs')
var rimraf = require('rimraf')
var Debug  = require('../debug')

var logDir = path.join(__dirname, '..', 'logs')

rimraf(logDir, function(result) {
  console.log(result)
})

var consoleObject = new Debug({
  consoleFilter: [],
  logToFile:     true,
  logFilter:     [],
  colors:        true,
})

describe('Stack getters', function() {
  it('get_stack()', function() {
    assert.doesNotThrow(function() {
      consoleObject.get_stack()
    }, Error)
  })

  it('get_stack_parent()', function() {
    assert.doesNotThrow(function() {
      consoleObject.get_stack_parent()
    }, Error)
  })

  it('get_line_parent()', function() {
    assert.doesNotThrow(function() {
      consoleObject.get_line_parent()
    }, Error)
  })
})

describe('Internal functions', function() {
  it('Displaying a object', function() {
    assert.object(consoleObject.trace({
      test1: [1, 2, 3, 4],
      test2: ['ohai', 'there'],
      test3:true
    }, 'LOG', true))
  })

  it('Trigger a uncaught exception', function() {
    assert.throws(function() {
      consoleObject.uncaughtException()
    }, Error)
  })
})

describe('Console object', function() {
  it('Log function', function() {
    assert.equal(consoleObject.log('test', 'LOG', true), true)
  })

  it('Warn function', function() {
    assert.equal(consoleObject.warn('test', 'WARN', true), true)
  })

  it('Error function', function() {
    assert.equal(consoleObject.error('test', 'ERROR', true), true)
  })

  it('Debug function', function() {
    assert.equal(consoleObject.debug('test', 'DEBUG', true), true)
  })

  it('Info function', function() {
    assert.equal(consoleObject.info('test', 'INFO', true), true)
  })

  it('Displaying a object', function() {
    assert.object(consoleObject.trace({
      test1: [1, 2, 3, 4],
      test2: ['ohai', 'there'],
      test3: true,
    }, 'LOG', true))
  })

  it('Log function without colors', function() {
    var consoleObject = new Debug({
      consoleFilter: [],
      logToFile: true,
      logFilter: [],
      colors: false
    })
    assert.equal(consoleObject.trace('test', 'LOG', true), 'test')
  })

  it('Log function with a filter', function() {
    var consoleObject = new Debug({
      consoleFilter: ['LOG'],
      logToFile: true,
      logFilter: [],
      colors: false,
    })
    assert.equal(consoleObject.trace('test', 'LOG', true), true)
  })
})


describe('Log to file', function() {
  it('Log to file while logFilter is set to LOG', function() {
    var consoleObject = new Debug({
      consoleFilter: [],
      logToFile: true,
      logFilter: ['LOG'],
      colors: false,
    })
    assert.doesNotThrow(function() {
      consoleObject.logFile('test', 'LOG', function(result) {
      })
    }, Error)
  })

  it('Log to file', function(done) {
    consoleObject.logFile('test', 'test', function(result) {
      assert.equal(result, true)
      done()
    })
  })
})
