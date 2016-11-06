'use strict';

var shortid = require('shortid');

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);
    var serveStatic = require('serve-static');
    var appVersion = shortid.generate();

    grunt.initConfig({
        compass: {
            compile: {
                options: {
                    sassDir: 'app/styles',
                    cssDir: 'app/css',
                    specify: 'app/styles/{,*/}*.scss',
                    imagesDir: 'app'
                }
            }
        },
        watch: {
            compass: {
                files: ['app/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:compile'],
                options: {
                    livereload: true
                }
            },
            ngtemplates: {
                files: ['app/views/**/*.html'],
                tasks: ['ngtemplates:app', 'ngtemplates:dist'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['app/js/{,*/}*.js', '!app/js/templates/*.js', 'app/*.html'],
                tasks: [],
                options: {
                    livereload: true
                }
            },
            gruntfile: {
                files: ['Gruntfile.js'],
                tasks: [],
                options: {
                    reload: true
                }
            }
        },
        jshint: {
            js: ['app/js/{,*/}*.js']
        },
        ngtemplates: {
            app: {
                cwd: 'app',
                src: 'views/{,*/}*.html',
                dest: 'app/js/templates/templates.js'
            },
            dist: {
                cwd: 'app',
                src: 'views/{,*/}*.html',
                dest: 'dist/js/templates/templates.js'
            }
        },
        rename: {
            dist: {
                files: [
                    { src: ['dist/js/scripts_.min.js'], dest: 'dist/js/' + getAppVersion() + '.min.js' },
                    { src: ['dist/css/css_.min.css'], dest: 'dist/css/' + getAppVersion() + '.min.css' }
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                base: 'app',
                open: true,
                livereload: 35729,
                hostname: 'localhost',
                keepalive: false
            },
            proxies: [{
                context: '/api/v1',
                host: '172.20.90.162',
                port: 5100,
                https: false,
                changeOrigin: true
            }],
            dist: {
                options: {
                    base: ['dist'],
                    open: true,
                    middleware: function(connect) {
                        return [
                            require('grunt-connect-proxy/lib/utils').proxyRequest,
                            serveStatic('.tmp'),
                            connect().use(
                                'js/bower',
                                serveStatic('js/bower')
                            ),
                            serveStatic('dist')
                        ];
                    }
                }
            },
            livereload: {
                options: {
                    base: ['app'],
                    open: true,
                    middleware: function(connect) {
                        return [
                            require('grunt-connect-proxy/lib/utils').proxyRequest,
                            serveStatic('.tmp'),
                            connect().use(
                                'js/bower',
                                serveStatic('js/bower')
                            ),
                            serveStatic('app')
                        ];
                    }
                }
            }
        },
        clean: {
            app: ['app/css/*'],
            dist: ['dist/*'],
            temp: '.tmp'
        },
        useminPrepare: {
            options: {
                dest: 'dist',
                flow: {
                    html: {
                        steps: {
                            js: ['concat'],
                            css: ['concat']
                        },
                        post: {}
                    },
                }
            },
            html: [
                'app/index.html'
            ]
        },
        usemin: {
            html: ['dist/*.html'],
            options: {
                timestamp: true,
                blockReplacements: {
                    css: function(block) {
                        var filePath = getAppVersion(block.dest);
                        return '<link rel="stylesheet" href="' + filePath + '">';
                    },
                    js: function(block) {
                        var filePath = getAppVersion(block.dest);
                        return '<script type="text/javascript" src="' + filePath + '"></script>';
                    }
                }
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'app',
                    dest: 'dist',
                    src: [
                        '*.ico',
                        'index.html',
                        'robots.txt',
                        'assets/**'
                    ]
                }, {
                    expand: true,
                    dot: false,
                    cwd: 'app',
                    dest: 'dist/fonts',
                    flatten: true,
                    src: [
                        'lib/wrapbootstrap/fonts/*.*',
                        'lib/wrapbootstrap/font-awesome/fonts/*.*'
                    ]
                }]
            }
        }
    });
    function getAppVersion(filePath){
        if(filePath){
            if(filePath.indexOf('css_') !== -1){
                return filePath.replace('css_', getAppVersion());
            } else {
                return filePath.replace('scripts_', getAppVersion());
            }
        }
        return appVersion;
    }

    grunt.registerTask('serve', [
        'clean:temp',
        'clean:dist',
        'clean:app',
        'compass:compile',
        'ngtemplates:app',
        'configureProxies',
        'connect:livereload',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'clean:app',
        'ngtemplates:app',
        'compass:compile',
        'copy:dist',
        'useminPrepare',
        'concat',
        'usemin',
        'rename'
    ]);

    grunt.registerTask('serve-build', [
        'build',
        'configureProxies',
        'connect:dist',
        'watch'
    ]);

};
