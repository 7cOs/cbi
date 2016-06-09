babelify    = require('babelify')
browserify  = require('browserify')
config      = require('../../../server/_config/app')
fs          = require('fs')
gulp        = require('gulp')


gulp.task 'compile:js', ['vet:js'], ->
  # browserify({ debug: true })
    # .transform(babelify.configure({
    #     presets: 'es2015'
    #   }))
    # .require(config.gulp.src.assets.jsMain, { entry: true })
    # .bundle()
    # .pipe(fs.createWriteStream(config.gulp.dest.assets.jsMain));
