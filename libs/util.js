'use strict'

const appRoot = require('app-root-path')
const path    = require('path')
const clear   = require('clear')
const _       = require('lodash')

exports.omitDeep = (collection, excludeKeys) => {
    function omitFn(value) {
        if (value && typeof value === 'object') {
            excludeKeys.forEach((key) => {
                delete value[key]
            })
        }
    }

    return _.cloneDeepWith(collection, omitFn)
}

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
