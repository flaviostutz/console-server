module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt)

    grunt.initConfig({
        eslint: {
            target: ['file.js']
        }
    })

    grunt.registerTask('default', ['eslint'])
}
