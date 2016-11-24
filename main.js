'use strict'

const errorStack = require('./libs/errorstack')
const render     = require('./libs/render')
const util       = require('./libs/util')
const _          = require('lodash')

// Default settings
const defaultSettings = {
    silent:    false,
    colors:    true,
    renderKid: false,
}

// Expose some modules that libs depend on
exports.errorStack = errorStack
exports.render     = render
exports.settings   = defaultSettings

exports.clear = () => {
    util.clearTerminal()
}

// TODO: how to get all friggin arguments?
// ..args doesn't work
// and arguments returns a bunch of useless stuff :c
exports.log = (firstArg) => {
    // for now just handle the first argument until this is solved.
    errorStack.capture()
    render.console(firstArg, 'log')
}

// console.debug is a alias of console.log
exports.debug = exports.log

exports.warn = (firstArg) => {
    errorStack.capture()
    render.console(firstArg, 'warn')
}

exports.error = (firstArg) => {
    errorStack.capture()
    render.console(firstArg, 'error')
}

exports.info = (firstArg) => {
    errorStack.capture()
    render.console(firstArg, 'info')
}

exports.fatal = (firstArg) => {
    errorStack.catchExceptions()
    throw new Error(firstArg)
}

exports.trace = () => {
    errorStack.capture()
    errorStack.renderStack(errorStack.getStack())
}

exports.setup = addedSettings => {
    exports.settings = _.merge(defaultSettings, addedSettings)
}
