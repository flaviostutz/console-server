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
