'use strict'

var assert = require('assert')
var assert = require('assert-plus')
var path   = require('path')
var fs     = require('fs')
var Debug  = require('../debug')

const console = require('../index.js');
console.debug('oh, my');
console.info('just some information from our fellows...');
console.warn('there is a clif just a few steps fr...');
console.error('we couldn\'t advise that poor guy along the clif in time...');

var consoleObject = new Debug({
  level: null,
  colors: true,
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
    assert(consoleObject.trace({
      test1: [1, 2, 3, 4],
      test2: ['ohai', 'there'],
      test3:true
    }, 'debug'))
  })

  it('Trigger a uncaught exception', function() {
    assert.throws(function() {
      consoleObject.uncaughtException()
    }, Error)
  })
})

describe('Console object', function() {
  it('Log function', function() {
    assert(consoleObject.log('test'))
  })

  it('Warn function', function() {
    assert(consoleObject.warn('test'))
  })

  it('Error function', function() {
    assert(consoleObject.error('test'))
  })

  it('Debug function', function() {
    assert(consoleObject.debug('test'))
  })

  it('Info function', function() {
    assert(consoleObject.info('test'))
  })

  it('Displaying a object', function() {
    assert(consoleObject.trace({
      test1: [1, 2, 3, 4],
      test2: ['ohai', 'there'],
      test3: true,
    }, 'LOG', true))
  })

  it('Log function without colors', function() {
    var consoleObject = new Debug({
      level: null,
      colors: false
    })
    assert.equal(consoleObject.trace('test', 'DEBUG'), true)
  })

  it('Log function with a filter skipping', function() {
    var consoleObject = new Debug({
      level: 'error',
      colors: false
    })
    assert.equal(consoleObject.trace('test', 'info'), false)
  })

  it('Log function with level DEBUG', function () {
    var consoleObject = new Debug({
      level: 'debug',
      colors: true
    })
    assert(consoleObject.trace('test', 'debug'))
    assert(consoleObject.trace('test', 'info'))
    assert(consoleObject.trace('test', 'warn'))
    assert(consoleObject.trace('test', 'error'))
  })

  it('Log function with level INFO', function () {
    var consoleObject = new Debug({
      level: 'info',
      colors: false
    })
    assert(!consoleObject.trace('test', 'debug'))
    assert(consoleObject.trace('test', 'info'))
    assert(consoleObject.trace('test', 'warn'))
    assert(consoleObject.trace('test', 'error'))

    assert(!consoleObject.debug('test'))
    assert(consoleObject.info('test'))
    assert(consoleObject.warn('test'))
    assert(consoleObject.error('test'))
  })

  it('Log function with level ERROR', function () {
    var consoleObject = new Debug({
      level: 'error',
      colors: true
    })
    assert(!consoleObject.trace('test', 'debug'))
    assert(!consoleObject.trace('test', 'info'))
    assert(!consoleObject.trace('test', 'warn'))
    assert(consoleObject.trace('test', 'error'))
  })

  it('Log function with default options', function () {
    var consoleObject = new Debug();
    assert(consoleObject.debug('test'))
    assert(consoleObject.error('test'))
  })

  it('Log function with format arguments', function () {
    var consoleObject = new Debug();
    assert(consoleObject.info('%s=%s', 'str1', 334))
    assert(consoleObject.info({ a: 111, b: 222, c: { d: 555, e: 'teste' } }))
    assert(consoleObject.info('testing ', {f:'efff', g:'giii'} ))
  })

  it('Log configured by ENV level', function () {
    process.env.LOGGER_LEVEL = 'error';
    delete process.env.LOGGER_USE_COLORS;
    delete require.cache[require.resolve('../index.js')]
    var consoleObject = require('../index.js');
    assert(consoleObject.error('test'));
    assert(!consoleObject.warn('test'));
    assert(consoleObject.options.colors);
  })

  it('Log configured by ENV colors=false', function () {
    delete process.env.LOGGER_LEVEL;
    process.env.LOGGER_USE_COLORS = 'false';
    delete require.cache[require.resolve('../index.js')]
    var consoleObject = require('../index.js');
    assert(consoleObject.debug('test'));
    assert(consoleObject.error('test'));
    assert(!consoleObject.options.colors);
  })

  it('Log configured by ENV colors=true', function () {
    process.env.LOGGER_LEVEL = 'info';
    process.env.LOGGER_USE_COLORS = 'true';
    delete require.cache[require.resolve('../index.js')]
    var consoleObject = require('../index.js');
    assert(!consoleObject.debug('test'));
    assert(consoleObject.error('test'));
    assert(consoleObject.options.colors);
  })

})

