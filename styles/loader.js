'use strict'

// The availible styles
const styles = {
    default: require('./src/default'),
}

// By default load the default theme
let style = styles.default

/*
setStyle allows us to edit the styles without passing the whole object, like so:

exports.setStyle({
    error: {
        color: 'blue',
    },
})

Error tag his text is now blue!

warning: no deep nesting yet (lodash? underscore?)
*/

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
