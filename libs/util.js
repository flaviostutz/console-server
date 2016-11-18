'use strict'

const appRoot = require('app-root-path')
const path    = require('path')
const clear   = require('clear')

exports.resolveProjectRoot = () => {
    return appRoot.toString()
}

exports.truncateFilePath = filePath => {
    const fileNameSplit = filePath.split(path.sep)

    return fileNameSplit[fileNameSplit.length - 1]
}

exports.clearTerminal = () => {
    clear()
}

exports.normalizeInput = input => {
    let output = input

    // Normalize objects/arrays
    if (typeof (input) === 'object') {
        output = `<object>${jsonToRenderKid(input)}</object>`
    }

    return output
}

// Converts json to match keys and values for styling with renderKid
const jsonToRenderKid = json => {
    if (typeof json !== 'string') {
        json = JSON.stringify(json, undefined, 2)
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'number'
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key'
            } else {
                cls = 'string'
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean'
        } else if (/null/.test(match)) {
            cls = 'null'
        }

        return `<${cls}>${match}</${cls}>`
    })
}
