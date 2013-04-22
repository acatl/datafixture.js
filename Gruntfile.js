module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        coffee: {
            main: {
                options: {
                    join: true,
                    separator: "\n###\n---------------------###\n"
                },
                files: {
                    'datafixture.js': ['datafixture.coffee']
                }
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %> | ' +
                        '(c) 2011 - <%= grunt.template.today("yyyy") %>, ' +
                        'By: <%= pkg.author %> | <%= pkg.license %> */\n'
            },
            main: {
                files: {
                    'datafixture.min.js': ['datafixture.js']
                }
            }
        },

        jasmine : {
            src : 'datafixture.js',
            options : {
                specs : 'tests/*.js'
            }
        },

        watch: {
            publicscripts: {
                files: [
                    '*.coffee'
                ],
                tasks: ['coffee','uglify']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.registerTask('default', ['coffee', 'uglify']);
    grunt.registerTask('test', ['jasmine']);
};