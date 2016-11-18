'use strict'

module.exports = function(grunt) {
    grunt.initConfig({
        instrument: {
            files: [
                'styles/**/*.js',
                'libs/**/*.js',
                'main.js',
            ],
            options: {
                lazy:     true,
                basePath: 'test/coverage/instrument/',
            }
        },
        mochaTest: {
            options: {
                reporter: 'spec',
                    quiet:             false,
                    clearRequireCache: false,
                    noFail:            false,
            },
            src: 'test/*.js',
        },
        storeCoverage: {
            options: {
                dir: 'test/coverage/reports',
            }
        },
        makeReport: {
            src: 'test/coverage/reports/**/*.json',
            options: {
                type:  'lcov',
                dir:   'test/coverage/reports',
                print: 'detail',
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter:          'spec',
                    quiet:             false,
                    clearRequireCache: false,
                    noFail:            false,
                },
                src: [
                    'test/**/*.js',
                ],
            },
        },
        eslint: {
            options: {
                'terminateOnCallback': false,
                callback: (result) => {
                    if (result.errorCount >= 1) {
                        grunt.log.error('Lint errors found!')
                    } else {
                        grunt.log.ok('No lint errors found, good job!')
                    }
                },
            },
            src: [
                '<%= instrument.files %>',
                'test/*.js'
            ],
        },
        coverage: {
            default: {
                options: {
                    thresholds: {
                        'statements': 95,
                        'branches':   90,
                        'lines':      95,
                        'functions':  100,
                    },
                    dir: 'coverage',
                    root: 'test',
                },
            },
        },
        clean: {
            pre: ['test/coverage'],
        },
        passfail: {
            options: {
                force: true
            },
            all: {
                success: () => {
                    grunt.log.ok('Test passed! :D')
                    process.exit(0)
                },
                fail: () => {
                    grunt.log.error('Test did not pass, please scroll up and check results.')
                    grunt.log.error(`To view the coverage report, check out: ${__dirname}/test/coverage/reports/lcov-report/index.html`)
                    process.exit(1)
                },
            },
        },
        watch: {
            scripts: {
                files: [
                    '<%= instrument.files %>',
                    'test/*.js'
                ],
                tasks: [
                    'verifyCommit',
                ],
                options: {
                    spawn: true,
                },
            },
        },
        notify_hooks: {
            options: {
                enabled: true,
                max_jshint_notifications: 1,
                success: true,
                duration: 1
            }
        }
    })

    grunt.loadNpmTasks('gruntify-eslint')
    grunt.loadNpmTasks('grunt-mocha-test')
    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-istanbul-coverage')
    grunt.loadNpmTasks('grunt-istanbul')
    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.loadNpmTasks('grunt-notify')
    grunt.loadNpmTasks('grunt-passfail')

    grunt.registerTask('default', 'verifyCommit')

    grunt.registerTask('dev', ['clean', 'verifyCoverage', 'watch'])
    grunt.registerTask('lint', 'eslint')
    grunt.registerTask('mocha', [
        'instrument',
        'mochaTest',
    ])
    grunt.registerTask('verifyCoverage', [
        'mocha',
        'storeCoverage',
        'makeReport',
        'coverage',
    ])

    grunt.registerTask('verifyCommit', [
        'verifyCoverage',
        'lint',
        'passfail',
    ])

    grunt.task.run('clean:pre')
    grunt.task.run('notify_hooks')
}
