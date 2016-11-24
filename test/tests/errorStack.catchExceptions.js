'use strict'

// The goal of this test is to run all code and check for exceptions, not the integrity of the output itself.

const assert       = require('assert-plus')
const consoleDebug = require('../coverage/instrument/main')

// Gets the errorStack module from the main file
const errorStack = consoleDebug.errorStack

describe('Exception Test Suite', () => {
    it('Setup console-debug', () => {
        consoleDebug.setup({
            silent:    false,
            colors:    false,
            renderKid: true,
        })
    })

    it('Clears terminal', () => {
        consoleDebug.clear()
    })

    it('Verify a non-captured stack', () => {
        assert.throws(errorStack.getStack)
    })

    it('Captures errorStack', () => {
        errorStack.capture()
    })

    it('Renders a non-cleaned console-debug stacktrace', () => {
        errorStack.renderStack(errorStack.getStack())
    })

    it('Renders a cleaned console-debug stacktrace', () => {
        errorStack.renderStack(errorStack.cleanStack(errorStack.getStack()))
    })

    it('Parses a error stack', () => {
        consoleDebug.errorStack.parseError(new Error('test'))
    })

    it('Catch exception', () => {
        errorStack.catchExceptions()
    })

    it('Should fatal error', () => {
        assert.throws(() => {
            consoleDebug.fatal('fatal')
        })
    })

    it('Should console.trace', () => {
        consoleDebug.trace()
    })

    it('Should console.log', () => {
        consoleDebug.log('log')
        consoleDebug.warn('warn')
        consoleDebug.error('error')
        consoleDebug.info('info')
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
        consoleDebug.log(() => {
            return 'test'
        })
        consoleDebug.log(/ab+c/)
    })

    it('Sets a style', () => {
        consoleDebug.render.styleLoader.setStyle({
            error: {
                color: 'green',
            },
        })
    })

    it('Verify a non console-debug stack', () => {
        assert.throws(() => {
            consoleDebug.errorStack.renderStack('thisshoulderror')
        })
    })

    it('Throw exception', () => {
        consoleDebug.errorStack.triggerException(new Error('test'))
    })

    it('Changes a theme', () => {
        consoleDebug.render.styleLoader.changeTheme('red')
    })

    it('Changes a theme to a non existing theme', () => {
        assert.throws(() => {
            consoleDebug.render.styleLoader.changeTheme('thisshouldnotexists1234')
        })
    })

    it('No renderkid', () => {
        consoleDebug.setup({
            silent:    false,
            colors:    false,
            renderKid: false,
        })
        consoleDebug.log('log')
    })

    it('Silent', () => {
        consoleDebug.setup({
            silent:    true,
            colors:    false,
            renderKid: false,
        })
        consoleDebug.log('log')
    })

    // it('No colors', () => {
    //     consoleDebug.setup({
    //         silent:    false,
    //         colors:    false,
    //         renderKid: true,
    //     })
    //     consoleDebug.log('log')
    // })
})
