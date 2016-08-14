config      = require('../../server/_config/app')
gulp        = require('gulp')
nodemon     = require('gulp-nodemon')
runSequence = require('run-sequence')

gulp.task 'serve', (cb) ->
  called = false
  nodemon(
    script: config.dir.server.script
    verbose: false,
    watch: ['./server/*', './public/**/*.js'],
    ignore: [
      './app/*',
      '*.html'
    ]).on('start', ->
      if !called
        runSequence [
          'watch'
          'browserSync'
        ]
        called = true
    )
