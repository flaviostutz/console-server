'use strict'

const RenderKid   = require('renderkid')
const styleLoader = require('../styles/loader')
const errorStack  = require('./errorstack')
const util        = require('./util')

// Expose some modules that libs depend on
exports.styleLoader = styleLoader

exports.render = html => {
    // Get the style again, because it might have changed
    const r = new RenderKid()
    r.style(styleLoader.getStyle())

    return r.render(html)
}

exports.display = html => {
    console.log(exports.render(html))
}

exports.handleConsole = a => {
    const stack = errorStack.getStack()
    let output  = ''

    for (let i = 0; i < stack.length; i++) {
        if (stack[i].methodName === 'log' && stack[i].isFromConsoleDebug) {
            const trace = stack[i - 1]
            const fileName = util.truncateFilePath(trace.fileName)

            const renderText = util.normalizeInput(a)

            output += `
            <ul>
                <li>
                    - <filename>${fileName}</filename>:<line>${trace.lineNumber}</line>
                    <subtext>${renderText}</subtext>
                </li>
            </ul>
            `
        }
    }

    exports.display(output)
}
