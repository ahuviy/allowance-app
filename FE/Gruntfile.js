module.exports = function (grunt) {
	'use strict';

	// load grunt plug-ins
	grunt.loadNpmTasks('grunt-angular-templates');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// configure individual actions/tasks
	grunt.initConfig({
		connect: {
			server: {
				options: {
					base: 'app',
					hostname: 'localhost',
					keepalive: false,
					livereload: 35729,
					open: true,
					port: 9000
				}
			}
		},
		ngtemplates: {
			dev: {
				cwd: 'app',
				src: 'views/**/*.html',
				dest: 'app/js/templates/templates.js',
				options: {
					module: 'allowance'
				}
			},
			devMinifyHtml: {
				cwd: 'app',
				src: 'views/**/*.html',
				dest: 'app/js/templates/templates.js',
				options: {
					module: 'allowance',
					htmlmin: {
						collapseBooleanAttributes: true,
						collapseWhitespace: true,
						removeAttributeQuotes: true,
						removeComments: true, // Only if you don't use comment directives! 
						removeEmptyAttributes: true,
						removeRedundantAttributes: true,
						removeScriptTypeAttributes: true,
						removeStyleLinkTypeAttributes: true
					}
				}
			},
			dist: {
				cwd: 'app',
				src: 'views/**/*.html',
				dest: 'dist/js/templates/templates.js',
				options: {
					module: 'allowance'
				}
			},
			distMinifyHtml: {
				cwd: 'app',
				src: 'views/**/*.html',
				dest: 'dist/js/templates/templates.js',
				options: {
					module: 'allowance',
					htmlmin: {
						collapseBooleanAttributes: true,
						collapseWhitespace: true,
						removeAttributeQuotes: true,
						removeComments: true, // Only if you don't use comment directives! 
						removeEmptyAttributes: true,
						removeRedundantAttributes: true,
						removeScriptTypeAttributes: true,
						removeStyleLinkTypeAttributes: true
					}
				}
			}
		},
		watch: {
			css: {
				files: ['app/css/**/*.css'],
				options: {
					livereload: true
				},
				tasks: []
			},
			gruntfile: {
				files: ['Gruntfile.js'],
				options: {
					reload: true
				},
				tasks: []
			},
			index: {
				files: ['app/index.html'],
				options: {
					livereload: true
				},
				tasks: []
			},
			js: {
				files: ['app/js/**/*.js', '!app/js/templates/*.js'],
				options: {
					livereload: true
				},
				tasks: []
			},
			ngtemplates: {
				files: ['app/views/**/*.html', 'app/*.html'],
				options: {
					livereload: true
				},
				tasks: ['ngtemplates:dev']
			}
		}
	});

	// open front-end server and watch (with livereload) for file changes
	grunt.registerTask('serve', [
        'ngtemplates:dev',
		'connect',
		'watch'
    ]);
};