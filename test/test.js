'use strict'

const assert       = require('assert-plus')
const consoleDebug = require('../main')

consoleDebug.init()

describe('Console Suite', () => {
    it('Does something', () => {
        assert.equal(true, true)
    })
})
