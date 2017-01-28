'use strict'

const prettyFormat = require('pretty-format')
const styleLoader  = require('../styles/loader')
const errorStack   = require('./errorstack')
const util         = require('./util')
const typeDetect   = require('type-detect')
const main         = require('../main')
const fs           = require('fs')
const path         = require('path')
const mkdirp       = require('mkdirp')
const stripTags    = require('striptags')
const trim         = require('trim')
const RenderKid    = require('renderkid')
const os           = require('os')

// Expose some modules that libs depend on
exports.styleLoader = styleLoader

// By default the capturedError is false (a module is supposed to set this value for exports.stack header)
exports.capturedError = false

// How html is printed to console
exports.html = html => {
    if (main.settings.silent === true) {
        return
    }
    let output = ''

    if (main.settings.renderKid === false) {
        const newlines = html.split('\n')
        const newHtml  = []
        newlines.forEach(line => {
            newHtml.push(trim(stripTags(line)))
        })

        output = newHtml.join('\n')
    } else {
        // Get the style again, because it might have changed
        let r = new RenderKid()
        r.style(styleLoader.getStyle())

        if (main.settings.colors === false) {
            r = new RenderKid()
            r.style(styleLoader.removeColors(styleLoader.getStyle()))
        }

        output = r.render(html)
    }

    if (main.settings.hasOwnProperty('file')) {
        if (main.settings.file.hasOwnProperty('path')) {
            output = false
            mkdirp(path.dirname(main.settings.file.path), err => {
                if (err) {
                    throw new Error(err)
                }
                const writeStream = fs.createWriteStream(main.settings.file.path, {
                    'flags': 'a',
                })
                const newlines = html.split('\n')
                const newHtml  = []
                newlines.forEach(line => {
                    newHtml.push(trim(stripTags(line)))
                })

                writeStream.write(newHtml.join('\n') + os.EOL)
                writeStream.end()
            })
        }
    }

    if (output) {
        console.log(output)
    }
}

// How a console-debug stacktrace is rendered
exports.stack = stack => {
    // A 'header' template. This is used for showing exceptions or other useful title messages
    let header = ''

    // Show a error
    if (exports.capturedError) {
        header += `
            <exception>uncaughtException</exception>:<exceptiontext>${exports.capturedError}</exceptiontext>
        `

        // Reset the capturedError because it was displayed
        exports.capturedError = false
    }

    // Add the li 'traces'
    let traces = ''
    for (let i = stack.length - 1; i >= 0; i--) {
        const trace      = stack[i]
        let functionName = stack[i].functionName
        if (functionName === null) {
            functionName = ''
        }

        const fileNameTruncated = util.truncateFilePath(trace.fileName)

        // A 'traces' template
        traces += `
            <li>
                - <filename>${fileNameTruncated}</filename>:<line>${trace.lineNumber}</line>
                <function>${functionName}</function>
                <subtext>${trace.fileName}:${trace.lineNumber}:${trace.columnNumber}</subtext>
            </li>
        `
    }

    // Render the main template
    const output = `
        <ul>
            ${header}
            <li>
                ${traces}
            </li>
        </ul>
    `

    exports.html(output)
}

exports.console = (msg, type) => {
    const stack = errorStack.getStack()
    let output  = ''

    for (let i = 0; i < stack.length; i++) {
        // Capture the trace where errorStack.capture() was called
        if (stack[i].methodName === 'capture' && stack[i].isFromConsoleDebug) {
            // Then go back 2 traces and start to render from there.
            const trace = stack[i - 2]

            // Truncate long filepaths
            const fileName = util.truncateFilePath(trace.fileName)

            // Put the content through prettyFormat plugins
            const renderText = prettyFormat(msg, {
                plugins: [
                    {
                        test(val) {
                            // NOTE: can a typeDetect fail? I geuss not :)
                            return typeDetect(val) !== false
                        },
                        print(val, print, indent) {
                            const type = typeDetect(val).toLowerCase()

                            // Encapsulate the value with a html tag being the type of the variable itself
                            return `<${type}>${val}</${type}>`
                        },
                    },
                ],
            })
            const typePadded = `<${type}>` + util.rightPad(type, 5, '.') + `</${type}>`
            output += `
                ${typePadded} <filename>${fileName}</filename>:<line>${trace.lineNumber}</line>
                <consoletext>${renderText}</consoletext>
            `
        }
    }

    exports.html(output)
}
