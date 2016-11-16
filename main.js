'use strict'

const errorStack = require('./libs/errorstack')

errorStack.capture()
console.log(errorStack.formatStack(errorStack.getStack()))

errorStack.catchExceptions()

exports.log = (msg) => {
    console.log(msg)
}
