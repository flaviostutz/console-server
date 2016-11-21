'use strict'

const typeDetect        = require('type-detect')
const RecursiveIterator = require('recursive-iterator')

exports.type = {
    test(val) {
        // NOTE: can a typeDetect fail? I geuss not :)
        return typeDetect(val) !== false
    },
    print(val, print, indent) {
        const type = typeDetect(val).toLowerCase()

        val = renderVariable(val, type)

        // Encapsulate the value with a html tag being the type of the variable itself
        return `<${type}>${val}</${type}>`
    },
}

const renderVariable = (variable, type) => {
    const processObject = {
        // How a object is processed
        object() {
            const iterator = new RecursiveIterator(variable)
            // let output     = ''

            let isDone = false

            while (isDone === false) {
                // const key = iterator.__state.key
                // console.log(iterator.__state)
                // output += `<br>${key}`
                isDone = iterator.next().done
            }

            // return output

            return variable.toString()
        },
        // How a function is processed
        function() {
            // TODO: apply arguments
            const functionOutput = variable()

            // TODO: expand on the function to string? how can we make this better?
            const functionCode   = variable.toString().replace(/\n/g, '<br>')

            return `${functionOutput}<br>${functionCode}`
        },
    }

    // Link the variable type with the functions in 'processObject'
    for (let processType in processObject) {
        if (processType === type) {
            return processObject[processType](variable)
        }
    }

    // If no match is found just return the variable
    return variable
}
