'use strict'

const util = require('../libs/util')

// The availible styles
const styles = {
    default: require('./src/default'),
    red:     require('./src/red'),
}

// By default load the default theme
let style = styles.default

exports.changeTheme = theme => {
    if (styles.hasOwnProperty(theme) === false) {
        throw new Error(`The theme "${theme}" is not a existing theme.`)
    }

    style = styles[theme]
}

exports.setStyle = newStyle => {
    style = Object.assign(style, newStyle)
}

exports.getStyle = () => {
    return style
}

exports.removeColors = newStyle => {
    return util.omitDeep(newStyle, [
        'color',
        'background',
    ])
}
