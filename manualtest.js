'use strict'

/*
    Developers notice:

    Just a test file for a manual test
*/

const console = require('./main')

console.log('hia')
console.warn('hia')
console.error('hia')
console.info('hia')
console.log({
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
console.trace()
console.fatal('oops, fake fatal error!')
