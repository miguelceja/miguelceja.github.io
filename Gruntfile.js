module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      options: {
        livereload: true,
      },
      files: [
        'css/scss/*.scss',
        'js/*.js',
        '*.html',
        '*.php',
        'partials/*.php',
      ],
      tasks: ['sass', 'postcss', 'concat', 'babel'],
    },

    concat: {
      dist: {
        src: ['js/_*.js'],
        dest: 'js/app.js',
      },
    },

    babel: {
      options: {
        sourceMap: true,
        presets: ['env', 'es2015', 'minify'],
      },
      dist: {
        files: {
          'js/build/app.min.js': 'js/app.js',
        },
      },
    },

    sass: {
      dist: {
        options: {
          style: 'compressed',
        },
        files: {
          'css/build/main.css': 'css/main.scss',
        },
      },
    },

    postcss: {
      options: {
        map: true, // inline sourcemaps
        processors: [
          require('autoprefixer')({ browsers: 'last 2 versions' }), // add vendor prefixes
        ],
      },
      dist: {
        src: 'css/build/main.css',
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-postcss');

  // Default task(s).
  grunt.registerTask('default', ['watch']);
};
