module.exports = function (grunt) {
	'use strict';

	// load grunt plug-ins
	grunt.loadNpmTasks('grunt-angular-templates');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-copy');
	
	// configure individual actions/tasks
	grunt.initConfig({
		compass: {
            compile: {
                options: {
                    sassDir: 'app/styles',
                    cssDir: 'app/css',
                    specify: 'app/styles/**/*.scss'
                }
            }
        },
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
		copy: {
			cordova: {
				files: [
					{
						expand: true,
						cwd: 'app',
						src: [
							'js/**/*.js',
							'css/**/*.css',
							'assets/**/*',
							'index.html'
						],
						dest: 'cordova/www/'
					}
				]
			}
		},
		ngtemplates: {
			dev: {
				cwd: 'app',
				src: 'views/**/*.html',
				dest: 'app/js/templates/templates.js',
				options: {
					module: 'app'
				}
			},
			devMinifyHtml: {
				cwd: 'app',
				src: 'views/**/*.html',
				dest: 'app/js/templates/templates.js',
				options: {
					module: 'app',
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
					module: 'app'
				}
			},
			distMinifyHtml: {
				cwd: 'app',
				src: 'views/**/*.html',
				dest: 'dist/js/templates/templates.js',
				options: {
					module: 'app',
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
			compass: {
                files: ['app/styles/**/*.scss'],
                options: {
                    livereload: true
                },
                tasks: ['compass:compile']
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

	// build the app for cordova
	grunt.registerTask('build:cordova', [
		'compass:compile',
		'ngtemplates:dev',
		'copy:cordova'
	]);
	
	// open front-end server and watch (with livereload) for file changes
	grunt.registerTask('serve', [
        'build:cordova',
		'connect',
		'watch'
    ]);
};