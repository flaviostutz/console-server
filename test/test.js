'use strict'

const assert  = require('assert-plus')
const console = require('../main')

describe('Console Suite', () => {
    it('Does something', () => {
        console.log('test')
        assert.equal(true, true)
    })
})
