'use strict'

const stackTrace = require('stack-trace')
const path       = require('path')
const render   = require('./render')
const util       = require('./util')

const projectRoot = util.resolveProjectRoot()

// NOTE: There are two stacktrace types:
// native stacktrace: this is the return output provided by the module stackTrace.
// console-debug stacktrace: this is a stacktrace but formatted so console-debug knows how to behave around it, check the getStack function.

// By default, no trace is captured on initialization
let currentTrace = false

// No captured error = default
exports.capturedError = false

// Captures a native stacktrace
exports.capture = () => {
    currentTrace = stackTrace.get()
}

// Captures exceptions
exports.catchExceptions = () => {
    process.on('uncaughtException', err => {
        exports.capturedError = err
        exports.renderStack(exports.cleanStack(exports.parseError(err)))
        process.exit(1)
    })
}

// Renders a console-debug stacktrace visually with renderKid
exports.renderStack = (stack) => {
    verifyIsConsoleDebugStack(stack)

    render.stack(stack)
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
    verifyIsConsoleDebugStack(stack)

    const formattedStack = []
    for (let i = stack.length - 1; i >= 0; i--) {
        const trace = stack[i]

        // Only allow traces from the client's project
        if (trace.isFromClientModule === false) {
            continue
        }

        formattedStack.push(trace)
    }

    return formattedStack
}

// Get the current captured stack and formulate objects
exports.getStack = () => {
    // If currentTrace is used in a function, it must be verified.
    verifyStackExists()

    const stack = []
    for (let i = currentTrace.length - 1; i >= 0; i--) {

        // Remove traces from native v8 code
        if (currentTrace[i].isNative()) {
            continue
        }

        // Find out if this trace is coming from console-debug itself
        const thisPathSep = currentTrace[i].getFileName().split(path.sep)
        let isFromConsoleDebug = false
        for (let a = thisPathSep.length - 1; a >= 0; a--) {
            if (thisPathSep[a] === 'console-debug') {
                isFromConsoleDebug = true
            }
        }

        // TODO: files in subdirectories are not found!
        const isFromClientModule = projectRoot === path.dirname(currentTrace[i].getFileName())

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
            isFromClientModule: isFromClientModule,
        })
    }

    return stack
}

// Verify that a stack is a console-debug stacktrace
const verifyIsConsoleDebugStack = stack => {
    let error = false

    // Check the stack length
    if (stack.length >= 1) {
        // And check a random property only set by console-debug itself
        if (stack[0].hasOwnProperty('isFromConsoleDebug') === false) {
            error = true
        }
    } else {
        // NOTE: not sure if I want to trigger a error on a empty stack.
        // EDIT: cleanStack can return a empty stack if no other traces were found. So keep this like it is
        // error = true
    }

    if (error) {
        console.error('a non console-debug stacktrace object was used, something went horribly wrong.')
    }
}

// Makes sure that currentTrace exists
const verifyStackExists = () => {
    if (currentTrace === false) {
        throw new Error('Cannot get trace from a non-captured stack')
    }
}
