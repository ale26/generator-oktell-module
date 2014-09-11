// Generated on <%%= (new Date).toISOString().split('T')[0] %> using
// <%= pkg.name %> <%= pkg.version %>
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'scripts/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'scripts/**/*.js'


var httpProxy = require('http-proxy'),
  modulePath = './module',
  manifest = require(modulePath + '/manifest.json'),
  www = manifest.www || 'www',
  config = {
    modulePath: modulePath,
    moduleWww: modulePath + '/' + www,
    dist: 'dist',
    wwwDist: 'dist/' + www,
    oktellServerHost: '<%= oktellHost %>'
  },
  moduleUrlPrefix = '/modules/' + manifest.id,
  proxy = new httpProxy.createProxyServer({
    target: 'http://' + config.oktellServerHost
  });


module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%%= config.moduleWww %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%%= connect.options.livereload %>'
        }
      },
      styles: {
        files: ['<%%= config.moduleWww %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%%= connect.options.livereload %>'
        },
        files: [
          '<%%= config.modulePath %>/manifest.json',
          '<%%= config.moduleWww %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%%= config.moduleWww %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729,
      },
      livereload: {
        options: {
          open: true,
          middleware: function(connect) {
            return [
              function(req, res, next) {
                // proxy all requests to Oktell web server except our module,
                // set cookies so web client knows what to load
                if ( req.url === moduleUrlPrefix + '/manifest.json' ) {
                  res.setHeader('Content-Type', 'text/json');
                  res.end(grunt.file.read(modulePath + '/manifest.json'));
                } else if ( req.url.indexOf(moduleUrlPrefix) === -1 ) {
                  res.cookie('oktellServerWsHost', config.oktellServerHost);
                  res.cookie('devModule', manifest.id);
                  proxy.web(req, res);
                } else {
                  next();
                }
              },
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect().use(
                moduleUrlPrefix,
                connect.static(config.moduleWww)
              )
            ];
          }
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%%= config.moduleWww %>/scripts/{,*/}*.js'
        ]
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%%= config.dist %>/{,*/}*',
            '!<%%= config.dist %>/.git*'
          ]
        }]
      },
      distModule: {
        files: [{
          dot: true,
          src: [
            '<%%= config.dist %>/{,*/}*',
            '!<%%= config.dist %>/*.zip',
            '!<%%= config.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    cssmin: {
      dist: {
        files: {
          '<%%= config.wwwDist %>/styles/styles.css': manifest.styles.map(function(path){ return '.tmp/' + path; })
        }
      }
    },

    uglify: {
      dist: {
        files: {
          '<%%= config.wwwDist %>/scripts/scripts.js': manifest.scripts.map(function(path){
            return '.tmp/scripts/' + path;
          })
        }
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= config.moduleWww %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%%= config.wwwDist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= config.moduleWww %>/images',
          src: '{,*/}*.svg',
          dest: '<%%= config.wwwDist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%%= config.wwwDist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%%= config.wwwDist %>'
        }]
      }
    },

    // ngAnnotate tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection. It doesn't work on
    // things like resolve or inject so those have to be done manually.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= config.moduleWww %>',
          src: manifest.scripts,
          dest: '.tmp/scripts/'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%%= config.moduleWww %>',
          dest: '<%%= config.wwwDist %>',
          src: [
            '*.{ico,png,txt}',
            '*.html',
            'views/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'fonts/*',
            'translations/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%%= config.wwwDist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: '<%%= config.modulePath %>/',
          dest: '<%%= config.dist %>/',
          src: ['manifest.json', manifest.sqlDir + '/**/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%%= config.moduleWww %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },

    // Create zip archive to install in web client
    compress: {
      module: {
        options: {
          pretty: true,
          archive: '<%%= config.dist %>/' + manifest.id + '.zip'
        },
        files: [{
            expand: true,
            cwd: '<%%= config.dist %>/',
            src: ['**/*'],
            dest: ''
        }]
      }
    },

    'json-replace': {
      options: {
        space: '  ',
        replace: {
          scripts: 'scripts/scripts.js',
          styles: 'styles/styles.css'
        }
      },
      manifest: {
        files : {
          '<%%= config.dist %>/manifest.json': '<%%= config.dist %>/manifest.json'
        }
      },
    }

  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'concurrent:dist',
    'autoprefixer',
    'ngAnnotate',
    'copy:dist',
    'cssmin',
    'uglify',
    'htmlmin',
    'json-replace',
    'compress',
    'clean:distModule'
  ]);

};
