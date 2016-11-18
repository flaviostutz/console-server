'use strict'

// The goal of this test is to run all code and check for exceptions, not the integrity of the output itself.

const assert       = require('assert-plus')
const consoleDebug = require('./coverage/instrument/main')

// Gets the errorStack module from the main file
const errorStack = consoleDebug.errorStack

describe('Exception Test Suite', () => {
    it('Verify a non-captured stack', () => {
        assert.throws(errorStack.getStack)
    })

    it('Captures errorStack', () => {
        assert.doesNotThrow(errorStack.capture)
    })

    it('Renders a non-cleaned console-debug stacktrace', () => {
        console.log(errorStack.getStack())
        errorStack.getStack()
        errorStack.renderStack(errorStack.getStack())
        assert.doesNotThrow(() => {
            errorStack.renderStack(errorStack.getStack())
        })
    })

    it('Renders a cleaned console-debug stacktrace', () => {
        assert.doesNotThrow(() => {
            errorStack.renderStack(errorStack.cleanStack(errorStack.getStack()))
        })
    })

    it('Parses a error stack', () => {
        assert.doesNotThrow(() => {
            consoleDebug.errorStack.parseError(new Error('test'))
        })
    })

    it('Catch exception', () => {
        assert.doesNotThrow(errorStack.catchExceptions)
    })

    it('Should console.log', () => {
        assert.doesNotThrow(() => {
            consoleDebug.log('hello!')
            consoleDebug.log('testing object display: ')
            consoleDebug.log({
                cool: 'object',
                mate: {
                    arrays: [
                        'test1',
                        'test2',
                    ],
                },
                numbers: [
                    1,
                    2,
                    3,
                    4,
                ],
                null:    null,
                integer: 5,
                boolean: true,
            })
            consoleDebug.log('testing array display: ')
            consoleDebug.log([
                'test1',
                'test2',
            ])
        })
    })

    it('Sets a style', () => {
        assert.doesNotThrow(() => {
            consoleDebug.render.styleLoader.setStyle({
                error: {
                    color: 'green',
                },
            })
        })
    })

    it('Verify a non console-debug stack', () => {
        assert.throws(() => {
            consoleDebug.errorStack.renderStack('thisshoulderror')
        })
    })

    it('Throw exception', () => {
        assert.doesNotThrow(() => {
            consoleDebug.errorStack.triggerException(new Error('test'))
        })
    })

    it('Changes a theme', () => {
        assert.doesNotThrow(() => {
            consoleDebug.render.styleLoader.changeTheme('red')
        })
    })

    it('Changes a theme to a non existing theme', () => {
        assert.throws(() => {
            consoleDebug.render.styleLoader.changeTheme('thisshouldnotexists1234')
        })
    })
})
