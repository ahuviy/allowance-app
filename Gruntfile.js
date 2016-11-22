module.exports = function (grunt) {
	
	// configure individual actions/tasks
	grunt.initConfig({
		
		// global variables for the project
		projVars: {
			appDir: 'FE/app',
			cordovaDir: 'FE/cordova'
		},

		clean: {
			cordova: ['<%= projVars.cordovaDir %>/www/*']
		},
		compass: {
			compile: {
				options: {
					sassDir: '<%= projVars.appDir %>/styles',
					cssDir: '<%= projVars.appDir %>/css',
					specify: '<%= projVars.appDir %>/styles/**/*.scss'
				}
			}
		},
		connect: {
			server: {
				options: {
					base: '<%= projVars.appDir %>',
					hostname: 'localhost',
					keepalive: false,
					livereload: 35729,
					open: true,
					port: 9000
				}
			},
			withProxy: {
				options: {
					base: 'app',
					hostname: 'localhost',
					keepalive: false,
					livereload: 35729,
					open: true,
					port: 9000,
					middleware: function (connect, options, middlewares) {
						/*Requires the Middleware snipped from the Library
						and add it before the other Middlewares.*/
						middlewares.unshift(require('grunt-middleware-proxy/lib/Utils').getProxyMiddleware());
						return middlewares;
					}
				},
				proxies: [{
					context: '/api',
					host: 'nir-youtube.herokuapp.com',
					https: true,
					rewriteHost: true
				}]
			}
		},
		copy: {
			cordova: {
				files: [
					{
						expand: true,
						cwd: '<%= projVars.appDir %>',
						src: [
							'js/**/*.js',
							'css/**/*.css',
							'assets/**/*',
							'index.html',
							'manifest.json'
						],
						dest: '<%= projVars.cordovaDir %>/www/'
					}
				]
			}
		},
		ngtemplates: {
			dev: {
				cwd: '<%= projVars.appDir %>',
				src: 'views/**/*.html',
				dest: '<%= projVars.appDir %>/js/templates/templates.js',
				options: { module: 'app' }
			},
			devMinifyHtml: {
				cwd: '<%= projVars.appDir %>',
				src: 'views/**/*.html',
				dest: '<%= projVars.appDir %>/js/templates/templates.js',
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
				files: ['<%= projVars.appDir %>/styles/**/*.scss'],
				tasks: ['compass:compile'],
				options: { livereload: true }
			},
			gruntfile: {
				files: ['Gruntfile.js'],
				tasks: []
			},
			index: {
				files: ['<%= projVars.appDir %>/index.html'],
				tasks: [],
				options: { livereload: true }
			},
			js: {
				files: [
					'<%= projVars.appDir %>/js/**/*.js',
					'!<%= projVars.appDir %>/js/templates/*.js' // to prevent reloading twice
				],
				tasks: [],
				options: { livereload: true }
			},
			ngtemplates: {
				files: ['<%= projVars.appDir %>/views/**/*.html'],
				tasks: ['ngtemplates:dev'],
				options: { livereload: true }
			}
		}
	});

//-----------------------------------------------------------------------------

	// load grunt plug-ins
	grunt.loadNpmTasks('grunt-angular-templates');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-middleware-proxy');

//-----------------------------------------------------------------------------

	/**
	 * Register tasks
	 */

	// build the app for cordova
	grunt.registerTask('build:cordova', [
		'clean:cordova',
		'compass:compile',
		'ngtemplates:dev',
		'copy:cordova'
	]);

	// open front-end server and watch (with livereload) for file changes
	grunt.registerTask('serve', [
		'build:cordova',
		'connect:server',
		'watch'
	]);

	// connect with a proxy
	grunt.registerTask('serveWithProxy', [
		'build:cordova',
		'setupProxies:withProxy',
		'connect:withProxy',
		'watch'
	]);
};