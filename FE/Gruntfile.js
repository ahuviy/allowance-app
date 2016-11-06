'use strict';
module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.initConfig({
		connect: {
			server: {
				options: {
					port: 9000,
					base: 'app',
					open: true,
					//				livereload: 35729,
					hostname: 'localhost',
					keepalive: true
				}
			}
		},
		//		watch: {
		//            compass: {
		//                files: ['app/styles/{,*/}*.{scss,sass}'],
		//                tasks: ['compass:compile'],
		//                options: {
		//                    livereload: true
		//                }
		//            },
		//            ngtemplates: {
		//                files: ['app/views/**/*.html'],
		//                tasks: ['ngtemplates:app', 'ngtemplates:dist'],
		//                options: {
		//                    livereload: true
		//                }
		//            },
		//            js: {
		//                files: ['app/js/{,*/}*.js', '!app/js/templates/*.js', 'app/*.html'],
		//                tasks: [],
		//                options: {
		//                    livereload: true
		//                }
		//            },
		//            gruntfile: {
		//                files: ['Gruntfile.js'],
		//                tasks: [],
		//                options: {
		//                    reload: true
		//                }
		//            }
		//        }
	});

	grunt.registerTask('serve', [
        'connect'
//		'connect:livereload',
//        'watch'
    ]);
};