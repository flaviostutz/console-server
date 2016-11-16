'use strict'

const stackTrace  = require('stack-trace')
const path        = require('path')
const PrettyError = require('pretty-error')
const pe          = new PrettyError()

// NOTE: There are two stacktrace types:
// native stacktrace: this is the return output provided by the module stackTrace.
// console-debug stacktrace: this is a stacktrace but formatted so console-debug knows how to behave around it, check the getStack function.

// By default, no trace is captured on initialization
let currentTrace = false

// Captures a native stacktrace
exports.capture = () => {
    currentTrace = stackTrace.get()
}

// Captures exceptions
exports.catchExceptions = () => {
    process.on('uncaughtException', err => {
        exports.renderStack(exports.parseError(err))
    })
}

exports.renderStack = stack => {
    console.log(exports.formatStack(stack))
}

// Parses a javascript error object to a console-debug stacktrace
exports.parseError = err => {
    // First parse the native error stacktrace and set it as the currentTrace
    currentTrace = stackTrace.parse(err)

    // Then transform the native error stacktrace to a console-debug stacktrace
    return exports.getStack()
}

// Cleans a console-debug stacktrace (works like the module clarify)
exports.cleanStack = stack => {

}

// Get the current captured stack and formulate objects
exports.getStack = () => {
    // If currentTrace is used in a function, it must be verified.
    verifyStackExists()

    const stack = []
    for (let i = currentTrace.length - 1; i >= 0; i--) {

        // Find out if this trace is coming from console-debug itself
        const thisPathSep = currentTrace[i].getFileName().split(path.sep)
        let isFromConsoleDebug = false
        for (let a = thisPathSep.length - 1; a >= 0; a--) {
            if (thisPathSep[a] === 'console-debug') {
                isFromConsoleDebug = true
            }
        }

        // Formulate the stack object itself
        stack.push({
            object:             currentTrace[i],
            fileName:           currentTrace[i].getFileName(),
            lineNumber:         currentTrace[i].getLineNumber(),
            columnNumber:       currentTrace[i].getColumnNumber(),
            typeName:           currentTrace[i].getTypeName(),
            methodName:         currentTrace[i].getMethodName(),
            functionName:       currentTrace[i].getFunctionName(),
            isNative:           currentTrace[i].isNative(),
            isFromConsoleDebug: isFromConsoleDebug,
        })
    }

    return stack
}

// formatStack only works with a console-debug stacktrace
exports.formatStack = stack => {
    verifyIsConsoleDebugStack(stack)

    const formattedStack = []
    for (let i = stack.length - 1; i >= 0; i--) {
        const trace = stack[i]

        // Skip traces that belong to console-debug itself
        if (trace.isFromConsoleDebug) {
            // TODO: for testing purposes, leave this commented for now
            // continue
        }

        formattedStack.push(exports.formatTrace(trace))
    }

    return formattedStack
}

// How to format a trace
exports.formatTrace = trace => {
    return `${trace.fileName}:${trace.lineNumber}`
}

const verifyIsConsoleDebugStack = stack => {
    let error = false
    if (stack.length >= 1) {
        if (!stack[0].hasOwnProperty('isFromConsoleDebug')) {
            error = true
        }
    } else {
        error = true
    }

    if (error) {
        throw new Error('a non console-debug stacktrace object was used or the stacktrace was empty!')
    }
}

// Makes sure that currentTrace exists
const verifyStackExists = () => {
    if (currentTrace === false) {
        throw new Error('Cannot get stack from a non-captured trace')
    }
}
