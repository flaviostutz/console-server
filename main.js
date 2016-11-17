'use strict'

const errorStack = require('./libs/errorstack')
const render   = require('./libs/render')

// Expose some modules that libs depend on
exports.errorStack = errorStack
exports.render   = render

// TODO: how to get all friggin arguments?
// ..args doesn't work
// and arugments returns a bunch of useless stuff :c
exports.log = (firstArg) => {
    // for now just handle the first argument until this is solved.
    errorStack.capture()
    render.console(firstArg)
}
