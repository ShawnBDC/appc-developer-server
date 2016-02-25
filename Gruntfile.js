var child_process = require('child_process');

var async = require('async');

module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		mochaTest: {
			options: {
				timeout: 30000,
				reporter: 'spec',
				ignoreLeaks: false
			},
			src: ['test/**/*.js']
		},
		jshint: {
			options: {
				jshintrc: true
			},
			src: ['*.js', 'conf/**.js', 'lib/**/*.js', 'apis/**/*.js', 'models/**/*.js', 'blocks/**/*.js', 'test/**/*.js', 'web/src/js/!(vendor)/**/*.js', 'web/routes/**/*.js']
		},
		kahvesi: {
			src: ['test/**/*.js']
		},
		clean: ['tmp'],
		less: {
			default: {
				options: {
					strictMath: true
				},
				src: 'web/src/less/default.less',
				dest: 'web/public/css/styles.css'
			}
		},
		watch: {
			css: {
				files: 'web/**/*.less',
				tasks: 'css'
			},
			js: {
				files: 'web/src/js/**/*.js',
				tasks: 'js'
			}
		},
		semver: {
			pkg: {
				src: 'package.json',
				dest: 'package.json'
			}
		},
		exec: {
			run: {
				command: 'appc run'
			},
			publish: {
				command: 'appc publish'
			}
		},
		concat: {
			default: {
				src: [
					'node_modules/bootstrap/js/tooltip.js',
					'node_modules/bootstrap/js/carousel.js',
					'web/src/js/**/*.js'
				],
				dest: 'web/public/js/scripts.js'
			}
		},
		uglify: {
			options: {
				preserveComments: 'some'
			},
			default: {
				src: 'web/public/js/scripts.js',
				dest: 'web/public/js/scripts.min.js'
			}
		}
	});

	// Load grunt plugins for modules
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-kahvesi');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-semver');
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('unpublish', 'Unpublished old versions', function () {
        var done = this.async();

        child_process.exec('appc acs publish --list_versions', function (error, stdout, stderr) {

            if (error !== null) {
                return grunt.fail.fatal(error);
            }

            var matches = stdout.match(/versions: ((?:(?:, )?[0-9]+\.[0-9]+\.[0-9]+)+)\..+currently: ([0-9]+\.[0-9]+\.[0-9]+)/);

            if (matches === null) {
                return done();
            }

            var all = matches[1].split(', ');
            var deployed = matches[2];

            if (all.length === 1) {
                return done();
            }

            async.each(all, function (version, callback) {

                if (version === deployed) {
                    return callback();
                }

                grunt.log.writeln('Unpublishing: ' + version);

                child_process.exec('appc acs unpublish --ver ' + version, callback);

            }, done);
        });

    });

	// register tasks
	grunt.registerTask('test', ['jshint', 'mochaTest', 'clean']);
	grunt.registerTask('cover', ['kahvesi', 'clean']);

	grunt.registerTask('css', ['less']);
	grunt.registerTask('js', ['concat', 'uglify']);

	grunt.registerTask('prep', ['css', 'js']);

	grunt.registerTask('publish', ['test', 'prep', 'unpublish', 'semver:pkg:bump:patch', 'exec:publish']);

	grunt.registerTask('dev', ['prep', 'clean', 'watch']);

	grunt.registerTask('default', 'dev');
};
