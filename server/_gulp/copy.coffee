config      = require('../../server/_config/app')
gulp = require('gulp')

# COPY REQUIRED NPM PACKAGES TO LIB FOLDER
# TODO: THIS SUCKS! FIND A BETTER SOLUTION :(
gulp.task 'copy:libs', ->
  gulp
    .src([
      config.gulp.npm + '*@angular/**/*'
      config.gulp.npm + '*angular2-in-memory-web-api/**/*'
      config.gulp.npm + '*core-js/client/**/*'
      config.gulp.npm + '*reflect-metadata/**/*'
      config.gulp.npm + '*rxjs/**/*'
      config.gulp.npm + '*systemjs/**/*'
      config.gulp.npm + '*zone.js/dist/**/*'
    ])
    .pipe gulp.dest(config.gulp.dest.lib)
