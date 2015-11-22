module.exports = function(grunt) {


    grunt.initConfig({
    jasmine_nodejs: {
        // task specific (default) options
        options: {
            specNameSuffix: "spec.js", // also accepts an array
            helperNameSuffix: "helper.js",
            useHelpers: false,
            stopOnFailure: false,
            // configure one or more built-in reporters
            reporters: {
                console: {
                    colors: true,
                    cleanStack: 1,       // (0|false)|(1|true)|2|3
                    verbosity: 4,        // (0|false)|1|2|3|(4|true)
                    listStyle: "indent", // "flat"|"indent"
                    activity: false
                },
                junit: {
                    savePath: "./reports",
                    filePrefix: "junit-report",
                    consolidate: true,
                    useDotNotation: true
                },
                nunit: {
                    savePath: "./reports",
                    filename: "nunit-report.html",
                    reportName: "Test Results"
                },
                // terminal: {
                //     color: false,
                //     showStack: false,
                //     verbosity: 2
                // },
                // teamcity: true,
                // tap: true
            },
            // add custom Jasmine reporter(s)
            customReporters: []
        },
        your_target: {
            // target specific options
            options: {
                useHelpers: true
            },
            // spec files
            specs: [
                "tests/specs/**",
                //"tests/jasmine/specs/_initSpec.js",
            ],
            helpers: [
                "tests/helpers/**"
            ]
        }
    }
});

    grunt.loadNpmTasks('grunt-jasmine-nodejs');

    //register tasks
    grunt.registerTask('test:meteor-unit-test',
        [
            'jasmine_nodejs',

        ]);


    grunt.registerTask('test', ['test:meteor-unit-test']);

};
