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
    numbers: [
        1,
        2,
        3,
        4,
    ],
    deep: {
        object: {
            with: {
                array: [
                    5,
                    6,
                    7,
                    8,
                ],
            },
        },
    },
})
console.log(() => {
    // this is a cool function
    return 'test'
})
console.log(/ab+c/)
//console.trace()
//console.fatal('oops, fake fatal error!')
