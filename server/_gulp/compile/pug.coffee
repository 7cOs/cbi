config      = require('../../../server/_config/app')
gulp        = require('gulp')
pug         = require('gulp-pug')
runSequence = require('run-sequence')
changed     = require('gulp-changed')
cache = require("gulp-cache-money")({
  cacheFile: __dirname + "/.cache"
})

# COMPILE JADE TEMPLATES
gulp.task 'compile:pug', ->
  gulp.src(config.gulp.src.assets.pug.templates)
      .pipe(changed(config.gulp.dest.assets.pug.templates))
      .pipe(cache())
      .pipe(pug(
        pretty: true
        locals: config: config))
      .pipe gulp.dest(config.gulp.dest.assets.pug.templates)
  # WATCH & RELOAD ON CHANGE
  if process.argv.watch && !process.argv.watchJade
    process.argv.watchJade = true
    gulp.watch config.gulp.src.assets.pug.templates, (cb) ->
      runSequence 'compile:pug', 'reload', cb
